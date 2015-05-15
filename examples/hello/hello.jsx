"use strict";

var React = require('react/addons');
var {put, timeout, go} = require("js-csp");
var {render, router} = require("isoroutes");

var Hello = React.createClass({
  statics: {
    // state will be executed within CSP `go` routine
    state: function(state, channel, n=0) {
      // we could use CSP channels here
      return go(function * () {
	yield put(channel, ["title", "World"]);
	yield timeout(300);
	channel.close()
      })
    }
  },
  render: function () {
    console.log("Serving HELLO");
    return <h1>Hello, <span>{this.props.title}</span></h1>
  }
});

// setup router
var routes = router([
    ["/", render.react(Hello)]
]);

module.exports = {
  hello: Hello,
  routes: routes
}