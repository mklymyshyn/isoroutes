"use strict"

var DEFAULT_TPL = "lib/guacamole/tpl/main.jade";
var DEFAULT_TPL_OPTS = {};

var {jsonattr, assertT} = require("./utils.js");
var {take, put, chan, go} = require("js-csp");
var {Map, List} = require("immutable");
var keys = require("./router.js").keys;
var {build, collect} = require("./state.js");


/**
 * Default template engine to render within HTML template on server
 */
function renderJade(templatePath, options) {
    var jade = require("jade");
    assertT(jade !== null,
           `Install Jade with "npm install jade" or
           configure other template engine`);

    return (context) => jade.renderFile(
        templatePath,
        Object.assign(options, context));
};

function notFound(_, res) {
    let text = "Not Found";
    let html = "<h1>404: Not Found</h1>"
    res.statusCode = 404;
    res.statusMessage = text;
    res.setHeader('Content-Length', html.length);
    res.end(html);
}

/**
 * Default Node.JS server handler
 */
function server(routes, template, error) {
    var template = template || renderJade(DEFAULT_TPL, DEFAULT_TPL_OPTS),
        error = error || notFound;

    return (request, response) => {
        /**
         * The main idea behind is to generate
         */
        var state = build.server(request);
        // TODO: create state object here

        var resultCh = chan(1);

        if (collect(state, routes, resultCh) === false) {
            return error(request, response);
        }

        go(function *() {
            var data = yield take(resultCh);
            var pool = Map();

            let context = data.reduce((context, elem) => {
                // collect prerendered state to speedup re-render on the client
                pool = pool.set(elem.get(keys.id), elem.get(keys.state));

                // render everything
                return context.set(
                    elem.get(keys.name),
                    elem.get(keys.render).server(elem)).merge(elem);
            }, Map());

            // jsonify state pool
            context = context.set(keys.state, jsonattr(pool.toObject()));

            // Node.js-specific stuff, render template
            var body = template(context.toObject());
            response.setHeader('Content-Length', body.length);
            response.end(body);
        });
    }
}
module.exports = {server: server, renderJade: renderJade}
