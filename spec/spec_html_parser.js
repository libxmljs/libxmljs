process.mixin(require('./helpers'));

describe('Parsing HTML', function() {
  var filename = path.dirname(__filename)+'/fixtures/parser_test.html';

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

// describe('Parsing bad HTML', function() {
//   var filename = path.dirname(__filename)+'/fixtures/bad_markup.html';
//
//   it('will throw warnings when using the default settings', function() {
//     var doc = libxml.parseHtmlFile(filename);
//   });
// });
