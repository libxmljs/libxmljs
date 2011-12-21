var bindings = require('../build/Release/libxmljs');

/// Create a new TextWriter instance
/// @constructor
var TextWriter = function() {
    var writer = new bindings.TextWriter();
    return writer;
};

TextWriter.prototype = bindings.TextWriter.prototype;


TextWriter.prototype.openMemory = function() {
    this._openMemory();
}

TextWriter.prototype.outputMemory = function(flush) {
    return this._outputMemory(flush);
}

TextWriter.prototype.startDocument = function(version, encoding, standalone) {
    return this._startDocument(version, encoding, standalone);
}

TextWriter.prototype.endDocument = function() {
    return this._endDocument();
}

TextWriter.prototype.startElementNS = function(prefix, name, nsuri) {
    return this._startElementNS(prefix, name, nsuri);
}

TextWriter.prototype.endElement = function() {
    return this._endElement();
}

TextWriter.prototype.startAttributeNS = function(prefix, name, nsuri) {
    return this._startAttributeNS(prefix, name, nsuri);
}

TextWriter.prototype.endAttribute = function() {
    return this._endAttribute();
}

TextWriter.prototype.startCdata = function() {
    return this._startCdata();
}

TextWriter.prototype.endCdata = function() {
    return this._endCdata();
}

TextWriter.prototype.startComment = function() {
    return this._startComment();
}

TextWriter.prototype.endComment = function() {
    return this._endComment();
}

TextWriter.prototype.writeString = function(text) {
    return this._writeString(text);
}



module.exports = TextWriter;
