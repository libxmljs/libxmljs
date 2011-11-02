var bindings = require('./build/Release/libxmljs');

// TODO hide as much of the bindings as possible behind js interfaces
// this is generally cleaner an separates dev facing js from
// backend bingings support
module.exports = bindings;

// attach javascipt helpers to bound classes
require('./lib/xml_element');
require('./lib/xml_document');
require('./lib/xml_sax_parser');
