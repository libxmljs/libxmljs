with(require('./helpers')) {

describe('Parsing XML', function() {
  var filename = path.dirname(__filename)+'/fixtures/parser.xml';

  it('can be done by string', function() {
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseXmlString(str);
    assert.equal('1.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
    assert.equal('root', doc.root().name());
    assert.equal('child', doc.get('child').name());
    assert.equal('grandchild', doc.get('child').get('grandchild').name());
    assert.equal('with love', doc.get('child/grandchild').text());
    assert.equal('sibling', doc.get('sibling').name());
    assert.equal('with content!', doc.get('sibling').text());
    assert.equal(str, doc.toString());
  });

  it('can be done by file', function() {
    var doc = libxml.parseXmlFile(filename);
    assert.equal('1.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
    assert.equal('root', doc.root().name());
    assert.equal('child', doc.get('child').name());
    assert.equal('grandchild', doc.get('child').get('grandchild').name());
    assert.equal('with love', doc.get('child/grandchild').text());
    assert.equal('sibling', doc.get('sibling').name());
    assert.equal('with content!', doc.get('sibling').text());
  });
});

describe('A fatal parse error when parsing an XML file', function() {
  var filename = path.dirname(__filename)+'/fixtures/errors/comment.xml';
  var err = null;

  it('will throw an exception', function() {
    try {
      libxml.parseXmlFile(filename);
    } catch(e) { err = e; }

    var errorControl = {
      domain: 1,
      code: 4,
      message: "Start tag expected, '<' not found\n",
      level: 3,
      file: filename,
      line: 5,
      str1: null,
      str2: null,
      str3: null,
      int1: null,
      column: 10
    };
    assert.deepEqual(errorControl, err);
  });
});

describe('A recoverable parse error when parsing an XML file', function() {
  var filename = path.dirname(__filename)+'/fixtures/warnings/ent9.xml';

  it('will attach the errors to the document', function() {
    var doc = libxml.parseXmlFile(filename);
    var err = {
      domain: 3,
      code: 201,
      message: "Namespace prefix prefix on node is not defined\n",
      level: 2,
      file: null,
      line: 1,
      str1: "prefix",
      str2: "node",
      str3: null,
      int1: null,
      column: 13
    };
    assert.equal(1, doc.errors().length);
    assert.equal(err.code, doc.errors()[0].code);
  });
});

describe('A fatal parse error when parsing an XML string', function() {
  var filename = path.dirname(__filename)+'/fixtures/errors/comment.xml';
  var str = fs.readFileSync(filename, 'utf8');
  var err = null;

  it('will throw an exception', function() {
    try {
      libxml.parseXmlString(str);
    } catch(e) { err = e; }

    var errorControl = {
      domain: 1,
      code: 4,
      message: "Start tag expected, '<' not found\n",
      level: 3,
      file: null,
      line: 5,
      str1: null,
      str2: null,
      str3: null,
      int1: null,
      column: 10
    };
    assert.equal(errorControl.code, err.code);
  });
});

describe('A recoverable parse error when parsing an XML string', function() {
  var filename = path.dirname(__filename)+'/fixtures/warnings/ent9.xml';
  var str = fs.readFileSync(filename, 'utf8');

  it('will attach the errors to the document', function() {
    var doc = libxml.parseXmlString(str);
    var err = {
      domain: 3,
      code: 201,
      message: "Namespace prefix prefix on node is not defined\n",
      level: 2,
      file: null,
      line: 1,
      str1: "prefix",
      str2: "node",
      str3: null,
      int1: null,
      column: 13
    };
    assert.equal(1, doc.errors().length);
    assert.equal(err.code, doc.errors()[0].code);
  });
});

}
