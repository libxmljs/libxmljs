# Libxmljs

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
    var gchild = xmlDoc.get('//grandchild');

    console.log(gchild.text());  // prints "grandchild content"

    var children = xmlDoc.root().childNodes();
    var child = children[0];

    console.log(child.attr('foo').value()); // prints "bar"

## Basics

* GitHub Repo - [http://github.com/polotek/libxmljs](http://github.com/polotek/libxmljs)
* Docs - [http://github.com/polotek/libxmljs/wiki](http://github.com/polotek/libxmljs/wiki)
* Mailing list - [http://groups.google.com/group/libxmljs](http://groups.google.com/group/libxmljs)

## API

Some examples below or check out the wiki [http://github.com/polotek/libxmljs/wiki](http://github.com/polotek/libxmljs/wiki)

## Requirements

* libxml
* node.js
* v8 (comes bundled with node, no need to install)
* [scons](http://www.scons.org/) (for building)

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
