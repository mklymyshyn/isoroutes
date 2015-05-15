"use strict";

var React = require("react");
var {wait, log} = require("../utils");
var keys = require("../router").keys;
var Map = require("immutable").Map;
var {take, put, chan, go} = require("js-csp");

var react = function (...components) {
  var defaultNm = (i) => i === 0 ? "" : i;
  var componentId = (c, i) => c.templateId || "component" + defaultNm(i);
  
  var client = (component) => {
    return (context) => {
      return React.render(
        component(context.get(keys.state).toObject()),
        document.getElementById(context.get(keys.name)));
    }
  };
  var server = (component) => {
    return (context) => {
      return React.renderToString(
        component(context.get(keys.state).toObject()));
    }
  };

  return (state, route, renderCh) => {
    // 1) create CSP channel to get state from
    // 2) wait until CSP channel will be closed
    // 3) put state into React component

    // start CSP state routines
    var channels = components.map((type, cid) => {
      var stateCh = chan(),
          component = React.createFactory(type),
          id = componentId(type, cid);
      
      type.state(state, stateCh, cid);
      
      go(function *() {
        var pairsCh = chan(1);
        yield wait(stateCh, pairsCh);
        

        // We should link state from template to component somehow
        var context = Map(yield take(pairsCh));
        
        // TODO: render STATE in case __state__=true in params
        // here we probably can create results factory?
        yield put(renderCh, Map([
          [keys.id, cid],
          [keys.state, context],
          [keys.name, id],
          // generate render factories
          [keys.render, {server: server(component),
                         client: client(component)}]
        ]));
      });
      
      return stateCh;
    });
    
    var cLog = (component) => {
      var params = state.get("params").map((val, key) => {
        return key + "=" + val;
      }).join(" ");
      return "<" + component.displayName + " " + params + " />";
    };
    log(state, components.map(cLog));
    return components.length;
  }
};

module.exports = react;
