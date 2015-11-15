var libxml = require('../index');

if (!global.gc) {
    throw new Error('must run with --expose_gc for memory management tests');
}

/*
 * TODO: Possibly create a custom `nodeunit` test reporter (https://github.com/caolan/nodeunit#command-line-options)
 *       that will run this check after each test. This would allow us to see exactly which test is causing a leak.
 *
 */

// run this test last to check for any unfreed nodes
module.exports.detect_leaks = function(assert) {
    global.gc();
    assert.ok(libxml.nodeCount() < 1);
    assert.done();
}
