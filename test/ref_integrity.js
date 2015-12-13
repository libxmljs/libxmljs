var libxml = require('../index');

if (!global.gc) {
    throw new Error('must run with --expose_gc for ref integrity tests');
}

module.exports.gc = function(assert) {
    var doc = libxml.Document();
    doc.node('root').node('child').node('grandchild').parent().node('child2');
    gc();
    assert.ok(doc, "doc");
    gc();
    assert.ok(doc.root(), "root");
    gc();
    assert.equal("child", doc.root().childNodes()[0].name(), "child name");
    assert.done();
};

module.exports.references = function(assert) {
    var nodes = libxml.parseXml('<root> <child> <grandchildren/> </child> <child2/> </root>').childNodes();

    gc();

    assert.ok(nodes[0].doc());
    assert.equal("child", nodes[1].name());
    assert.done();
};

// test that double-freeing XmlNode's doesn't cause a segfault
module.exports.double_free = function(assert) {
    var children = null;

    // stick this portion of code into a self-executing function so
    // its internal variables can be garbage collected
    (function(){
        var html = '<html><body><div><span></span></div></body></html>';
        var doc = libxml.parseHtml(html);

        doc.find('//div').forEach(function(tag){
            // provide a reference to childNodes so they are exposed as XmlNodes
            // and therefore subject to V8's garbage collection
            children = tag.childNodes();
            tag.remove();
        });
    })();

    global.gc();
    assert.ok( children[0].attrs() );
    assert.done();
};

module.exports.freed_namespace_unwrappable = function(assert) {
    var doc = libxml.parseXml("<?xml version='1.0' encoding='UTF-8'?><root></root>");
    var el = new libxml.Element(doc, "foo");
    var ns = el.namespace("bar", null);
    el = null;
    global.gc();
    ns = null;
    global.gc();
    assert.done();
};

module.exports.unlinked_tree_persistence_parent_proxied_first = function(assert) {
  var doc = makeDocument();
  var parent_node = doc.get('//middle');
  var child_node = doc.get('//inner');

  parent_node.remove();
  parent_node = null;
  collectGarbage();

  assert.equal("inner", child_node.name()); // works with >= v0.14.3
  assert.done();
};

module.exports.unlinked_tree_proxied_leaf_persistent_ancestor_first = function(assert) {
  var doc = makeDocument();
  var ancestor = doc.get('//middle');
  var leaf = doc.get('//center');

  ancestor.remove();
  ancestor = null;
  collectGarbage();

  assert.equal("center", leaf.name()); // fails with v0.14.3, v0.15
  assert.done();
};

module.exports.unlinked_tree_proxied_leaf_persistent_descendant_first = function(assert) {
  var doc = makeDocument();
  var leaf = doc.get('//center');
  var ancestor = doc.get('//middle');

  ancestor.remove(); // make check here?
  ancestor = null;
  collectGarbage();

  assert.equal("center", leaf.name());
  assert.done();
};

module.exports.unlinked_tree_persistence_child_proxied_first = function(assert) {
  var doc = makeDocument();
  var child_node = doc.get('//inner');
  var parent_node = doc.get('//middle');

  parent_node.remove();
  parent_node = null;
  collectGarbage();

  assert.equal("inner", child_node.name()); // fails with v0.14.3, v0.15
  assert.done();
};

module.exports.unlinked_tree_leaf_persistence_with_proxied_ancestor = function(assert) {
  var doc = makeDocument();
  var proxied_ancestor = doc.get('//inner');
  var leaf = doc.get('//center');

  doc.get('//middle').remove();
  leaf = null;
  collectGarbage();

  leaf = proxied_ancestor.get('.//center');
  assert.equal("center", leaf.name());
  assert.done();
};

module.exports.unlinked_tree_leaf_persistence_with_peer_proxy = function(assert) {
  var doc = makeDocument();
  var leaf = doc.get('//left');
  var peer = doc.get('//right');

  doc.get('//middle').remove();
  leaf = null;
  collectGarbage();

  leaf = peer.parent().get('./left');
  assert.equal("left", leaf.name());
  assert.done();
};

module.exports.set_text_clobbering_children = function(assert) {
  var doc = libxml.parseHtml('<root><child><inner>old</inner></child></root>')
  var child = doc.get('//child');
  var inner = doc.get('//inner');
  child.text('new');

  assert.equal(doc, inner.parent());
  assert.equal('old', inner.text());

  assert.done();
}

function makeDocument() {
    var body = "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><left/><center/><right/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles, maxCycles) {
    minCycles = minCycles || 3;
    maxCycles = maxCycles || 10;

    var cycles = 0;
    var freedRss = 0;
    var usage = process.memoryUsage();
    do {
        global.gc();

        var usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    }
    while ((cycles < minCycles) || ((freedRss !== 0) && (cycles < maxCycles)));

    return usage;
}

