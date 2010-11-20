with(require('./helpers')) {

describe('Document traversal on a built document', function() {
  it('can get to the document from any node', function() {
    var gchild = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', function(n) {
          gchild = n.node('grandchild');
        });
      });
    });

    assert.equal(doc, gchild.doc());
  });

  it('can travel down the tree', function() {
    var gchild = null;
    doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', function(n) {
          gchild = n.node('grandchild');
        });
      });
    });
    // uses the specific and default syntax for returning a child.
    assert.equal(gchild, doc.child(1).child());
  });

  it('can travel across siblings', function() {
    var sibling = null;
    doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child');
        sibling = n.node('sibling');
      });
    });
    assert.equal(sibling, doc.child(2));
  });

  it('can travel up the tree', function() {
    var gchild = null, child = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        child = n.node('child', function(n) {
          gchild = n.node('grandchild');
        });
      });
    });
    assert.equal(doc, doc.root().parent());
    assert.equal(child, gchild.parent());
  });

  it('will list children', function() {
    var children = [];
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        children.push(n.node('child'));
        children.push(n.node('sibling1'));
        children.push(n.node('sibling2'));
      });
    });
    var i;
    assert.equal(children.length, doc.childNodes().length);
    for (i = 0; i < children.length; i++)
      assert.equal(children[i], doc.child(i+1));
  });

  it('can traverse siblings', function() {
    var children = [];
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        children.push(n.node('prevSibling'));
        children.push(n.node('child'));
        children.push(n.node('nextSibling'));
      });
    });
    assert.equal(children[0], children[1].prevSibling());
    assert.equal(children[2], children[1].nextSibling());
    assert.equal(null, children[0].prevSibling());
    assert.equal(null, children[2].nextSibling());
  });
});

describe('Document traversal on a parsed document', function() {
  it('can get to the document from any node', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    assert.equal(doc, doc.child(0).child(1).doc());
  });

  it('can travel down the tree', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    // uses the specific and default syntax for returning a child.
    assert.equal('grandchild', doc.child(1).child().name());
  });

  it('can travel across siblings', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><child /><sibling /></root>\
    ');
    assert.equal('sibling', doc.child(2).name());
  });

  it('can travel up the tree', function() {
    var gchild = null, child = null;
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    assert.equal(doc, doc.root().parent());
    assert.equal('child', doc.child().child().parent().name());
  });

  it('will list children', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><child /><sibling1 /><sibling2 /></root>\
    ');
    var children = ['child', 'sibling1', 'sibling2'];
    var i;
    assert.equal(3, doc.childNodes().length);
    for (i = 0; i < children.length; i++)
      assert.equal(children[i], doc.child(i+1).name());
  });

  it('can traverse siblings', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><prevSibling /><child /><nextSibling /></root>\
    ');

    var children = ['prevSibling', 'child', 'nextSibling'];
    var child = doc.child(2);
    assert.equal('child', child.name());
    assert.equal(children[0], child.prevSibling().name());
    assert.equal(children[2], child.nextSibling().name());
    assert.equal(null, child.prevSibling().prevSibling());
    assert.equal(null, child.nextSibling().nextSibling());
  });

  it('can traverse sibling elements', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root>\
        <prevSibling />\
        <child />\
        <nextSibling />\
      </root>\
    ');

    var children = ['prevSibling', 'child', 'nextSibling'];
    var child = doc.child(4);
    assert.equal('child', child.name());
    assert.equal(children[0], child.prevElement().name());
    assert.equal(children[2], child.nextElement().name());
    assert.equal(null, child.prevElement().prevElement());
    assert.equal(null, child.nextElement().nextElement());
  });
});

}
