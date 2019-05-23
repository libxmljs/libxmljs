var libxml = require('../index');
var path = require('path');

var xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<root xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include href="fixtures/parser.xml" /></root>';
var txt =
  '<?xml version="1.0" encoding="UTF-8"?>\n<root xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include href="fixtures/include.txt" parse="text" /></root>';

var baseUrl = path.resolve(__dirname) + '/';
var wrongBaseUrl = path.resolve(__dirname, 'fixtures') + '/';

module.exports.xinclude = function(assert) {
  var doc = libxml.parseXmlString(xml, {
    baseUrl: baseUrl,
    xinclude: true,
    noxincnode: true,
  });
  const child = doc.get('//child');
  assert.ok(child);
  assert.equals('child', child.name());
  assert.done();
};

module.exports.xincnode = function(assert) {
  var doc = libxml.parseXmlString(xml, {
    baseUrl: baseUrl,
    xinclude: true,
    noxincnode: false,
  });
  const xincnode = doc.root().child(0);
  assert.ok(xincnode);
  assert.equals('include', xincnode.name());
  assert.equals('xinclude_start', xincnode.type());
  assert.done();
};

module.exports.xincludeText = function(assert) {
  var doc = libxml.parseXmlString(txt, {
    baseUrl: baseUrl,
    xinclude: true,
    noxincnode: true,
  });
  assert.equals('Lorem ipsum dolor sit amet\n', doc.root().text());
  assert.done();
};

module.exports.xincludeDisabled = function(assert) {
  var doc = libxml.parseXmlString(xml, {
    baseUrl: baseUrl,
  });
  var include = doc.get('//xi:include', { xi: 'http://www.w3.org/2001/XInclude' });
  assert.ok(include);
  assert.done();
};

module.exports.wrongBaseUrl = function(assert) {
  assert.throws(function() {
    libxml.parseXmlString(xml, {
      baseUrl: wrongBaseUrl,
      xinclude: true,
      noxincnode: true,
    });
  }, /could not load.*and no fallback was found/);
  assert.done();
};

module.exports.wrongFileType = function(assert) {
  var invalidXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<root xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include href="fixtures/include.txt" /></root>';
  assert.throws(function() {
    libxml.parseXmlString(invalidXml, {
      baseUrl: baseUrl,
      xinclude: true,
      noxincnode: true,
    });
  }, /could not load.*and no fallback was found/);
  assert.done();
};
