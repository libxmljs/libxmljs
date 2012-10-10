// js acts as a wrapper to the c++ bindings
// prefer to do error handling and other abstrctions in the
// js layer and only go to c++ when we need to hit libxml
var bindings = require('./lib/bindings');

// document parsing for backwards compat
var Document = require('./lib/document');

/// parse an xml string and return a Document
module.exports.parseXml = Document.fromXml;

/// parse an html string and return a Document
module.exports.parseHtml = Document.fromHtml;

// constants
module.exports.version = require('./package.json').version;
module.exports.libxml_version = bindings.libxml_version;
module.exports.libxml_parser_version = bindings.libxml_parser_version;
module.exports.libxml_debug_enabled = bindings.libxml_debug_enabled;

// lib exports
module.exports.Document = Document;
module.exports.Element = require('./lib/element');

// Compatibility synonyms
Document.fromXmlString = Document.fromXml;
Document.fromHtmlString = Document.fromHtmlString;
module.exports.parseXmlString = module.exports.parseXml;
module.exports.parseHtmlString = module.exports.parseHtml;

var sax_parser = require('./lib/sax_parser');
module.exports.SaxParser = sax_parser.SaxParser;
module.exports.SaxPushParser = sax_parser.SaxPushParser;

