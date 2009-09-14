#! /usr/bin/env python

import sys
import js2c

js2c.JS2C(sys.argv[2:], [sys.argv[1]])
