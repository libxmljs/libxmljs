import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('invalid_new', () => {
    const doc = libxml.Document();

    assert.throws(() => {
        //@ts-ignore
        libxml.Text();
    });

    assert.throws(() => {
        libxml.Text(doc);
    });
});

it('new', () => {
    const doc = libxml.Document();
    const elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(elem.text(), "node content");
});

it('setters', () => {
    const doc = libxml.Document();
    const elem = libxml.Text(doc, "node content");

    assert.strictEqual(elem.text(), "node content");
    elem.text("content && more content <>");
    assert.strictEqual(elem.text(), "content &amp;&amp; more content &lt;&gt;");
});

it('remove', () => {
    const doc = libxml.Document();
    const elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\nnode content\n');
    elem.remove();
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n');
});

it('toString', () => {
    const doc = libxml.Document();
    const elem = libxml.Text(doc, "node content");
    doc.root(elem);
    assert.strictEqual(elem.toString(), "node content");
});

it('addChild', () => {
    const doc = libxml.Document();

    const newTextNode = libxml.Text(doc, "my text");
    const newElement = libxml.Element(doc, "div");

    newElement.addChild(newTextNode);
    doc.root(newElement);
    assert.strictEqual(newElement.toString(), "<div>my text</div>");
});

it('addSiblings', () => {
    const doc = libxml.Document();

    const parentNode = libxml.Element(doc, "div");
    const child = parentNode.node("child", "i'm a child");
    const prevTextNode = libxml.Text(doc, "before text");
    const nextTextNode = libxml.Text(doc, "after text");

    child.addPrevSibling(prevTextNode);
    child.addNextSibling(nextTextNode);

    assert.strictEqual(parentNode.toString(), "<div>before text<child>i'm a child</child>after text</div>");
});

it('add_prev_sibling_merge_text', () => {
    const str = "<foo>bar<baz/></foo>";
    const doc = libxml.parseXml(str);
    const bar = doc.root()?.childNodes()[0];

    const qux = libxml.Text(doc, "qux");
    bar?.addPrevSibling(qux);

    const children = doc.root()?.childNodes();
    assert.deepStrictEqual(children?.length, 2);
    assert.deepStrictEqual(children?.[0]?.text(), "quxbar");
    assert.ok(children?.[0] != qux);

    assert.deepStrictEqual(qux.parent(), doc);
    assert.deepStrictEqual(qux.text(), "qux");
});

it('add_next_sibling_merge_text', () => {
    const str = "<foo>bar<baz/></foo>";
    const doc = libxml.parseXml(str);
    const bar = doc.root()?.childNodes()[0];

    const qux = libxml.Text(doc, "qux");
    bar?.addNextSibling(qux);

    const children = doc.root()?.childNodes();
    assert.deepStrictEqual(children?.length, 2);
    assert.deepStrictEqual(children?.[0]?.text(), "barqux");
    assert.ok(children?.[0] != qux);

    assert.deepStrictEqual(qux.parent(), doc);
    assert.deepStrictEqual(qux.text(), "qux");
});
