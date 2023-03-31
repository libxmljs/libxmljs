import * as libxml from "../index";
import { XMLElement } from "../index";

if (!global.gc) {
    throw new Error("must run with --expose_gc for ref integrity tests");
}

module.exports.gc = function (assert: any) {
    var doc = libxml.Document();
    doc.node("root")?.node("child")?.node("grandchild")?.parent()?.node("child2");
    global.gc();
    assert.ok(doc, "doc");
    global.gc();
    assert.ok(doc.root(), "root");
    global.gc();
    assert.equal("child", doc.root()?.childNodes()[0]?.name(), "child name");
    assert.done();
};

module.exports.references = function (assert: any) {
    var nodes = libxml.parseXml("<root> <child> <grandchildren/> </child> <child2/> </root>").childNodes();

    global.gc();

    assert.ok(nodes[0]?.doc());
    assert.equal("child", nodes[1]?.name());
    assert.done();
};

// test that double-freeing XmlNode's doesn't cause a segfault
module.exports.double_free = function (assert: any) {
    var children = null;

    // stick this portion of code into a self-executing function so
    // its internal variables can be garbage collected
    (function () {
        var html = "<html><body><div><span></span></div></body></html>";
        var doc = libxml.parseHtml(html);

        doc.find("//div").forEach(function (tag) {
            // provide a reference to childNodes so they are exposed as XmlNodes
            // and therefore subject to V8's garbage collection
            children = (tag as XMLElement).childNodes();
            (tag as XMLElement).remove();
        });
    })();

    global.gc();
    //@ts-ignore
    assert.ok(children[0].attrs());
    assert.done();
};

module.exports.freed_namespace_unwrappable = function (assert: any) {
    var doc = libxml.parseXml("<?xml version='1.0' encoding='UTF-8'?><root></root>");
    var el: XMLElement | null = libxml.Element(doc, "foo");
    var ns = el.namespace("bar", null);
    el = null;
    global.gc();
    ns = null;
    global.gc();
    assert.done();
};

module.exports.unlinked_tree_persistence_parent_proxied_first = function (assert: any) {
    var doc = makeDocument();
    var parent_node: XMLElement | null = doc.get("//middle") as XMLElement;
    var child_node = doc.get("//inner") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.equal("inner", child_node.name()); // works with >= v0.14.3
    assert.done();
};

module.exports.unlinked_tree_proxied_leaf_persistent_ancestor_first = function (assert: any) {
    var doc = makeDocument();
    var ancestor: XMLElement | null = doc.get("//middle") as XMLElement;
    var leaf = doc.get("//center") as XMLElement;

    ancestor.remove();
    ancestor = null;
    collectGarbage();

    assert.equal("center", leaf.name()); // fails with v0.14.3, v0.15
    assert.done();
};

module.exports.unlinked_tree_proxied_leaf_persistent_descendant_first = function (assert: any) {
    var doc = makeDocument();
    var leaf = doc.get("//center") as XMLElement;
    var ancestor: XMLElement | null = doc.get("//middle") as XMLElement;

    ancestor.remove(); // make check here?
    ancestor = null;
    collectGarbage();

    assert.equal("center", leaf.name());
    assert.done();
};

module.exports.unlinked_tree_persistence_child_proxied_first = function (assert: any) {
    var doc = makeDocument();
    var child_node = doc.get("//inner") as XMLElement;
    var parent_node: XMLElement | null = doc.get("//middle") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.equal("inner", child_node.name()); // fails with v0.14.3, v0.15
    assert.done();
};

module.exports.unlinked_tree_leaf_persistence_with_proxied_ancestor = function (assert: any) {
    var doc = makeDocument();
    var proxied_ancestor = doc.get("//inner") as XMLElement;
    var leaf = doc.get("//center");

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = proxied_ancestor.get(".//center") as XMLElement;
    assert.equal("center", leaf.name());
    assert.done();
};

module.exports.unlinked_tree_leaf_persistence_with_peer_proxy = function (assert: any) {
    var doc = makeDocument();
    var leaf: XMLElement | null = doc.get("//left") as XMLElement;
    var peer = doc.get("//right") as XMLElement;

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = peer.parent()?.get("./left") as XMLElement;
    assert.equal("left", leaf.name());
    assert.done();
};

module.exports.set_text_clobbering_children = function (assert: any) {
    var doc = libxml.parseHtml("<root><child><inner>old</inner></child></root>");
    var child = doc.get("//child") as XMLElement;
    var inner = doc.get("//inner") as XMLElement;
    child.text("new");

    assert.equal(doc, inner.parent());
    assert.equal("old", inner.text());

    assert.done();
};

function makeDocument() {
    var body =
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><left/><center/><right/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles?: number, maxCycles?: number) {
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
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}
