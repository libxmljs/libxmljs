process.mixin(require('./helpers'));

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

    assertEqual(doc, gchild.doc());
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
    assertEqual(gchild, doc.child(1).child());
  });

  it('can travel across siblings', function() {
    var sibling = null;
    doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child');
        sibling = n.node('sibling');
      });
    });
    assertEqual(sibling, doc.child(2));
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
    assertEqual(doc, doc.root().parent());
    assertEqual(child, gchild.parent());
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
    assertEqual(children.length, doc.children().length);
    for (i = 0; i < children.length; i++)
      assertEqual(children[i], doc.children()[i]);
  });

  it('can traverse siblings', function() {
    var children = [];
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        children.push(n.node('prev_sibling'));
        children.push(n.node('child'));
        children.push(n.node('next_sibling'));
      });
    });
    assertEqual(children[0], children[1].prev_sibling());
    assertEqual(children[2], children[1].next_sibling());
    assertEqual(null, children[0].prev_sibling());
    assertEqual(null, children[2].next_sibling());
  });
});

describe('Document traversal on a parsed document', function() {
  it('can get to the document from any node', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    assertEqual(doc, doc.child(0).child(1).doc());
  });

  it('can travel down the tree', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    // uses the specific and default syntax for returning a child.
    assertEqual('grandchild', doc.child(1).child().name());
  });

  it('can travel across siblings', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><child /><sibling /></root>\
    ');
    assertEqual('sibling', doc.child(2).name());
  });

  it('can travel up the tree', function() {
    var gchild = null, child = null;
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><child><grandchild /></child></root>\
    ');
    assertEqual(doc, doc.root().parent());
    assertEqual('child', doc.child().child().parent().name());
  });

  it('will list children', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><child /><sibling1 /><sibling2 /></root>\
    ');
    var children = ['child', 'sibling1', 'sibling2'];
    var i;
    assertEqual(3, doc.children().length);
    for (i = 0; i < children.length; i++)
      assertEqual(children[i], doc.children()[i].name());
  });

  it('can traverse siblings', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0"?>\
      <root><prev_sibling /><child /><next_sibling /></root>\
    ');

    var children = ['prev_sibling', 'child', 'next_sibling'];
    var child = doc.child(2);
    assertEqual('child', child.name());
    assertEqual(children[0], child.prev_sibling().name());
    assertEqual(children[2], child.next_sibling().name());
    assertEqual(null, child.prev_sibling().prev_sibling());
    assertEqual(null, child.next_sibling().next_sibling());
  });
});
