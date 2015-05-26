"use strict";

import {router, keys} from "./router";
import {collect, build} from "./state";
import {server, notFound} from "./server";

import * as utils from "./utils";
import * as client from "./client";
import * as react_render from "./render/react";

module.exports = {
  router: router,
  keys: keys,
  client: client,
  state: build,
  collect: collect,
  render: {react: react_render["default"]},
  server: server,
  serverUtils: {notFound: notFound},
  utils: utils
}
