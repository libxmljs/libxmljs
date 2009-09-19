include('helpers.js');

describe('Parsing a string', function() {
  it('can be done', function() {
    var doc = libxml.parseString(
      '<?xml version="1.0" encoding="UTF-8"?> \
      <root> \
        <child to="wongfoo"> \
          <grandchild from="julie numar">with love</grandchild> \
        </child> \
        <sibling>with content!</sibling> \
      </root>'
    );
    assertEqual('1.0', doc.version);
    assertEqual('UTF-8', doc.encoding());
    assertEqual('root', doc.root().name());
    assertEqual('child', doc.get('child').name());
    assertEqual('grandchild', doc.get('child').get('grandchild').name());
    assertEqual('with love', doc.get('child/grandchild').text());
    assertEqual('sibling', doc.get('sibling').name());
    assertEqual('with content!', doc.get('sibling').text());
  });
});
