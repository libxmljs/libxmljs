// js acts as a wrapper to the c++ bindings
// prefer to do error handling and other abstrctions in the
// js layer and only go to c++ when we need to hit libxml
var bindings = require('./build/Release/libxmljs');

// document parsing for backwards compat
var Document = require('./lib/document');

/// parse an xml string and return a Document
module.exports.parseXmlString = function(string) {
    return Document.fromXmlString(string);
}

/// parse an html string and return a Document
module.exports.parseHtmlString = function(string) {
    return Document.fromHtmlString(string);
}

// constants
module.exports.version = bindings.version;
module.exports.libxml_version = bindings.libxml_version;
module.exports.libxml_parser_version = bindings.libxml_parser_version;
module.exports.libxml_debug_enabled = bindings.libxml_debug_enabled;

// lib exports
module.exports.Document = Document;
module.exports.Element = require('./lib/element');

var sax_parser = require('./lib/sax_parser');
module.exports.SaxParser = sax_parser.SaxParser;
module.exports.SaxPushParser = sax_parser.SaxPushParser;

