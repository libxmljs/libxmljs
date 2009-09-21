include('helpers.js');

describe('Document traversal', function() {
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
