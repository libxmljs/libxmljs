var packageJSON = require('../../package.json');

import * as libxml from '../index';

module.exports.constants = function(assert: any) {
    assert.ok(typeof libxml.version == 'string');
    assert.equal(packageJSON.version, libxml.version);
    assert.ok(typeof libxml.libxml_version == 'string');
    assert.ok(typeof libxml.libxml_parser_version == 'string');
    assert.ok(typeof libxml.libxml_debug_enabled == 'boolean');
    assert.done();
};

module.exports.memoryUsage = function(assert: any) {
  assert.ok(typeof libxml.memoryUsage() === 'number');
  assert.ok(typeof libxml.nodeCount() === 'number');
  assert.done();
};

