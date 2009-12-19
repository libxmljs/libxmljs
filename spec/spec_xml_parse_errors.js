process.mixin(require('./helpers'));

describe('Parse error object', function() {
  var synErr = null;
  
  beforeEach(function() {
    synErr = new libxml.SyntaxError();
  });

  var accessors = [
    'domain',
    'code',
    'level',
    'file',
    'line',
    'str1',
    'str2',
    'str3',
    'int1',
    'column'
  ];

  for (var i = 0; i < accessors.length; ++i) {
    var accessor = accessors[i];
    it('has a '+accessor+' accessor', function() {
      assertEqual('object', typeof synErr[accessor]);
    });
  }
});

describe('A fatal parse error when parsing an XML file', function() {
  var filename = path.dirname(__filename)+'/fixtures/sax_parser_test.xml';

  it('will throw an exception', function() {
    try {
      libxml.parseXmlFile(filename);
    } catch(e) { err = e; }

    var errorControl = {
     str1: "error",
     str2: null,
     int1: 2,
     column: 1,
     domain: 1,
     file: filename,
     level: 3,
     code: 77,
     line: 14,
     str3: null
    };

    assertEqual(errorControl, err);
  });
});

describe('A recoverable parse error when parsing an XML file', function() {
  var filename = path.dirname(__filename)+'/fixtures/recoverable.xml';

  it('will attach the errors to the document', function() {
    var doc = libxml.parseXmlFile(filename);
    var err = {
      str1: "\ufffd\u00194",
      str2: null,
      int1: null,
      column: 14,
      domain: 1,
      file: filename,
      level: 2,
      code: 27,
      line: 3,
      str3: null
    };
    
    assertEqual(1, doc.errors().length);
    assertEqual(err, doc.errors()[0]);
  });
});

describe('A fatal parse error when parsing an XML string', function() {
  var filename = path.dirname(__filename)+'/fixtures/sax_parser_test.xml';
  var str = posix.cat(filename).wait();

  it('will throw an exception', function() {
    try {
      libxml.parseXmlString(str);
    } catch(e) { err = e; }

    var errorControl = {
     str1: "error",
     str2: null,
     int1: 2,
     column: 1,
     domain: 1,
     file: null,
     level: 3,
     code: 77,
     line: 14,
     str3: null
    };

    assertEqual(errorControl, err);
  });
});

describe('A recoverable parse error when parsing an XML string', function() {
  var filename = path.dirname(__filename)+'/fixtures/recoverable.xml';
  var str = posix.cat(filename).wait();

  it('will attach the errors to the document', function() {
    var doc = libxml.parseXmlString(str);
    var err = {
      str1: "@\u001d4",
      str2: null,
      int1: null,
      column: 14,
      domain: 1,
      file: null,
      level: 2,
      code: 27,
      line: 3,
      str3: null
    };

    assertEqual(1, doc.errors().length);
    assertEqual(err, doc.errors()[0]);
  });
});
