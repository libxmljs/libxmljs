{
  'targets': [
    {
      'target_name': 'xmljs',
      'product_extension': 'node',
      'type': 'shared_library',
      'include_dirs': ["<!(node -e \"require('nan')\")"],
      'cflags': [ '-Wall', '-Werror' ],
      "xcode_settings": {
        "OTHER_CFLAGS": [ "-Wall", "-Werror" ]
      },
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
        'src/xml_text.cc',
        'src/xml_xpath_context.cc',
      ],
      'dependencies': [
        './vendor/libxml/libxml.gyp:libxml'
      ],
      'conditions': [
        ['OS=="mac"', {
          # node-gyp 2.x doesn't add this anymore
          # https://github.com/TooTallNate/node-gyp/pull/612
          'xcode_settings': {
            'OTHER_LDFLAGS': [
              '-undefined dynamic_lookup'
            ],
          },
        }]
      ]
    }
  ]
}
