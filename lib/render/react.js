"use strict";

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _utils = require("../utils");

var _router = require("../router");

var _immutable = require("immutable");

var _jsCsp = require("js-csp");

var react = function react() {
  for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
    components[_key] = arguments[_key];
  }

  var defaultNm = function defaultNm(i) {
    return i === 0 ? "" : i;
  };
  var componentId = function componentId(c, i) {
    return c.templateId || "component" + defaultNm(i);
  };

  var element = function element(component, context) {
    return React.createElement(component, context.get(_router.keys.state).toObject());
  };

  var client = function client(component) {
    return function (context) {
      return React.render(element(component, context), document.getElementById(context.get(_router.keys.name)));
    };
  };
  var server = function server(component) {
    return function (context) {
      return React.renderToString(element(component, context));
    };
  };

  return function (state, route, renderCh) {
    // 1) create CSP channel to get state from
    // 2) wait until CSP channel will be closed
    // 3) put state into React component

    // start CSP state routines
    var channels = components.map(function (type, cid) {
      var stateCh = (0, _jsCsp.chan)(),
          id = componentId(type, cid);

      type.state(state, stateCh, cid);

      (0, _jsCsp.go)(function* () {
        var pairsCh = (0, _jsCsp.chan)(1);
        yield (0, _utils.wait)(stateCh, pairsCh);

        // We should link state from template to component somehow
        var context = (0, _immutable.Map)((yield (0, _jsCsp.take)(pairsCh)));

        // TODO: render STATE in case __state__=true in params
        // here we probably can create results factory?
        yield (0, _jsCsp.put)(renderCh, (0, _immutable.Map)([[_router.keys.id, cid], [_router.keys.state, context], [_router.keys.name, id],
        // generate render factories
        [_router.keys.render, { server: server(type),
          client: client(type) }]]));
      });

      return stateCh;
    });

    var cLog = function cLog(component) {
      var params = state.get("params").map(function (val, key) {
        return key + "=" + val;
      }).join(" ");
      return "<" + component.name + " " + params + " />";
    };
    (0, _utils.log)(state, components.map(cLog));
    return components.length;
  };
};

module.exports = react;