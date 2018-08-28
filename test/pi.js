var libxml = require('../index');

module.exports.new = function(assert) {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, 'mypi', 'mycontent');
    doc.root(new libxml.Element(doc, 'myelem'));
    doc.root().addPrevSibling(pi);

    assert.equal(doc.root().prevSibling(), pi);
    assert.equal('mypi', pi.name());
    assert.equal('mycontent', pi.text());
    assert.done();
};

module.exports.name = function(assert) {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, 'mypi');
    pi.name('mynewpi');
    assert.equal('mynewpi', pi.name());
    assert.done();
};

module.exports.text = function(assert) {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, 'mypi');
    pi.text('pi3');
    assert.equal('pi3', pi.text());
    assert.done();
};
