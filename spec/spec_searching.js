with(require('./helpers')) {

describe('Finding a node', function() {
  it('can be done with #get', function() {
    var child = null;
    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) { child = n.node('child'); });
    });
    assert.equal(child, doc.get('child'));
  });

  it('can be done with #find', function() {
    var children = [];
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      children.push(n.node('child'));
      children.push(n.node('child'));
    });
    var results = doc.find('child');
    assert.equal(2, children.length);
    assert.equal(2, results.length);
    for (child = 0; child < children.length; child++)
      assert.equal(children[child], results[child]);
  });

  it('can be nested', function() {
    var grandchild = null;
    var doc = new libxml.Document();
    doc.node('root', function(n) {
      n.node('child', function(n) {
        grandchild = n.node('grandchild');
      });
    });
    assert.equal(grandchild, doc.get('child').get('grandchild'));
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

    assert.equal(child, doc.get('xmlns:child', uri));
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
    assert.equal(2, children.length);
    assert.equal(2, results.length);
    for (child = 0; child < children.length; child++)
      assert.equal(children[child], results[child]);
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

    assert.equal(grandchild, doc.get('child').get('xmlns:grandchild', uri));
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

    assert.equal(child, doc.get(prefix+':child', ns_parms));
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
    assert.equal(2, children.length);
    assert.equal(2, results.length);
    for (child = 0; child < children.length; child++)
      assert.equal(children[child], results[child]);
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

    assert.equal(grandchild,
                doc.get('child').get(prefix+':grandchild', ns_parms));
  });
});

}
