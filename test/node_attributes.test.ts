import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

it('basic', () => {
    const doc = libxml.Document();
    const elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
});

it('null', () => {
    const doc = libxml.Document();
    const elem = doc.node("name");
    assert.strictEqual(elem.getAttribute("to"), null);
});

it('assign_object', () => {
    const doc = libxml.Document();
    const elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
});

it('change', () => {
    const doc = libxml.Document();
    const elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
    elem.attr({ to: "julie newmar" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "julie newmar");
});

it('attrs', () => {
    const doc = libxml.Document();
    const elem = doc.node("root");

    assert.deepStrictEqual(elem.attrs(), []);

    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });

    const attrs = [elem.getAttribute("foo"), elem.getAttribute("bar"), elem.getAttribute("baz")];
    for (let i = 0; i < 3; ++i) {
        assert.ok(attrs[i] == elem.attrs()[i]);
    }
});

it('siblings', () => {
    const doc = libxml.Document();
    const elem = doc.node("root");
    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });
    assert.strictEqual(elem.getAttribute("bar")?.nextSibling(), elem.getAttribute("baz"));
    assert.strictEqual(elem.getAttribute("bar")?.prevSibling(), elem.getAttribute("foo"));
    assert.strictEqual(elem.getAttribute("foo")?.prevSibling(), null);
    assert.strictEqual(elem.getAttribute("baz")?.nextSibling(), null);
});

it('getters', () => {
    const doc = libxml.Document();
    const elem = doc.node("root");
    elem.attr({ foo: "bar" });

    assert.strictEqual(elem.getAttribute("foo")?.parent(), elem);
    assert.strictEqual(elem.getAttribute("foo")?.doc(), doc);
});
