exports.gc = (typeof gc == 'undefined') ? function() {} : gc;

exports.libxml = require('../libxmljs');

exports.clone = function(obj) {
  if(obj == null || typeof(obj) != 'object')
    return obj;

  var temp = new obj.constructor();
  for(var key in obj)
    temp[key] = arguments.callee(obj[key]);

  return temp;
};

exports.callbackTest = {
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

exports.callbackControl = {
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
