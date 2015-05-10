"use strict";
//var isNode = typeof(process) !== 'undefined' && process.version !== '';
//var csp = require("js-csp");

var keys = require("./router.js").keys;
var collect = require("./state.js").collect;
var {take, chan, go, CLOSED} = require("js-csp");

/*
 * Function which wait for state of all requested components and
 * render when they are available and ready to render (all at once)
 */
function client(state, routes) {
    var channel = chan(),
        total = routes(state, channel);

    if (total === null) return false;

    // it's not required to render all at once, we can do it
    // asynchronously.
    go(function *() {
        var elem = null;
        while((elem = yield take(channel)) != CLOSED) {
            elem.get(keys.render).client(elem);
        }
    });

    return true;
}

module.exports = client;