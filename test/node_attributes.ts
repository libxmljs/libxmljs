import * as libxml from "../index";
import { XMLElement } from "../index";

module.exports.basic = function (assert: any) {
    // reading a node is implied during all tests
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.equal("wongfoo", elem.getAttribute("to")?.value());
    assert.done();
};

module.exports.null = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name");
    assert.equal(null, elem.getAttribute("to"));
    assert.done();
};

module.exports.assign_object = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.equal("wongfoo", elem.getAttribute("to")?.value());
    assert.done();
};

module.exports.change = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("name");
    elem.attr({ to: "wongfoo" });
    assert.equal("wongfoo", elem.getAttribute("to")?.value());
    elem.attr({ to: "julie newmar" });
    assert.equal("julie newmar", elem.getAttribute("to")?.value());
    assert.done();
};

module.exports.attrs = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("root");

    assert.deepEqual([], elem.attrs());

    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });

    var attrs = [elem.getAttribute("foo"), elem.getAttribute("bar"), elem.getAttribute("baz")];
    for (var i = 0; i < 3; ++i) {
        // console.log(attrs[i]);
        // console.log(elem.attrs()[i]);
        assert.ok(attrs[i] == elem.attrs()[i]);
    }
    assert.done();
};

module.exports.siblings = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("root");
    elem.attr({ foo: "bar" });
    elem.attr({ bar: "baz" });
    elem.attr({ baz: "foo" });
    assert.equal(elem.getAttribute("baz"), elem.getAttribute("bar")?.nextSibling());
    assert.equal(elem.getAttribute("foo"), elem.getAttribute("bar")?.prevSibling());
    assert.equal(null, elem.getAttribute("foo")?.prevSibling());
    assert.equal(null, elem.getAttribute("baz")?.nextSibling());
    assert.done();
};

module.exports.getters = function (assert: any) {
    var doc = libxml.Document();
    var elem = doc.node("root");
    elem.attr({ foo: "bar" });

    // get node
    assert.equal(elem, elem.getAttribute("foo")?.parent());
    // get document
    assert.equal(doc, elem.getAttribute("foo")?.doc());

    assert.done();
};
