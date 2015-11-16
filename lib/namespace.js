var bindings = require('./bindings');

var Namespace = function() {
  throw new Error('cannot be directly instantiated');
};

Namespace.prototype = bindings.Namespace.prototype;

Namespace.prototype.type = function() {
    return "namespace_decl";
};

module.exports = Namespace;

