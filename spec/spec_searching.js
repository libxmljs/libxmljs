node.mixin(process, require('helpers.js'));

describe('Finding a node', function() {
  it('can be done with #get', function() {
    var child = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) { child = n.node('child'); });
    });
    assertEqual(child, doc.get('child'));
  });

  it('can be done with #find', function() {
    var children = [];
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      children.push(n.node('child'));
      children.push(n.node('child'));
    });
    var results = doc.find('child');
    assertEqual(2, children.length);
    assertEqual(2, results.length);
    for (child = 0; child < children.length; child++)
      assertEqual(children[child], results[child]);
  });

  it('can be nested', function() {
    var grandchild = null;
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      n.node('child', function(n) {
        grandchild = n.node('grandchild');
      });
    });
    assertEqual(grandchild, doc.get('child').get('grandchild'));
  });
});
