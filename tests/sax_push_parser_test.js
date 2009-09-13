include('helpers.js');

var callbacks = clone(callbackTest);
var parser = new libxml.createSAXPushParser(function(cb) {
  function argsToArray(args) {
    var ary = [];
    for (i = 0; i < args.length; i++)
      ary.push(args[i]);
    return ary;
  };

  cb.onStartDocument(function() {
    callbacks.startDocument.push(argsToArray(arguments));
  });

  cb.onEndDocument(function() {
    callbacks.endDocument.push(argsToArray(arguments));
  });

  cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
    callbacks.startElementNS.push(argsToArray(arguments));    
  });

  cb.onEndElementNS(function(elem, prefix, uri) {
    callbacks.endElementNS.push(argsToArray(arguments));
  });

  cb.onCharacters(function(chars) {
    callbacks.characters.push(argsToArray(arguments));
  });

  cb.onCdata(function(cdata) {
    callbacks.cdata.push(argsToArray(arguments));
  });

  cb.onComment(function(msg) {
    callbacks.comment.push(argsToArray(arguments));
  });

  cb.onWarning(function(msg) {
    callbacks.warning.push(argsToArray(arguments));
  });

  cb.onError(function(msg) {
    callbacks.error.push(argsToArray(arguments));
  });
});

parser.push('<?xml-warning?>');
parser.push('<error>');
parser.push('<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="example.com" version="1.0">');
parser.push('<!-- comment -->');
parser.push('<message type="chat" to="n@d" from="n@d/r" id="id1">');
parser.push('<![CDATA[ some cdata ]]>');
parser.push('<body>exit</body>');
parser.push('<html xmlns="http://jabber.org/protocol/xhtml-im">');
parser.push('<body xmlns="http://www.w3.org/1999/xhtml">exit</body>');
parser.push('</html>');
parser.push('</message>');
parser.push('<stream:prefixed />');
parser.push('</stream:stream>', true);

var control = clone(callbackControl);
control.error = [["Extra content at the end of the document\n"]];

assertEquals(JSON.stringify(control), JSON.stringify(callbacks));
