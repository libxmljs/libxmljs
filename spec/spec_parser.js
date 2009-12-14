process.mixin(require('./helpers'));

describe('Parsing XML', function() {
  var filename = path.dirname(__filename)+'/fixtures/parser_test.xml';

  it('can be done by string', function() {
    var str = posix.cat(filename).wait();

    var doc = libxml.parseXmlString(str);
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
    var doc = libxml.parseXmlFile(filename);
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

describe('Parsing HTML', function() {
  var filename = path.dirname(__filename)+'/fixtures/html_parser_test.html';

  it('can be done by string', function() {
    var str = posix.cat(filename).wait();
  
    var doc = libxml.parseHtmlString(str);
    assertEqual('html', doc.root().name());
    assertEqual('Test HTML document', doc.get('head/title').text());
    assertEqual('HTML content!', doc.get('body/span').text());
  });

  it('can be done by file', function() {
    var doc = libxml.parseHtmlFile(filename);
    assertEqual('html', doc.root().name());
    assertEqual('Test HTML document', doc.get('head/title').text());
    assertEqual('HTML content!', doc.get('body/span').text());
  });
});
