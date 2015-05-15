//require("babel/register");
//require('node-babel')();

var http = require('http');

var {server, serverUtils} = require("../../src/isoroutes");
var routes = require("./hello").routes;

// react-specific things
require('node-jsx').install({extension: '.jsx'});

// serving static
var file = new(require('node-static').Server)();
var serve = (req, rsp) => file.serve(req, rsp);

// node.js configuration
var port = 3000;

// isomorphic part
var template = serverUtils.renderJade("./base.jade", {});

http.createServer(server(routes, template, serve)).listen(
  port, function(err) {
    if (err) throw err;
    console.log('Listening on ' + port + '...');
});