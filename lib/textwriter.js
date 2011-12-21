var bindings = require('../build/Release/libxmljs');

/// Create a new TextWriter instance
/// @constructor
var TextWriter = function() {
    var writer = new bindings.TextWriter();
    return writer;
};

TextWriter.prototype = bindings.TextWriter.prototype;

module.exports = TextWriter;
