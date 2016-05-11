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
/*
 * Navigate shortcut
 */
function navigate(e, path) {
  // we need to have access to history and window global objects
  var path = path;
  if (e) {
    e.preventDefault();
    path = e.target.getAttribute("href");
  }

  if (history.pushState) {
    history.pushState({path: path}, '', path);
    window.onpopstate();
    return false;
  }

  // fallback
  location.replace(path);
  return false;
}



module.exports = {
  log: log,
  wait: wait,
  jsonattr: jsonattr,
  compose: compose,
  navigate: navigate
}
