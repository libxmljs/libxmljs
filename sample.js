var parser = libxml.sax.pushParser({
  document: null,
  current: null,

  startDocument: function() {},
  endDocument: function() {},

  startElementNS: function(elem, attrs, prefix, uri, namespaces) {},
  endElementNS: function(elem, prefix, uri) {},

  characters: function(chars) {},
  cdata: function(cdata) {},

  warning: function(msg) {},
  error: function(msg) {}
});

while(data) {
  parser.push(data);
};
