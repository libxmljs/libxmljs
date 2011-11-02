var bindings = require('../build/Release/libxmljs');

bindings.Document.prototype.node = function() {
  var args = bindings.Element.Arguments(arguments);
  return this.root(new bindings.Element(this, args[0], args[1], args[2], args[3]));
};

bindings.Document.prototype.find = function() {
  return this.root().find.apply(this.root(), arguments);
};

bindings.Document.prototype.get = function() {
  return this.find.apply(this, arguments)[0];
};

bindings.Document.prototype.child = function() {
  return this.root().child.apply(this.root(), arguments);
};

bindings.Document.prototype.childNodes = function() {
  return this.root().childNodes();
};
