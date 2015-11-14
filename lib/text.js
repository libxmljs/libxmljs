var bindings = require("./bindings");

/// create a new element on the given document
/// @param doc the Document to create the element for
/// @param name the element name
/// @param {String} [contenn] element content
/// @constructor


function Text(doc, content) {
    if (!doc) {
        throw new Error('document argument required');
    }

    if (!(doc instanceof bindings.Document)) {
        throw new Error('document argument must be an instance of Document');
    }

    if (!content) {
        throw new Error('content argument required');
    }

    return new bindings.Text(doc, content);
}

Text.prototype = bindings.Text.prototype;

module.exports = Text;
