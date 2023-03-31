import * as libxml from "../index";
import { XMLElement } from "../index";

module.exports.new = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, "name1");
    doc.root(elem);
    assert.equal("name1", elem.name());
    assert.equal("name1", doc.root()?.name());
    assert.done();
};

module.exports.newWithContent = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Element(doc, "name1", "content && more content <>");
    doc.root(elem);
    assert.equal("name1", elem.name());
    assert.equal("name1", doc.root()?.name());
    assert.equal("content && more content <>", elem.text());
    assert.done();
};

module.exports.setters = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    // change content
    assert.equal("", elem.text());
    elem.text("content && more content <>");
    assert.equal("content && more content <>", elem.text());

    // change name
    assert.equal("name1", elem.name());
    elem.name("newname");
    assert.equal("newname", elem.name());
    assert.done();
};

module.exports.getters = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    assert.equal("element", elem.type());
    //TODO assert.equal(doc, elem.doc());
    assert.done();
};

module.exports.remove = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var child = elem.node("child");
    assert.ok(doc.get("/name1/child"));

    child.remove();
    assert.ok(!doc.get("/name1/child"));

    assert.done();
};

module.exports.toString = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    assert.equal("<name1/>", elem.toString());
    elem.node("child");
    assert.equal("<name1><child/></name1>", elem.toString());
    assert.equal("<name1><child></child></name1>", elem.toString({ selfCloseEmpty: false }));
    assert.equal("<name1><child></child></name1>", elem.toString({ type: "html" }));
    assert.equal("<name1\n  ><child\n  /></name1\n>", elem.toString({ whitespace: true }));
    assert.equal("<name1>\n  <child/>\n</name1>", elem.toString({ format: true }));
    assert.done();
};

module.exports.toStringWithEncoding = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    assert.equal("<name1></name1>", elem.toString({ type: "xhtml" }));
    elem.node("child1").text("Something\xA0with a non-breaking space");
    assert.equal("<name1><child1>Something\xA0with a non-breaking space</child1></name1>", elem.toString({ type: "xhtml" }));
    assert.equal("<name1><child1>Something\xA0with a non-breaking space</child1></name1>", elem.toString({ type: "xhtml", encoding: "UTF-8" }));
    assert.equal("<name1><child1>Something&nbsp;with a non-breaking space</child1></name1>", elem.toString({ type: "xhtml", encoding: "HTML" }));
    assert.equal("<name1><child1>Something&#160;with a non-breaking space</child1></name1>", elem.toString({ type: "xhtml", encoding: "ASCII" }));
    elem.node("child2").text("😀");
    assert.equal("<name1><child1>Something\xA0with a non-breaking space</child1><child2>😀</child2></name1>", elem.toString({ type: "xhtml" }));
    assert.equal("<name1><child1>Something\xA0with a non-breaking space</child1><child2>😀</child2></name1>", elem.toString({ type: "xhtml", encoding: "UTF-8" }));
    assert.equal("<name1><child1>Something&nbsp;with a non-breaking space</child1><child2>&#128512;</child2></name1>", elem.toString({ type: "xhtml", encoding: "HTML" }));
    assert.equal("<name1><child1>Something&#160;with a non-breaking space</child1><child2>&#128512;</child2></name1>", elem.toString({ type: "xhtml", encoding: "ASCII" }));
    assert.done();
};

module.exports.path = function (assert: any) {
    var doc = libxml.Document();
    var root = doc.node("root");
    var gchild = root.node("child").node("grandchild");
    var sibling = root.node("child");
    assert.equal("/root/child[1]/grandchild", gchild.path());
    assert.equal("/root/child[2]", sibling.path());
    assert.done();
};

module.exports.move = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var child = elem.node("child");
    assert.ok(doc.get("/name1/child"));

    child.remove();
    var name2 = elem.node("name2");
    name2.addChild(child);
    assert.ok(!doc.get("/name1/child"));
    assert.ok(doc.get("/name1/name2/child"));
    assert.done();
};

module.exports.addChild = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");
    var newChild = libxml.Element(doc, "new-child");
    elem.addChild(newChild);
    assert.ok(doc.get("/name1/new-child"));
    assert.done();
};

module.exports.add_prev_sibling = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    var child2 = elem.node("child2");
    assert.equal(elem.childNodes().length, 2);
    var prevSibling = libxml.Element(doc, "prev-sibling");
    var addedSibling = child2.addPrevSibling(prevSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal("prev-sibling", children[1]?.name());
    assert.done();
};

module.exports.add_next_sibling = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    var child2 = elem.node("child2");
    assert.equal(elem.childNodes().length, 2);
    var nextSibling = libxml.Element(elem.doc()!, "next-sibling");
    var addedSibling = child1.addNextSibling(nextSibling);
    var children = elem.childNodes();
    assert.equal(3, children.length);
    assert.equal("next-sibling", children[1]?.name());
    assert.done();
};

module.exports.import = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name1");

    var child1 = elem.node("child1");
    doc = child1.doc()!;

    var newdoc = libxml.Document();
    newdoc.node("newdoc");

    newdoc.root()?.addChild(child1);

    assert.ok(newdoc);
    assert.notEqual(doc, newdoc, true);
    assert.equal("child1", newdoc.root()?.childNodes()[0]?.name());
    assert.equal(child1, elem.childNodes()[0]); // child1 is the the first child of elem
    assert.done();
};

module.exports.clone = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("child");
    var elem2 = elem.clone();

    assert.equal(elem2 instanceof XMLElement, true);

    if (elem2 instanceof XMLElement) {
        assert.equal(elem.name(), elem2.name());
        assert.equal(elem.text(), elem2.text());
        assert.equal(elem.toString(), elem2.toString());
    }
    assert.done();
};

module.exports.namespace = function (assert: any) {
    var str =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<root xmlns:bacon="http://www.example.com/fake/uri"><node bacon:attr-with-ns="attr-with-ns-value" attr-without-ns="attr-withoug-ns-vavlue" /></root>';
    var doc = libxml.parseXml(str);
    var node = doc.get("node");

    assert.equal(node instanceof XMLElement, true);

    if (node instanceof XMLElement) {
        var attrs = node?.attrs();

        attrs.forEach(function (attr: any) {
            var name = attr.name();
            var ns = attr.namespace();

            if (name === "attr-with-ns") {
                assert.equal(ns.prefix(), "bacon");
                assert.equal(ns.href(), "http://www.example.com/fake/uri");
            } else {
                assert.equal(name, "attr-without-ns");
                assert.equal(ns, null);
            }
        });
    }
    assert.done();
};

module.exports.replace = function (assert: any) {
    var str = "<foo>some <bar/> evening</foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.get("bar");

    assert.equal(bar instanceof XMLElement, true);

    if (bar instanceof XMLElement) {
        bar.replace("enchanted");
    }

    assert.equal(doc.root()?.text(), "some enchanted evening");

    doc = libxml.parseXml(str);
    bar = doc.get("bar");

    assert.equal(bar instanceof XMLElement, true);

    if (bar instanceof XMLElement) {
        bar.replace("<>");
    }
    assert.equal(doc.root()?.toString(), "<foo>some &lt;&gt; evening</foo>");

    doc = libxml.parseXml(str);
    bar = doc.get("bar");
    var enchant = libxml.parseXml("<enchanted/>");
    assert.equal(bar instanceof XMLElement, true);

    if (bar instanceof XMLElement) {
        assert.equal(!!enchant.root(), true);
        bar.replace(enchant.root()!);
    }

    assert.equal(doc.root()?.toString(), "<foo>some <enchanted/> evening</foo>");
    assert.equal(doc.root()?.childNodes().length, 3);
    assert.equal(doc.root()?.childNodes()[1]?.name(), "enchanted");

    assert.done();
};

module.exports.add_child_merge_text = function (assert: any) {
    var str = "<foo>bar</foo>";
    var doc = libxml.parseXml(str);
    var foo = doc.root();
    var baz = libxml.Text(doc, "baz");

    assert.equal(foo instanceof XMLElement, true);

    if (foo instanceof XMLElement) {
        foo.addChild(baz);

        // added text is merged into existing child node
        assert.strictEqual("barbaz", foo.text());
        assert.strictEqual(foo.childNodes().length, 1);
        assert.ok(foo.childNodes()[0] != baz);

        // passed node is not changed
        assert.strictEqual(doc, baz.parent());
        assert.strictEqual("baz", baz.text());
    }

    assert.done();
};
