#! /usr/bin/env python

import js2c

source = [
  "sax_parser.js",
]

js2c.JS2C(source, ["natives.h"])
