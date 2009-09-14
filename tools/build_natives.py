#! /usr/bin/env python

import sys
import js2c

source = [
  sys.argv[0],
]

js2c.JS2C(source, [sys.argv[1]])
