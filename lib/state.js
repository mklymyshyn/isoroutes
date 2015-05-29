"use strict";

var _immutable = require("immutable");

var _jsCsp = require("js-csp");

/*
 * Function which init request for states of all
 * requested components and when it's ready put it
 * into resulting channel (resultCh)
 */

function collect(state, routes, resultCh) {
    var channel = (0, _jsCsp.chan)(),
        total = routes(state, channel);

    if (total === null) return false;

    (0, _jsCsp.go)(function* () {
        var data = (0, _immutable.List)();

        // waiting for all components states
        while (data.size < total) {
            data = data.push((yield (0, _jsCsp.take)(channel)));
        }
        yield (0, _jsCsp.put)(resultCh, data);
    });

    return true;
}

/*
 * Function which generate state on client or on server.
 */
function build() {
    var state = (0, _immutable.Map)([["params", (0, _immutable.Map)()], // synthetic params from URL
    ["url", "/"], ["get", (0, _immutable.Map)()], ["post", (0, _immutable.Map)()], ["hash", ""], // client-side only
    ["protocol", "http:"], ["hostname", "localhost"], ["method", "GET"]]);
    return {
        client: function client(location) {
            return state.merge((0, _immutable.Map)([["url", location.pathname], ["protocol", location.protocol], ["hostname", location.hostname], ["hash", location.hash]]));
        },
        server: function server(request) {
            return state.merge((0, _immutable.Map)([["url", request.url], ["method", request.method]]));
        }
    };
}

/*
 * Parse params from URL
 */
function params(state, route) {
    var nameXP = route.get("nameXP");
    var paramXP = route.get("paramXP");

    var names = nameXP.exec(route.get("url")),
        values = paramXP.exec(state.get("url"));

    if (names === null || values === null) return state;

    // zip names with values and put as a Map
    return state.set("params", (0, _immutable.Map)(names.slice(1).map(function (name, id) {
        return [name, values[id + 1]];
    })));
}

module.exports = {
    collect: collect,
    build: build(),
    params: params
};