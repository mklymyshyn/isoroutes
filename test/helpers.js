"use strict";

import {assert} from "chai";
import {keys, router, state, collect} from "../src/isoroutes";
import {timeout, take, put, chan, go} from "js-csp";
import {Map, List} from "immutable";


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
