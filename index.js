module.exports = require('./build/Release/libxmljs');

// attach javascipt helpers to bound classes
require('./lib/xml_element');
require('./lib/xml_document');
require('./lib/xml_sax_parser');
