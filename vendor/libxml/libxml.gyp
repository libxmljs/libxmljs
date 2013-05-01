{
  'targets': [
    {
      'target_name': 'libxml',
      'type': 'static_library',
      'sources': [
        'buf.c',
        'catalog.c',
        'chvalid.c',
        'dict.c',
        'encoding.c',
        'entities.c',
        'error.c',
        'globals.c',
        'hash.c',
        'HTMLparser.c',
        'HTMLtree.c',
        'legacy.c',
        'list.c',
        'parser.c',
        'parserInternals.c',
        'pattern.c',
        'relaxng.c',
        'SAX2.c',
        'SAX.c',
        'tree.c',
        'threads.c',
        'uri.c',
        'valid.c',
        'xinclude.c',
        'xlink.c',
        'xmlIO.c',
        'xmlmemory.c',
        'xmlmodule.c',
        'xmlreader.c',
        'xmlregexp.c',
        'xmlsave.c',
        'xmlschemas.c',
        'xmlschemastypes.c',
        'xmlstring.c',
        'xmlunicode.c',
        'xmlwriter.c',
        'xpath.c',
        'xpointer.c'
      ],
      'include_dirs': [
        'include/',
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          'include/',
        ],
      },
    }
  ]
}
