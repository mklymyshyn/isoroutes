"use strict";

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _utils = require('../utils');

var _router = require('../router');

var _immutable = require('immutable');

var _jsCsp = require('js-csp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return _react2.default.createElement(component, context.get(_router.keys.state).toObject());
  };

  var client = function client(component) {
    return function (context) {
      return _reactDom2.default.render(element(component, context), document.getElementById(context.get(_router.keys.name)));
    };
  };
  var server = function server(component) {
    return function (context) {
      return _server2.default.renderToString(element(component, context));
    };
  };
  var redirect = function redirect(context) {
    if (context.get(_router.keys.redirect) === undefined) return function () {
      return null;
    };

    return function () {
      return { "location": context.get(_router.keys.redirect),
        "next": context.get(_router.keys.next) };
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

      (0, _jsCsp.go)(regeneratorRuntime.mark(function _callee() {
        var pairsCh, context;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pairsCh = (0, _jsCsp.chan)(1);
                _context.next = 3;
                return (0, _utils.wait)(stateCh, pairsCh);

              case 3:
                _context.next = 5;
                return (0, _jsCsp.take)(pairsCh);

              case 5:
                _context.t0 = _context.sent;
                context = (0, _immutable.Map)(_context.t0);
                _context.next = 9;
                return (0, _jsCsp.put)(renderCh, (0, _immutable.Map)([[_router.keys.id, cid], // State ID
                [_router.keys.state, context], // state dump
                // key: state_$STATE_ID
                [_router.keys.state + "_" + cid, context.toObject()], // accessible from Jade/template engine
                [_router.keys.name, id],
                // generate render factories
                [_router.keys.render, {
                  server: server(type),
                  client: client(type),
                  redirect: redirect(context)
                }]]));

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

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