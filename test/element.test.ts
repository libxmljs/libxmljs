import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

it('new', () => {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, "name1");
    doc.root(elem);
    assert.strictEqual(elem.name(), "name1");
    assert.strictEqual(doc.root()?.name(), "name1");
});

it('newWithContent', () => {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, "name1", "content && more content <>");
    doc.root(elem);
    assert.strictEqual(elem.name(), "name1");
    assert.strictEqual(doc.root()?.name(), "name1");
    assert.strictEqual(elem.text(), "content && more content <>");
});

it('setters', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    assert.strictEqual(elem.text(), "");
    elem.text("content && more content <>");
    assert.strictEqual(elem.text(), "content && more content <>");

    assert.strictEqual(elem.name(), "name1");
    elem.name("newname");
    assert.strictEqual(elem.name(), "newname");
});

it('getters', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    assert.strictEqual(elem.type(), "element");
});

it('remove', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var child = elem.node("child");
    assert.ok(doc.get("/name1/child"));

    child.remove();
    assert.ok(!doc.get("/name1/child"));
});

it('toString', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    assert.strictEqual(elem.toString(), "<name1/>");
    elem.node("child");
    assert.strictEqual(elem.toString(), "<name1><child/></name1>");
    assert.strictEqual(elem.toString({ selfCloseEmpty: false }), "<name1><child></child></name1>");
    assert.strictEqual(elem.toString({ type: "html" }), "<name1><child></child></name1>");
    assert.strictEqual(elem.toString({ whitespace: true }), "<name1\n  ><child\n  /></name1\n>");
    assert.strictEqual(elem.toString({ format: true }), "<name1>\n  <child/>\n</name1>");
});

it('toStringWithEncoding', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    assert.strictEqual(elem.toString({ type: "xhtml" }), "<name1></name1>");
    elem.node("child1").text("Something\xA0with a non-breaking space");
    assert.strictEqual(elem.toString({ type: "xhtml" }), "<name1><child1>Something\xA0with a non-breaking space</child1></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "UTF-8" }), "<name1><child1>Something\xA0with a non-breaking space</child1></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "HTML" }), "<name1><child1>Something&nbsp;with a non-breaking space</child1></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "ASCII" }), "<name1><child1>Something&#160;with a non-breaking space</child1></name1>");
    elem.node("child2").text("\u{1F600}");
    assert.strictEqual(elem.toString({ type: "xhtml" }), "<name1><child1>Something\xA0with a non-breaking space</child1><child2>\u{1F600}</child2></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "UTF-8" }), "<name1><child1>Something\xA0with a non-breaking space</child1><child2>\u{1F600}</child2></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "HTML" }), "<name1><child1>Something&nbsp;with a non-breaking space</child1><child2>&#128512;</child2></name1>");
    assert.strictEqual(elem.toString({ type: "xhtml", encoding: "ASCII" }), "<name1><child1>Something&#160;with a non-breaking space</child1><child2>&#128512;</child2></name1>");
});

it('path', () => {
    var doc = libxml.Document();
    var root = doc.node("root");
    var gchild = root.node("child").node("grandchild");
    var sibling = doc.root()?.node("sibling");
    assert.strictEqual(gchild.path(), "/root/child/grandchild");
    assert.strictEqual(sibling?.path(), "/root/sibling");
});

it('move', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var child = elem.node("child");
    assert.ok(doc.get("/name1/child"));

    child.remove();
    var name2 = elem.node("name2");
    name2.addChild(child);
    assert.ok(!doc.get("/name1/child"));
    assert.ok(doc.get("/name1/name2/child"));
});

it('addChild', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var newChild = libxml.Element(doc, "new-child");
    elem.addChild(newChild);
    assert.ok(doc.get("/name1/new-child"));
});

it('add_prev_sibling', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    var child2 = elem.node("child2");
    assert.strictEqual(elem.childNodes().length, 2);
    var prevSibling = libxml.Element(doc, "prev-sibling");
    var addedSibling = child2.addPrevSibling(prevSibling);
    var children = elem.childNodes();
    assert.strictEqual(children.length, 3);
    assert.strictEqual(children[1]?.name(), "prev-sibling");
});

it('add_next_sibling', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    var child2 = elem.node("child2");
    assert.strictEqual(elem.childNodes().length, 2);
    var nextSibling = libxml.Element(elem.doc()!, "next-sibling");
    var addedSibling = child1.addNextSibling(nextSibling);
    var children = elem.childNodes();
    assert.strictEqual(children.length, 3);
    assert.strictEqual(children[1]?.name(), "next-sibling");
});

it('import', () => {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    doc = child1.doc()!;

    var newdoc = libxml.Document();
    newdoc.node("newdoc");

    newdoc.root()?.addChild(child1);

    assert.ok(newdoc);
    assert.notStrictEqual(newdoc, doc);
    assert.strictEqual(newdoc.root()?.childNodes()[0]?.name(), "child1");
    assert.strictEqual(elem.childNodes()[0], child1);
});

it('clone', () => {
    var doc = libxml.Document();
    var elem = doc.node("child");
    var elem2 = elem.clone();

    assert.ok(elem2 instanceof XMLElement);

    if (elem2 instanceof XMLElement) {
        assert.strictEqual(elem2.name(), elem.name());
        assert.strictEqual(elem2.text(), elem.text());
        assert.strictEqual(elem2.toString(), elem.toString());
    }
});

it('namespace', () => {
    var str =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<root xmlns:bacon="http://www.example.com/fake/uri"><node bacon:attr-with-ns="attr-with-ns-value" attr-without-ns="attr-withoug-ns-vavlue" /></root>';
    var doc = libxml.parseXml(str);
    var node = doc.get("node");

    assert.ok(node instanceof XMLElement);

    if (node instanceof XMLElement) {
        var attrs = node?.attrs();

        attrs.forEach(function (attr: any) {
            var name = attr.name();
            var ns = attr.namespace();

            if (name === "attr-with-ns") {
                assert.strictEqual(ns.prefix(), "bacon");
                assert.strictEqual(ns.href(), "http://www.example.com/fake/uri");
            } else {
                assert.strictEqual(name, "attr-without-ns");
                assert.strictEqual(ns, null);
            }
        });
    }
});

it('replace', () => {
    var str = "<foo>some <bar/> evening</foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.get("bar");

    assert.ok(bar instanceof XMLElement);

    if (bar instanceof XMLElement) {
        bar.replace("enchanted");
    }

    assert.strictEqual(doc.root()?.text(), "some enchanted evening");

    doc = libxml.parseXml(str);
    bar = doc.get("bar");

    assert.ok(bar instanceof XMLElement);

    if (bar instanceof XMLElement) {
        bar.replace("<>");
    }
    assert.strictEqual(doc.root()?.toString(), "<foo>some &lt;&gt; evening</foo>");

    doc = libxml.parseXml(str);
    bar = doc.get("bar");
    var enchant = libxml.parseXml("<enchanted/>");
    assert.ok(bar instanceof XMLElement);

    if (bar instanceof XMLElement) {
        assert.ok(!!enchant.root());
        bar.replace(enchant.root()!);
    }

    assert.strictEqual(doc.root()?.toString(), "<foo>some <enchanted/> evening</foo>");
    assert.strictEqual(doc.root()?.childNodes().length, 3);
    assert.strictEqual(doc.root()?.childNodes()[1]?.name(), "enchanted");
});

it('add_child_merge_text', () => {
    var str = "<foo>bar</foo>";
    var doc = libxml.parseXml(str);
    var foo = doc.root();
    var baz = libxml.Text(doc, "baz");

    assert.ok(foo instanceof XMLElement);

    if (foo instanceof XMLElement) {
        foo.addChild(baz);

        assert.deepStrictEqual(foo.text(), "barbaz");
        assert.deepStrictEqual(foo.childNodes().length, 1);
        assert.ok(foo.childNodes()[0] != baz);

        assert.deepStrictEqual(baz.parent(), doc);
        assert.deepStrictEqual(baz.text(), "baz");
    }
});
