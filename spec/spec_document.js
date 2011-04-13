with(require('./helpers')) {

describe('A new document', function() {
  it('can be instantiated with nothing', function() {
    var doc = new libxml.Document();
    assert.ok(doc);
    assert.equal('1.0', doc.version());
    assert.equal(null, doc.encoding());
  });

  it('can be instantiated with a version', function() {
    var doc = new libxml.Document('2.0');
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal(null, doc.encoding());
  });

  it('can be instantiated with a version and encoding', function() {
    var doc = new libxml.Document('2.0', 'UTF-8');
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
  });

  it('can be instantiated with a callback', function() {
    var doc = null;
    new libxml.Document(function(d) { doc = d; });
    assert.ok(doc);
    assert.equal('1.0', doc.version());
    assert.equal(null, doc.encoding());
  });

  it('can be instantiated with a version and a callback', function() {
    var doc = null;
    new libxml.Document('2.0', function(d) { doc = d; });
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal(null, doc.encoding());
  });

  it('can be instantiated with a version, encoding and callback', function() {
    var doc = null;
    new libxml.Document('2.0', 'UTF-8', function(d) { doc = d; });
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
  });

  it('is created with a null root node', function() {
    var doc = new libxml.Document();
    assert.equal(null, doc.root());
  });

  it('can have a root node attached to it', function() {
    var doc = new libxml.Document();
    var root = doc.node('root');
    assert.equal('root', root.name());
    assert.equal(root, doc.root());
  });

  it('can return an arbitrary child of the root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.child(1).name());
    assert.equal('child-two', doc.child(2).name());
  });

  it('can return an array of children of the root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.childNodes()[0].name());
    assert.equal('child-two', doc.childNodes()[1].name());
  });

  it('returns itself when asked', function() {
    var doc = new libxml.Document();
    assert.equal(doc, doc.document());
  });

  it('can under go an encoding change', function() {
    var doc = new libxml.Document();
    assert.ok(doc);
    assert.equal(null, doc.encoding());
    doc.encoding('UTF-8');
    assert.equal('UTF-8', doc.encoding());
  });

  it('can find a set by xpath', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child').parent().node('child');
    assert.equal(2, doc.find('child').length);
  });

  it('can get a child by xpath', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.get('child-one').name());
    assert.equal('child-two', doc.get('child-two').name());
  });

  it('knows its root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child').parent().node('child');
    assert.equal(doc.root().name(), doc.get('/root').name());
  });

  it('can be output as a string', function() {
    var control = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"><grandchild from="julie numar">with love</grandchild></child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', {to: 'wongfoo'}, null, function(n) {
          n.node('grandchild', {from: 'julie numar'}, 'with love');
        });
        n.node('sibling', null, 'with content!');
      });
    });
    assert.equal(control, doc.toString());
  });

  it('can add child nodes', function() {
    var gchild = '';
    var doc1_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"><grandchild from="julie numar">with love</grandchild></child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc2_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"></child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc1 = libxml.parseXmlString(doc1_string);
    var doc2 = libxml.parseXmlString(doc2_string);
    doc2.child(0).addChild(doc1.child(0).child(0));
    assert.equal(doc1.toString(), doc2.toString());
  });

  it('can add a cloned node', function() {
    var gchild_string  = '<grandchild from="julie numar">with love</grandchild>';
    var doc1_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo">'+gchild_string+'</child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc2_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"/><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc1 = libxml.parseXmlString(doc1_string);
    var doc2 = libxml.parseXmlString(doc2_string);
	
	var gchild = doc1.child(0).child(0); //the element to operate on
	
    doc2.child(0).addChild(gchild); // add gchild clone to doc2, implicit clone

    assert.equal(doc1.toString(), doc2.toString()); // both documents should be the same

    assert. notEqual(gchild, doc2.child(0).child(0)); // these nodes should be different (cloned)

    gchild.remove();
	
    assert.equal(doc2_string, doc1.toString()); //doc1 should be the same as doc2 str

    assert.equal(doc1_string, doc2.toString()); //doc2 should be the same as doc1 str
  });
});

}
