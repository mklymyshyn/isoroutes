"use strict";

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _router = require("./router");

var _state = require("./state");

var _server = require("./server");

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _client = require("./client");

var client = _interopRequireWildcard(_client);

var _renderReact = require("./render/react");

var react_render = _interopRequireWildcard(_renderReact);

module.exports = {
  router: _router.router,
  keys: _router.keys,
  client: client,
  state: _state.build,
  collect: _state.collect,
  render: { react: react_render["default"] },
  server: _server.server,
  serverUtils: { notFound: _server.notFound },
  utils: utils
};