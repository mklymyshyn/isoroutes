"use strict";
import {chan, go, take, put, CLOSED} from "js-csp";
import {List} from "immutable";

var log = (r, rId) => {
  console.log([r.url, "->", rId].join(" "));
}

var wait = function (srcCh, dstCh) {
  return go(function * () {

    var data = List(), pair;

    while((pair = yield take(srcCh)) !== CLOSED) {
      data = data.push(pair);
    }
    yield put(dstCh, data);

  })
};

var compose = f => {
  return g => {
    return (...xs) => f(g.apply(this, xs))
  }
}

// jsonify attr
var jsonattr = obj => JSON.stringify(obj).replace(/\"/g, "\\\"")


module.exports = {
  log: log,
  wait: wait,
  jsonattr: jsonattr,
  compose: compose
}
