process.mixin(require('./helpers'));

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
