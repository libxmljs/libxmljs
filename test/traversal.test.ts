import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

it('built', () => {
    const doc = libxml.Document();
    const child = doc.node("root").node("child");
    const sibling = doc.root()?.node("sibling");
    const gchild = child.node("grandchild");

    assert.ok(doc == gchild.doc());
    assert.ok(doc == doc.root()?.parent());

    assert.ok(child == gchild.parent());
    assert.ok(gchild == doc.child(0)?.child(0));

    assert.ok(sibling == doc.child(1));
});

it('children', () => {
    const children = [];
    const doc = libxml.Document();
    const root = doc.node("root");
    children.push(root.node("child"));
    children.push(root.node("sibling1"));
    children.push(root.node("sibling2"));

    assert.strictEqual(doc.childNodes().length, children.length);
    for (let i = 0; i < children.length; ++i) {
        assert.ok(children[i] == doc.child(i));
    }
});

it('siblings', () => {
    const children = [];
    const doc = libxml.Document();
    const root = doc.node("root");
    children.push(root.node("prevSibling"));
    children.push(root.node("child"));
    children.push(root.node("nextSibling"));
    assert.ok(children[0] == children[1]?.prevSibling());
    assert.ok(children[2] == children[1]?.nextSibling());
    assert.ok(null == children[0]?.prevSibling());
    assert.ok(null == children[2]?.nextSibling());
});

it('parsed', () => {
    const doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><child><grandchild /></child><sibling/></root>");
    assert.ok(doc == (doc.child(0) as XMLElement).doc());
    assert.ok(doc == (doc.child(1) as XMLElement).doc());
    assert.ok(doc == (doc.child(0)?.child(0) as XMLElement).doc());
    assert.ok(doc == doc.root()?.parent());

    assert.strictEqual(doc.child(0)?.child(0)?.parent()?.name(), "child");
    assert.strictEqual(doc.child(0)?.child(0)?.name(), "grandchild");
    assert.strictEqual(doc.child(1)?.name(), "sibling");
});

it('parsed_children', () => {
    const doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><prevSibling /><child /><nextSibling /></root>");
    const children = ["prevSibling", "child", "nextSibling"];

    assert.strictEqual(doc.childNodes().length, 3);
    for (let i = 0; i < children.length; ++i) {
        assert.strictEqual((doc.child(i) as XMLElement).name(), children[i]);
    }

    {
        const child = doc.child(1) as XMLElement;
        assert.strictEqual(child.name(), "child");
        assert.strictEqual(child.prevSibling()?.name(), children[0]);
        assert.strictEqual(child.nextSibling()?.name(), children[2]);
        assert.strictEqual(child.prevSibling()?.prevSibling(), null);
        assert.strictEqual(child.nextSibling()?.nextSibling(), null);
    }

    {
        const child = doc.child(1) as XMLElement;
        assert.strictEqual(child.name(), "child");
        assert.strictEqual(child.prevElement()?.name(), children[0]);
        assert.strictEqual(child.nextElement()?.name(), children[2]);
        assert.strictEqual(child.prevElement()?.prevElement(), null);
        assert.strictEqual(child.nextElement()?.nextElement(), null);
    }
});
