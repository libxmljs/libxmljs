include('helpers.js');

describe('A namespace', function() {
  it('can be created and not set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.define_namespace('http://my-namespace.com');
    assertEqual(null, elem.namespace());
    assertEqual(null, ns.prefix());
    assertEqual('http://my-namespace.com', ns.href());
  });

  it('can be created with a prefix and not set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.define_namespace('pref', 'http://my-namespace.com');
    assertEqual(null, elem.namespace());
    assertEqual('pref', ns.prefix());
    assertEqual('http://my-namespace.com', ns.href());
  });

  it('can be created and set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.define_namespace('http://my-namespace.com');
    elem.namespace(ns);
    assert(ns == elem.namespace());
    assertEqual(null, elem.namespace().prefix());
    assertEqual('http://my-namespace.com', elem.namespace().href());
  });

  it('can be created with a prefix and set', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.define_namespace('pref', 'http://my-namespace.com');
    elem.namespace(ns);
    assert(ns == elem.namespace());
    assertEqual('pref', elem.namespace().prefix());
    assertEqual('http://my-namespace.com', elem.namespace().href());
  });

  it('without a prefix can be applied through parsing', function() {
    var doc = libxml.parseString('<?xml version="1.0" encoding="UTF-8"?>\
    <name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root();
    assert(elem.namespace());
    assertEqual(null, elem.namespace().prefix());
    assertEqual('http://my-namespace.com', elem.namespace().href());
  });

  it('with a prefix wont be applied through parsing', function() {
    var doc = libxml.parseString('<?xml version="1.0" encoding="UTF-8"?>\
    <name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert(!elem.namespace());
  });

  it('with a prefix can be applied through parsing', function() {
    var doc = libxml.parseString('<?xml version="1.0" encoding="UTF-8"?>\
    <pref:name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert(elem.namespace());
    assertEqual('pref', elem.namespace().prefix());
    assertEqual('http://my-namespace.com', elem.namespace().href());
  });
});
