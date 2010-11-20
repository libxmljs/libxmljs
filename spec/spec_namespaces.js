with(require('./helpers')) {

describe('A namespace', function() {
  it('can be created and not set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('http://my-namespace.com');
    assert.equal(null, elem.namespace());
    assert.equal(null, ns.prefix());
    assert.equal('http://my-namespace.com', ns.href());
  });

  it('can be created with a prefix and not set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('pref', 'http://my-namespace.com');
    assert.equal(null, elem.namespace());
    assert.equal('pref', ns.prefix());
    assert.equal('http://my-namespace.com', ns.href());
  });

  it('can be created and set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.namespace('http://my-namespace.com');
    assert.ok(ns == elem.namespace());
    assert.equal(null, elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
  });

  it('can be created with a prefix and set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.namespace('pref', 'http://my-namespace.com');
    assert.ok(ns == elem.namespace());
    assert.equal('pref', elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
  });

  it('without a prefix can be applied through parsing', function() {
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\
    <name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(elem.namespace());
    assert.equal(null, elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
  });

  it('with a prefix wont be applied through parsing', function() {
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\
    <name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(!elem.namespace());
  });

  it('with a prefix can be applied through parsing', function() {
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\
    <pref:name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(elem.namespace());
    assert.equal('pref', elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
  });

  it('will use an existing namespace with only a url', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('http://my-namespace.com');
    elem.namespace('http://my-namespace.com');
    assert.ok(ns == elem.namespace());
  });

  it('will use an existing namespace with a prefix', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('pref', 'http://my-namespace.com');
    elem.namespace('pref', 'http://my-namespace.com');
    assert.ok(ns == elem.namespace());
  });

  it('can be pulled off a node', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.namespace('http://my-namespace.com');
    assert.ok(ns);
    assert.ok(ns == elem.namespace());
    elem.namespace(null);
    assert.ok(!elem.namespace());
  });
});

}
