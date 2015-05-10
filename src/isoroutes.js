"use strict";
var {server, renderJade, notFound} = require("./server");
var utils = require("./utils");
var {router, keys} = require("./router");

var client = require("./client"),
    build = require("./state").build,
    render = {react: require("./render/react")};

module.exports = {
    client: client,
    build: build,
    render: render,
    server: server,
    serverUtils: {renderJade: renderJade, notFound: notFound},
    utils: utils
}
