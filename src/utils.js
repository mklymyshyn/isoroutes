var {chan, go, take, put, CLOSED} = require("js-csp");
var {Map, List} = require("immutable");

// utility functions
var assertC = (cond, f) => !cond ? f() : "";
var assertT = (cond, msg) => assertC(cond, () => { throw msg; })

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

// jsonify attr
var jsonattr = obj => JSON.stringify(obj).replace(/\"/g, "\\\"")


module.exports = {
    assertT: assertT,
    assertC: assertC,
    log: log,
    wait: wait,
    jsonattr: jsonattr
}