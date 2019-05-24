# Libxmljs2

[![Build Status](https://secure.travis-ci.org/marudor/libxmljs2.svg?branch=master)](http://travis-ci.org/marudor/libxmljs2)

[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/vlefa3ucskt8avb8?svg=true)](https://ci.appveyor.com/project/marudor/libxmljs2/branch/master)

![Gitlab build Status](https://gitlab.com/marudor/libxmljs2/badges/master/pipeline.svg)

LibXML bindings for [node.js](http://nodejs.org/)

```javascript
var libxmljs = require('libxmljs2');
var xml =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<root>' +
  '<child foo="bar">' +
  '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
  '</child>' +
  '<sibling>with content!</sibling>' +
  '</root>';

var xmlDoc = libxmljs.parseXml(xml);

// xpath queries
var gchild = xmlDoc.get('//grandchild');

console.log(gchild.text()); // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr('foo').value()); // prints "bar"
```

## Support

- Docs - [http://github.com/marudor/libxmljs2/wiki](http://github.com/marudor/libxmljs2/wiki)
  <!-- * Mailing list - [http://groups.google.com/group/libxmljs](http://groups.google.com/group/libxmljs) -->

## API and Examples

Check out the wiki [http://github.com/marudor/libxmljs2/wiki](http://github.com/libxmljs/libxmljs2/wiki).

See the [examples](https://github.com/marudor/libxmljs2/tree/master/examples) folder.

## Installation via [npm](https://npmjs.org)

```shell
npm install libxmljs2
```

## Contribute

Start by checking out the [open issues](https://github.com/marudor/libxmljs2/issues?labels=&page=1&state=open). Specifically the [desired feature](https://github.com/marudor/libxmljs2/issues?labels=desired+feature&page=1&state=open) ones.

### Requirements

Make sure you have met the requirements for [node-gyp](https://github.com/TooTallNate/node-gyp#installation). You DO NOT need to manually install node-gyp; it comes bundled with node.
