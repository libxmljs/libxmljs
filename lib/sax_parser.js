var events = require('events');
var util = require('util');

var bindings = require('../build/Release/libxmljs');

var SaxParser = function(callbacks) {
    var parser = new bindings.SaxParser();

    // attach callbacks
    for (callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

// store existing functions because util.inherits overrides the prototype
var parseString = bindings.SaxParser.prototype.parseString;
var parseFile = bindings.SaxParser.prototype.parseFile;

util.inherits(bindings.SaxParser, events.EventEmitter);

bindings.SaxParser.prototype.parseString = parseString;
bindings.SaxParser.prototype.parseFile = parseFile;

var SaxPushParser = function(callbacks) {
    var parser = new bindings.SaxPushParser();

    // attach callbacks
    for (callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }

    return parser;
};

var push = bindings.SaxPushParser.prototype.push;
var parseString = bindings.SaxPushParser.prototype.parseString;
var parseFile = bindings.SaxPushParser.prototype.parseFile;

util.inherits(bindings.SaxPushParser, events.EventEmitter);

bindings.SaxPushParser.prototype.push = push;
bindings.SaxPushParser.prototype.parseString = parseString;
bindings.SaxPushParser.prototype.parseFile = parseFile;

module.exports.SaxParser = SaxParser;
module.exports.SaxPushParser = SaxPushParser;

