import * as helpers from "./helpers";
import {assert} from "chai";
import {render, keys, router, state, collect} from "../src/isoroutes";
import {timeout, take, put, chan, go} from "js-csp";
import {Map, List} from "immutable";
import * as React from "react/addons";

var stripattrs = helpers.stripReactAttrs;

// sample component
var componentFactory = function (displayName, stateFunc) {
  return React.createClass({
    displayName: displayName,
    statics: {
      state: stateFunc
    },
    render: function () {
      return <h1>Hello, <span>{this.props.title}</span>!</h1>
    }
  })
};

var Hello1 = componentFactory("Hello1", function (state, channel, cid) {
  return go(function * () {
    yield put(channel, ["title", "World"]);
    channel.close();
  })
});
var Hello2 = componentFactory("Hello2", function (state, channel, cid) {
  return go(function * () {
    yield put(channel, ["title", "John"]);
    channel.close();
  })
});

describe("React rendering", () => {
  it("should render Hello component", function(done) {
    var ch = chan();
    var routes = router([
      ["/", render.react(Hello1)]
    ]);

    var result = routes(state.server({"url": "/"}), ch);
    
    go(function * () {
      var data = yield take(ch);
      var rendered = stripattrs(React.renderToString(
        React.createFactory(Hello1)({title: "World"})));
      
      assert(
        stripattrs(data.get(keys.render).server(data)) === rendered,
        "Should be rendered into React.js string");
      
      done();
    });
  });

  it("should able to render multiple components", function(done) {
    var ch = chan();
    var routes = router([
      ["/", render.react(Hello1, Hello2)]
    ]);
    
    var result = routes(state.server({"url": "/"}), ch);
    
    go(function * () {
      var data1 = yield take(ch);
      var data2 = yield take(ch);
      
      var rendered1 = stripattrs(React.renderToString(
        React.createFactory(Hello1)({title: "World"})));
      var rendered2 = stripattrs(React.renderToString(
        React.createFactory(Hello2)({title: "John"})));
      
      assert(
        stripattrs(data1.get(keys.render).server(data1)) === rendered1,
        "Should be rendered into React.js string " + rendered1);
      assert(
        stripattrs(data2.get(keys.render).server(data2)) === rendered2,
        "Should be rendered into React.js string" + rendered2);
      
      done();
    });
  });

  it("should be able to collect states from multiple components", function (done) {
    var ch = chan(1);
    var routes = router([
      ["/", render.react(Hello1, Hello2)]
    ]);

    assert(collect(state.server({"url": "/"}), routes, ch) === true,
           "Page should exist");
    
    go(function * () {
      var data = yield take(ch);
      var state = {
        0: data.filter(e => e.get("id") === 0).first(),
        1: data.filter(e => e.get("id") === 1).first()
      }
      assert(state[0].get("state").get("title") === "World",
             "First component should have title World");
      assert(state[1].get("state").get("title") === "John",
             "Second component should have title John");
      done();
    });
  });
});