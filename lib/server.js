"use strict";

var _jsCsp = require("js-csp");

var _immutable = require("immutable");

var _router = require("./router");

var _state = require("./state");

var _utils = require("./utils");

function notFound(_, res) {
  var text = "Not Found";
  var html = "<h1>404: Not Found</h1>";
  res.statusCode = 404;
  res.statusMessage = text;
  res.setHeader('Content-Length', html.length);
  res.end(html);
}

// Default Node.JS server handler
function server(routes, template, error_) {

  var error = error_ || notFound;

  return function (request, response) {
    var state = _state.build.server(request);
    var resultCh = (0, _jsCsp.chan)(1);

    if ((0, _state.collect)(state, routes, resultCh) === false) {
      return error(request, response);
    }

    (0, _jsCsp.go)(regeneratorRuntime.mark(function _callee() {
      var data, pool, redirect, context, body;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _jsCsp.take)(resultCh);

            case 2:
              data = _context.sent;
              pool = (0, _immutable.Map)(), redirect = null;

              // TODO: look for redirects first

              context = data.reduce(function (context, elem) {
                if (redirect !== null) return;

                // collect prerendered state to speedup re-render on the client
                pool = pool.set(elem.get(_router.keys.id), elem.get(_router.keys.state));

                var _redirect = elem.get(_router.keys.render).redirect();
                if (_redirect !== null) {
                  redirect = _redirect;
                  return context;
                }

                // render everything
                return context.set(elem.get(_router.keys.name), elem.get(_router.keys.render).server(elem)).merge(elem);
              }, (0, _immutable.Map)());

              // 302 redirect

              if (!redirect) {
                _context.next = 11;
                break;
              }

              response.setHeader('Location', redirect.location);
              response.statusCode = 302;
              response.setHeader('Content-Length', 0);
              response.end("");
              return _context.abrupt("return");

            case 11:

              // jsonify state pool
              context = context.set(_router.keys.state, (0, _utils.jsonattr)(pool.toObject()));
              // Node.js-specific stuff, render template
              body = template(context.toObject());

              response.setHeader('Content-Length', body.length);
              response.end(body);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
  };
}

module.exports = { server: server, notFound: notFound };