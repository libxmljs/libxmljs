import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('text', () => {
    const doc = libxml.parseXml('<?xml version="1.0"?><root>child</root>');
    assert.strictEqual(doc.child(0)?.type(), "text");
    assert.strictEqual(doc.child(0)?.name(), "text");
});

it('comment', () => {
    const doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><!-- comment --></root>");
    assert.strictEqual(doc.child(0)?.type(), "comment");
    assert.strictEqual(doc.child(0)?.name(), "comment");
});

it('cdata', () => {
    const doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><![CDATA[cdata text]]></root>");
    assert.strictEqual(doc.child(0)?.type(), "cdata");
    assert.strictEqual(doc.child(0)?.name(), "cdata");
});
