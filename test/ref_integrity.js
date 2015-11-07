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
    var nodes = libxml.parseXml('<root> <child> <grandchildren/> </child> <child2/></root>').childNodes();

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


