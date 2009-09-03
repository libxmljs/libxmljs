function Callbacks() {
  this.document = null;
  this.current = null;

  this.startDocument = function() {};
  this.endDocument = function() {};

  this.startElement = function(elem, attrs) {};
  this.endElement = function(elem) {};

  this.startElementNS = function(elem, attrs, prefix, uri, namespaces) {};
  this.endElementNS = function(elem, prefix, uri) {};

  this.characters = function(chars) {};
  this.cdata = function(cdata) {};

  this.comment = function(msg) {};

  this.warning = function(msg) {};
  this.error = function(msg) {};
};


/** SAX Push Parser **/
var saxPushParser = libxml.createSAXPushParser(new Callbacks(), {html: true});
while(data) {
  saxPushParser.push(data);
};


/** SAX Parser **/
var saxParser = libxml.createSAXParser(new Callbacks());
saxParser.parseString(document);


/** Parser **/
var fromFile = libxml.parseFile('./document.xml');
var formMem = libxml.parseString(doc);
