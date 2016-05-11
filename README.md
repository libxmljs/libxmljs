# Libxmljs
[![Build Status](https://secure.travis-ci.org/libxmljs/libxmljs.svg?branch=master)](http://travis-ci.org/libxmljs/libxmljs)

[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/cf862a98w7qsajpl/branch/master?svg=true)](https://ci.appveyor.com/project/rchipka/libxmljs/branch/master)

LibXML bindings for [node.js](http://nodejs.org/)

```javascript
var libxmljs = require("libxmljs");
var xml =  '<?xml version="1.0" encoding="UTF-8"?>' +
           '<root>' +
               '<child foo="bar">' +
                   '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
               '</child>' +
               '<sibling>with content!</sibling>' +
           '</root>';

var xmlDoc = libxmljs.parseXml(xml);

// xpath queries
var gchild = xmlDoc.get('//grandchild');

console.log(gchild.text());  // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr('foo').value()); // prints "bar"
```

## Support

* Docs - [http://github.com/libxmljs/libxmljs/wiki](http://github.com/libxmljs/libxmljs/wiki)
* Mailing list - [http://groups.google.com/group/libxmljs](http://groups.google.com/group/libxmljs)

## API and Examples

Check out the wiki [http://github.com/libxmljs/libxmljs/wiki](http://github.com/libxmljs/libxmljs/wiki).

See the [examples](https://github.com/libxmljs/libxmljs/tree/master/examples) folder.

## Installation via [npm](https://npmjs.org)

```shell
npm install libxmljs
```

## Contribute

Start by checking out the [open issues](https://github.com/libxmljs/libxmljs/issues?labels=&page=1&state=open). Specifically the [desired feature](https://github.com/libxmljs/libxmljs/issues?labels=desired+feature&page=1&state=open) ones.

### Requirements

Make sure you have met the requirements for [node-gyp](https://github.com/TooTallNate/node-gyp#installation). You DO NOT need to manually install node-gyp; it comes bundled with node.
