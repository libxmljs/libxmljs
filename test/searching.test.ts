import { it, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLAttribute, XMLElement, XMLNamespace } from "../index";

it('get', () => {
    const doc = libxml.Document();
    const root = doc.node("root");
    const child = root.node("child");
    const grandchild = child.node("grandchild");

    assert.strictEqual(doc.get("child"), child);
    assert.strictEqual((doc.get("child") as XMLElement).get("grandchild"), grandchild);
});

it('get_missing', () => {
    const doc = libxml.Document();
    const _root = doc.node("root");

    const missing = doc.get("missing/text()");
    assert.strictEqual(missing, null);
});

it('get_attr', () => {
    let doc = libxml.Document();
    const root = doc.node("root");
    const child = root.node("child");
    child.setAttribute("attr", "val");
    const attr = child.getAttribute("attr");

    assert.strictEqual(doc.get("//@attr"), attr);
    assert.strictEqual((doc.get("//@attr") as XMLAttribute).value(), "val");

    assert.strictEqual((doc.get("child") as XMLElement).get("@attr"), attr);
    assert.strictEqual(((doc.get("child") as XMLElement).get("@attr") as XMLAttribute).value(), "val");

    doc = libxml.parseXml(doc.toString());
    assert.strictEqual((doc.get("//@attr") as XMLAttribute).value(), "val");
    assert.strictEqual(((doc.get("child") as XMLElement).get("@attr") as XMLAttribute).value(), "val");
    assert.strictEqual((doc.get("//@attr") as XMLAttribute).node(), doc.get("child"));
});

it('get_non_nodeset', () => {
    const doc = libxml.Document();
    const _root = doc.node("root");

    assert.strictEqual(doc.get("true()"), true);
    assert.strictEqual(doc.get("false()"), false);
    assert.strictEqual(doc.get('"Hello, world!"'), "Hello, world!");
    assert.strictEqual(doc.get("1.23"), 1.23);
});

it('find', () => {
    const children = [];
    const doc = libxml.Document();
    const root = doc.node("root");
    children.push(root.node("child"));
    children.push(root.node("child"));

    const results = doc.find("child");
    assert.strictEqual(children.length, 2);
    assert.strictEqual(results.length, 2);

    for (let child = 0; child < children.length; ++child) {
        assert.strictEqual(results[child], children[child]);
    }
});

describe('namespace', () => {
    it('get', () => {
        const doc = libxml.Document();
        const root = doc.node("root");
        const child = root.node("child");
        const grandchild = child.node("grandchild");
        grandchild.namespace("nsuri");

        assert.strictEqual(doc.get("child"), child);
        assert.strictEqual((doc.get("child") as XMLElement).get("xmlns:grandchild", "nsuri"), grandchild);
    });

    it('find', () => {
        const children = [];
        const doc = libxml.Document();
        const root = doc.node("root");
        children.push(root.node("child"));
        children.push(root.node("child"));

        const ns = children[0]?.namespace("nsuri") as XMLNamespace;
        children[1]?.namespace(ns);

        const results = doc.find("xmlns:child", "nsuri");
        assert.strictEqual(children.length, 2);
        assert.strictEqual(results.length, 2);
        for (let child = 0; child < children.length; ++child) {
            assert.strictEqual(results[child], children[child]);
        }
    });
});

describe('prefixed_namespace', () => {
    it('get', () => {
        const doc = libxml.Document();
        const root = doc.node("root");
        const child = root.node("child");
        const grandchild = child.node("grandchild");
        grandchild.namespace("pefname", "nsuri");

        assert.strictEqual(doc.get("child"), child);

        const ns_params = {
            pefname: "nsuri",
        };

        assert.strictEqual((doc.get("child") as XMLElement).get("pefname:grandchild", ns_params), grandchild);
    });

    it('find', () => {
        const children = [];
        const doc = libxml.Document();
        const root = doc.node("root");
        children.push(root.node("child"));
        children.push(root.node("child"));

        const ns = children[0]?.namespace("pefname", "nsuri") as XMLNamespace;
        children[1]?.namespace(ns);

        const ns_params = {
            pefname: "nsuri",
        };

        const results = doc.find("pefname:child", ns_params);
        assert.strictEqual(children.length, 2);
        assert.strictEqual(results.length, 2);
        for (let child = 0; child < children.length; ++child) {
            assert.strictEqual(results[child], children[child]);
        }
    });
});
