var bindings = require('../build/Release/libxmljs');

/// Create a new TextWriter instance
/// @constructor
var TextWriter = function() {
    var writer = new bindings.TextWriter();
    writer._openMemory();
    return writer;
};

TextWriter.prototype = bindings.TextWriter.prototype;


TextWriter.prototype.outputMemory = function(flush) {
    return this._outputMemory(flush);
}

TextWriter.prototype.startDocument = function(version, encoding, standalone) {
    var result;

    result = this._startDocument(version, encoding, standalone);

    if (result === -1) {
        throw new Error("Failed to start document");
    }
}

TextWriter.prototype.endDocument = function() {
    var result;

    result = this._endDocument();

    if (result === -1) {
        throw new Error("Failed to end document");
    }

    return result;
}

TextWriter.prototype.startElementNS = function(prefix, name, nsuri) {
    var result;

    result = this._startElementNS(prefix, name, nsuri);

    if (result === -1) {
        throw new Error("Failed to start element");
    }

    return result;
}

TextWriter.prototype.endElement = function() {
    var result;

    result = this._endElement();

    if (result === -1) {
        throw new Error("Failed to end element");
    }

    return result;
}

TextWriter.prototype.startAttributeNS = function(prefix, name, nsuri) {
    var result;

    result = this._startAttributeNS(prefix, name, nsuri);

    if (result === -1) {
        throw new Error("Failed to start attribute");
    }

    return result;
}

TextWriter.prototype.endAttribute = function() {
    var result;

    result = this._endAttribute();

    if (result === -1) {
        throw new Error("Failed to end attribute");
    }

    return result;
}

TextWriter.prototype.startCdata = function() {
    var result;

    result = this._startCdata();

    if (result === -1) {
        throw new Error("Failed to start CDATA section");
    }

    return result;
}

TextWriter.prototype.endCdata = function() {
    var result;

    result = this._endCdata();

    if (result === -1) {
        throw new Error("Failed to end CDATA section");
    }

    return result;
}

TextWriter.prototype.startComment = function() {
    var result;

    result = this._startComment();

    if (result === -1) {
        throw new Error("Failed to start Comment section");
    }

    return result;
}

TextWriter.prototype.endComment = function() {
    var result;

    result = this._endComment();

    if (result === -1) {
        throw new Error("Failed to end Comment section");
    }

    return result;
}

TextWriter.prototype.writeString = function(text) {
    var result;

    result = this._writeString(text);

    if (result === -1) {
        throw new Error("Failed to write string");
    }

    return result;
}



module.exports = TextWriter;
