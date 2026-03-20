import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

it('create', () => {
    const doc = libxml.Document();
    const elem = doc.node("name1");
    const ns = elem.defineNamespace("http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), null);
    assert.strictEqual(ns.prefix(), null);
    assert.strictEqual(ns.href(), "http://my-namespace.com");
});

it('set', () => {
    const doc = libxml.Document();
    const elem = doc.node("name1");

    const ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), ns);
    assert.strictEqual(elem.namespace()?.prefix(), null);
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
});

it('with_prefix', () => {
    const doc = libxml.Document();
    const elem = doc.node("name1");
    const ns = elem.defineNamespace("pref", "http://my-namespace.com");
    assert.strictEqual(elem.namespace(), null);
    assert.strictEqual(ns.prefix(), "pref");
    assert.strictEqual(ns.href(), "http://my-namespace.com");

    const ns2 = elem.namespace("pref", "http://my-namespace.com");
    assert.ok(ns2);
    assert.strictEqual(ns2, ns);
    assert.strictEqual(elem.namespace(), ns);
    assert.strictEqual(elem.namespace()?.prefix(), "pref");
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
});

it('from_parsing', () => {
    {
        const doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' + '<name1 xmlns="http://my-namespace.com"/>');
        const elem = doc.root() as XMLElement;
        assert.ok(elem.namespace());
        assert.strictEqual(elem.namespace()?.prefix(), null);
        assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
    }

    {
        const doc = libxml.parseXml(
            '<?xml version="1.0" encoding="UTF-8"?>' + '<name1 xmlns:pref="http://my-namespace.com"/>'
        );
        const elem = doc.root() as XMLElement;
        assert.ok(!elem.namespace());
    }

    {
        const doc = libxml.parseXml(
            '<?xml version="1.0" encoding="UTF-8"?>' + '<pref:name1 xmlns:pref="http://my-namespace.com"/>'
        );
        const elem = doc.root() as XMLElement;
        assert.ok(elem.namespace());
        assert.strictEqual(elem.namespace()?.prefix(), "pref");
        assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
    }
});

it('existing', () => {
    {
        const doc = libxml.Document();
        const elem = doc.node("name1");
        const ns = elem.defineNamespace("http://my-namespace.com");
        elem.namespace("http://my-namespace.com");
        assert.ok(ns);
        assert.strictEqual(elem.namespace(), ns);
    }

    {
        const doc = libxml.Document();
        const elem = doc.node("name1");
        const ns = elem.defineNamespace("pref", "http://my-namespace.com");
        elem.namespace("pref", "http://my-namespace.com");
        assert.ok(ns);
        assert.strictEqual(elem.namespace(), ns);
    }
});

it('remove', () => {
    const doc = libxml.Document();
    const elem = doc.node("name1");
    const ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.ok(ns == elem.namespace());
    elem.namespace(null);
    assert.ok(!elem.namespace());
});

it('all', () => {
    const document = libxml.Document();
    const root = document.node("root");
    const list: any = [];

    list.push(root.namespace("com", "http://example.com"));
    list.push(root.namespace("net", "http://example.net"));
    list.push(root.namespace("http://example.org"));

    assert.ok(
        root.namespaces().every(function (ns, index) {
            return ns.href() === list[index].href() && ns.prefix() === list[index].prefix();
        })
    );
    assert.strictEqual(root.namespaces().length, list.length);
});

it('empty', () => {
    const document = libxml.Document();
    const root = document.node("root");

    assert.strictEqual(root.namespaces().length, 0);
});

it('nested', () => {
    const document = libxml.Document();
    const root = document.node("root");

    root.namespace("com", "http://example.com");
    assert.strictEqual(root.namespaces().length, 1);

    const child = root.node("child");
    child.namespace("net", "http://example.net");
    assert.strictEqual(child.namespaces().length, 2);

    root.namespace("http://example.org");
    assert.strictEqual(child.namespaces().length, 3);
});

it('xmlns', () => {
    const str =
        '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><div>BACON</div><div>ROCKS</div><p>WUT?</p></body></html>';
    const doc = libxml.parseXml(str);

    const divs = doc.find("//xmlns:div", "http://www.w3.org/1999/xhtml");
    assert.strictEqual(divs.length, 2);

    const div = doc.get("//xmlns:div", "http://www.w3.org/1999/xhtml") as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.notStrictEqual(div, null);
    const exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.notStrictEqual(exp, null);
    assert.strictEqual(div.toString(), exp.toString());
});

it('custom_ns', () => {
    const str =
        '<html xmlns:bacon="http://www.example.com/fake/uri"><head></head><body><bacon:div>BACON</bacon:div><bacon:div>ROCKS</bacon:div><p>WUT?</p></body></html>';
    const doc = libxml.parseXml(str);

    const divs = doc.find("//bacon:div", { bacon: "http://www.example.com/fake/uri" });
    assert.strictEqual(divs.length, 2);

    const div = doc.get("//bacon:div", { bacon: "http://www.example.com/fake/uri" }) as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.notStrictEqual(div, null);
    const exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.notStrictEqual(exp, null);
    assert.strictEqual(div.toString(), exp.toString());
});

it('local_namespaces', () => {
    const str = '<html xmlns="urn:example" xmlns:ex1="urn:example:1"><body xmlns:ex2="urn:example:2"/></html>';
    const doc = libxml.parseXml(str);
    assert.ok(doc);
    const root = doc.root() as XMLElement;
    assert.ok(root);
    let decls = root.namespaces(true);
    assert.ok(decls);
    assert.strictEqual(decls.length, 2);
    decls.forEach(function (n) {
        if (n.prefix() == null) {
            assert.strictEqual(n.href(), "urn:example");
        } else if (n.prefix() == "ex1") {
            assert.strictEqual(n.href(), "urn:example:1");
        } else {
            assert.ok(false);
        }
    });
    const body = root.get("ex:body", { ex: "urn:example" }) as XMLElement;
    assert.ok(body);
    decls = body.namespaces(true);
    assert.strictEqual(decls.length, 1);
    assert.strictEqual(decls[0]?.href(), "urn:example:2");

    decls = body.namespaces();
    assert.strictEqual(decls.length, 3);
    decls = body.namespaces(false);
    assert.strictEqual(decls.length, 3);
    decls = body.namespaces(0 as any);
    assert.strictEqual(decls.length, 3);
    decls = body.namespaces(1 as any);
    assert.strictEqual(decls.length, 3);
});
