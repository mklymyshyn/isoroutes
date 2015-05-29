"use strict";
/**EMACS* js3-indent-level:8 **/

var _immutable = require("immutable");

var _state = require("./state");

var _utils = require("./utils");

/**
 * Basic router factory which accept list of routes,
 * prepare it and generate factory which handle it.
 */
function router(reactd_urls) {
  // replace `/xxx/:param/` with appropriate regexp
  var baseXP = /[\/][\:][A-Za-z0-9_]+/g;
  var paramsXP = function paramsXP(url) {
    return url.replace(baseXP, "/([A-Za-z0-9\\.\\,\\+\\_\\-%]+)").replace(/\//g, "[\\/]");
  };
  // create RegExp for names
  var namesXP = function namesXP(url) {
    return url.replace(baseXP, "/[\\:]([A-Za-z0-9_]+)").replace(/\//, "[\\/]");
  };

  // here we going to transduce configuration
  var urls = (0, _immutable.List)(reactd_urls).map(function (e) {
    var c = { url: e[0], render: e[1] };
    return (0, _immutable.Map)({
      url: c.url,
      paramXP: new RegExp("^" + paramsXP(c.url) + "$"),
      nameXP: new RegExp("^" + namesXP(c.url) + "$"),
      render: c.render
    });
  });

  var reach = function reach(path) {
    return urls.find(function (u) {
      return u.get("paramXP").test(path) ? u : null;
    });
  };

  // declarative approach to customize request processing
  return function (state, channel) {
    var route = reach(state.get("url"));
    if (!route) return null;
    return route.get("render")((0, _state.params)(state, route), route, channel);
  };
}

module.exports = {
  router: router,
  keys: { id: "id", state: "state", name: "name", render: "render" }
};