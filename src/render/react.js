"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import ReactDomServer from 'react-dom/server';

import {wait, log} from "../utils";
import {keys} from "../router";
import {Map} from "immutable";
import {take, put, chan, go} from "js-csp";

var react = (...components) => {
  var defaultNm = (i) => i === 0 ? "" : i;
  var componentId = (c, i) => c.templateId || "component" + defaultNm(i);

  var element = (component, context) => React.createElement(
    component, context.get(keys.state).toObject())

  var client = (component) => {
    return (context) => ReactDom.render(
      element(component, context),
      document.getElementById(context.get(keys.name)));
  };
  var server = (component) => {
    return (context) => ReactDomServer.renderToString(element(component, context));
  };
  var redirect = (context) => {
    if (context.get(keys.redirect) === undefined) return () => null;

    return () => {
      return {"location": context.get(keys.redirect),
              "next": context.get(keys.next)}}
  };

  return (state, route, renderCh) => {
    // 1) create CSP channel to get state from
    // 2) wait until CSP channel will be closed
    // 3) put state into React component

    // start CSP state routines
    var channels = components.map((type, cid) => {
      var stateCh = chan(),
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
          [keys.id, cid], // State ID
          [keys.state, context], // state dump
          // key: state_$STATE_ID
          [keys.state + "_" + cid, context.toObject()], // accessible from Jade/template engine
          [keys.name, id],
          // generate render factories
          [keys.render, {
            server: server(type),
            client: client(type),
            redirect: redirect(context)
          }]
        ]));
      });

      return stateCh;
    });

    var cLog = (component) => {
      var params = state.get("params").map((val, key) => {
        return key + "=" + val;
      }).join(" ");
      return "<" + component.name + " " + params + " />";
    };
    log(state, components.map(cLog));
    return components.length;
  }
};

module.exports = react;
