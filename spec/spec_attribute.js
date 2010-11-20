with(require('./helpers')) {

describe('Attribute', function() {
  var doc = null;
  var node = null;
  beforeEach(function() {
    doc = new libxml.parseXmlString(
      "<?xml version='1.0' encoding='UTF-8'?>\n"+
      "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>"
    );
    node = doc.get('node');
  });

  it('can be created without a namespace', function() {
    var attr = new libxml.Attribute(node, 'new-attr-key', 'new-attr-value');
    assert.ok(attr);
    assert.equal(attr.value(), node.attr('new-attr-key').value());
  });

  it('can be created with a namespace', function() {
    var ns = new libxml.Namespace(node, 'ns-prefix', 'ns-uri');
    var attr = new libxml.Attribute(node, 'new-attr-key', 'new-attr-value', ns);
    assert.ok(attr);
    assert.equal(ns.prefix(), attr.namespace().prefix());
    assert.equal(ns.href(), attr.namespace().href());
  });

  it('knows its name', function() {
    assert.equal('attr-one-key', node.attr('attr-one-key').name());
  });

  it('knows its value', function() {
    assert.equal('attr-one-value', node.attr('attr-one-key').value());
  });

  it('knows its node', function() {
    assert.equal('node', node.attr('attr-one-key').node().name());
  });

  it('can change its value', function() {
    node.attr('attr-one-key').value('new-value');
    assert.equal(node.attr('attr-one-key').value(), 'new-value');
  });

  it('knows its previous sibling', function() {
    assert.equal('attr-one-key', node.attr('attr-two-key').prevSibling().name());
  });

  it('knows its next sibling', function() {
    assert.equal('attr-three-key', node.attr('attr-two-key').nextSibling().name());
  });

  it('can set and retrieve its namespace', function() {
    var ns = new libxml.Namespace(node, 'ns-prefix', 'ns-uri');
    var attr = node.attr('attr-one-key');
    attr.namespace(ns);
    assert.equal(ns.prefix(), attr.namespace().prefix());
    assert.equal(ns.href(), attr.namespace().href());
  });

  it('knows that its type is "attribute"', function() {
    assert.ok('attribute', node.attr('attr-two-key').type());
  });  

  it('can remove itself', function() {
    var attr = node.attr('attr-one-key');
    assert.ok(node.attr('attr-one-key'));
    attr.remove();
    assert.ok(!node.attr('attr-one-key'));
  });
});

}
