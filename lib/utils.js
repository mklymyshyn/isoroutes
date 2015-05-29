"use strict";

var _jsCsp = require("js-csp");

var _immutable = require("immutable");

var log = function log(r, rId) {
  console.log([r.url, "->", rId].join(" "));
};

var wait = function wait(srcCh, dstCh) {
  return (0, _jsCsp.go)(function* () {

    var data = (0, _immutable.List)(),
        pair;

    while ((pair = yield (0, _jsCsp.take)(srcCh)) !== _jsCsp.CLOSED) {
      data = data.push(pair);
    }
    yield (0, _jsCsp.put)(dstCh, data);
  });
};

var compose = function compose(f) {
  return function (g) {
    return function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return f(g.apply(undefined, xs));
    };
  };
};

// jsonify attr
var jsonattr = function jsonattr(obj) {
  return JSON.stringify(obj).replace(/\"/g, "\\\"");
};

module.exports = {
  log: log,
  wait: wait,
  jsonattr: jsonattr,
  compose: compose
};