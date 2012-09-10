var package = require('../package')
  , libxml = require('../index');

module.exports.constants = function(assert) {
    assert.ok(typeof libxml.version == 'string');
    assert.equal(package.version, libxml.version);
    assert.ok(typeof libxml.libxml_version == 'string');
    assert.ok(typeof libxml.libxml_parser_version == 'string');
    assert.ok(typeof libxml.libxml_debug_enabled == 'boolean');
    assert.done();
};

