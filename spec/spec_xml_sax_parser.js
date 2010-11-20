with(require('./helpers')) {

describe("SAX Push Parser", function() {
  var callbacks = {};
  var filename = path.dirname(__filename)+'/fixtures/sax_parser.xml';

  function createParser(parserType) {
    var parser = new libxml[parserType](function(cb) {
      function argsToArray(args) {
        var ary = [];
        var i;
        for (i = 0; i < args.length; i++)
          ary.push(args[i]);
        return ary;
      }

      cb.onStartDocument(function() {
        callbacks.startDocument.push(argsToArray(arguments));
      });

      cb.onEndDocument(function() {
        callbacks.endDocument.push(argsToArray(arguments));
      });

      cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
        // p({e: elem, a: attrs, p: prefix, u: uri, n: namespaces});
        callbacks.startElementNS.push(argsToArray(arguments));
      });

      cb.onEndElementNS(function(elem, prefix, uri) {
        callbacks.endElementNS.push(argsToArray(arguments));
      });

      cb.onCharacters(function(chars) {
        if (!chars.match(/^[\s\n\r]+$/))
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
  }

  beforeEach(function() {
    callbacks = clone(callbackTest);
  });

  it('will properly parse a regular string', function() {
    var str = fs.readFileSync(filename, 'utf8');
    var parser = createParser('SaxParser');
    parser.parseString(str);
    var control = JSON.stringify(callbackControl);
    var test = JSON.stringify(callbacks);
    assert.equal(control, test);
  });

  it('will properly parse a string chunk by chunk', function() {
    var str_ary = fs.readFileSync(filename, 'utf8').split("\n");
    var parser = createParser('SaxPushParser');
    var i;
    for (i = 0; i < str_ary.length; i++)
      parser.push(str_ary[i], (i+1 == str_ary.length));

    var control = clone(callbackControl);
    control.error = [["Extra content at the end of the document\n"]];
    assert.equal(JSON.stringify(control), JSON.stringify(callbacks));
  });

  it('will properly parse a file', function() {
    var parser = createParser('SaxParser');
    parser.parseFile(filename);

    var control = clone(callbackControl);
    assert.deepEqual(control, callbacks);
  });

  it('can can be reused as a string parser', function() {
    var str = fs.readFileSync(filename, 'utf8');
    var parser = createParser('SaxParser');

    for (var i=0; i<10; i++) {
        gc();
        parser.parseString(str);
    }

    assert.ok(true);
  });

  it('can can be reused as a file parser', function() {
    var parser = createParser('SaxParser');

    for (var i=0; i<10; i++) {
        gc();
        parser.parseFile(filename);
    }

    assert.ok(true);
  });
});

}
