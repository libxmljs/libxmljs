var events = require("events");

import * as getBindings from "bindings";

const bindings = getBindings("xmljs");

var SaxParser = function (callbacks: any) {
    var parser = new bindings.SaxParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (var k in events.EventEmitter.prototype) bindings.SaxParser.prototype[k] = events.EventEmitter.prototype[k];

var SaxPushParser = function (callbacks: any) {
    var parser = new bindings.SaxPushParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (var k in events.EventEmitter.prototype) bindings.SaxPushParser.prototype[k] = events.EventEmitter.prototype[k];

export { SaxParser };
export { SaxPushParser };
