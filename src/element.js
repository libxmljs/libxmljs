libxml.Element.prototype.attr = function() {
  var args = {};
  if (arguments.length == 0)
    return this.getAttributes();
  
  else if (arguments.length == 1)
    if (typeof arguments[0] == 'string')
      return this.getAttribute(arguments[0]);
    else
      args = arguments[0];
  
  else
    args[arguments[0]] = arguments[1];
  
  for (i in args)
    this.setAttribute(i, args[i]);
  
  return this;
};

libxml.Element.prototype.getAttributes = function() {
};

libxml.Element.prototype.node = function() {
  if (typeof arguments[1] == 'string')
    arguments[2] = arguments[1];
  else if (typeof arguments[1] == 'function')
    arguments[3] = arguments[1];

  if (typeof arguments[2] == 'function')
    arguments[3] = arguments[2];

  var elem = new libxml.Element(this.document, arguments[0], arguments[1], arguments[2], arguments[3]);
  this.addChild(elem);
  return elem;
};
