with(require('./helpers')) {

describe('A node attribute', function() {
  it('can be read', function() {
    // reading a node is implied during all tests
    var doc = new libxml.Document();
    elem = doc.node('name');
    new libxml.Attribute(elem, 'to', 'wongfoo');
    assertEqual('wongfoo', elem.attr('to').value());
  });

  it('will return null when an attr is not found', function() {
    var doc = new libxml.Document();
    elem = doc.node('name');
    assertEqual(null, elem.attr('to'));
  });

  it('can be assigned on creation', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name', {to: 'wongfoo'});
    assertEqual('wongfoo', elem.attr('to').value());
  });

  it('can be assigned with an object', function() {
    var doc = new libxml.Document();
    elem = doc.node('name');
    elem.attr({to: 'wongfoo'});
    assertEqual('wongfoo', elem.attr('to').value());
  });

  it('can be reassigned', function() {
    var doc = new libxml.Document();
    var elem = doc.node('name', {to: 'wongfoo'});
    assertEqual('wongfoo', elem.attr('to').value());
    elem.attr({to: 'julie newmar'});
    assertEqual('julie newmar', elem.attr('to').value());
  });

  it('can be retrieved in an array', function() {
    var doc = new libxml.Document();
    var elem = doc.node('root');

    assertEqual([], elem.attrs());

    elem.attr({foo: 'bar'})
        .attr({bar: 'baz'})
        .attr({baz: 'foo'});

    var attrs = [elem.attr('foo'), elem.attr('bar'), elem.attr('baz')];
    var i;
    for (i = 0; i < 3; i++)
      assertEqual(attrs[i], elem.attrs()[i]);
  });

  it('can traverse over its siblings', function() {
    var doc = new libxml.Document();
    var elem = doc.node('root')
                    .attr({foo: 'bar'})
                    .attr({bar: 'baz'})
                    .attr({baz: 'foo'});
    assertEqual(elem.attr('baz'), elem.attr('bar').nextSibling());
    assertEqual(elem.attr('foo'), elem.attr('bar').prevSibling());
    assertEqual(null, elem.attr('foo').prevSibling());
    assertEqual(null, elem.attr('baz').nextSibling());
  });

  it('can get back to its node', function() {
    var doc = new libxml.Document();
    var elem = doc.node('root')
                  .attr({foo: 'bar'});
    assertEqual(elem, elem.attr('foo').parent());
  });

  it('can get back to its document', function() {
    var doc = new libxml.Document();
    var elem = doc.node('root')
                  .attr({foo: 'bar'});
    assertEqual(doc, elem.attr('foo').doc());
  });
});

}
