var fs = require('fs');

var libxml = require('../index');

function clone(obj) {
  if(obj == null || typeof(obj) != 'object')
    return obj;

  var temp = new obj.constructor();
  for(var key in obj)
    temp[key] = arguments.callee(obj[key]);

  return temp;
};

var callbackTest = {
  startDocument: [],
  endDocument: [],

  startElementNS: [],
  endElementNS: [],

  characters: [],
  cdata: [],

  comment: [],

  warning: [],
  error: []
};

var callbackControl = {
  startDocument: [
    []
  ],

  endDocument: [
    []
  ],

  startElementNS: [
    ['error', [], null, null, []],
    ['stream', [['to', '', '', 'example.com'], ['version', '', '', '1.0']], 'stream', 'http://etherx.jabber.org/streams', [[null, 'jabber:client'], ['stream', 'http://etherx.jabber.org/streams']]],
    ['message', [['type', '', '', 'chat'], ['to', '', '', 'n@d'], ['from', '', '', 'n@d/r'], ['id', '', '', 'id1']], null, 'jabber:client', []],
    ['x', [['name', '', '', 'abc & xyz']], null, 'jabber:client', []],
    ['body', [], null, 'jabber:client', []],
    ['html', [], null, 'http://jabber.org/protocol/xhtml-im', [[null, 'http://jabber.org/protocol/xhtml-im']]],
    ['body', [], null, 'http://www.w3.org/1999/xhtml', [[null, 'http://www.w3.org/1999/xhtml']]],
    ['prefixed', [], 'stream', 'http://etherx.jabber.org/streams', []]
  ],

  endElementNS: [
    ['x', null, 'jabber:client'],
    ['body', null, 'jabber:client'],
    ['body', null, 'http://www.w3.org/1999/xhtml'],
    ['html', null, 'http://jabber.org/protocol/xhtml-im'],
    ['message', null, 'jabber:client'],
    ['prefixed', 'stream', 'http://etherx.jabber.org/streams'],
    ['stream', 'stream', 'http://etherx.jabber.org/streams']
  ],

  characters: [
    ['ABC '], ['&'], ['&'], [' XYZ'], ['exit'], ['exit']
  ],

  cdata: [
    [' some cdata ']
  ],

  comment: [
    [' comment ']
  ],

  warning: [
    ["xmlParsePITarget: invalid name prefix 'xml'\n"]
  ],

  error: [
    ["Premature end of data in tag error line 2\n"]
  ]
};

function createParser(parserType, callbacks) {
    return new libxml[parserType](function(cb) {
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
}

var filename = __dirname + '/fixtures/sax_parser.xml';

module.exports.sax_push = function(assert) {
    var callbacks = clone(callbackTest);
    var str = fs.readFileSync(filename, 'utf8');
    var parser = createParser('SaxParser', callbacks);
    parser.parseString(str);
    var control = JSON.stringify(callbackControl);
    var test = JSON.stringify(callbacks);
    assert.equal(control, test);
    assert.done();
};

module.exports.sax_push_chunked = function(assert) {
    var callbacks = clone(callbackTest);
    var str_ary = fs.readFileSync(filename, 'utf8').split("\n");
    var parser = createParser('SaxPushParser', callbacks);
    for (var i = 0; i < str_ary.length; ++i) {
        parser.push(str_ary[i], (i+1 == str_ary.length));
    }

    var control = clone(callbackControl);
    control.error = [["Extra content at the end of the document\n"]];
    assert.equal(JSON.stringify(control), JSON.stringify(callbacks));
    assert.done();
};

module.exports.sax = function(assert) {
    var callbacks = clone(callbackTest);
    var parser = createParser('SaxParser', callbacks);
    parser.parseFile(filename);

    var control = clone(callbackControl);
    assert.deepEqual(control, callbacks);
    assert.done();
};

module.exports.string_parser = function(assert) {
    var callbacks = clone(callbackTest);
    var str = fs.readFileSync(filename, 'utf8');
    var parser = createParser('SaxParser', callbacks);

    for (var i=0; i<10; i++) {
        gc();
        parser.parseString(str);
    }

    assert.ok(true);
    assert.done();
};

module.exports.file_parser = function(assert) {
    var callbacks = clone(callbackTest);
    var parser = createParser('SaxParser', callbacks);
    for (var i=0; i<10; ++i) {
        gc();
        parser.parseFile(filename);
    }

    assert.ok(true);
    assert.done();
};
