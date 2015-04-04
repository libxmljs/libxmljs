{
  'targets': [
    {
      'target_name': 'libxml',
      'type': 'static_library',
      'sources': [
        'libxml/buf.c',
        'libxml/catalog.c',
        'libxml/chvalid.c',
        'libxml/dict.c',
        'libxml/encoding.c',
        'libxml/entities.c',
        'libxml/error.c',
        'libxml/globals.c',
        'libxml/hash.c',
        'libxml/HTMLparser.c',
        'libxml/HTMLtree.c',
        'libxml/legacy.c',
        'libxml/list.c',
        'libxml/parser.c',
        'libxml/parserInternals.c',
        'libxml/pattern.c',
        'libxml/relaxng.c',
        'libxml/SAX2.c',
        'libxml/SAX.c',
        'libxml/tree.c',
        'libxml/threads.c',
        'libxml/uri.c',
        'libxml/valid.c',
        'libxml/xinclude.c',
        'libxml/xlink.c',
        'libxml/xmlIO.c',
        'libxml/xmlmemory.c',
        'libxml/xmlmodule.c',
        'libxml/xmlreader.c',
        'libxml/xmlregexp.c',
        'libxml/xmlsave.c',
        'libxml/xmlschemas.c',
        'libxml/xmlschemastypes.c',
        'libxml/xmlstring.c',
        'libxml/xmlunicode.c',
        'libxml/xmlwriter.c',
        'libxml/xpath.c',
        'libxml/xpointer.c'
      ],
      'include_dirs': [
        'libxml.conf',
        'libxml.conf/include',
        'libxml/include',
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          'libxml.conf/include',
          'libxml/include',
        ],
      },
    }
  ]
}
