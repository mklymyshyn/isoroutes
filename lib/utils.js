"use strict";

var _jsCsp = require("js-csp");

var _immutable = require("immutable");

var log = function log(r, rId) {
  console.log([r.url, "->", rId].join(" "));
};

var wait = function wait(srcCh, dstCh) {
  return (0, _jsCsp.go)(regeneratorRuntime.mark(function _callee() {
    var data, pair;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = (0, _immutable.List)();

          case 1:
            _context.next = 3;
            return (0, _jsCsp.take)(srcCh);

          case 3:
            _context.t0 = pair = _context.sent;
            _context.t1 = _jsCsp.CLOSED;

            if (!(_context.t0 !== _context.t1)) {
              _context.next = 9;
              break;
            }

            data = data.push(pair);
            _context.next = 1;
            break;

          case 9:
            _context.next = 11;
            return (0, _jsCsp.put)(dstCh, data);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
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
    history.pushState({ path: path }, '', path);
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
};