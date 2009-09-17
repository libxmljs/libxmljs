include('helpers.js');

describe('An element node', function() {
  var doc = null;
  beforeEach(function() {
    doc = new libxml.Document();
  });

  it('can be created', function() {    
    var node = doc.node('name1');
    assertEqual('name1', node.name);
  });

  it('can be created with a callback', function() {    
    var node = false;
    doc.node('name2', function(n) { node = n; });
    assertEqual('name2', node.name);
  });

  it('can be created as the document root', function() {
    var node = doc.node('name');
    assertEqual(node, doc.root);
  });
});
// 
// describe('A node attribute', function() {
//   var node = null;
//   beforeEach(function() {
//     var doc = new libxml.Document();
//     node = doc.node('name');
//   });
// 
//   it('can be read', function() {
//     // reading a node is implied during all tests
//     node.attr('to', 'wongfoo');
//     assertEqual('wongfoo', node.attr('to'));
//   });
// 
//   it('can be assigned on creation', function() {
//     var node = doc.node('name', {to: 'wongfoo'});
//     assertEqual('wongfoo', node.attr('to'));
//   });
// 
//   it('can be assigned with helpers', function() {
//     node.attr('to', 'wongfoo');
//     assertEqual('wongfoo', node.attr('to'));
//   });
// 
//   it('can be assigned with an object', function() {
//     node.attr({to: 'wongfoo'});
//     assertEqual('wongfoo', node.attr('to'));
//   });
// });
