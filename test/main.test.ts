import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'path';

const packageJSON = require(path.join(__dirname, '..', 'package.json'));
import * as libxml from '../index';

it('constants', () => {
    assert.strictEqual(typeof libxml.version, 'string');
    assert.strictEqual(libxml.version, packageJSON.version);
    assert.strictEqual(typeof libxml.libxml_version, 'string');
    assert.strictEqual(typeof libxml.libxml_parser_version, 'string');
    assert.strictEqual(typeof libxml.libxml_debug_enabled, 'boolean');
});

it('memoryUsage', () => {
    assert.strictEqual(typeof libxml.memoryUsage(), 'number');
    assert.strictEqual(typeof libxml.nodeCount(), 'number');
});
