"use strict";

var {Map, List} = require("immutable");
var {map, compose, seq} = require("transducers.js");
var params = require("./state").params;

/**
 * Basic router factory which accept list of routes,
 * prepare it and generate factory which handle it.
 */
function router(reactd_urls) {
    // replace `/xxx/:param/` with appropriate regexp
    var baseXP = /[\/][\:][A-Za-z0-9_]+/g;
    var paramsXP = url => {
        return url.replace(baseXP,
                           "\/\([A-Za-z0-9\\.\\,\\+\\_\\-\%]+\)")
                  .replace(/\//g, "[\\/]");
    };
    // create RegExp for names
    var namesXP = url => {
        return url.replace(baseXP,
                           "\/[\\\:]\([A-Za-z0-9\_]+\)")
                  .replace(/\//, "[\\/]");
    };

    // here we going to transduce configuration
    var urls = List(
        seq(reactd_urls,
        compose(
            map(c => {return {url: c[0], render: c[1]}; }),
            map(c => Map({
                url: c.url,
                paramXP: new RegExp("^" + paramsXP(c.url) + "$"),
                nameXP: new RegExp("^" + namesXP(c.url) + "$"),
                render: c.render
            }))
        )));

    var reach = path => urls.find(u => u.get("paramXP").test(path) ? u : null);

    // declarative approach to customize request processing
    return (state, channel) => {
        var route = reach(state.get("url"));
        if (!route) return null;
        return route.get("render")(params(state, route), route, channel);
    }
}

module.exports = {
    router: router,
    keys: {id: "id", state: "state", name: "name", render: "render"}
}
