//require("6to5/register")();

var assert = require("chai").assert;
var {keys, router, state, collect} = require("isoroutes");
var {timeout, take, put, chan, go} = require("js-csp");
var {Map, List} = require("immutable");
var helpers = require("./helpers");


describe("Basic", function() {
    it("should recognize state on the server", function () {
        var s = state.server({url: "/", method: "GET1"});
        assert(s.get("url") === "/", "Location should be /");
        assert(s.get("method") === "GET1", "Wrong method recognition");
    });

    it("should recognize state on client", function () {
        var s = state.client({
            pathname: "/",
            protocol: "https:",
            hostname: "localhost"
        });
        assert(s.get("url") === "/", "Location should be /");
    });

    it("should generate same important params for state (iso!)", function () {
        var s1 = state.server({url: "/21"});
        var s2 = state.client({pathname: "/21"});

        assert(s1.get("url") === s2.get("url"), "Both states should be equal");
    });

    it("should start rendering of component", function(done) {
        var routes = router([
            ["/", helpers.dummy(chan())]
        ]);
        var ch = chan();

        assert(typeof routes === "function", "should be factory");

        go(function * () {
            assert(routes(state.server({"url": "/"}), ch) === 1,
                   "Should start rendering of 1 component");
            done();
        });
    });
});