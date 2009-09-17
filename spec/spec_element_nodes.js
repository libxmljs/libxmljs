include('helpers.js');

describe('An element node', function() {
  var doc = null;
  beforeEach(function() {
    doc = new libxml.Document();
  });

  it('can be created', function() {
    var elem = doc.node('name1');
    assertEqual('name1', elem.name);
  });

  it('can be created with a callback', function() {
    var elem = false;
    doc.node('name2', function(n) { elem = n; });
    assertEqual('name2', elem.name);
  });

  it('can be created as the document root', function() {
    var elem = doc.node('name');
    assertEqual(elem, doc.root);
  });
});

describe('A node attribute', function() {
  var doc = null;

  beforeEach(function() {
    doc = new libxml.Document();
  });

  it('can be read', function() {
    // reading a node is implied during all tests
    elem = doc.node('name');
    elem.attr('to', 'wongfoo');
    assertEqual('wongfoo', elem.attr('to'));
  });

  it('will return null when an attr is not found', function() {
    elem = doc.node('name');
    assertEqual(null, elem.attr('to'));
  });

  it('can be assigned on creation', function() {
    var elem = doc.node('name', {to: 'wongfoo'});
    assertEqual('wongfoo', elem.attr('to'));
  });

  it('can be assigned with helpers', function() {
    elem = doc.node('name');
    elem.attr('to', 'wongfoo');
    assertEqual('wongfoo', elem.attr('to'));
  });

  it('can be assigned with an object', function() {
    elem = doc.node('name');
    elem.attr({to: 'wongfoo'});
    assertEqual('wongfoo', elem.attr('to'));
  });
});
