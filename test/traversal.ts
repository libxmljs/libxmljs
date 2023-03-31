import * as libxml from "../index";
import { XMLElement, XMLNode } from "../index";

module.exports.built = function (assert: any) {
    var doc = libxml.Document();
    var child = doc.node("root").node("child");
    var sibling = doc.root()?.node("sibling");
    var gchild = child.node("grandchild");

    // access document
    assert.ok(doc == gchild.doc());
    assert.ok(doc == doc.root()?.parent());

    assert.ok(child == gchild.parent());
    assert.ok(gchild == doc.child(0)?.child(0));

    assert.ok(sibling == doc.child(1));
    assert.done();
};

module.exports.children = function (assert: any) {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node("root");
    children.push(root.node("child"));
    children.push(root.node("sibling1"));
    children.push(root.node("sibling2"));

    assert.equal(children.length, doc.childNodes().length);
    for (var i = 0; i < children.length; ++i) {
        assert.ok(children[i] == doc.child(i));
    }
    assert.done();
};

module.exports.siblings = function (assert: any) {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node("root");
    children.push(root.node("prevSibling"));
    children.push(root.node("child"));
    children.push(root.node("nextSibling"));
    assert.ok(children[0] == children[1]?.prevSibling());
    assert.ok(children[2] == children[1]?.nextSibling());
    assert.ok(null == children[0]?.prevSibling());
    assert.ok(null == children[2]?.nextSibling());
    assert.done();
};

module.exports.parsed = function (assert: any) {
    var doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><child><grandchild /></child><sibling/></root>");
    assert.ok(doc == (doc.child(0) as XMLElement).doc());
    assert.ok(doc == (doc.child(1) as XMLElement).doc());
    assert.ok(doc == (doc.child(0)?.child(0) as XMLElement).doc());
    assert.ok(doc == doc.root()?.parent());

    // down and back up
    assert.equal("child", doc.child(0)?.child(0)?.parent()?.name());

    // propertly access inner nodes
    assert.equal("grandchild", doc.child(0)?.child(0)?.name());

    // sibling nodes
    assert.equal("sibling", doc.child(1)?.name());
    assert.done();
};

module.exports.parsed_children = function (assert: any) {
    var doc = libxml.parseXml('<?xml version="1.0"?>' + "<root><prevSibling /><child /><nextSibling /></root>");
    var children = ["prevSibling", "child", "nextSibling"];

    // childNodes
    assert.ok(3 == doc.childNodes().length);
    for (var i = 0; i < children.length; ++i) {
        assert.ok(children[i] == (doc.child(i) as XMLElement).name());
    }

    // check prev/next sibling
    var child = doc.child(1) as XMLElement;
    assert.equal("child", child.name());
    assert.equal(children[0], child.prevSibling()?.name());
    assert.equal(children[2], child.nextSibling()?.name());
    assert.ok(null == child.prevSibling()?.prevSibling());
    assert.ok(null == child.nextSibling()?.nextSibling());

    // prev/next Element
    var child = doc.child(1) as XMLElement;
    assert.equal("child", child.name());
    assert.equal(children[0], child.prevElement()?.name());
    assert.equal(children[2], child.nextElement()?.name());
    assert.ok(null == child.prevElement()?.prevElement());
    assert.ok(null == child.nextElement()?.nextElement());

    assert.done();
};
