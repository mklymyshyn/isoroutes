"use strict";
//var isNode = typeof(process) !== 'undefined' && process.version !== '';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _router = require("./router.js");

var _state = require("./state.js");

var _jsCsp = require("js-csp");

/*
 * Function which wait for state of all requested components and
 * render when they are available and ready to render (all at once)
 */
function client(state, routes) {
  var channel = (0, _jsCsp.chan)(),
      total = routes(state, channel);

  if (total === null) return false;

  // it's not required to render all at once, we can do it
  // asynchronously.
  (0, _jsCsp.go)(regeneratorRuntime.mark(function _callee() {
    var elem;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            elem = null;

          case 1:
            _context.next = 3;
            return (0, _jsCsp.take)(channel);

          case 3:
            _context.t0 = elem = _context.sent;
            _context.t1 = _jsCsp.CLOSED;

            if (!(_context.t0 != _context.t1)) {
              _context.next = 9;
              break;
            }

            // TODO: check for redirect here
            elem.get(_router.keys.render).client(elem);
            _context.next = 1;
            break;

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return true;
}

exports.default = client;