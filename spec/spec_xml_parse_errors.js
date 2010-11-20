with(require('./helpers')) {

describe('Parse error object', function() {
  var synErr = null;
  
  beforeEach(function() {
    synErr = new libxml.SyntaxError();
  });

  var accessors = [
    'domain',
    'code',
    'level',
    'file',
    'line',
    'str1',
    'str2',
    'str3',
    'int1',
    'column'
  ];

  for (var i = 0; i < accessors.length; ++i) {
    var accessor = accessors[i];
    it('has a '+accessor+' accessor', function() {
      assert.equal('object', typeof synErr[accessor]);
    });
  }
});

}
