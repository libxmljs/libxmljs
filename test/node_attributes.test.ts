import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";
import { XMLElement } from "../index";

it('basic', () => {
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
});

it('null', () => {
    var doc = libxml.Document();
    var elem = doc.node("name");
    assert.strictEqual(elem.getAttribute("to"), null);
});

it('assign_object', () => {
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
});

it('change', () => {
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "wongfoo");
    elem.attr({ to: "julie newmar" });
    assert.strictEqual(elem.getAttribute("to")?.value(), "julie newmar");
});

it('attrs', () => {
    var doc = libxml.Document();
    var elem = doc.node("root");

    assert.deepStrictEqual(elem.attrs(), []);

    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });

    var attrs = [elem.getAttribute("foo"), elem.getAttribute("bar"), elem.getAttribute("baz")];
    for (var i = 0; i < 3; ++i) {
        assert.ok(attrs[i] == elem.attrs()[i]);
    }
});

it('siblings', () => {
    var doc = libxml.Document();
    var elem = doc.node("root");
    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });
    assert.strictEqual(elem.getAttribute("bar")?.nextSibling(), elem.getAttribute("baz"));
    assert.strictEqual(elem.getAttribute("bar")?.prevSibling(), elem.getAttribute("foo"));
    assert.strictEqual(elem.getAttribute("foo")?.prevSibling(), null);
    assert.strictEqual(elem.getAttribute("baz")?.nextSibling(), null);
});

it('getters', () => {
    var doc = libxml.Document();
    var elem = doc.node("root");
    elem.attr({ foo: "bar" });

    assert.strictEqual(elem.getAttribute("foo")?.parent(), elem);
    assert.strictEqual(elem.getAttribute("foo")?.doc(), doc);
});
