with(require('./helpers')) {

describe('Text node', function() {
  var doc = null;

  beforeEach(function() {
    doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root>child</root>\
    ');
  });

  it('knows its type is "text"', function() {
    assertEqual('text', doc.child().type());
  });

  it('knows its name is "text"', function() {
    assertEqual('text', doc.child().name());
  });
});

describe('Comment node', function() {
  var doc = null;

  beforeEach(function() {
    doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><!-- comment --></root>\
    ');
  });

  it('knows its type is "comment"', function() {
    assertEqual('comment', doc.child().type());
  });

  it('knows its name is "comment"', function() {
    assertEqual('comment', doc.child().name());
  });
});

describe('CDATA node', function() {
  var doc = null;

  beforeEach(function() {
    doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root><![CDATA[cdata text]]></root>\
    ');
  });

  it('knows its type is "cdata"', function() {
    assertEqual('cdata', doc.child().type());
  });

  it('has no name', function() {
    assertEqual(undefined, doc.child().name());
  });
});

}
