# Libxmljs

LibXML bindings for  [node.js](http://nodejs.org/)

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

There are two main ways to use the builder. The first:

    var doc = new libxml.Document(function(n) {
      n.node('root', function(n) {
        n.node('child', {foo: 'bar'}, function(n) {
          n.node('grandchild', {baz: 'fizbuzz'}, 'grandchild content');
        });
        n.node('sibling', 'with content!');
      });
    });

Calling doc.toString() will yield the following XML:

    <?xml version="1.0" encoding="UTF-8"?>
    <root>
        <child foo="bar">
            <grandchild baz="fizbuzz">grandchild content</grandchild>
        </child>
        <sibling>with content!</sibling>
    </root>

The other way is through chaining (indentation is meant to represent location in the tree):

    var doc = new libxml.Document();
      doc.node('root')
        .node('child', {foo: 'bar'})
          .node('grandchild', {baz: 'fizbuzz'}, 'grandchild content')
        .parent()
      .parent()
        .node('sibling', 'with content!');

This will yield the same results.

### Parsing

By file:

    var doc = libxml.parseXmlFile([filename]);

By String:

    var doc = libxml.parseXmlString([xmlString]);

#### SAX Parsing

Callbacks for SAX are created during the instantiation of the parser object. You can omit any callback you're not interested in. Below is just a list of callbacks currently supported with the arguments they'll be sent.

    var parser = new libxml.SaxParser(function(cb) {
      cb.onStartDocument(function() {});
      cb.onEndDocument(function() {});
      cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {});
      cb.onEndElementNS(function(elem, prefix, uri) {});
      cb.onCharacters(function(chars) {});
      cb.onCdata(function(cdata) {});
      cb.onComment(function(msg) {});
      cb.onWarning(function(msg) {});
      cb.onError(function(msg) {});
    });

    // Parse a string:
    parser.parseString([xmlString]);

    // Parse a file:
    parser.parseFile([filename]);

#### SAX Push Parsing

Push parsers are created the same way DOM parsers are, but take input a chunk at a time:

    var parser = new libxml.SaxPushParser(function(cb) {
      cb.onStartDocument(function() {});
      cb.onEndDocument(function() {});
      cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {});
      cb.onEndElementNS(function(elem, prefix, uri) {});
      cb.onCharacters(function(chars) {});
      cb.onCdata(function(cdata) {});
      cb.onComment(function(msg) {});
      cb.onWarning(function(msg) {});
      cb.onError(function(msg) {});
    });

    while(xmlChunk)
      parser.push(xmlChunk);

[Here's a more complex example](https://gist.github.com/484083)


## Basics

* GitHub Repo - [http://github.com/polotek/libxmljs](http://github.com/polotek/libxmljs)
* Docs - [http://github.com/polotek/libxmljs/wiki](http://github.com/polotek/libxmljs/wiki)
* Mailing list - [http://groups.google.com/group/libxmljs](http://groups.google.com/group/libxmljs)

## Requirements

* [libxml2](http://www.xmlsoft.org/)
* [node.js](http://nodejs.org/)
* v8 (comes bundled with node, no need to install)
* [scons](http://www.scons.org/) (for building)

**pre-conditions**

You will need have the libxml2 library installed and also the libxml2-devel
package. This comes with the `xml2-config` utility that is needed for
compiling.  **This command must be in your path.**

The `scons` command is used for building and must also be in your path.

## Installation

To build the addon, the libxml C library must be installed and the xml2-config helper script must be on your path.

**npm**
    npm install libxmljs

**source**

In the root of the source directory, just run `make`.  This will
generate the binary `libxmljs.node` in the root of the source folder.
You can copy this file to `~/.node_libraries` or any other directory
in your require path.

**tests**

    make test
  
    make test-verbose
