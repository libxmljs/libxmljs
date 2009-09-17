import sys
import os
import subprocess
from os.path import join, dirname, abspath
from types import DictType, StringTypes
root_dir = dirname(File('SConstruct').rfile().abspath)
sys.path.append(join(root_dir, 'tools'))
import js2c

if ARGUMENTS.get('debug', 0):
  node_exe ='node_g'
else:
  node_exe ='node'

def shellOut(target):
  return subprocess.Popen(target, stdout=subprocess.PIPE).communicate()[0].strip()

def CheckForNodeJS(context):
  context.Message('Checking for node.js ...')
  result = shellOut(['which', node_exe]) != ''
  context.Result(result)
  return result

testBuilder = Builder(action = 'node spec/tacular.js')

env = Environment(BUILDERS = {'Test' : testBuilder})
if not env.GetOption('clean'):
  conf = Configure(env, custom_tests = {'CheckForNodeJS' : CheckForNodeJS})
  print conf.CheckForNodeJS()
  if not conf.CheckLibWithHeader('xml2', 'libxml/parser.h', 'c++'):
    print 'Did not find libxml2, exiting!'
    Exit(1)
  if not conf.CheckLibWithHeader('v8', 'v8.h', 'c++'):
    print 'Did not find libv8, exiting!'
    Exit(1)
  if (('libxmljs.node' in COMMAND_LINE_TARGETS) or ('test' in COMMAND_LINE_TARGETS)) and not conf.CheckForNodeJS():
    print 'Did not find node.js exiting!'
    Exit(1)
  env = conf.Finish()

# Build native js
js2c.JS2C(Glob('src/*.js'), ['src/natives.h'])

libs = ['xml2', 'v8']
cc_sources = Glob('src/*.cc')

# Build libxmljs binary
libxmljs = env.Program(
  target = 'libxmljs',
  source = cc_sources,
  LIBS = libs
)

# Build libxmljs node plugin
if env['PLATFORM'] == 'darwin':
  env.Append(LDMODULEFLAGS = ['-bundle_loader', shellOut(['which', 'node'])])

node = env.LoadableModule(
  target = 'libxmljs.node',
  source = cc_sources,
  CCFLAGS = shellOut([node_exe, '--cflags']),
  LIBS = libs
)

# Run tests
tests = env.Test('test', 'libxmljs.node')

env.Default(libxmljs)
