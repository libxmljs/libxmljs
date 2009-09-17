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
