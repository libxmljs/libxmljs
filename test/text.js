var libxml = require('../index');

module.exports.invalid_new = function(assert) {
    var doc = libxml.Document();

    assert.throws(function() {
        libxml.Text();
    });

    assert.throws(function() {
        libxml.Text(doc);
    });

    assert.done();
};

module.exports.new = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, 'node content');
    doc.root(elem);
    assert.equal('node content', elem.text());
    assert.done();
};

module.exports.setters = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, 'node content');

    // change content
    assert.equal('node content', elem.text());
    elem.text('content && more content <>');
    assert.equal('content &amp;&amp; more content &lt;&gt;', elem.text());

    assert.done();
};

module.exports.getters = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, 'getters');

    assert.throws(function() {
        elem.name();
    }, "text nodes should NOT expose a name");

    assert.equal('text', elem.type());
    assert.done();
};

module.exports.remove = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, 'node content');
    doc.root(elem);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\nnode content\n', doc.toString());
    elem.remove();
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n', doc.toString());
    assert.done();
};

module.exports.toString = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, 'node content');
    doc.root(elem);
    assert.equal('node content', elem.toString());
    assert.done();
};

module.exports.addChild = function(assert) {
    var doc = libxml.Document();

    var newTextNode = new libxml.Text(doc, "my text");
    var newElement = new libxml.Element(doc, "div");

    newElement.addChild(newTextNode);
    doc.root(newElement);
    assert.equal('<div>my text</div>', newElement.toString());

    assert.done();
};

module.exports.addSiblings = function(assert) {
    var doc = libxml.Document();

    var parentNode = new libxml.Element(doc, "div");
    var child = parentNode.node("child", "i'm a child");
    var prevTextNode = new libxml.Text(doc, "before text");
    var nextTextNode = new libxml.Text(doc, "after text");

    child.addPrevSibling(prevTextNode);
    child.addNextSibling(nextTextNode);

    assert.equal("<div>before text<child>i'm a child</child>after text</div>", parentNode.toString());

    assert.done();
};
