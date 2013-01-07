var libxml = require('../index');

if (!global.gc) {
    throw new Error('must run with --expose_gc for ref integrity tests');
}

module.exports.gc = function(assert) {
    var doc = libxml.Document();
    doc.node('root').node('child').node('grandchild').parent().node('child2');
    gc();
    assert.ok(doc, "doc");
    gc();
    assert.ok(doc.root(), "root");
    gc();
    assert.equal("child", doc.root().childNodes()[0].name(), "child name");
    assert.done();
};

module.exports.references = function(assert) {
    var nodes = libxml.parseXml('<root> <child> <grandchildren/> </child> <child2/></root>').childNodes();

    gc();

    assert.ok(nodes[0].doc());
    assert.equal("child", nodes[1].name());
    assert.done();
};
