# libxmljs

[![npm version](https://badge.fury.io/js/libxmljs.svg)](https://badge.fury.io/js/libxmljs)
[![Test & Upload](https://github.com/libxmljs/libxmljs/actions/workflows/test-deploy.yml/badge.svg)](https://github.com/libxmljs/libxmljs/actions/workflows/test-deploy.yml)

`npm install libxmljs`

Native NodeJS bindings for [libxml2](https://en.wikipedia.org/wiki/Libxml2) written in [Typescript](https://www.typescriptlang.org/)

```javascript
var libxmljs = require("libxmljs");
var xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    "<root>" +
    '<child foo="bar">' +
    '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
    "</child>" +
    "<sibling>with content!</sibling>" +
    "</root>";

var xmlDoc = libxmljs.parseXml(xml);

// xpath queries
var gchild = xmlDoc.get("//grandchild");

console.log(gchild.text()); // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr("foo").value()); // prints "bar"
```

## Docs

[https://libxmljs.github.io/libxmljs/](https://libxmljs.github.io/libxmljs/)
