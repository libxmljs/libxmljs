"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaxPushParser = exports.SaxParser = void 0;
var events = require("events");
var bindings_1 = __importDefault(require("bindings"));
var bindings = (0, bindings_1.default)("xmljs");
var SaxParser = function (callbacks) {
    var parser = new bindings.SaxParser();
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }
    return parser;
};
exports.SaxParser = SaxParser;
for (var k1 in events.EventEmitter.prototype)
    bindings.SaxParser.prototype[k1] = events.EventEmitter.prototype[k1];
var SaxPushParser = function (callbacks) {
    var parser = new bindings.SaxPushParser();
    for (var callback in callbacks) {
        parser.on(callback, callbacks[callback]);
    }
    return parser;
};
exports.SaxPushParser = SaxPushParser;
for (var k2 in events.EventEmitter.prototype)
    bindings.SaxPushParser.prototype[k2] = events.EventEmitter.prototype[k2];
//# sourceMappingURL=sax.js.map