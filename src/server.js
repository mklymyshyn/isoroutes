"use strict";

import {take, put, chan, go} from "js-csp";
import {Map, List} from "immutable";
import {keys} from "./router";
import {build, collect} from "./state";
import {jsonattr} from "./utils";


function notFound(_, res) {
  var text = "Not Found";
  var html = "<h1>404: Not Found</h1>"
  res.statusCode = 404;
  res.statusMessage = text;
  res.setHeader('Content-Length', html.length);
  res.end(html);
}



// Default Node.JS server handler
function server(routes, template, error_) {

  var error = error_ || notFound;

  return function (request, response) {
    var state = build.server(request);
    var resultCh = chan(1);

    if (collect(state, routes, resultCh) === false) {
      return error(request, response);
    }

    go(function * () {
      var data = yield take(resultCh);
      var pool = Map(), redirect = null;

      // TODO: look for redirects first

      var context = data.reduce(function (context, elem) {
        if (redirect !== null) return;

        // collect prerendered state to speedup re-render on the client
        pool = pool.set(elem.get(keys.id), elem.get(keys.state));

        var _redirect = elem.get(keys.render).redirect();
        if (_redirect !== null) {
          redirect = _redirect;
          return context;
        }

        // render everything
        return context.set(
          elem.get(keys.name),
          elem.get(keys.render).server(elem)).merge(elem);
      }, Map());


      // 302 redirect
      if (redirect) {
        response.setHeader('Location', redirect.location);
        response.statusCode = 302;
        response.setHeader('Content-Length', 0);
        response.end("");
        return;
      }

      // jsonify state pool
      context = context.set(keys.state, jsonattr(pool.toObject()));
      // Node.js-specific stuff, render template
      var body = template(context.toObject());
      response.setHeader('Content-Length', body.length);
      response.end(body);
    });
  }
}

module.exports = {server: server, notFound: notFound}
