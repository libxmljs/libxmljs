var libxml = require('../index');

var body = "<?xml version='1.0' encoding='UTF-8'?>\n" +
  "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>";

module.exports.new = function(assert) {
    var doc = libxml.parseXml(body);
    var node = doc.get('node');

    // add new attribute to the node
    node.attr({'new-attr-key': 'new-attr-value'});
    assert.equal('new-attr-value', node.attr('new-attr-key').value());
    assert.done();
};

module.exports.create_with_namespace = function(assert) {
    var doc = new libxml.parseXml(
      "<?xml version='1.0' encoding='UTF-8'?>\n"+
      "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>"
    );
    var node = doc.get('node');

    var attr = node.attr({'new-attr-key': 'new-attr-value'});
    var ns = attr.namespace('ns-prefix', 'ns-url');
    assert.ok(attr);
    assert.equal(ns.prefix(), attr.namespace().prefix());
    assert.equal(ns.href(), attr.namespace().href());
    assert.done();
};

module.exports.getters = function(assert) {
    var doc = libxml.parseXml(body);
    var node = doc.get('node');

    assert.equal('attr-one-key', node.attr('attr-one-key').name());
    assert.equal('attr-one-value', node.attr('attr-one-key').value());
    assert.equal('node', node.attr('attr-one-key').node().name());
    assert.ok('attribute', node.attr('attr-two-key').type());

    // siblings
    assert.equal('attr-one-key', node.attr('attr-two-key').prevSibling().name());
    assert.equal('attr-three-key', node.attr('attr-two-key').nextSibling().name());

    assert.done();
};

module.exports.setters = function(assert) {
    var doc = libxml.parseXml(body);
    var node = doc.get('node');

    node.attr('attr-one-key').value('new-value');
    assert.equal(node.attr('attr-one-key').value(), 'new-value');
    assert.done();
};

/*
module.exports.namespace = function(assert) {
    var doc = libxml.parseXml(body);
    var node = doc.get('node');

    var ns = new libxml.Namespace(node, 'ns-prefix', 'ns-uri');
    var attr = node.attr('attr-one-key');
    attr.namespace(ns);
    assert.equal(ns.prefix(), attr.namespace().prefix());
    assert.equal(ns.href(), attr.namespace().href());
    assert.done();
};
*/

module.exports.remove = function(assert) {
    var doc = libxml.parseXml(body);
    var node = doc.get('node');

    var attr = node.attr('attr-one-key');
    assert.ok(node.attr('attr-one-key'));
    attr.remove();
    assert.ok(!node.attr('attr-one-key'));
    assert.done();
};
