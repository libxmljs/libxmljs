import * as libxml from "../index";
import { XMLElement } from "../index";

module.exports.create = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("http://my-namespace.com");
    assert.ok(ns);
    assert.equal(null, elem.namespace());
    assert.equal(null, ns.prefix());
    assert.equal("http://my-namespace.com", ns.href());
    assert.done();
};

// assign namespace to a node
module.exports.set = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    // this will set a namespace on the node
    var ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.equal(ns, elem.namespace());
    assert.equal(null, elem.namespace()?.prefix());
    assert.equal("http://my-namespace.com", elem.namespace()?.href());
    assert.done();
};

module.exports.with_prefix = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("pref", "http://my-namespace.com");
    assert.equal(null, elem.namespace());
    assert.equal("pref", ns.prefix());
    assert.equal("http://my-namespace.com", ns.href());

    // this should detect existing namespace object
    var ns2 = elem.namespace("pref", "http://my-namespace.com");
    assert.ok(ns2);
    assert.equal(ns, ns2);
    assert.equal(ns, elem.namespace());
    assert.equal("pref", elem.namespace()?.prefix());
    assert.equal("http://my-namespace.com", elem.namespace()?.href());
    assert.done();
};

module.exports.from_parsing = function (assert: any) {
    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>' + '<name1 xmlns="http://my-namespace.com"/>');
    var elem = doc.root() as XMLElement;
    assert.ok(elem.namespace());
    assert.equal(null, elem.namespace()?.prefix());
    assert.equal("http://my-namespace.com", elem.namespace()?.href());

    // no prefix from parsing
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
    assert.equal("pref", elem.namespace()?.prefix());
    assert.equal("http://my-namespace.com", elem.namespace()?.href());

    assert.done();
};

module.exports.existing = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("http://my-namespace.com");
    elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.equal(ns, elem.namespace());

    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.defineNamespace("pref", "http://my-namespace.com");
    elem.namespace("pref", "http://my-namespace.com");
    assert.ok(ns);
    assert.equal(ns, elem.namespace());
    assert.done();
};

module.exports.remove = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var ns = elem.namespace("http://my-namespace.com");
    assert.ok(ns);
    assert.ok(ns == elem.namespace());
    elem.namespace(null);
    assert.ok(!elem.namespace());
    assert.done();
};

module.exports.all = function (assert: any) {
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
    assert.equal(root.namespaces().length, list.length);

    assert.done();
};

module.exports.empty = function (assert: any) {
    var document = libxml.Document();
    var root = document.node("root");

    assert.equal(root.namespaces().length, 0);

    assert.done();
};

module.exports.nested = function (assert: any) {
    var document = libxml.Document();
    var root = document.node("root");

    root.namespace("com", "http://example.com");
    assert.equal(root.namespaces().length, 1);

    var child = root.node("child");
    child.namespace("net", "http://example.net");
    assert.equal(child.namespaces().length, 2); // <child xmlns:net="http://example.net"/> + root

    root.namespace("http://example.org");
    assert.equal(child.namespaces().length, 3); // child's namespace + root's two namespaces

    assert.done();
};

module.exports.xmlns = function (assert: any) {
    var str =
        '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><div>BACON</div><div>ROCKS</div><p>WUT?</p></body></html>';
    var doc = libxml.parseXml(str);

    var divs = doc.find("//xmlns:div", "http://www.w3.org/1999/xhtml");
    assert.equal(divs.length, 2);

    var div = doc.get("//xmlns:div", "http://www.w3.org/1999/xhtml") as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.ok(div != null);
    var exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.ok(exp != null);
    assert.equal(div.toString(), exp.toString());
    assert.done();
};

module.exports.custom_ns = function (assert: any) {
    var str =
        '<html xmlns:bacon="http://www.example.com/fake/uri"><head></head><body><bacon:div>BACON</bacon:div><bacon:div>ROCKS</bacon:div><p>WUT?</p></body></html>';
    var doc = libxml.parseXml(str);

    var divs = doc.find("//bacon:div", { bacon: "http://www.example.com/fake/uri" });
    assert.equal(divs.length, 2);

    var div = doc.get("//bacon:div", { bacon: "http://www.example.com/fake/uri" }) as XMLElement;
    assert.ok(div instanceof XMLElement);
    assert.ok(div != null);
    var exp = doc.root()?.child(1)?.child(0) as XMLElement;
    assert.ok(exp != null);
    assert.equal(div.toString(), exp.toString());
    assert.done();
};

module.exports.local_namespaces = function (assert: any) {
    var str = '<html xmlns="urn:example" xmlns:ex1="urn:example:1"><body xmlns:ex2="urn:example:2"/></html>';
    var doc = libxml.parseXml(str);
    assert.ok(doc);
    var root = doc.root() as XMLElement;
    assert.ok(root);
    var decls = root.namespaces(true);
    assert.ok(decls);
    assert.equal(2, decls.length);
    decls.forEach(function (n) {
        if (n.prefix() == null) {
            assert.equal("urn:example", n.href());
        } else if (n.prefix() == "ex1") {
            assert.equal("urn:example:1", n.href());
        } else {
            assert.ok(false);
        }
    });
    // body has a namespace, from the default declaration on html.
    var body = root.get("ex:body", { ex: "urn:example" }) as XMLElement;
    assert.ok(body);
    decls = body.namespaces(true);
    assert.equal(1, decls.length);
    assert.equal("urn:example:2", decls[0]?.href());

    // Make sure default behavior still works,
    // and doesn't get turned on by mistake
    decls = body.namespaces();
    assert.equal(3, decls.length);
    decls = body.namespaces(false);
    assert.equal(3, decls.length);
    decls = body.namespaces(0 as any);
    assert.equal(3, decls.length);
    decls = body.namespaces(1 as any);
    assert.equal(3, decls.length);
    assert.done();
};
