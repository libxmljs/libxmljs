import * as libxml from "../index";
import { XMLElement, XMLNamespace } from "../index";

var body =
    "<?xml version='1.0' encoding='UTF-8'?>\n" +
    "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>";

module.exports.new = function (assert: any) {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    // add new attribute to the node
    node?.setAttribute("new-attr-key", "new-attr-value");
    assert.equal("new-attr-value", node.getAttribute("new-attr-key")?.value());

    assert.done();
};

module.exports.create_with_namespace = function (assert: any) {
    var doc = libxml.parseXml(
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
            "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value' /></root>"
    );
    var node = doc.get("node") as XMLElement;

    assert.equal(node instanceof XMLElement, true);

    var attr = node.setAttribute("new-attr-key", "new-attr-value");
    var ns = node?.namespace("ns-prefix", "ns-url");
    assert.ok(attr);
    assert.ok(ns?.prefix());
    assert.ok(node?.namespace()?.prefix());
    assert.equal(ns?.prefix(), node?.namespace()?.prefix());
    assert.equal(ns?.href(), node?.namespace()?.href());
    assert.done();
};

module.exports.getters = function (assert: any) {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    assert.equal("attr-one-key", node.getAttribute("attr-one-key")?.name());
    assert.equal("attr-one-value", node.getAttribute("attr-one-key")?.value());
    assert.equal("node", node.getAttribute("attr-one-key")?.node().name());
    assert.ok("attribute", node.getAttribute("attr-two-key")?.type());

    // siblings
    assert.equal("attr-one-key", node.getAttribute("attr-two-key")?.prevSibling()!.name());
    assert.equal("attr-three-key", node.getAttribute("attr-two-key")?.nextSibling()!.name());

    assert.done();
};

module.exports.setters = function (assert: any) {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    node.getAttribute("attr-one-key")?.value("new-value");
    assert.equal(node.getAttribute("attr-one-key")?.value(), "new-value");
    assert.done();
};

module.exports.namespace = function (assert: any) {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;

    var ns = libxml.Namespace(node, "ns-prefix", "ns-uri");
    var attr = node.getAttribute("attr-one-key");
    attr?.namespace(ns);
    assert.equal(ns.prefix(), attr?.namespace()?.prefix());
    assert.equal(ns.href(), attr?.namespace()?.href());
    assert.done();
};

module.exports.remove = function (assert: any) {
    var doc = libxml.parseXml(body);
    var node = doc.get("node") as XMLElement;


    var attr = node.getAttribute("attr-one-key");
    assert.ok(node.getAttribute("attr-one-key"));
    attr?.remove();
    assert.ok(!node.getAttribute("attr-one-key"));
    assert.done();
};
