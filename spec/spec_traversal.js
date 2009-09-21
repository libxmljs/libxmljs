include('helpers.js');

describe('Document traversal', function() {
  it('can get to the document from any node', function() {
    var gchild = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', {to: 'wongfoo'}, function(n) {
          gchild = n.node('grandchild', {from: 'julie numar'}, 'with love');
        });
      });
    });

    assertEqual(doc, gchild.doc());
  });
});
