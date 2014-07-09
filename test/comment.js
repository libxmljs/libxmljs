var libxml = require('../index');

module.exports.new = function(assert) {
    var doc = libxml.Document();
    var comm = libxml.Comment(doc, 'comment1');
    doc.root(comm);
    assert.equal('comment1', comm.text());
    assert.done();
};

module.exports.text = function(assert) {
    var doc = libxml.Document();
    var comm = libxml.Comment(doc);
    comm.text('comment2');
    assert.equal('comment2', comm.text());
    assert.done();
};

