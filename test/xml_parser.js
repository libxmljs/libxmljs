var fs = require('fs');

var libxml = require('../index');

module.exports.parse = function(assert) {
    var filename = __dirname + '/fixtures/parser.xml';
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
    assert.done();
};

module.exports.recoverable_parse = function(assert) {
    var filename = __dirname + '/fixtures/warnings/ent9.xml';
    var str = fs.readFileSync(filename, 'utf8');

    var doc = libxml.parseXmlString(str);
    var err = {
        domain: 3,
        code: 201,
        message: "Namespace prefix prefix was not found\n",
        level: 1,
        line: 1,
        str1: "prefix",
        column: 13
    };
    assert.equal(1, doc.errors.length);
    assert.deepEqual(err, doc.errors.shift());
    assert.done();
};

module.exports.fatal_error = function(assert) {
    var filename = __dirname + '/fixtures/errors/comment.xml';
    var str = fs.readFileSync(filename, 'utf8');
    var err = null;

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
    assert.done();
};

