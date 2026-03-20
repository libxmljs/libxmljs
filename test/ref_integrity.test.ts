import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

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
        global.gc?.();

        var usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}

it('gc', () => {
    var doc = libxml.Document();
    doc.node("root")?.node("child")?.node("grandchild")?.parent()?.node("child2");
    global.gc?.();
    assert.ok(doc);
    global.gc?.();
    assert.ok(doc.root());
    global.gc?.();
    assert.strictEqual(doc.root()?.childNodes()[0]?.name(), "child");
});

it('references', () => {
    var nodes = libxml.parseXml("<root> <child> <grandchildren/> </child> <child2/> </root>").childNodes();

    global.gc?.();

    assert.ok(nodes[0]?.doc());
    assert.strictEqual(nodes[1]?.name(), "child");
});

it('double_free', () => {
    var children = null;

    (function () {
        var html = "<html><body><div><span></span></div></body></html>";
        var doc = libxml.parseHtml(html);

        doc.find("//div").forEach(function (tag) {
            children = (tag as XMLElement).childNodes();
            (tag as XMLElement).remove();
        });
    })();

    global.gc?.();
    //@ts-ignore
    assert.ok(children[0].attrs());
});

it('freed_namespace_unwrappable', () => {
    var doc = libxml.parseXml("<?xml version='1.0' encoding='UTF-8'?><root></root>");
    var el: XMLElement | null = libxml.Element(doc, "foo");
    var ns = el.namespace("bar", null);
    el = null;
    global.gc?.();
    ns = null;
    global.gc?.();
});

it('unlinked_tree_persistence_parent_proxied_first', () => {
    var doc = makeDocument();
    var parent_node: XMLElement | null = doc.get("//middle") as XMLElement;
    var child_node = doc.get("//inner") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.strictEqual(child_node.name(), "inner");
});

it('unlinked_tree_proxied_leaf_persistent_ancestor_first', () => {
    var doc = makeDocument();
    var ancestor: XMLElement | null = doc.get("//middle") as XMLElement;
    var leaf = doc.get("//center") as XMLElement;

    ancestor.remove();
    ancestor = null;
    collectGarbage();

    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_proxied_leaf_persistent_descendant_first', () => {
    var doc = makeDocument();
    var leaf = doc.get("//center") as XMLElement;
    var ancestor: XMLElement | null = doc.get("//middle") as XMLElement;

    ancestor.remove();
    ancestor = null;
    collectGarbage();

    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_persistence_child_proxied_first', () => {
    var doc = makeDocument();
    var child_node = doc.get("//inner") as XMLElement;
    var parent_node: XMLElement | null = doc.get("//middle") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.strictEqual(child_node.name(), "inner");
});

it('unlinked_tree_leaf_persistence_with_proxied_ancestor', () => {
    var doc = makeDocument();
    var proxied_ancestor = doc.get("//inner") as XMLElement;
    var leaf = doc.get("//center");

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = proxied_ancestor.get(".//center") as XMLElement;
    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_leaf_persistence_with_peer_proxy', () => {
    var doc = makeDocument();
    var leaf: XMLElement | null = doc.get("//left") as XMLElement;
    var peer = doc.get("//right") as XMLElement;

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = peer.parent()?.get("./left") as XMLElement;
    assert.strictEqual(leaf.name(), "left");
});

it('set_text_clobbering_children', () => {
    var doc = libxml.parseHtml("<root><child><inner>old</inner></child></root>");
    var child = doc.get("//child") as XMLElement;
    var inner = doc.get("//inner") as XMLElement;
    child.text("new");

    assert.strictEqual(inner.parent(), doc);
    assert.strictEqual(inner.text(), "old");
});
