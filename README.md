# Libxmljs
[![Build Status](https://secure.travis-ci.org/polotek/libxmljs.png)](http://travis-ci.org/polotek/libxmljs)

LibXML bindings for [node.js](http://nodejs.org/)

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

## Basics

* Docs - [http://github.com/polotek/libxmljs/wiki](http://github.com/polotek/libxmljs/wiki)
* Mailing list - [http://groups.google.com/group/libxmljs](http://groups.google.com/group/libxmljs)

## API and Examples

Check out the wiki [http://github.com/polotek/libxmljs/wiki](http://github.com/polotek/libxmljs/wiki)

## Requirements

* [libxml2](http://www.xmlsoft.org/)

You will need have the libxml2 library installed and also the libxml2-devel (libxml2-dev on debian systems)
package. This comes with the `xml2-config` utility that is needed for
compiling.  **This command must be in your path.**

## Installation

**npm**

    npm install libxmljs

**source**

To build with node waf:

    node-waf configure build

Alternatively, run `make`.

**tests**

    npm test
