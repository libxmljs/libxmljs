libxml.Document.prototype.Node.prototype.node = function() {
  var node = buildNode(this, arguments);

  this.addChild(node.node);

  node.callback(node);
  return node;
};
