# Libxmljs

LibXML bindings for  [node.js](http://nodejs.org/)

```javascript
var libxmljs = require("libxmljs");
var xml =  '<?xml version="1.0" encoding="UTF-8"?>' +
           '<root>' +
               '<child foo="bar">' +
                   '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
               '</child>' +
               '<sibling>with content!</sibling>' +
           '</root>';

var xmlDoc = libxmljs.parseXmlString(xml);

// xpath queries
var gchild = xmlDoc.get('//grandchild');

console.log(gchild.text());  // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr('foo').value()); // prints "bar"
```

## API

* [[Libxmljs]]
* [[XmlDocument]]
* [[Element]]
* [[Attribute]]
* [[Namespace]]
* [[HtmlDocument]]
* [[Parser]]
* [[SaxParser]]
* [[SaxPushParser]]
* [[SyntaxError]]

Check out some examples on parsing and building xml documents below.

### Builder

To build an XML document simply create all the required nodes (indentation is meant to represent location in the tree, you can capture any intermediate variable to reuse):

```javascript
var doc = new libxml.Document();
  doc.node('root')
    .node('child').attr({foo: 'bar'})
      .node('grandchild', 'grandchild content').attr({baz: 'fizbuzz'})
    .parent()
  .parent()
    .node('sibling', 'with content!');
```

Calling doc.toString() will yield the following XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
    <child foo="bar">
        <grandchild baz="fizbuzz">grandchild content</grandchild>
    </child>
    <sibling>with content!</sibling>
</root>
```

### Parsing

```javascript
var doc = libxml.parseXmlString([xmlString]);
```

#### SAX Parsing

SAX parsing objects are event emitters and callbacks can be connected in typical node.js fashion.

```javascript
var parser = new libxml.SaxParser();

parser.on('startDocument', ...);
parser.on('startElement', ...);
```

There is also a shorthand syntax for adding event callbacks during parser creation.

```javascript
var parser = new libxml.SaxParser({
  startDocument: function() {...},
  endDocument: function() {...},
  startElementNS: function(elem, attrs, prefix, uri, namespaces) {...},
});

// parse a string
parser.parseString([xmlString]);
```

#### SAX Push Parsing

Push parsers are created the same way DOM parsers are, but take input a chunk at a time:

```javascript
var parser = new libxml.SaxPushParser();

// connect any callbacks here

while(xmlChunk) {
  parser.push(xmlChunk);
}
```
