import * as libxml from "../index";
import { XMLElement } from "../index";
var semver = require("semver");

if (!global.gc) {
    throw new Error("must run with --expose_gc for memory management tests");
}

var nodeVersion = process.versions.node;
var shouldSkip = semver.satisfies(nodeVersion, "8.x || 9.x || 10.x || 11.x || 12.x");

module.exports.setUp = function (done: any) {
    collectGarbage();
    done();
};

module.exports.inaccessible_document_freed = function (assert: any) {
    var xml_memory_before_document = libxml.memoryUsage();
    for (var i = 0; i < 10; i++) {
        makeDocument();
    }
    collectGarbage();
    assert.ok(libxml.memoryUsage() <= xml_memory_before_document);
    assert.done();
};

module.exports.inaccessible_document_freed_when_node_freed = function (assert: any) {
    if (shouldSkip) {
        assert.done();
        console.warn("skipping inaccessible_document_freed_when_node_freed");
        return;
    }

    var xmlCountBefore = libxml.nodeCount();
    var xml_memory_before_document = libxml.memoryUsage();
    
    (() => {
        var nodes: any[] | null = [];
        for (var i = 0; i < 10; i++) {
            nodes.push(makeDocument().get("//center"));
        }
        nodes = null;
    })();

    collectGarbage();
    assert.equal(libxml.nodeCount(), xmlCountBefore);
    assert.ok(libxml.memoryUsage() <= xml_memory_before_document);
    assert.done();
};

module.exports.inaccessible_document_freed_after_middle_nodes_proxied = function (assert: any) {
    var xml_memory_before_document = libxml.memoryUsage();
    var xmlCountBefore = libxml.nodeCount();
    var doc = makeDocument();
    var middle = doc.get("//middle") as XMLElement;
    var inner = doc.get("//inner") as XMLElement;
    inner.remove(); // v0.14.3, v0.15: proxy ref'd parent but can't unref when destroyed
    //@ts-ignore
    doc = middle = inner = null;
    collectGarbage();
    assert.equal(libxml.nodeCount(), xmlCountBefore);
    assert.ok(libxml.memoryUsage() <= xml_memory_before_document);
    assert.done();
};

module.exports.inaccessible_tree_freed = function (assert: any) {
    if (shouldSkip) {
        assert.done();
        console.warn("skipping inaccessible_tree_freed");
        return;
    }

    var doc = makeDocument();
    var xml_memory_after_document = libxml.memoryUsage();
    (() => {
        (doc.get("//middle") as XMLElement).remove();
    })();
    collectGarbage();
    assert.ok(libxml.memoryUsage() < xml_memory_after_document);
    assert.done();
};

module.exports.namespace_list_freed = function (assert: any) {
    var doc = makeDocument();
    var el = doc.get("//center") as XMLElement;
    el.namespace("bar", null);
    var xmlMemBefore = libxml.memoryUsage();
    var xmlCountBefore = libxml.nodeCount();
    for (var i = 0; i < 1000; i++) {
        el.namespaces();
    }
    collectGarbage();
    assert.equal(libxml.nodeCount(), xmlCountBefore);
    assert.ok(libxml.memoryUsage() <= xmlMemBefore);
    assert.done();
};

function makeDocument() {
    var body =
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><center/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles?: number, maxCycles?: number) {
    minCycles = minCycles || 3;
    maxCycles = maxCycles || 10;

    var cycles = 0;
    var freedRss = 0;
    var usage = process.memoryUsage();
    do {
        global.gc();

        var usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}
