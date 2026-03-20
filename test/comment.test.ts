import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('new', () => {
    const doc = libxml.Document();
    const comm = libxml.Comment(doc, 'comment1');
    doc.root(comm);
    assert.strictEqual(comm.text(), 'comment1');
});

it('text', () => {
    const doc = libxml.Document();
    const comm = libxml.Comment(doc);
    comm.text('comment2');
    assert.strictEqual(comm.text(), 'comment2');
});

it('textWithSpecialCharacters', () => {
    const doc = libxml.Document();
    const comm = libxml.Comment(doc);
    const theText = 'my comment <has> special ch&r&cters';
    comm.text(theText);
    assert.strictEqual(comm.text(), theText);
});

it('toStringWithSpecialCharacters', () => {
    const doc = libxml.Document();
    const comm = libxml.Comment(doc);
    const theText = 'my comment <has> special ch&r&cters';
    comm.text(theText);
    assert.strictEqual(comm.toString(), "<!--" + theText + "-->");
});
