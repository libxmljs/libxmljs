with(require('./helpers')) {

var recoverableFile = path.dirname(__filename)+'/fixtures/warnings/amp.html';
var recoverableErrors = [
  { domain: 5,
    code: 23,
    message: "htmlParseEntityRef: expecting ';'\n",
    level: 2,
    line: 12,
    column: 27 },
  { domain: 5,
    code: 68,
    message: "htmlParseEntityRef: no name\n",
    level: 2,
    line: 12,
    column: 38 },
  { domain: 5,
    code: 23,
    message: "htmlParseEntityRef: expecting ';'\n",
    level: 2,
    line: 14,
    column: 4 },
  { domain: 5,
    code: 68,
    message: "htmlParseEntityRef: no name\n",
    level: 2,
    line: 15,
    column: 4 }
];

describe('Parsing HTML', function() {
  var filename = path.dirname(__filename)+'/fixtures/parser.html';

  it('can be done by string', function() {
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseHtmlString(str);
    assert.equal('html', doc.root().name());
    assert.equal('Test HTML document', doc.get('head/title').text());
    assert.equal('HTML content!', doc.get('body/span').text());
  });
});

describe('A recoverable parse error when parsing an HTML string', function() {
  var str = fs.readFileSync(recoverableFile, 'utf8');

  it('will attach the errors to the document', function() {
    var doc = libxml.parseHtmlString(str);
    assert.equal(4, doc.errors.length);
    assert.deepEqual(recoverableErrors, doc.errors);
  });
});

}
