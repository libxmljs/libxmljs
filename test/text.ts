import * as libxml from "../index";

module.exports.invalid_new = function (assert: any) {
    var doc = libxml.Document();

    assert.throws(function () {
        //@ts-ignore
        libxml.Text();
    });

    assert.throws(function () {
        libxml.Text(doc);
    });

    assert.done();
};

module.exports.new = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.equal("node content", elem.text());
    assert.done();
};

module.exports.setters = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");

    // change content
    assert.equal("node content", elem.text());
    elem.text("content && more content <>");
    assert.equal("content &amp;&amp; more content &lt;&gt;", elem.text());
    assert.done();
};

// removed for interoperability between XMLText and XMLElement
//
// module.exports.getters = function (assert: any) {
//     var doc = libxml.Document();
//     var elem = libxml.Text(doc, "getters");

//     assert.throws(function () {
//         elem.name();
//     }, "text nodes should NOT expose a name");

//     assert.equal("text", elem.type());
//     assert.done();
// };

module.exports.remove = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\nnode content\n', doc.toString());
    elem.remove();
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n', doc.toString());
    assert.done();
};

module.exports.toString = function (assert: any) {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.equal("node content", elem.toString());
    assert.done();
};

module.exports.addChild = function (assert: any) {
    var doc = libxml.Document();

    var newTextNode = libxml.Text(doc, "my text");
    var newElement = libxml.Element(doc, "div");

    newElement.addChild(newTextNode);
    doc.root(newElement);
    assert.equal("<div>my text</div>", newElement.toString());

    assert.done();
};

module.exports.addSiblings = function (assert: any) {
    var doc = libxml.Document();

    var parentNode = libxml.Element(doc, "div");
    var child = parentNode.node("child", "i'm a child");
    var prevTextNode = libxml.Text(doc, "before text");
    var nextTextNode = libxml.Text(doc, "after text");

    child.addPrevSibling(prevTextNode);
    child.addNextSibling(nextTextNode);

    assert.equal("<div>before text<child>i'm a child</child>after text</div>", parentNode.toString());

    assert.done();
};

module.exports.add_prev_sibling_merge_text = function (assert: any) {
    var str = "<foo>bar<baz/></foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.root()?.childNodes()[0];

    var qux = libxml.Text(doc, "qux");
    bar?.addPrevSibling(qux);
    // added text is merged into existing child node

    var children = doc.root()?.childNodes();
    assert.strictEqual(children?.length, 2);
    assert.strictEqual("quxbar", children?.[0]?.text());
    assert.ok(children?.[0] != qux);

    // passed node is not changed
    assert.strictEqual(doc, qux.parent());
    assert.strictEqual("qux", qux.text());

    assert.done();
};

module.exports.add_next_sibling_merge_text = function (assert: any) {
    var str = "<foo>bar<baz/></foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.root()?.childNodes()[0];

    var qux = libxml.Text(doc, "qux");
    bar?.addNextSibling(qux);

    var children = doc.root()?.childNodes();
    assert.strictEqual(children?.length, 2);
    assert.strictEqual("barqux", children?.[0]?.text());
    assert.ok(children?.[0] != qux);

    assert.strictEqual(doc, qux.parent());
    assert.strictEqual("qux", qux.text());

    assert.done();
};
