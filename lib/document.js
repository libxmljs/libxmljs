var bindings = require('./bindings');

var Element = require('./element');

/// Create a new document
/// @param {string} version xml version, default 1.0
/// @param {string} encoding the encoding, default utf8
/// @constructor
var Document = function(version, encoding) {
    version = version || '1.0';
    var doc = new bindings.Document(version);
    doc.encoding(encoding || 'utf8');
    return doc;
};

Document.prototype = bindings.Document.prototype;

/// get or set the root element
/// if called without any arguments, this will return the document root
/// @param {Element} [elem] if specified, this will become the new document root
Document.prototype.root = function(elem) {
    return this._root(elem);
};

/// add a child node to the document
/// this will set the document root
Document.prototype.node = function(name, content) {
    return this.root(Element(this, name, content));
};

/// xpath search
/// @return array of matching elements
Document.prototype.find = function(xpath, ns_uri) {
    return this.root().find(xpath, ns_uri);
};

/// xpath search
/// @return first element matching
Document.prototype.get = function(xpath, ns_uri) {
    return this.find(xpath, ns_uri)[0];
};

/// @return a given child
Document.prototype.child = function(id) {
    if (id === undefined || typeof id !== 'number') {
        throw new Error('id argument required for #child');
    }
    return this.root().child(id);
};

/// @return an Array of child nodes of the document root
Document.prototype.childNodes = function() {
    return this.root().childNodes();
};

/// @return a string representation of the document
Document.prototype.toString = function() {
    return this._toString();
}

/// @return the document version
Document.prototype.version = function() {
    return this._version();
}

/// @return the document encoding
Document.prototype.encoding = function(encoding) {
    return this._encoding(encoding);
}

module.exports = Document;

/// parse a string into a html document
/// @param string html string to parse
/// @return a Document
module.exports.fromHtmlString = function(string) {
    return bindings.fromHtmlString(string);
}

/// parse a string into a xml document
/// @param string xml string to parse
/// @return a Document
module.exports.fromXmlString = function(string) {
    return bindings.fromXmlString(string);
}

