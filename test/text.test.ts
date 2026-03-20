import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('invalid_new', () => {
    var doc = libxml.Document();

    assert.throws(() => {
        //@ts-ignore
        libxml.Text();
    });

    assert.throws(() => {
        libxml.Text(doc);
    });
});

it('new', () => {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(elem.text(), "node content");
});

it('setters', () => {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");

    assert.strictEqual(elem.text(), "node content");
    elem.text("content && more content <>");
    assert.strictEqual(elem.text(), "content &amp;&amp; more content &lt;&gt;");
});

it('remove', () => {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\nnode content\n');
    elem.remove();
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n');
});

it('toString', () => {
    var doc = libxml.Document();
    var elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(elem.toString(), "node content");
});

it('addChild', () => {
    var doc = libxml.Document();

    var newTextNode = libxml.Text(doc, "my text");
    var newElement = libxml.Element(doc, "div");

    newElement.addChild(newTextNode);
    doc.root(newElement);
    assert.strictEqual(newElement.toString(), "<div>my text</div>");
});

it('addSiblings', () => {
    var doc = libxml.Document();

    var parentNode = libxml.Element(doc, "div");
    var child = parentNode.node("child", "i'm a child");
    var prevTextNode = libxml.Text(doc, "before text");
    var nextTextNode = libxml.Text(doc, "after text");

    child.addPrevSibling(prevTextNode);
    child.addNextSibling(nextTextNode);

    assert.strictEqual(parentNode.toString(), "<div>before text<child>i'm a child</child>after text</div>");
});

it('add_prev_sibling_merge_text', () => {
    var str = "<foo>bar<baz/></foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.root()?.childNodes()[0];

    var qux = libxml.Text(doc, "qux");
    bar?.addPrevSibling(qux);

    var children = doc.root()?.childNodes();
    assert.deepStrictEqual(children?.length, 2);
    assert.deepStrictEqual(children?.[0]?.text(), "quxbar");
    assert.ok(children?.[0] != qux);

    assert.deepStrictEqual(qux.parent(), doc);
    assert.deepStrictEqual(qux.text(), "qux");
});

it('add_next_sibling_merge_text', () => {
    var str = "<foo>bar<baz/></foo>";
    var doc = libxml.parseXml(str);
    var bar = doc.root()?.childNodes()[0];

    var qux = libxml.Text(doc, "qux");
    bar?.addNextSibling(qux);

    var children = doc.root()?.childNodes();
    assert.deepStrictEqual(children?.length, 2);
    assert.deepStrictEqual(children?.[0]?.text(), "barqux");
    assert.ok(children?.[0] != qux);

    assert.deepStrictEqual(qux.parent(), doc);
    assert.deepStrictEqual(qux.text(), "qux");
});
