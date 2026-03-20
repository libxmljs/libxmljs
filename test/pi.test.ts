import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('new', () => {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, "mypi", "mycontent");
    doc.root(libxml.Element(doc, "myelem"));
    doc.root()?.addPrevSibling(pi);

    assert.strictEqual(doc.root()?.prevSibling(), pi);
    assert.strictEqual(pi.name(), "mypi");
    assert.strictEqual(pi.text(), "mycontent");
});

it('name', () => {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, "mypi");
    pi.name("mynewpi");
    assert.strictEqual(pi.name(), "mynewpi");
});

it('text', () => {
    var doc = libxml.Document();
    var pi = libxml.ProcessingInstruction(doc, "mypi");
    pi.text("pi3");
    assert.strictEqual(pi.text(), "pi3");
});
