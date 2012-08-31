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

    function attempt_parse(encoding) {
        var str = fs.readFileSync(filename, encoding);

        var doc = libxml.parseHtml(str);
        assert.equal('html', doc.root().name());
        assert.equal('Test HTML document', doc.get('head/title').text());
        assert.equal('HTML content!', doc.get('body/span').text());
    }

    // Parse via a string
    attempt_parse('utf-8');

    // Parse via a Buffer
    attempt_parse(null);

    assert.done();
};

// Although libxml defaults to a utf-8 encoding, if not specifically specified
// it will guess the encoding based on meta http-equiv tags available
// This test shows that the "guessed" encoding can be overridden
module.exports.parse_force_encoding = function(assert) {
    var filename = __dirname + '/fixtures/parser.euc_jp.html';

    function attempt_parse(encoding, opts) {
        var str = fs.readFileSync(filename, encoding);

        var doc = libxml.parseHtml(str, opts);
        assert.equal('html', doc.root().name());

        // make sure libxml rewrite the meta charset of this document

        // calling toString on the document ensure that it is converted to the
        // correct internal format and the new meta tag is replaced
        doc.root().toString();
        var fixedCharset = doc.find('/html/head/meta/@content')[0].value();
        assert.ok( fixedCharset.indexOf(opts.encoding.toUpperCase() ) !== -1);

        assert.equal('テスト', doc.get('head/title').text());
        assert.equal('テスト', doc.get('body/div').text());
    }

    // Parse via a string
    attempt_parse('utf-8', {encoding: 'utf-8'});

    // Parse via a Buffer
    attempt_parse(null, {encoding: 'utf-8'});

    assert.done();
};

module.exports.parse_synonym = function(assert) {
    assert.strictEqual(libxml.parseHtml, libxml.parseHtmlString);
    assert.done();
}

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

    var doc = libxml.parseHtml(str);
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

