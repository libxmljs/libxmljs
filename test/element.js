var libxml = require('../index');

module.exports.new = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, 'name1');
    doc.root(elem);
    assert.equal('name1', elem.name());
    assert.equal('name1', doc.root().name());
    assert.done();
};

module.exports.newWithContent = function(assert) {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, 'name1', 'content && more content <>');
    doc.root(elem);
    assert.equal('name1', elem.name());
    assert.equal('name1', doc.root().name());
    assert.equal('content && more content <>', elem.text());
    assert.done();
};

module.exports.setters = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    // change content
    assert.equal('', elem.text());
    elem.text('content && more content <>');
    assert.equal('content && more content <>', elem.text());

    // change name
    assert.equal('name1', elem.name());
    elem.name('newname');
    assert.equal('newname', elem.name());
    assert.done();
};

module.exports.getters = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    assert.equal('element', elem.type());
    //TODO assert.equal(doc, elem.doc());
    assert.done();
};

module.exports.remove = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var child = elem.node('child');
    assert.ok(doc.get('/name1/child'));

    child.remove();
    assert.ok(!doc.get('/name1/child'));

    assert.done();
};

module.exports.toString = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    assert.equal('<name1/>', elem.toString());
    elem.node('child');
    assert.equal('<name1><child/></name1>', elem.toString());
    assert.equal('<name1><child></child></name1>', elem.toString({ selfCloseEmpty: false }));
    assert.equal('<name1><child></child></name1>', elem.toString({ type: 'html' }));
    assert.equal('<name1\n  ><child\n  /></name1\n>', elem.toString({ whitespace: true }));
    assert.equal('<name1>\n  <child/>\n</name1>', elem.toString({ format: true }));
    assert.done();
};

module.exports.path = function(assert) {
    var gchild = null, sibling = null;
    var doc = libxml.Document();
    var root = doc.node('root');
    var gchild = root.node('child').node('grandchild');
    var sibling = root.node('child');
    assert.equal('/root/child[1]/grandchild', gchild.path());
    assert.equal('/root/child[2]', sibling.path());
    assert.done();
};

module.exports.move = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var child = elem.node('child');
    assert.ok(doc.get('/name1/child'));

    child.remove();
    var name2 = elem.node('name2');
    name2.addChild(child);
    assert.ok(!doc.get('/name1/child'));
    assert.ok(doc.get('/name1/name2/child'));
    assert.done();
};

module.exports.addChild = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var newChild = libxml.Element(doc, 'new-child');
    elem.addChild(newChild);
    assert.ok(doc.get('/name1/new-child'));
    assert.done();
};

module.exports.add_prev_sibling = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assert.equal(elem.childNodes().length, 2);
    var prevSibling = libxml.Element(doc, 'prev-sibling');
    var addedSibling = child2.addPrevSibling(prevSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal('prev-sibling', children[1].name());
    assert.done();
};

module.exports.add_next_sibling = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assert.equal(elem.childNodes().length, 2);
    var nextSibling = libxml.Element(elem.doc(), 'next-sibling');
    var addedSibling = child1.addNextSibling(nextSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal('next-sibling', children[1].name());
    assert.done();
};

module.exports.import = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    var child1 = elem.node('child1');
    doc = child1.doc();

    var newdoc = libxml.Document();
    newdoc.node('newdoc');

    newdoc.root().addChild(child1);

    assert.ok(newdoc);
    assert.notEqual(doc, newdoc, true);
    assert.equal('child1', newdoc.root().childNodes()[0].name());
    assert.equal(child1, elem.childNodes()[0]); // child1 is the the first child of elem
    assert.done();
};

module.exports.clone = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('child');
    var elem2 = elem.clone();
    assert.equal(elem.name(), elem2.name());
    assert.equal(elem.text(), elem2.text());
    assert.equal(elem.toString(), elem2.toString());
    assert.done();
};

module.exports.namespace = function(assert) {
    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
            '<root xmlns:bacon="http://www.example.com/fake/uri"><node bacon:attr-with-ns="attr-with-ns-value" attr-without-ns="attr-withoug-ns-vavlue" /></root>';
    var doc = new libxml.parseXml(str);
    var node = doc.get('node');
    var attrs = node.attrs();

    attrs.forEach(function(attr) {
        var name = attr.name();
        var ns = attr.namespace();

        if (name === 'attr-with-ns') {
            assert.equal(ns.prefix(), 'bacon');
            assert.equal(ns.href(), 'http://www.example.com/fake/uri');
        } else {
            assert.equal(name, 'attr-without-ns');
            assert.equal(ns, null);
        }
    });
    assert.done();
};

module.exports.replace = function(assert) {
  var str = "<foo>some <bar/> evening</foo>";
  var doc = libxml.parseXml(str);
  var bar = doc.get('bar');
  bar.replace('enchanted');
  assert.equal(doc.root().text(), 'some enchanted evening');

  doc = libxml.parseXml(str);
  bar = doc.get('bar');
  bar.replace('<>');
  assert.equal(doc.root().toString(), '<foo>some &lt;&gt; evening</foo>')

  doc = libxml.parseXml(str);
  bar = doc.get('bar');
  enchant = libxml.parseXml('<enchanted/>');
  bar.replace(enchant.root());
  assert.equal(doc.root().toString(), '<foo>some <enchanted/> evening</foo>')
  assert.equal(doc.root().childNodes().length, 3);
  assert.equal(doc.root().childNodes()[1].name(), 'enchanted');

  assert.done();
}
