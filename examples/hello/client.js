var routes = require("./hello.jsx").routes;
var {client, state} = require("isoroutes");

if (client(state.client(location), routes) === false) {
    alert("Route not found");
}
