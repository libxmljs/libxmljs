var bindings = require('./bindings');

var Document = require('./document');

/// create a new comment on the given document
/// @param doc the Document to create the comment for
/// @param {String} [content] comment content
/// @constructor
var Comment = function(doc, content) {
    if (!doc) {
        throw new Error('document argument required');
    } else if (! (doc instanceof bindings.Document)) {
        throw new Error('document argument must be an ' +
                        'instance of Document');
    }

    return new bindings.Comment(doc, content);
};

Comment.prototype = bindings.Comment.prototype;

module.exports = Comment;

