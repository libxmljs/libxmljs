with(require('./helpers')) {

describe('An element node', function() {
  var doc = null;
  var elem = null;

  beforeEach(function() {
    doc = new libxml.Document();
    elem = doc.node('name1');
  });

  it('can be created', function() {
    assert.equal('name1', elem.name());
  });

  it('can be created with a callback', function() {
    doc = new libxml.Document();
    var elem = false;
    doc.node('name2', function(n) { elem = n; });
    assert.equal('name2', elem.name());
  });

  it('can be created as the document root', function() {
    assert.equal('name1', doc.root().name());
  });

  it('can be built by nesting', function() {
    var doc = new libxml.Document();
    var levels = 0;
    doc.node('root', function(n) {
      levels++;
      assert.equal('root', n.name());
      n.node('child', function(n) {
        levels++;
        assert.equal('child', n.name());
        var grandchild = n.node('grandchild', function() { levels++; });
        assert.equal('grandchild', grandchild.name());
      });
    });
    assert.equal(3, levels);
  });

  it('can have content assigned after creation', function() {
    assert.equal("", elem.text());
    elem.text('content');
    assert.equal('content', elem.text());
  });

  it('can undergo a namechange after creation', function() {
    assert.equal('name1', elem.name());
    elem.name('newname');
    assert.equal('newname', elem.name());
  });

  it('can have a child added to it', function() {
    var newChild = new libxml.Element(elem.doc(), 'new-child');
    elem.addChild(newChild);
    assert.ok(doc.get('/name1/new-child'));
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
    assert.equal('/root/child[1]/grandchild', gchild.path());
    assert.equal('/root/child[2]', sibling.path());
  });

  it('knows that its type is "element"', function() {
    assert.ok('element', elem.type());
  });

  it('can print itself using #toString', function() {
    assert.equal('<name1/>', elem.toString());
    elem.node('child');
    assert.equal('<name1><child/></name1>', elem.toString());
  });

  it('can remove itself from the document', function() {
    var child = elem.node('child');
    assert.ok(doc.get('/name1/child'));

    child.remove();
    assert.ok(!doc.get('/name1/child'));
  });

  it('can be moved from one place to another', function() {
    var child = elem.node('child');
    assert.ok(doc.get('/name1/child'));

    child.remove();
    var name2 = elem.node('name2');
    name2.node(child);
    assert.ok(!doc.get('/name1/child'));
    assert.ok(doc.get('/name1/name2/child'));
  });

  it('can add a previous sibling', function() {
    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assert.equal(elem.childNodes().length, 2);
    var prevSibling = new libxml.Element(elem.doc(), 'prev-sibling');
    var addedSibling = child2.addPrevSibling(prevSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal('prev-sibling', children[1].name());
  });

  it('can add a next sibling', function() {
    var child1 = elem.node('child1');
    var child2 = elem.node('child2');
    assert.equal(elem.childNodes().length, 2);
    var nextSibling = new libxml.Element(elem.doc(), 'next-sibling');
    var addedSibling = child1.addNextSibling(nextSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal('next-sibling', children[1].name());
  });

    it('can be imported to another document', function() {
        var child1 = elem.node('child1');
        doc = child1.doc();

        var newdoc = new libxml.Document();
        newdoc.node('newdoc');
        newdoc.root().addChild(child1);

        assert.ok(newdoc);
        assert. notEqual(doc, newdoc, true);
        assert.equal('child1', newdoc.root().childNodes()[0].name());
        gc();
        assert.equal(child1, elem.childNodes()[0]); // child1 is the the first child of elem
    });
});

}
