var fs = require('fs');

var libxml = require('../index');

module.exports.parse = function(assert) {
    var filename = __dirname + '/fixtures/parser.xml';
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseXml(str);
    assert.equal('1.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
    assert.equal('root', doc.root().name());
    assert.equal('child', doc.get('child').name());
    assert.equal('grandchild', doc.get('child').get('grandchild').name());
    assert.equal('with love', doc.get('child/grandchild').text());
    assert.equal('sibling', doc.get('sibling').name());
    assert.equal(6, doc.get('sibling').line());
    assert.equal(3, doc.get('child').attr('to').line());
    assert.equal('with content!', doc.get('sibling').text());
    assert.equal(str, doc.toString());
    assert.done();
};

module.exports.parse_buffer = function(assert) {
    var filename = __dirname + '/fixtures/parser-utf16.xml';
    var buf = fs.readFileSync(filename);

    var doc = libxml.parseXml(buf);
    assert.equal('1.0', doc.version());
    assert.equal('UTF-16', doc.encoding());
    assert.equal('root', doc.root().name());
    assert.done();
};

module.exports.parse_synonym = function(assert) {
    assert.strictEqual(libxml.parseXml, libxml.parseXmlString);
    assert.done();
}

module.exports.recoverable_parse = function(assert) {
    var filename = __dirname + '/fixtures/warnings/ent9.xml';
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseXml(str);

    assert.equal(1, doc.errors.length);
    var err = doc.errors.shift();
    assert.ok(err instanceof Error);
    assert.equal(err.domain, 3);
    assert.equal(err.column, 13);
    assert.equal(err.line, 1);
    assert.equal(err.code, 201);
    assert.equal(err.str1, 'prefix');

    assert.done();
};

module.exports.fatal_error = function(assert) {
    var filename = __dirname + '/fixtures/errors/comment.xml';
    var str = fs.readFileSync(filename, 'utf8');
    var err = null;

    try {
        libxml.parseXml(str);
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
    assert.done();
};

