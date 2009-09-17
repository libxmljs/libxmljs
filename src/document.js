libxml.Document.prototype.node = function() {
  if (this.root)
    throw new Error("This document already has a root node");

  if (typeof arguments[1] == 'string')
    arguments[2] = arguments[1];
  else if (typeof arguments[1] == 'function')
    arguments[3] = arguments[1];

  if (typeof arguments[2] == 'function')
    arguments[3] = arguments[2];

  this.root = new libxml.Element(this, arguments[0], arguments[1], arguments[2], arguments[3]);
  return this.root;
};
