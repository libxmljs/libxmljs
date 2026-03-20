import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement, XMLNamespace } from "../index";

var body =
    "<?xml version='1.0' encoding='UTF-8'?>\n" +
    "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>";

it('new', () => {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    node?.setAttribute("new-attr-key", "new-attr-value");
    assert.strictEqual(node.getAttribute("new-attr-key")?.value(), "new-attr-value");
});

it('create_with_namespace', () => {
    var doc = libxml.parseXml(
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
            "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>"
    );
    var node = doc.get("node") as XMLElement;

    assert.ok(node instanceof XMLElement);

    var attr = node.setAttribute("new-attr-key", "new-attr-value");
    var ns = node?.namespace("ns-prefix", "ns-url");
    assert.ok(attr);
    assert.ok(ns?.prefix());
    assert.ok(node?.namespace()?.prefix());
    assert.strictEqual(node?.namespace()?.prefix(), ns?.prefix());
    assert.strictEqual(node?.namespace()?.href(), ns?.href());
});

it('getters', () => {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    assert.strictEqual(node.getAttribute("attr-one-key")?.name(), "attr-one-key");
    assert.strictEqual(node.getAttribute("attr-one-key")?.value(), "attr-one-value");
    assert.strictEqual(node.getAttribute("attr-one-key")?.node().name(), "node");
    assert.ok(node.getAttribute("attr-two-key")?.type());

    assert.strictEqual(node.getAttribute("attr-two-key")?.prevSibling()!.name(), "attr-one-key");
    assert.strictEqual(node.getAttribute("attr-two-key")?.nextSibling()!.name(), "attr-three-key");
});

it('setters', () => {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    node.getAttribute("attr-one-key")?.value("new-value");
    assert.strictEqual(node.getAttribute("attr-one-key")?.value(), "new-value");
});

it('namespace', () => {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    var ns = libxml.Namespace(node, "ns-prefix", "ns-uri");
    var attr = node.getAttribute("attr-one-key");
    attr?.namespace(ns);
    assert.strictEqual(attr?.namespace()?.prefix(), ns.prefix());
    assert.strictEqual(attr?.namespace()?.href(), ns.href());
});

it('remove', () => {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    var attr = node.getAttribute("attr-one-key");
    assert.ok(node.getAttribute("attr-one-key"));
    attr?.remove();
    assert.ok(!node.getAttribute("attr-one-key"));
});
