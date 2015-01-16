var events = require('events');

var bindings = require('./bindings');

var SaxParser = function(callbacks) {
    var parser = new bindings.SaxParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (var k in events.EventEmitter.prototype)
    bindings.SaxParser.prototype[k] = events.EventEmitter.prototype[k];

var SaxPushParser = function(callbacks) {
    var parser = new bindings.SaxPushParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// Overriding the prototype, like util.inherit, wipes out the native binding.
// Copy over the methods instead.
for (var k in events.EventEmitter.prototype)
    bindings.SaxPushParser.prototype[k] = events.EventEmitter.prototype[k];

module.exports.SaxParser = SaxParser;
module.exports.SaxPushParser = SaxPushParser;

