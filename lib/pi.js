var bindings = require('./bindings');

/// create a new processing instruction on the given document
/// @param doc the Document to create the processing instruction for
/// @param name the processing instruction name
/// @param {String} [content] processing instruction content
/// @constructor
function ProcessingInstruction(doc, name, content) {
    if (!doc) {
        throw new Error('document argument required');
    } else if (! (doc instanceof bindings.Document)) {
        throw new Error('document argument must be an ' +
                        'instance of Document');
    } else if (!name) {
        throw new Error('name argument required');
    }

    return new bindings.ProcessingInstruction(doc, name, content);
}

ProcessingInstruction.prototype = bindings.ProcessingInstruction.prototype;

module.exports = ProcessingInstruction;
