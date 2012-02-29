var events = require('events');
var util = require('util');

var bindings = require('./bindings');

var SaxParser = function(callbacks) {
    var parser = new bindings.SaxParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// store existing functions because util.inherits overrides the prototype
var parseString = bindings.SaxParser.prototype.parseString;

util.inherits(bindings.SaxParser, events.EventEmitter);

bindings.SaxParser.prototype.parseString = parseString;

var SaxPushParser = function(callbacks) {
    var parser = new bindings.SaxPushParser();

    // attach callbacks
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

var push = bindings.SaxPushParser.prototype.push;

util.inherits(bindings.SaxPushParser, events.EventEmitter);

bindings.SaxPushParser.prototype.push = push;

module.exports.SaxParser = SaxParser;
module.exports.SaxPushParser = SaxPushParser;

