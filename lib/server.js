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
  res.setHeader("Content-Length", html.length);
  res.end(html);
}

// Default Node.JS server handler
function server(routes, template, error) {

  var error = error || notFound;

  return function (request, response) {
    var state = _state.build.server(request);
    var resultCh = (0, _jsCsp.chan)(1);

    if ((0, _state.collect)(state, routes, resultCh) === false) {
      return error(request, response);
    }

    (0, _jsCsp.go)(function* () {
      var data = yield (0, _jsCsp.take)(resultCh);
      var pool = (0, _immutable.Map)();

      var context = data.reduce(function (context, elem) {
        // collect prerendered state to speedup re-render on the client
        pool = pool.set(elem.get(_router.keys.id), elem.get(_router.keys.state));

        // render everything
        return context.set(elem.get(_router.keys.name), elem.get(_router.keys.render).server(elem)).merge(elem);
      }, (0, _immutable.Map)());

      // jsonify state pool
      context = context.set(_router.keys.state, (0, _utils.jsonattr)(pool.toObject()));

      // Node.js-specific stuff, render template
      var body = template(context.toObject());
      response.setHeader("Content-Length", body.length);
      response.end(body);
    });
  };
}

module.exports = { server: server, notFound: notFound };