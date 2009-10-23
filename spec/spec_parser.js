node.mixin(process, require('helpers.js'));

describe('Parsing', function() {
  it('can be done by string', function() {
    var str = node.fs.cat(node.path.dirname(__filename)+'/fixtures/parser_test.xml').wait();

    var doc = libxml.parseString(str);
    assertEqual('1.0', doc.version());
    assertEqual('UTF-8', doc.encoding());
    assertEqual('root', doc.root().name());
    assertEqual('child', doc.get('child').name());
    assertEqual('grandchild', doc.get('child').get('grandchild').name());
    assertEqual('with love', doc.get('child/grandchild').text());
    assertEqual('sibling', doc.get('sibling').name());
    assertEqual('with content!', doc.get('sibling').text());
    assertEqual(str, doc.toString());
  });

  it('can be done by file', function() {
    var doc = libxml.parseFile(node.path.dirname(__filename)+'/fixtures/parser_test.xml');
    assertEqual('1.0', doc.version());
    assertEqual('UTF-8', doc.encoding());
    assertEqual('root', doc.root().name());
    assertEqual('child', doc.get('child').name());
    assertEqual('grandchild', doc.get('child').get('grandchild').name());
    assertEqual('with love', doc.get('child/grandchild').text());
    assertEqual('sibling', doc.get('sibling').name());
    assertEqual('with content!', doc.get('sibling').text());
  });
});
