with(require('./helpers')) {

describe('Text node', function() {
  it('knows its type is "text"', function() {
    var doc = libxml.parseXmlString(
      '<?xml version="1.0"?>\
      <root>child</root>\
    ');
    assertEqual('text', doc.child().type());
  });
});

}
