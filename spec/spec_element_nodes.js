include('helpers.js');

describe('An element node', function() {
  it('can be created', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    assertEqual('name1', elem.name());
  });

  it('can be created with a callback', function() {
    var doc = new libxml.Document();
    var elem = false;
    doc.node('name2', function(n) { elem = n; });
    assertEqual('name2', elem.name());
  });

  it('can be created as the document root', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name');
    assertEqual(elem, doc.root());
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
    var doc = new libxml.Document();
    var elem = doc.node('name');
    assertEqual(null, elem.text());
    elem.text('content');
    assertEqual('content', elem.text());
  });

  it('can undergo a namechange after creation', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    assertEqual('name1', elem.name());
    elem.name('newname');
    assertEqual('newname', elem.name());
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
});
