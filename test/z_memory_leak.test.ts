import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

function collectGarbage(minCycles: number, maxCycles?: number) {
    minCycles = minCycles || 3;
    maxCycles = maxCycles || 10;

    let cycles = 0;
    let freedRss = 0;
    let usage = process.memoryUsage();
    do {
        global.gc?.();

        const usageAfterGc = process.memoryUsage();
        freedRss = usage.rss - usageAfterGc.rss;
        usage = usageAfterGc;

        cycles++;
    } while (cycles < minCycles || (freedRss !== 0 && cycles < maxCycles));

    return usage;
}

// run this test last to check for any unfreed nodes
it('detect_leaks', () => {
    collectGarbage(5);
    if (libxml.nodeCount() > 0) {
        console.log("tests leak " + libxml.nodeCount() + " nodes");
        assert.ok(false);
    }
});
