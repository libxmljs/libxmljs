var libxml = require('../index');

if (!global.gc) {
    throw new Error('must run with --expose_gc for memory management tests');
}

module.exports.setUp = function(done) {
    collectGarbage();
    done();
};

module.exports.namespace_list_freed = function(assert) {
    var doc = makeDocument();
    var el = doc.get('//center');
    el.namespace("bar", null);
    var xmlMemBefore = libxml.memoryUsage();
    for (var i; i<1000; i++) {
        el.namespaces()
    }
    collectGarbage();
    assert.ok(libxml.memoryUsage() <= xmlMemBefore);
    assert.done();
};

function makeDocument() {
    var body = "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<root><outer><middle><inner><center/></inner></middle></outer></root>";
    return libxml.parseXml(body);
}

function collectGarbage(minCycles, maxCycles) {
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
    }
    while ((cycles < minCycles) || ((freedRss !== 0) && (cycles < maxCycles)));

    return usage;
}

