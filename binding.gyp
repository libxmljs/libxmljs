{
  'targets': [
    {
      'target_name': 'xmljs',
      'product_extension': 'node',
      'type': 'shared_library',
      'include_dirs': ["<!(node -e \"require('nan')\")"],
      'sources': [
        'src/libxmljs.cc',
        'src/xml_attribute.cc',
        'src/xml_document.cc',
        'src/xml_element.cc',
        'src/xml_comment.cc',
        'src/xml_namespace.cc',
        'src/xml_node.cc',
        'src/xml_sax_parser.cc',
        'src/xml_syntax_error.cc',
        'src/xml_xpath_context.cc',
      ],
      'dependencies': [
        './vendor/libxml/libxml.gyp:libxml'
      ],
      'defines': ['LIBXML_XINCLUDE_ENABLED']
    }
  ]
}
