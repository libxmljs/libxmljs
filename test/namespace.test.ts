import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

it('create', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), null);
    assert.strictEqual(ns.prefix(), null);
    assert.strictEqual(ns.href(), "http://my-namespace.com");
});

it('set', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), ns);
    assert.strictEqual(elem.namespace()?.prefix(), null);
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
});

it('with_prefix', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("pref", "http://my-namespace.com");
    assert.strictEqual(elem.namespace(), null);
    assert.strictEqual(ns.prefix(), "pref");
    assert.strictEqual(ns.href(), "http://my-namespace.com");

    var ns2 = elem.namespace("pref", "http://my-namespace.com");
    assert.ok(ns2);
    assert.strictEqual(ns2, ns);
    assert.strictEqual(elem.namespace(), ns);
    assert.strictEqual(elem.namespace()?.prefix(), "pref");
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
});

it('from_parsing', () => {
    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' + '<name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root() as XMLElement;
    assert.ok(elem.namespace());
    assert.strictEqual(elem.namespace()?.prefix(), null);
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");

    var doc = libxml.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>' + '<name1 xmlns:pref="http://my-namespace.com"/>'
    );
    var elem = doc.root() as XMLElement;
    assert.ok(!elem.namespace());

    var doc = libxml.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>' + '<pref:name1 xmlns:pref="http://my-namespace.com"/>'
    );
    var elem = doc.root() as XMLElement;
    assert.ok(elem.namespace());
    assert.strictEqual(elem.namespace()?.prefix(), "pref");
    assert.strictEqual(elem.namespace()?.href(), "http://my-namespace.com");
});

it('existing', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("http://my-namespace.com");
    elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), ns);

    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("pref", "http://my-namespace.com");
    elem.namespace("pref", "http://my-namespace.com");
    assert.ok(ns);
    assert.strictEqual(elem.namespace(), ns);
});

it('remove', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.ok(ns == elem.namespace());
    elem.namespace(null);
    assert.ok(!elem.namespace());
});

it('all', () => {
    var document = libxml.Document();
    var root = document.node("root");
    var list: any = [];

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
    var document = libxml.Document();
    var root = document.node("root");

    assert.strictEqual(root.namespaces().length, 0);
});

it('nested', () => {
    var document = libxml.Document();
    var root = document.node("root");

    root.namespace("com", "http://example.com");
    assert.strictEqual(root.namespaces().length, 1);

    var child = root.node("child");
    child.namespace("net", "http://example.net");
    assert.strictEqual(child.namespaces().length, 2);

    root.namespace("http://example.org");
    assert.strictEqual(child.namespaces().length, 3);
});

it('xmlns', () => {
    var str =
        '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><div>BACON</div><div>ROCKS</div><p>WUT?</p></body></html>';
    var doc = libxml.parseXml(str);

    var divs = doc.find("//xmlns:div", "http://www.w3.org/1999/xhtml");
    assert.strictEqual(divs.length, 2);

    var div = doc.get("//xmlns:div", "http://www.w3.org/1999/xhtml") as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.notStrictEqual(div, null);
    var exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.notStrictEqual(exp, null);
    assert.strictEqual(div.toString(), exp.toString());
});

it('custom_ns', () => {
    var str =
        '<html xmlns:bacon="http://www.example.com/fake/uri"><head></head><body><bacon:div>BACON</bacon:div><bacon:div>ROCKS</bacon:div><p>WUT?</p></body></html>';
    var doc = libxml.parseXml(str);

    var divs = doc.find("//bacon:div", { bacon: "http://www.example.com/fake/uri" });
    assert.strictEqual(divs.length, 2);

    var div = doc.get("//bacon:div", { bacon: "http://www.example.com/fake/uri" }) as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.notStrictEqual(div, null);
    var exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.notStrictEqual(exp, null);
    assert.strictEqual(div.toString(), exp.toString());
});

it('local_namespaces', () => {
    var str = '<html xmlns="urn:example" xmlns:ex1="urn:example:1"><body xmlns:ex2="urn:example:2"/></html>';
    var doc = libxml.parseXml(str);
    assert.ok(doc);
    var root = doc.root() as XMLElement;
    assert.ok(root);
    var decls = root.namespaces(true);
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
    var body = root.get("ex:body", { ex: "urn:example" }) as XMLElement;
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
