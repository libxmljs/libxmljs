include('helpers.js');

var callbacks = callbackTest;
var parser = new libxml.createSAXParser(function(cb) {
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

// 
// var callbacks = callbackTest;
// parser.parseFile('fixtures/sax_parser_test.xml');
// assertEquals(callbackControl, callbacks);
