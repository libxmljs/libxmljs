var libxml = require('../index');

module.exports.create = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('http://my-namespace.com');
    assert.ok(ns);
    assert.equal(null, elem.namespace());
    assert.equal(null, ns.prefix());
    assert.equal('http://my-namespace.com', ns.href());
    assert.done();
};

// assign namespace to a node
module.exports.set = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');

    // this will set a namespace on the node
    var ns = elem.namespace('http://my-namespace.com');
    assert.ok(ns);
    assert.equal(ns, elem.namespace());
    assert.equal(null, elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
    assert.done();
};


module.exports.with_prefix = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('pref', 'http://my-namespace.com');
    assert.equal(null, elem.namespace());
    assert.equal('pref', ns.prefix());
    assert.equal('http://my-namespace.com', ns.href());

    // this should detect existing namespace object
    var ns2 = elem.namespace('pref', 'http://my-namespace.com');
    assert.ok(ns2);
    assert.equal(ns, ns2);
    assert.equal(ns, elem.namespace());
    assert.equal('pref', elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());
    assert.done();
};

module.exports.from_parsing = function(assert) {
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' +
        '<name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(elem.namespace());
    assert.equal(null, elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());

    // no prefix from parsing
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' +
        '<name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(!elem.namespace());

    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' +
        '<pref:name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(elem.namespace());
    assert.equal('pref', elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());

    assert.done();
};

module.exports.existing = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('http://my-namespace.com');
    elem.namespace('http://my-namespace.com');
    assert.ok(ns);
    assert.equal(ns, elem.namespace());

    var doc = libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.defineNamespace('pref', 'http://my-namespace.com');
    elem.namespace('pref', 'http://my-namespace.com');
    assert.ok(ns);
    assert.equal(ns, elem.namespace());
    assert.done();
};

module.exports.remove = function(assert) {
    var doc = libxml.Document();
    var elem = doc.node('name1');
    var ns = elem.namespace('http://my-namespace.com');
    assert.ok(ns);
    assert.ok(ns == elem.namespace());
    elem.namespace(null);
    assert.ok(!elem.namespace());
    assert.done();
};

