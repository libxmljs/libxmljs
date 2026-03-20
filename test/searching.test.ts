import { it, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLAttribute, XMLElement, XMLNamespace } from "../index";

it('get', () => {
    var doc = libxml.Document();
    var root = doc.node("root");
    var child = root.node("child");
    var grandchild = child.node("grandchild");

    assert.strictEqual(doc.get("child"), child);
    assert.strictEqual((doc.get("child") as XMLElement).get("grandchild"), grandchild);
});

it('get_missing', () => {
    var doc = libxml.Document();
    var root = doc.node("root");

    var missing = doc.get("missing/text()");
    assert.strictEqual(missing, null);
});

it('get_attr', () => {
    var doc = libxml.Document();
    var root = doc.node("root");
    var child = root.node("child");
    child.setAttribute("attr", "val");
    var attr = child.getAttribute("attr");

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
    var doc = libxml.Document();
    var root = doc.node("root");

    assert.strictEqual(doc.get("true()"), true);
    assert.strictEqual(doc.get("false()"), false);
    assert.strictEqual(doc.get('"Hello, world!"'), "Hello, world!");
    assert.strictEqual(doc.get("1.23"), 1.23);
});

it('find', () => {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node("root");
    children.push(root.node("child"));
    children.push(root.node("child"));

    var results = doc.find("child");
    assert.strictEqual(children.length, 2);
    assert.strictEqual(results.length, 2);

    for (var child = 0; child < children.length; ++child) {
        assert.strictEqual(results[child], children[child]);
    }
});

describe('namespace', () => {
    it('get', () => {
        var doc = libxml.Document();
        var root = doc.node("root");
        var child = root.node("child");
        var grandchild = child.node("grandchild");
        grandchild.namespace("nsuri");

        assert.strictEqual(doc.get("child"), child);
        assert.strictEqual((doc.get("child") as XMLElement).get("xmlns:grandchild", "nsuri"), grandchild);
    });

    it('find', () => {
        var children = [];
        var doc = libxml.Document();
        var root = doc.node("root");
        children.push(root.node("child"));
        children.push(root.node("child"));

        var ns = children[0]?.namespace("nsuri") as XMLNamespace;
        children[1]?.namespace(ns);

        var results = doc.find("xmlns:child", "nsuri");
        assert.strictEqual(children.length, 2);
        assert.strictEqual(results.length, 2);
        for (var child = 0; child < children.length; ++child) {
            assert.strictEqual(results[child], children[child]);
        }
    });
});

describe('prefixed_namespace', () => {
    it('get', () => {
        var doc = libxml.Document();
        var root = doc.node("root");
        var child = root.node("child");
        var grandchild = child.node("grandchild");
        grandchild.namespace("pefname", "nsuri");

        assert.strictEqual(doc.get("child"), child);

        var ns_params = {
            pefname: "nsuri",
        };

        assert.strictEqual((doc.get("child") as XMLElement).get("pefname:grandchild", ns_params), grandchild);
    });

    it('find', () => {
        var children = [];
        var doc = libxml.Document();
        var root = doc.node("root");
        children.push(root.node("child"));
        children.push(root.node("child"));

        var ns = children[0]?.namespace("pefname", "nsuri") as XMLNamespace;
        children[1]?.namespace(ns);

        var ns_params = {
            pefname: "nsuri",
        };

        var results = doc.find("pefname:child", ns_params);
        assert.strictEqual(children.length, 2);
        assert.strictEqual(results.length, 2);
        for (var child = 0; child < children.length; ++child) {
            assert.strictEqual(results[child], children[child]);
        }
    });
});
