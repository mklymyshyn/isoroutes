"use strict";
//var isNode = typeof(process) !== 'undefined' && process.version !== '';

var _routerJs = require("./router.js");

var _stateJs = require("./state.js");

var _jsCsp = require("js-csp");

/*
 * Function which wait for state of all requested components and
 * render when they are available and ready to render (all at once)
 */
function client(state, routes) {
  var channel = (0, _jsCsp.chan)(),
      total = routes(state, channel);

  if (total === null) return false;

  // it's not required to render all at once, we can do it
  // asynchronously.
  (0, _jsCsp.go)(function* () {
    var elem = null;
    while ((elem = yield (0, _jsCsp.take)(channel)) != _jsCsp.CLOSED) {
      elem.get(_routerJs.keys.render).client(elem);
    }
  });

  return true;
}

module.exports = client;