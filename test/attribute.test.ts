import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

const body =
    "<?xml version='1.0' encoding='UTF-8'?>\n" +
    "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>";

it('new', () => {
    const doc = libxml.parseXml(body);
    const node = doc.get("node") as XMLElement;

    node?.setAttribute("new-attr-key", "new-attr-value");
    assert.strictEqual(node.getAttribute("new-attr-key")?.value(), "new-attr-value");
});

it('create_with_namespace', () => {
    const doc = libxml.parseXml(
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
            "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>"
    );
    const node = doc.get("node") as XMLElement;

    assert.ok(node instanceof XMLElement);

    const attr = node.setAttribute("new-attr-key", "new-attr-value");
    const ns = node?.namespace("ns-prefix", "ns-url");
    assert.ok(attr);
    assert.ok(ns?.prefix());
    assert.ok(node?.namespace()?.prefix());
    assert.strictEqual(node?.namespace()?.prefix(), ns?.prefix());
    assert.strictEqual(node?.namespace()?.href(), ns?.href());
});

it('getters', () => {
    const doc = libxml.parseXml(body);
    const node = doc.get("node") as XMLElement;

    assert.strictEqual(node.getAttribute("attr-one-key")?.name(), "attr-one-key");
    assert.strictEqual(node.getAttribute("attr-one-key")?.value(), "attr-one-value");
    assert.strictEqual(node.getAttribute("attr-one-key")?.node().name(), "node");
    assert.ok(node.getAttribute("attr-two-key")?.type());

    assert.strictEqual(node.getAttribute("attr-two-key")?.prevSibling()!.name(), "attr-one-key");
    assert.strictEqual(node.getAttribute("attr-two-key")?.nextSibling()!.name(), "attr-three-key");
});

it('setters', () => {
    const doc = libxml.parseXml(body);
    const node = doc.get("node") as XMLElement;

    node.getAttribute("attr-one-key")?.value("new-value");
    assert.strictEqual(node.getAttribute("attr-one-key")?.value(), "new-value");
});

it('namespace', () => {
    const doc = libxml.parseXml(body);
    const node = doc.get("node") as XMLElement;

    const ns = libxml.Namespace(node, "ns-prefix", "ns-uri");
    const attr = node.getAttribute("attr-one-key");
    attr?.namespace(ns);
    assert.strictEqual(attr?.namespace()?.prefix(), ns.prefix());
    assert.strictEqual(attr?.namespace()?.href(), ns.href());
});

it('remove', () => {
    const doc = libxml.parseXml(body);
    const node = doc.get("node") as XMLElement;

    const attr = node.getAttribute("attr-one-key");
    assert.ok(node.getAttribute("attr-one-key"));
    attr?.remove();
    assert.ok(!node.getAttribute("attr-one-key"));
});
