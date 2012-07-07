var libxml = require('../index');

module.exports.text = function(assert) {
    var doc = libxml.parseXml('<?xml version="1.0"?><root>child</root>');
    assert.equal('text', doc.child(0).type());
    assert.equal('text', doc.child(0).name());
    assert.done();
};

module.exports.comment = function(assert) {
    var doc = libxml.parseXml('<?xml version="1.0"?>' +
                                    '<root><!-- comment --></root>');
    assert.equal('comment', doc.child(0).type());
    assert.equal('comment', doc.child(0).name());
    assert.done();
};

module.exports.cdata = function(assert) {

    var doc = libxml.parseXml('<?xml version="1.0"?>' +
                                    '<root><![CDATA[cdata text]]></root>');

    assert.equal('cdata', doc.child(0).type());
    assert.equal(undefined, doc.child(0).name());
    assert.done();
};

