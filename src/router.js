"use strict";
/**EMACS* js3-indent-level:8 **/

import {Map, List} from "immutable";
import {params} from "./state";
import {compose} from "./utils";

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
  var urls = List(reactd_urls).map(
    e=> {
      var c = {url: e[0], render: e[1]};
      return Map({
        url: c.url,
        paramXP: new RegExp("^" + paramsXP(c.url) + "$"),
        nameXP: new RegExp("^" + namesXP(c.url) + "$"),
        render: c.render
      })
    });
  
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
