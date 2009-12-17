process.mixin(require('./helpers'));

describe('Parse error object', function() {
  var synErr = null;
  
  beforeEach(function() {
    synErr = new libxml.SyntaxError();
  });

  it('has a domain accessor', function() {
    assertEqual('object', typeof synErr.domain);
  });

  it('has a code accessor', function() {
    assertEqual('object', typeof synErr.code);
  });

  it('has a level accessor', function() {
    assertEqual('object', typeof synErr.level);
  });

  it('has a file accessor', function() {
    assertEqual('object', typeof synErr.file);
  });

  it('has a line accessor', function() {
    assertEqual('object', typeof synErr.line);
  });

  it('has a str1 accessor', function() {
    assertEqual('object', typeof synErr.str1);
  });

  it('has a str2 accessor', function() {
    assertEqual('object', typeof synErr.str2);
  });

  it('has a str3 accessor', function() {
    assertEqual('object', typeof synErr.str3);
  });

  it('has a int1 accessor', function() {
    assertEqual('object', typeof synErr.int1);
  });

  it('has a column accessor', function() {
    assertEqual('object', typeof synErr.column);
  });
});
