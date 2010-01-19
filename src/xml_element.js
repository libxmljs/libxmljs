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

libxml.Element.prototype.node = function() {
  var args = libxml.Element.Arguments(arguments);
  var elem = null;

  if (args[0] instanceof libxml.Element)
    elem = args[0];
  else
    elem = new libxml.Element(this.doc(), args[0], args[1], args[2], args[3]);

  this.addChild(elem);
  return elem;
};

libxml.Element.prototype.get = function() {
  return this.find.apply(this, arguments)[0];
};

libxml.Element.prototype.defineNamespace = function() {
  var args = arguments.length == 1 ? [null, arguments[0]] : [arguments[0], arguments[1]];
  return new libxml.Namespace(this, args[0], args[1]);
};
