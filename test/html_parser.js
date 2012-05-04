var fs = require('fs');
var libxml = require('../index');

function make_error(object) {
    var err = new Error(object.message);
    err.domain = object.domain;
    err.code = object.code;
    err.level = object.level;
    err.line = object.line;
    err.column = object.column;
    return err;
}

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
      make_error({ domain: 5,
        code: 23,
        message: "htmlParseEntityRef: expecting ';'\n",
        level: 2,
        line: 12,
        column: 27 }),
      make_error({ domain: 5,
        code: 68,
        message: "htmlParseEntityRef: no name\n",
        level: 2,
        line: 12,
        column: 38 }),
      make_error({ domain: 5,
        code: 23,
        message: "htmlParseEntityRef: expecting ';'\n",
        level: 2,
        line: 14,
        column: 4 }),
      make_error({ domain: 5,
        code: 68,
        message: "htmlParseEntityRef: no name\n",
        level: 2,
        line: 15,
        column: 4 })
    ];

    var doc = libxml.parseHtmlString(str);
    assert.equal(4, doc.errors.length);
    for(var i = 0; i < recoverableErrors.length; i++) {
        assert.equal(recoverableErrors[i].domain, doc.errors[i].domain);
        assert.equal(recoverableErrors[i].code, doc.errors[i].code);
        assert.equal(recoverableErrors[i].message, doc.errors[i].message);
        assert.equal(recoverableErrors[i].level, doc.errors[i].level);
        assert.equal(recoverableErrors[i].line, doc.errors[i].line);
    }
    assert.done();
};

