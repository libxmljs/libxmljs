var libxml = require('../index');

module.exports.built = function(assert) {
    var doc = libxml.Document();
    var child = doc.node('root').node('child');
    var sibling = doc.root().node('sibling');
    var gchild = child.node('grandchild');

    // access document
    assert.equal(doc, gchild.doc());
    assert.equal(doc, doc.root().parent());

    assert.equal(child, gchild.parent());
    assert.equal(gchild, doc.child(0).child(0));

    assert.equal(sibling, doc.child(1));
    assert.done();
};

module.exports.children = function(assert) {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node('root');
    children.push(root.node('child'));
    children.push(root.node('sibling1'));
    children.push(root.node('sibling2'));

    assert.equal(children.length, doc.childNodes().length);
    for (var i = 0; i < children.length; ++i) {
        assert.equal(children[i], doc.child(i));
    }
    assert.done();
};

module.exports.siblings = function(assert) {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node('root');
    children.push(root.node('prevSibling'));
    children.push(root.node('child'));
    children.push(root.node('nextSibling'));
    assert.equal(children[0], children[1].prevSibling());
    assert.equal(children[2], children[1].nextSibling());
    assert.equal(null, children[0].prevSibling());
    assert.equal(null, children[2].nextSibling());
    assert.done();
};

module.exports.parsed = function(assert) {
    var doc = libxml.parseXml(
        '<?xml version="1.0"?>' +
        '<root><child><grandchild /></child><sibling/></root>');
    assert.equal(doc, doc.child(0).doc());
    assert.equal(doc, doc.child(1).doc());
    assert.equal(doc, doc.child(0).child(0).doc());
    assert.equal(doc, doc.root().parent());

    // down and back up
    assert.equal('child', doc.child(0).child(0).parent().name());

    // propertly access inner nodes
    assert.equal('grandchild', doc.child(0).child(0).name());

    // sibling nodes
    assert.equal('sibling', doc.child(1).name());
    assert.done();
};

module.exports.parsed_children = function(assert) {
    var doc = libxml.parseXml(
        '<?xml version="1.0"?>' +
        '<root><prevSibling /><child /><nextSibling /></root>');
    var children = ['prevSibling', 'child', 'nextSibling'];

    // childNodes
    assert.equal(3, doc.childNodes().length);
    for (var i = 0; i < children.length; ++i) {
        assert.equal(children[i], doc.child(i).name());
    }

    // check prev/next sibling
    var child = doc.child(1);
    assert.equal('child', child.name());
    assert.equal(children[0], child.prevSibling().name());
    assert.equal(children[2], child.nextSibling().name());
    assert.equal(null, child.prevSibling().prevSibling());
    assert.equal(null, child.nextSibling().nextSibling());

    // prev/next Element
    var child = doc.child(1);
    assert.equal('child', child.name());
    assert.equal(children[0], child.prevElement().name());
    assert.equal(children[2], child.nextElement().name());
    assert.equal(null, child.prevElement().prevElement());
    assert.equal(null, child.nextElement().nextElement());

    assert.done();
};

