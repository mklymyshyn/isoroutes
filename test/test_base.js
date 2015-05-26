import * as helpers from "./helpers";
import {assert} from "chai";
import {keys, router, state, collect} from "../src/isoroutes";
import {timeout, take, put, chan, go} from "js-csp";
import {Map, List} from "immutable";

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