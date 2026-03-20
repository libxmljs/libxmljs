const events = require("events");

import getBindings from "bindings";

const bindings = getBindings("xmljs");

const SaxParser = function (callbacks: any) {
    const parser = new bindings.SaxParser();

    // attach callbacks
    for (const callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (const k1 in events.EventEmitter.prototype) bindings.SaxParser.prototype[k1] = events.EventEmitter.prototype[k1];

const SaxPushParser = function (callbacks: any) {
    const parser = new bindings.SaxPushParser();

    // attach callbacks
    for (const callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (const k2 in events.EventEmitter.prototype) bindings.SaxPushParser.prototype[k2] = events.EventEmitter.prototype[k2];

export { SaxParser };
export { SaxPushParser };
