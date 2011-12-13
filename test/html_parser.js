var fs = require('fs');
var libxml = require('../index');

module.exports.parse = function(assert) {
    var filename = __dirname + '/fixtures/parser.html';
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseHtmlString(str);
    assert.equal('html', doc.root().name());
    assert.equal('Test HTML document', doc.get('head/title').text());
    assert.equal('HTML content!', doc.get('body/span').text());
    assert.done();
};

module.exports.recoverable_parse = function(assert) {
    var recoverableFile = __dirname +'/fixtures/warnings/amp.html';
    var str = fs.readFileSync(recoverableFile, 'utf8');
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

    var doc = libxml.parseHtmlString(str);
    assert.equal(4, doc.errors.length);
    assert.deepEqual(recoverableErrors, doc.errors);
    assert.done();
};

