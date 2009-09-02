var callbacks = {
  document: null,
  current: null,

  startDocument: function() {},
  endDocument: function() {},

  startElement: function(elem, attrs) {},
  endElement: function(elem) {},

  startElementNS: function(elem, attrs, prefix, uri, namespaces) {},
  endElementNS: function(elem, prefix, uri) {},

  characters: function(chars) {},
  cdata: function(cdata) {},

  warning: function(msg) {},
  error: function(msg) {}
};


/** SAX Push Parser **/
var saxPushParser = libxml.sax.createPushParser(callbacks);

while(data) {
  saxPushParser.push(data);
};


/** SAX Parser **/
var saxParser = libxml.sax.createParser(callbacks);
saxParser.parse(document);
