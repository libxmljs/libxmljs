include('helpers.js');

describe("SAX Push Parser", function() {
  var callbacks = {};

  function createParser(parserType) {
    parser = new libxml[parserType](function(cb) {
      function argsToArray(args) {
        var ary = [];
        var i;
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
        if (chars[0] && !chars[0].match(/^[\s\n\r]+$/))
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
    return parser;
  };

  beforeEach(function() {
    callbacks = clone(callbackTest);
  });

  it('will properly parse a regular string', function() {
    parser = createParser('createSAXParser');
    parser.parseString(
      '<?xml-warning?>'+
      '<error>'+
      '<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="example.com" version="1.0">'+
        '<!-- comment -->'+
        '<message type="chat" to="n@d" from="n@d/r" id="id1">'+
          '<![CDATA[ some cdata ]]>'+
          '<body>exit</body>'+
          '<html xmlns="http://jabber.org/protocol/xhtml-im">'+
            '<body xmlns="http://www.w3.org/1999/xhtml">exit</body>'+
          '</html>'+
        '</message>'+
        '<stream:prefixed />'+
      '</stream:stream>'
    );
    assertEqual(JSON.stringify(callbackControl), JSON.stringify(callbacks));
  });
  
  it('will properly parse a string chunk by chunk', function() {
    parser = createParser('createSAXPushParser');
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
    assertEqual(JSON.stringify(control), JSON.stringify(callbacks));
  });

  it('will properly parse a file', function() {
    parser = createParser('createSAXParser');
    parser.parseFile(node.path.dirname(__filename)+'/fixtures/sax_parser_test.xml');

    var control = clone(callbackControl);
    control.error = [["Premature end of data in tag error line 2\n"]];
    assertEqual(JSON.stringify(control), JSON.stringify(callbacks));
  });
});
