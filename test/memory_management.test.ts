import { it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'child_process';
import * as path from 'path';
import * as libxml from "../index";
import { XMLElement } from "../index";

var nodeVersion = process.versions.node;
var majorVersion = parseInt(nodeVersion.split('.')[0]!, 10);
var shouldSkip = majorVersion <= 12;

// Run a memory test in an isolated subprocess so tsx module caching
// doesn't interfere with GC-based assertions.
function runIsolated(scriptBody: string) {
    var tsxBin = path.join(__dirname, '..', 'node_modules', '.bin', 'tsx');
    var script = `
        var libxml = require('./index');
        var XMLElement = libxml.XMLElement;

        function makeDocument() {
            var body =
                "<?xml version='1.0' encoding='UTF-8'?>\\n" +
                "<root><outer><middle><inner><center/></inner></middle></outer></root>";
            return libxml.parseXml(body);
        }

        function collectGarbage(minCycles, maxCycles) {
            minCycles = minCycles || 5;
            maxCycles = maxCycles || 20;
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

        collectGarbage();

        ${scriptBody}
    `;

    execFileSync(tsxBin, ['--expose_gc', '-e', script], {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
}

function makeDocument() {
    var body =
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><center/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles?: number, maxCycles?: number) {
    minCycles = minCycles || 5;
    maxCycles = maxCycles || 20;

    var cycles = 0;
    var freedRss = 0;
    var usage = process.memoryUsage();
    do {
        global.gc?.();

        var usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}

it('inaccessible_document_freed', () => {
    runIsolated(`
        var xml_memory_before_document = libxml.memoryUsage();
        for (var i = 0; i < 10; i++) {
            makeDocument();
        }
        collectGarbage();
        var after = libxml.memoryUsage();
        if (after > xml_memory_before_document) {
            process.exit(1);
        }
    `);
});

it('inaccessible_document_freed_when_node_freed', () => {
    if (shouldSkip) {
        console.warn("skipping inaccessible_document_freed_when_node_freed");
        return;
    }

    runIsolated(`
        var xmlCountBefore = libxml.nodeCount();
        var xml_memory_before_document = libxml.memoryUsage();

        (function() {
            var nodes = [];
            for (var i = 0; i < 10; i++) {
                nodes.push(makeDocument().get("//center"));
            }
            nodes = null;
        })();

        collectGarbage();
        if (libxml.nodeCount() > xmlCountBefore) {
            console.error("nodeCount " + libxml.nodeCount() + " > " + xmlCountBefore);
            process.exit(1);
        }
        if (libxml.memoryUsage() > xml_memory_before_document) {
            console.error("memoryUsage " + libxml.memoryUsage() + " > " + xml_memory_before_document);
            process.exit(1);
        }
    `);
});

it('inaccessible_document_freed_after_middle_nodes_proxied', () => {
    runIsolated(`
        var xml_memory_before_document = libxml.memoryUsage();
        var xmlCountBefore = libxml.nodeCount();
        (function() {
            var doc = makeDocument();
            var middle = doc.get("//middle");
            var inner = doc.get("//inner");
            inner.remove();
        })();
        collectGarbage();
        if (libxml.nodeCount() > xmlCountBefore) {
            console.error("nodeCount " + libxml.nodeCount() + " > " + xmlCountBefore);
            process.exit(1);
        }
        if (libxml.memoryUsage() > xml_memory_before_document) {
            console.error("memoryUsage " + libxml.memoryUsage() + " > " + xml_memory_before_document);
            process.exit(1);
        }
    `);
});

it('inaccessible_tree_freed', () => {
    if (shouldSkip) {
        console.warn("skipping inaccessible_tree_freed");
        return;
    }

    runIsolated(`
        var doc = makeDocument();
        var xml_memory_after_document = libxml.memoryUsage();
        (function() {
            doc.get("//middle").remove();
        })();
        collectGarbage();
        if (libxml.memoryUsage() >= xml_memory_after_document) {
            console.error("memoryUsage " + libxml.memoryUsage() + " >= " + xml_memory_after_document);
            process.exit(1);
        }
    `);
});

it('namespace_list_freed', () => {
    collectGarbage();
    var doc = makeDocument();
    var el = doc.get("//center") as XMLElement;
    el.namespace("bar", null);
    var xmlMemBefore = libxml.memoryUsage();
    var xmlCountBefore = libxml.nodeCount();
    for (var i = 0; i < 1000; i++) {
        el.namespaces();
    }
    collectGarbage();
    assert.strictEqual(libxml.nodeCount(), xmlCountBefore);
    assert.ok(libxml.memoryUsage() <= xmlMemBefore);
});
