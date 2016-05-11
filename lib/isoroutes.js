"use strict";

var _router = require("./router");

var _state = require("./state");

var _server = require("./server");

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _client = require("./client");

var client = _interopRequireWildcard(_client);

var _react = require("./render/react");

var react_render = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  router: _router.router,
  keys: _router.keys,
  client: client["default"],
  state: _state.build,
  collect: _state.collect,
  render: { react: react_render["default"] },
  server: _server.server,
  serverUtils: { notFound: _server.notFound },
  utils: utils,
  navigate: utils.navigate
};