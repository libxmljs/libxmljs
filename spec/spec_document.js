with(require('./helpers')) {

describe('A new document', function() {
  it('can be instantiated with nothing', function() {
    var doc = new libxml.Document();
    assert(doc);
    assertEqual('1.0', doc.version());
    assertEqual(null, doc.encoding());
  });

  it('can be instantiated with a version', function() {
    var doc = new libxml.Document('2.0');
    assert(doc);
    assertEqual('2.0', doc.version());
    assertEqual(null, doc.encoding());
  });

  it('can be instantiated with a version and encoding', function() {
    var doc = new libxml.Document('2.0', 'UTF-8');
    assert(doc);
    assertEqual('2.0', doc.version());
    assertEqual('UTF-8', doc.encoding());
  });

  it('can be instantiated with a callback', function() {
    var doc = null;
    new libxml.Document(function(d) { doc = d; });
    assert(doc);
    assertEqual('1.0', doc.version());
    assertEqual(null, doc.encoding());
  });

  it('can be instantiated with a version and a callback', function() {
    var doc = null;
    new libxml.Document('2.0', function(d) { doc = d; });
    assert(doc);
    assertEqual('2.0', doc.version());
    assertEqual(null, doc.encoding());
  });

  it('can be instantiated with a version, encoding and callback', function() {
    var doc = null;
    new libxml.Document('2.0', 'UTF-8', function(d) { doc = d; });
    assert(doc);
    assertEqual('2.0', doc.version());
    assertEqual('UTF-8', doc.encoding());
  });

  it('is created with a null root node', function() {
    var doc = new libxml.Document();
    assertEqual(null, doc.root());
  });

  it('can have a root node attached to it', function() {
    var doc = new libxml.Document();
    var root = doc.node('root');
    assertEqual('root', root.name());
    assertEqual(root, doc.root());
  });

  it('can return an arbitrary child of the root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assertEqual('child-one', doc.child(1).name());
    assertEqual('child-two', doc.child(2).name());
  });

  it('can return an array of children of the root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assertEqual('child-one', doc.childNodes()[0].name());
    assertEqual('child-two', doc.childNodes()[1].name());
  });

  it('returns itself when asked', function() {
    var doc = new libxml.Document();
    assertEqual(doc, doc.document());
  });

  it('can under go an encoding change', function() {
    var doc = new libxml.Document();
    assert(doc);
    assertEqual(null, doc.encoding());
    doc.encoding('UTF-8');
    assertEqual('UTF-8', doc.encoding());
  });

  it('can find a set by xpath', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child').parent().node('child');
    assertEqual(2, doc.find('child').length);
  });

  it('can get a child by xpath', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assertEqual('child-one', doc.get('child-one').name());
    assertEqual('child-two', doc.get('child-two').name());
  });

  it('knows its root node', function() {
    var doc = new libxml.Document();
    doc.node('root').node('child').parent().node('child');
    assertEqual(doc.root().name(), doc.get('/root').name());
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
    assertEqual(control, doc.toString());
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
    assertEqual(doc1.toString(), doc2.toString());
  });

  it('can haz cloned node', function() {
    var gchild_string  = '<grandchild from="julie numar">with love</grandchild>';
    var doc1_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo">'+gchild_string+'</child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc2_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"></child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc1 = libxml.parseXmlString(doc1_string);
    var doc2 = libxml.parseXmlString(doc2_string);
    doc2.child(0).addChild(doc1.child(0).child(0)); // add gchild to doc 2

    assertEqual(doc1.toString(), doc2.toString());; // both documents should be the same

    var gchild = doc1.child(0).child(0).remove(); //the removed element
    assertEqual(gchild_string, gchild.toString()); //make sure it's the same as what we started with

    //require('sys').debug('doc1: '+doc1.toString());
    //require('sys').debug('doc2: '+doc2.toString());
    assertEqual(gchild_string, doc2.child(0).child(0).toString()); // doc2 should have gchild

    assertEqual(doc2_string, doc1.toString()); //doc1 should be the same as doc2 str

    assertEqual(doc1_string, doc2.toString()); //doc2 should be the same as doc1 str
  });
});

}
