from os import popen

srcdir = '.'
blddir = 'build'
VERSION = '0.0.1'

def set_options(opt):
  opt.tool_options('compiler_cxx')

def configure(conf):
  conf.check_tool('compiler_cxx')
  conf.check_tool('node_addon')

  conf.env.append_value("LIB_XML2", "xml2")
  xml2_config = conf.find_program('xml2-config', var='XML2_CONFIG', mandatory=True)
  xml2_includedir = popen("%s --cflags" % xml2_config).readline().strip()
  conf.env.append_value("CPPPATH_XML2", [i.strip() for i in xml2_includedir.split('-I') if len(i) > 0])


def build(bld):
  obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
  obj.cxxflags = ["-O3", "-g", "-Wall", "-Werror"]
  obj.target = 'libxmljs'
  obj.source = [
    'src/libxmljs.cc',
    'src/xml_attribute.cc',
    'src/xml_document.cc',
    'src/xml_element.cc',
    'src/xml_namespace.cc',
    'src/xml_node.cc',
    'src/xml_sax_parser.cc',
    'src/xml_syntax_error.cc',
    'src/xml_xpath_context.cc',
  ]
  obj.uselib = 'XML2'

