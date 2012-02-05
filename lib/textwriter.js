var bindings = require('./bindings');

/// Create a new TextWriter instance
/// @constructor
var TextWriter = function() {
    var writer = new bindings.TextWriter();
    writer._openMemory();
    return writer;
};

TextWriter.prototype = bindings.TextWriter.prototype;

/// Return the content of the output buffer.
/// @return buffer content
TextWriter.prototype.toString = function() {
    return this._bufferContent();
}

/// Empty the memory buffer
/// @return buffer content
TextWriter.prototype.clear = function() {
    this._bufferEmpty();
}

/// Return the content of the output buffer.
/// @param {boolean} [clear] clear the buffer afterwards.
TextWriter.prototype.outputMemory = function(clear) {
    var result = this.toString();
    if (clear || typeof clear === 'undefined') {
        this.clear();
    }
    return result;
}

/// Write document preamble
/// @param {string} [version] xml version, default 1.0
/// @param {string} [encoding] the encoding, default undefined
/// @param {string} [standalone] (yes or no), default undefined
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.startDocument = function(version, encoding, standalone) {
    var result;

    if (typeof standalone === 'boolean') {
        standalone = standalone ? "yes" : "no";
    }

    result = this._startDocument(version, encoding, standalone);

    if (result === -1) {
        throw new Error("Failed to start document");
    }
}

/// Close all elements and end the document
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.endDocument = function() {
    var result;

    result = this._endDocument();

    if (result === -1) {
        throw new Error("Failed to end document");
    }

    return result;
}

/// Start an element
/// @param {string} [prefix] namespace prefix
/// @param {string} name element local name
/// @param {string} [namespaceURI] namespace URI or NULL
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.startElementNS = function(prefix, name, namespaceURI) {
    var result;

    result = this._startElementNS(prefix, name, namespaceURI);

    if (result === -1) {
        throw new Error("Failed to start element");
    }

    return result;
}

/// End the current element
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.endElement = function() {
    var result;

    result = this._endElement();

    if (result === -1) {
        throw new Error("Failed to end element");
    }

    return result;
}

/// Start an attribute
/// @param {string} [prefix] namespace prefix
/// @param {string} name local name
/// @param {string} [namespaceURI] namespace URI or NULL
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.startAttributeNS = function(prefix, name, namespaceURI) {
    var result;

    result = this._startAttributeNS(prefix, name, namespaceURI);

    if (result === -1) {
        throw new Error("Failed to start attribute");
    }

    return result;
}

/// End the current attribute
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.endAttribute = function() {
    var result;

    result = this._endAttribute();

    if (result === -1) {
        throw new Error("Failed to end attribute");
    }

    return result;
}

/// Start a CDATA section
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.startCdata = function() {
    var result;

    result = this._startCdata();

    if (result === -1) {
        throw new Error("Failed to start CDATA section");
    }

    return result;
}

/// End a CDATA section
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.endCdata = function() {
    var result;

    result = this._endCdata();

    if (result === -1) {
        throw new Error("Failed to end CDATA section");
    }

    return result;
}

/// Start a comment
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.startComment = function() {
    var result;

    result = this._startComment();

    if (result === -1) {
        throw new Error("Failed to start Comment section");
    }

    return result;
}

/// End a comment
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.endComment = function() {
    var result;

    result = this._endComment();

    if (result === -1) {
        throw new Error("Failed to end Comment section");
    }

    return result;
}

/// Write text
/// @return number of bytes written (may be 0 because of buffering)
TextWriter.prototype.writeString = function(text) {
    var result;

    result = this._writeString(text);

    if (result === -1) {
        throw new Error("Failed to write string");
    }

    return result;
}

module.exports = TextWriter;
