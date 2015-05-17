"use strict";

var {router, keys} = require("./router");

var {collect, build} = require("./state");
var utils = require("./utils");
var client = require("./client"),
    render = {react: require("./render/react")};
var {server, renderJade, notFound} = require("./server");

module.exports = {
  router: router,
  keys: keys,
  client: client,
  state: build,
  collect: collect,
  render: render,
  server: server,
  serverUtils: {renderJade: renderJade, notFound: notFound},
  utils: utils
}
