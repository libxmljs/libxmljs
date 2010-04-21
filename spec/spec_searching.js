with(require('./helpers')) {

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

describe('Finding a non-prefix namespaced node', function() {
  var uri = 'nsuri';

  it('can be done with #get', function() {
    var child = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        child = n.node('child');
        child.namespace(uri);
      });
    });

    assertEqual(child, doc.get('xmlns:child', uri));
  });

  it('can be done with #find', function() {
    var children = [];
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      children.push(n.node('child'));
      children.push(n.node('child'));
    });
    
    var ns = children[0].namespace(uri);
    children[1].namespace(ns);

    var results = doc.find('xmlns:child', uri);
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
        grandchild.namespace(uri);
      });
    });

    assertEqual(grandchild, doc.get('child').get('xmlns:grandchild', uri));
  });
});

describe('Finding a prefixed namespaced node', function() {
  var prefix = 'pefname',
      uri = 'nsuri';
  
  var ns_parms = {};
  ns_parms[prefix] = uri;
  
  it('can be done with #get', function() {
    var child = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        child = n.node('child'); 
        child.namespace(prefix, uri);
      });
    });

    assertEqual(child, doc.get(prefix+':child', ns_parms));
  });

  it('can be done with #find', function() {
    var children = [];
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      children.push(n.node('child'));
      children.push(n.node('child'));
    });
    
    var ns = children[0].namespace(prefix, uri);
    children[1].namespace(ns);

    var results = doc.find(prefix+':child', ns_parms);
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
        grandchild.namespace(prefix, uri);
      });
    });

    assertEqual(grandchild,
                doc.get('child').get(prefix+':grandchild', ns_parms));
  });
});

}
