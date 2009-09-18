// name, attrs, content, callback
libxml.Element.Arguments = function(args) {
  var ret_args = null;

  switch (args.length) {
    case 1:
      ret_args = [args[0], null, null, null];
      break;

    case 2: // name, callback; name, attrs; name, content
      if (typeof args[1] == 'function')
        ret_args = [args[0], null, null, args[1]];
      else if (typeof args[1] == 'string')
        ret_args = [args[0], null, args[1], null];
      else
        ret_args = [args[0], args[1], null, null];
      break;

    case 3: // name, attrs, content; name, attrs, callback
      if (typeof args[2] == 'function')
        ret_args = [args[0], args[1], null, args[2]];
      else
        ret_args = [args[0], args[1], args[2], null];
      break;

    case 4: // name, attrs, content, callback
      ret_args = [args[0], args[1], args[2], args[3]];
  }
  
  return ret_args;
};

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
  var args = libxml.Element.Arguments(arguments);

  var elem = new libxml.Element(this.document, args[0], args[1], args[2], args[3]);
  this.addChild(elem);
  return elem;
};
