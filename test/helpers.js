var assert = require("chai").assert;
var {keys, router, state, collect} = require("../src/isoroutes");
var {timeout, take, put, chan, go} = require("js-csp");
var {Map, List} = require("immutable");


var dummyComponent = function (testCh, id, state, name, render) {
  var id = id || 0,
      state = state || {key: 1},
      name = name || "component",
      render=render || {
        server: context => "server renderer",
        client: context => "client renderer"
      },
      testCh = testCh || chan();
  
  return (s, r, ch) => {
    go(function * () {
      yield put(ch, new Map([
        [keys.id, id],
        [keys.state, state],
        [keys.name, name],
        [keys.render, render]]));
      yield put(testCh, [s, r]);
    });
    
    return 1;
  }
};

// function to cleanup attributes
var stripReactAttrs = function (s) {
  return s.replace(/\s+(data\-react)[A-Za-z0-9\-]+[\=][\"\'][\w\-\.]+[\"\']/g, "")
}

module.exports = {
  dummy: dummyComponent,
  stripReactAttrs: stripReactAttrs
}
