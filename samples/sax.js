var callbacks = {
  startDocument: function() {},
  endDocument: function() {},

  startElement: function(elem, attrs) {},
  endElement: function(elem) {},

  startElementNS: function(elem, attrs, prefix, uri, namespaces) {},
  endElementNS: function(elem, prefix, uri) {},

  characters: function(chars) {},
  cdata: function(cdata) {},

  comment: function(msg) {},

  warning: function(msg) {},
  error: function(msg) {}
};


/** SAX Push Parser **/
var saxPushParser = libxml.createSAXPushParser(callbacks, {html: true});
while(data) {
  saxPushParser.push(data);
};


/** SAX Parser **/
var saxParser = libxml.createSAXParser(callbacks);
saxParser.parseString(document);


/** Parser **/
var fromFile = libxml.parseFile('./document.xml');
var formMem = libxml.parseString(doc);
