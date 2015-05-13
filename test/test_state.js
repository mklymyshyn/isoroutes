//require("6to5/register")();

var assert = require("chai").assert;
var {keys, router, state, collect} = require("isoroutes");
var {timeout, take, put, chan, go} = require("js-csp");
var {Map, List} = require("immutable");
var helpers = require("./helpers");


describe("State", () => {
    var routes = null,
        testCh = null;

    beforeEach(() => {
        testCh = chan();
        routes = router([
            ["/", helpers.dummy(testCh)],
            ["/test/:name/", helpers.dummy(testCh)],
            ["/:id/:subid/check/", helpers.dummy(testCh)]
        ]);
    });

    afterEach(() => {
        routes = null;
        testCh = null;
    });

    it("should prepare component state", function(done) {
        var ch = chan();
        routes(state.server({"url": "/"}), ch)

        go(function * () {
            var data = yield take(ch);
            assert(data.get(keys.state).key === 1, "State should exist");
            assert(data.get(keys.render).client(data), "client rendered");
            assert(data.get(keys.render).server(data), "server rendered");
            done();
        });
    });

    it("should parse URL params", function (done) {
        var ch = chan();
        var test = "HELLO%20WORLD";
        routes(state.server({"url": "/test/" + test + "/"}), ch)

        go(function * () {
            var data = yield take(ch);
            var [s, _] = yield take(testCh);

            assert(s.get("params").get("name") === test,
                   "Param `name` should be passed and equal to " + test);
            done();
        });
    });

    it("should parse nested URL params", function (done) {
        var ch = chan();
        var route = routes(state.server({"url": "/cat1/subcat1/check/"}), ch)

        assert(route !== null, "Route should properly parse nested urls");

        go(function * () {
            var data = yield take(ch);
            var [s, _] = yield take(testCh);

            var params = s.get("params").toObject();

            assert(params.id === "cat1", ":id param should be cat1");
            assert(params.subid === "subcat1", ":suid should be subcat1");
            done();
        });
    });

    // TODO: test getting state for multiple components
});