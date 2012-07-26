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
    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' +
        '<name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(elem.namespace());
    assert.equal(null, elem.namespace().prefix());
    assert.equal('http://my-namespace.com', elem.namespace().href());

    // no prefix from parsing
    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' +
        '<name1 xmlns:pref="http://my-namespace.com"/>');
    var elem = doc.root();
    assert.ok(!elem.namespace());

    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' +
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

module.exports.all = function(assert) {
    var document = libxml.Document();
    var root = document.node('root');
    var list = [];

    list.push(root.namespace('com', 'http://example.com'));
    list.push(root.namespace('net', 'http://example.net'));
    list.push(root.namespace('http://example.org'));

    assert.ok(root.namespaces().every(function(ns, index) {
        return ns.href() === list[index].href() && ns.prefix() === list[index].prefix();
    }));
    assert.equal(root.namespaces().length, list.length);

    assert.done();
};

module.exports.empty = function(assert) {
    var document = libxml.Document();
    var root = document.node('root');

    assert.equal(root.namespaces().length, 0);

    assert.done();
};

module.exports.nested = function(assert) {
    var document = libxml.Document();
    var root = document.node('root');

    root.namespace('com', 'http://example.com');
    assert.equal(root.namespaces().length, 1);

    var child = root.node('child');
    child.namespace('net', 'http://example.net');
    assert.equal(child.namespaces().length, 2); // <child xmlns:net="http://example.net"/> + root

    root.namespace('http://example.org');
    assert.equal(child.namespaces().length, 3); // child's namespace + root's two namespaces

    assert.done();
};
