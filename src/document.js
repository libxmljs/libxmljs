libxml.Document.prototype.node = function() {
  if (this.root)
    throw new Error("This document already has a root node");

  args = libxml.Element.Arguments(arguments);

  this.root = new libxml.Element(this, args[0], args[1], args[2], args[3]);
  return this.root;
};

libxml.Document.prototype.find = function() {
  this.root.find.apply(this.root, arguments);
};
