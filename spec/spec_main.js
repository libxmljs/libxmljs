with(require('./helpers')) {

describe('libxmljs', function() {
  it('has a version number', function() {
    if (specVerbose) print(libxml.version+" ");
    assert.ok(typeof libxml.version == 'string');
  });

  it('knows the libxml version number', function() {
    if (specVerbose) print(libxml.libxml_version+" ");
    assert.ok(typeof libxml.libxml_version == 'string');
  });

  it('knows the libxml parser version number', function() {
    if (specVerbose) print(libxml.libxml_parser_version+" ");
    assert.ok(typeof libxml.libxml_parser_version == 'string');
  });

  it('knows if libxml debugging is enabled', function() {
    if (specVerbose) print(libxml.libxml_debug_enabled+" ");
    assert.ok(typeof libxml.libxml_debug_enabled == 'boolean');
  });
});

}
