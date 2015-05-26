"use strict";

import * as React from 'react';
import {put, timeout, go} from "js-csp";
import {render, router} from "isoroutes";

class Hello extends React.Component {
  // state will be executed within CSP `go` routine
  static state (state, channel, n=0) {
    // we could use CSP channels here
    return go(function * () {
      yield put(channel, ["title", "World"]);
      yield timeout(300);
      channel.close()
    })
  }
  render() {
    console.log("Serving HELLO");
    return <h1>Hello, <span>{this.props.title}</span></h1>
  }
}

// setup router
var routes = router([
    ["/", render.react(Hello)]
]);

module.exports = {
  hello: Hello,
  routes: routes
}