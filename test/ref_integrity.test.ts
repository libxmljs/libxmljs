import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

function makeDocument() {
    const body =
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><left/><center/><right/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles?: number, maxCycles?: number) {
    minCycles = minCycles || 3;
    maxCycles = maxCycles || 10;

    let cycles = 0;
    let freedRss = 0;
    let usage = process.memoryUsage();
    do {
        global.gc?.();

        const usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}

it('gc', () => {
    const doc = libxml.Document();
    doc.node("root")?.node("child")?.node("grandchild")?.parent()?.node("child2");
    global.gc?.();
    assert.ok(doc);
    global.gc?.();
    assert.ok(doc.root());
    global.gc?.();
    assert.strictEqual(doc.root()?.childNodes()[0]?.name(), "child");
});

it('references', () => {
    const nodes = libxml.parseXml("<root> <child> <grandchildren/> </child> <child2/> </root>").childNodes();

    global.gc?.();

    assert.ok(nodes[0]?.doc());
    assert.strictEqual(nodes[1]?.name(), "child");
});

it('double_free', () => {
    let children = null;

    (function () {
        const html = "<html><body><div><span></span></div></body></html>";
        const doc = libxml.parseHtml(html);

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
    const doc = libxml.parseXml("<?xml version='1.0' encoding='UTF-8'?><root></root>");
    let el: XMLElement | null = libxml.Element(doc, "foo");
    let _ns = el.namespace("bar", null);
    el = null;
    global.gc?.();
    _ns = null;
    global.gc?.();
});

it('unlinked_tree_persistence_parent_proxied_first', () => {
    const doc = makeDocument();
    let parent_node: XMLElement | null = doc.get("//middle") as XMLElement;
    const child_node = doc.get("//inner") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.strictEqual(child_node.name(), "inner");
});

it('unlinked_tree_proxied_leaf_persistent_ancestor_first', () => {
    const doc = makeDocument();
    let ancestor: XMLElement | null = doc.get("//middle") as XMLElement;
    const leaf = doc.get("//center") as XMLElement;

    ancestor.remove();
    ancestor = null;
    collectGarbage();

    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_proxied_leaf_persistent_descendant_first', () => {
    const doc = makeDocument();
    const leaf = doc.get("//center") as XMLElement;
    let ancestor: XMLElement | null = doc.get("//middle") as XMLElement;

    ancestor.remove();
    ancestor = null;
    collectGarbage();

    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_persistence_child_proxied_first', () => {
    const doc = makeDocument();
    const child_node = doc.get("//inner") as XMLElement;
    let parent_node: XMLElement | null = doc.get("//middle") as XMLElement;

    parent_node.remove();
    parent_node = null;
    collectGarbage();

    assert.strictEqual(child_node.name(), "inner");
});

it('unlinked_tree_leaf_persistence_with_proxied_ancestor', () => {
    const doc = makeDocument();
    const proxied_ancestor = doc.get("//inner") as XMLElement;
    let leaf = doc.get("//center");

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = proxied_ancestor.get(".//center") as XMLElement;
    assert.strictEqual(leaf.name(), "center");
});

it('unlinked_tree_leaf_persistence_with_peer_proxy', () => {
    const doc = makeDocument();
    let leaf: XMLElement | null = doc.get("//left") as XMLElement;
    const peer = doc.get("//right") as XMLElement;

    (doc.get("//middle") as XMLElement).remove();
    leaf = null;
    collectGarbage();

    leaf = peer.parent()?.get("./left") as XMLElement;
    assert.strictEqual(leaf.name(), "left");
});

it('set_text_clobbering_children', () => {
    const doc = libxml.parseHtml("<root><child><inner>old</inner></child></root>");
    const child = doc.get("//child") as XMLElement;
    const inner = doc.get("//inner") as XMLElement;
    child.text("new");

    assert.strictEqual(inner.parent(), doc);
    assert.strictEqual(inner.text(), "old");
});
