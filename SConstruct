import sys
import os
import re
import subprocess
from os.path import join, dirname, abspath
from types import DictType, StringTypes
root_dir = dirname(File('SConstruct').rfile().abspath)
# prefer these tools to anything living in the system already.
sys.path.insert(0, join(root_dir, 'tools'))
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

def CheckVersion(a,b):
    from pkg_resources import parse_version as V
    return V(a) >= V(b)

def GetLibXml2cflags():
    minxml2version = '2.7.1'
    if CheckVersion(shellOut(['xml2-config', '--version']), minxml2version):
        return shellOut(['xml2-config', '--cflags'])
    elif os.path.isfile('/opt/local/bin/xml2-config') and CheckVersion(shellOut(['/opt/local/bin/xml2-config', '--version']), minxml2versio$
        return shellOut(['/opt/local/bin/xml2-config', '--cflags'])
    else:
        print 'Your version of libxml2 is too old, exiting.'
        Exit(1);

using_node_js = (('libxmljs.node' in COMMAND_LINE_TARGETS) or ('test' in COMMAND_LINE_TARGETS))

libs = ['xml2']
libpath = [
  '/opt/local/lib',
  '/usr/local/lib',
  '/usr/lib'
]

#cflags = ' '.join([
#  '-I/opt/local/include',
#  '-I/opt/local/include/libxml2',
#  '-I/usr/local/include',
#  '-I/usr/include',
#  '-I/usr/include/libxml2',
#])
cflags = GetLibXml2cflags()

if using_node_js:
  node_flags = shellOut([node_exe, '--vars'])
  node_flags = re.search(r'^NODE_CFLAGS:\s*(.*)$', node_flags, re.MULTILINE)

  if node_flags:
    cflags += ' ' + node_flags.group(1)

testBuilder = Builder(action = 'node spec/tacular.js')

env = Environment(BUILDERS = {'Test' : testBuilder})
env.Append(
  LIBPATH = libpath,
  CCFLAGS = cflags
)

# explicitly link against node under cygwin
if env['PLATFORM'] == 'cygwin':
	libs += ['node']

if not env.GetOption('clean'):
  conf = Configure(env, custom_tests = {'CheckForNodeJS' : CheckForNodeJS})
  print conf.CheckForNodeJS()
  if not conf.CheckLib('xml2', header = '#include <libxml/parser.h>', language = 'c++'):
    print 'Did not find libxml2, exiting!'
    Exit(1)
  if not using_node_js and not conf.CheckLib('v8', header = '#include <v8.h>', language = 'c++'):
    print 'Did not find libv8, exiting!'
    Exit(1)
  if using_node_js and not conf.CheckForNodeJS():
    print 'Did not find node.js exiting!'
    Exit(1)
  env = conf.Finish()

# Build native js
js2c.JS2C(Glob('src/*.js'), ['src/natives.h'])

cc_sources = Glob('src/*.cc')

# Build libxmljs binary
libxmljs = env.Program(
  target = 'libxmljs',
  source = cc_sources,
  CCFLAGS = cflags,
  LIBS = libs,
  LIBPATH = libpath
)

# Build libxmljs node plugin
if env['PLATFORM'] == 'darwin':
  env.Append(LDMODULEFLAGS = ['-bundle_loader', shellOut(['which', 'node'])])

node = env.LoadableModule(
  target = 'libxmljs.node',
  source = cc_sources,
  CCFLAGS = cflags,
  LIBS = libs,
  LIBPATH = libpath
)

# Run tests
tests = env.Test('test', 'libxmljs.node')

env.Default(libxmljs)
