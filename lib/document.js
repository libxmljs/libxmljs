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
    return this.root().get(xpath, ns_uri);
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
Document.prototype.toString = function(formatted) {
    return this._toString(formatted !== undefined ? formatted : true);
};

/// @return the document version
Document.prototype.version = function() {
    return this._version();
};

/// @return the document encoding
Document.prototype.encoding = function(encoding) {
    return this._encoding(encoding);
};

/// @return whether the XmlDocument is valid
Document.prototype.validate = function(xsd) {
    return this._validate(xsd);
};

Document.prototype.setDtd = function(name, ext, sys) {
    if (!name) {
        throw new Error('Must pass in a DTD name');
    } else if (typeof name !== 'string') {
        throw new Error('Must pass in a valid DTD name');
    }

    var params = [name];
    if (typeof ext !== 'undefined') {
        params.push(ext);
    }
    if (ext && typeof sys !== 'undefined') {
        params.push(sys);
    }

    return this._setDtd.apply(this, params);
};

/// @return array of namespaces in document
Document.prototype.namespaces = function() {
    return this.root().namespaces();
};

module.exports = Document;

/// parse a string into a html document
/// @param string html string to parse
/// @param {encoding:string, baseUrl:string} opts html string to parse
/// @return a Document
module.exports.fromHtml = function(string, opts) {
    opts = opts || {};

    // if for some reason user did not specify an object for the options
    if (typeof(opts) !== 'object') {
        throw new Error('fromHtml options must be an object');
    }

    return bindings.fromHtml(string, opts);
};

/// parse a string into a xml document
/// @param string xml string to parse
/// @return a Document
module.exports.fromXml = function(string) {
    return bindings.fromXml(string);
};

