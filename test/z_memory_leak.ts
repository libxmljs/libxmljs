import * as libxml from "../index";

if (!global.gc) {
    throw new Error("must run with --expose_gc for memory management tests");
}

/*
 * TODO: Possibly create a custom `nodeunit` test reporter (https://github.com/caolan/nodeunit#command-line-options)
 *       that will run this check after each test. This would allow us to see exactly which test is causing a leak.
 *
 */

// run this test last to check for any unfreed nodes
module.exports.detect_leaks = function (assert: any) {
    collectGarbage(5);
    if (libxml.nodeCount() > 0) {
        console.log("tests leak " + libxml.nodeCount() + " nodes");
        assert.ok(false);
    }
    // console.log(libxml.memoryUsage());
    assert.done();
};

function collectGarbage(minCycles: number, maxCycles?: number) {
    minCycles = minCycles || 3;
    maxCycles = maxCycles || 10;

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
