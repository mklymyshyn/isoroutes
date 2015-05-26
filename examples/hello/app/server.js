"use strict";

require("babel/register")({
  blacklist: ['regenerator']
});

var http = require('http');
var isoroutes = require("isoroutes");
var server = isoroutes.server,
    serverUtils = isoroutes.serverUtils;
var jade = require("jade");

//import {server, serverUtils} from "../../src/isoroutes";
//import {routes} from "./hello";
var routes = require("./hello").routes;

// react-specific things
require('node-jsx').install({extension: '.jsx'});

// serving static
var file = new(require('node-static').Server)("../");
var serve = (req, rsp) => file.serve(req, rsp);

// node.js configuration
var port = 3000;


// here we need to render template with some tool
var template = (context) => jade.renderFile("./base.jade", context);

http.createServer(server(routes, template, serve)).listen(
  port, function(err) {
    if (err) throw err;
    console.log('Listening on ' + port + '...');
});
