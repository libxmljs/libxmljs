# libxmljs

[![npm version](https://badge.fury.io/js/libxmljs.svg)](https://badge.fury.io/js/libxmljs)
[![Test & Upload](https://github.com/libxmljs/libxmljs/actions/workflows/test-deploy.yml/badge.svg)](https://github.com/libxmljs/libxmljs/actions/workflows/test-deploy.yml)

`npm install libxmljs`

Native NodeJS bindings for [libxml2](https://en.wikipedia.org/wiki/Libxml2) written in [Typescript](https://www.typescriptlang.org/)

## API Docs

[https://libxmljs.github.io/libxmljs/](https://libxmljs.github.io/libxmljs/)

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

## Package Scripts

`npm run init-submodules`

> Clones libxml2 source code to `vendor/libxml2`

`npm run configure`

> Generate new cmake config headers with cmake in vendor/libxml2.config.
> Used when updating to a new libxml2 version.

`npm run build`

> Build the C++ source code using node-gyp

`npm run swig`

> Generate a new `src/libxml2.cc` and `swig.xml` file by processing the native code using SWIG.
> Used when making changes to native code or any of the SWIG interface files (src/*.i)

`npm run tsgenerate`

> Generates typescript definitons for native bindings exports.
> Used when changes are made to native exports.
> Auto-generates `constants.ts`, `functions.ts`, `types.ts`, and `variables.ts` within `lib/bindings/`

`npm run tsc`

> Compiles Typescript within `lib/` and outputs it to `dist/`
> Use `npm run dev` to put Typescript compiler into watch mode.

`npm run test`

> Runs all tests in `test/` using nodeunit.
> Use `npm run test -- -t TEST_NAME` to run a specific test.

`npm run docs`

> Generates `docs/` using Typedoc

