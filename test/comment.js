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


module.exports.textWithSpecialCharacters = function(assert) {
    var doc = libxml.Document();
    var comm = libxml.Comment(doc);
    var theText = 'my comment <has> special ch&r&cters';
    comm.text(theText);
    assert.equal(theText, comm.text());
    assert.done();
};

module.exports.toStringWithSpecialCharacters = function(assert) {
    var doc = libxml.Document();
    var comm = libxml.Comment(doc);
    var theText = 'my comment <has> special ch&r&cters';
    comm.text(theText);
    assert.equal("<!--" + theText + "-->", comm.toString());
    assert.done();
};
