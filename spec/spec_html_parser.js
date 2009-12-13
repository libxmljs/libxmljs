process.mixin(require('./helpers'));

describe('Parsing', function() {
  var filename = path.dirname(__filename)+'/fixtures/html_parser_test.html';

  it('can be done from HTML', function() {
    var str = posix.cat(filename).wait();
  
    var doc = libxml.parseHTML(str);
    assertEqual('html', doc.root().name());
    assertEqual('Test HTML document', doc.root().get('head').get('title').text());
    assertEqual('HTML content!', doc.root().get('body').get('span').text());
  });
});
