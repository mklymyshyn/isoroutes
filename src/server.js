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
function server(routes, template, error) {
  
  var error = error || notFound;

  return function (request, response) {
    var state = build.server(request);
    var resultCh = chan(1);
    
    if (collect(state, routes, resultCh) === false) {
      return error(request, response);
    }

    go(function * () {
      var data = yield take(resultCh);
      var pool = Map();
      
      var context = data.reduce(function (context, elem) {
        // collect prerendered state to speedup re-render on the client
        pool = pool.set(elem.get(keys.id), elem.get(keys.state));
        
        // render everything
        return context.set(
          elem.get(keys.name),
          elem.get(keys.render).server(elem)).merge(elem);
      }, Map());
      
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
