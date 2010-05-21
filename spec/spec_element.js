with(require('./helpers')) {

describe('An element node', function() {
  var doc = null;
  var elem = null;

  beforeEach(function() {
    doc = new libxml.Document();
    elem = doc.node('name1');
  });

  it('can be created', function() {
    assertEqual('name1', elem.name());
  });

  it('can be created with a callback', function() {
    doc = new libxml.Document();
    var elem = false;
    doc.node('name2', function(n) { elem = n; });
    assertEqual('name2', elem.name());
  });

  it('can be created as the document root', function() {
    assertEqual('name1', doc.root().name());
  });

  it('can be built by nesting', function() {
    var doc = new libxml.Document();
    var levels = 0;
    doc.node('root', function(n) {
      levels++;
      assertEqual('root', n.name());
      n.node('child', function(n) {
        levels++;
        assertEqual('child', n.name());
        var grandchild = n.node('grandchild', function() { levels++; });
        assertEqual('grandchild', grandchild.name());
      });
    });
    assertEqual(3, levels);
  });

  it('can have content assigned after creation', function() {
    assertEqual("", elem.text());
    elem.text('content');
    assertEqual('content', elem.text());
  });

  it('can undergo a namechange after creation', function() {
    assertEqual('name1', elem.name());
    elem.name('newname');
    assertEqual('newname', elem.name());
  });

  it('can have a child added to it', function() {
    var newChild = new libxml.Element(elem.doc(), 'new-child');
    elem.addChild(newChild);
    assert(doc.get('/name1/new-child'));
  });

  it('can describe its path', function() {
    var gchild = null, sibling = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', function(n) {
          gchild = n.node('grandchild');
        });
        sibling = n.node('child');
      });
    });
    assertEqual('/root/child[1]/grandchild', gchild.path());
    assertEqual('/root/child[2]', sibling.path());
  });

  it('knows that its type is "element"', function() {
    assert('element', elem.type());
  });

  it('can print itself using #toString', function() {
    assertEqual('<name1/>', elem.toString());
    elem.node('child');
    assertEqual('<name1><child/></name1>', elem.toString());
  });

  it('can remove itself from the document', function() {
    var child = elem.node('child');
    assert(doc.get('/name1/child'));

    child.remove();
    assert(!doc.get('/name1/child'));
  });

  it('can be moved from one place to another', function() {
    var child = elem.node('child');
    assert(doc.get('/name1/child'));

    child.remove();
    var name2 = elem.node('name2');
    name2.node(child);
    assert(!doc.get('/name1/child'));
    assert(doc.get('/name1/name2/child'));
  });

  it('can add a previous sibling', function() {
    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assertEqual(elem.childNodes().length, 2);
    var prevSibling = new libxml.Element(elem.doc(), 'prev-sibling');
    var addedSibling = child2.addPrevSibling(prevSibling);
    var children = elem.childNodes();
    assertEqual(3, children.length);
    assertEqual('prev-sibling', children[1].name());
  });

  it('can add a next sibling', function() {
    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assertEqual(elem.childNodes().length, 2);
    var nextSibling = new libxml.Element(elem.doc(), 'next-sibling');
    var addedSibling = child1.addNextSibling(nextSibling);
    var children = elem.childNodes();
    assertEqual(3, children.length);
    assertEqual('next-sibling', children[1].name());
  });
});

}
