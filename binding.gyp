{
    'targets': [
        {
            'target_name': 'xmljs',
            'product_extension': 'node',
            'type': 'shared_library',
            'include_dirs': [
                'src/include',
                'vendor/libxml2',
                'vendor/libxml2/include',
                'vendor/libxml2/include/libxml',
                'vendor/libxml2.config',
                'vendor/libxml2.config/include',
                "<!(node -e \"require('nan')\")"
            ],
            'cflags': ['-Wall -Wno-unused-result -O3'],
            'xcode_settings': {
                'OTHER_CFLAGS': ['-Wall -Wno-unused-result -O3']
            },
            'defines': [
                'BUILDING_NODE_EXTENSION',
                'IN_LIBXMLJS',
                '_REENTRANT',
            ],
            'sources': [
                'src/xml_sax_parser.cc',
                'src/libxml2.cc',
                'vendor/libxml2/buf.c',
                'vendor/libxml2/catalog.c',
                'vendor/libxml2/chvalid.c',
                'vendor/libxml2/dict.c',
                'vendor/libxml2/encoding.c',
                'vendor/libxml2/entities.c',
                'vendor/libxml2/error.c',
                'vendor/libxml2/globals.c',
                'vendor/libxml2/hash.c',
                'vendor/libxml2/HTMLparser.c',
                'vendor/libxml2/HTMLtree.c',
                'vendor/libxml2/legacy.c',
                'vendor/libxml2/list.c',
                'vendor/libxml2/parser.c',
                'vendor/libxml2/parserInternals.c',
                'vendor/libxml2/pattern.c',
                'vendor/libxml2/relaxng.c',
                'vendor/libxml2/SAX2.c',
                'vendor/libxml2/SAX.c',
                'vendor/libxml2/tree.c',
                'vendor/libxml2/threads.c',
                'vendor/libxml2/uri.c',
                'vendor/libxml2/valid.c',
                'vendor/libxml2/xinclude.c',
                'vendor/libxml2/xlink.c',
                'vendor/libxml2/xmlIO.c',
                'vendor/libxml2/xmlmemory.c',
                'vendor/libxml2/xmlmodule.c',
                'vendor/libxml2/xmlreader.c',
                'vendor/libxml2/xmlregexp.c',
                'vendor/libxml2/xmlsave.c',
                'vendor/libxml2/xmlschemas.c',
                'vendor/libxml2/xmlschemastypes.c',
                'vendor/libxml2/xmlstring.c',
                'vendor/libxml2/xmlunicode.c',
                'vendor/libxml2/xmlwriter.c',
                'vendor/libxml2/xpath.c',
                'vendor/libxml2/xpointer.c'
            ],
            'conditions': [
                ['OS=="mac"', {
                    # node-gyp 2.x doesn't add this anymore
                    # https://github.com/TooTallNate/node-gyp/pull/612
                    'xcode_settings': {
                        'CLANG_CXX_LANGUAGE_STANDARD': 'c++17',
                        'OTHER_LDFLAGS': [
                            '-undefined dynamic_lookup'
                        ],
                    },
                }],
                ['OS=="win"', {
                    'defines': [
                        'HAVE_WIN32_THREADS',
                    ],
                }, {
                    'defines': [
                        'HAVE_LIBPTHREAD',
                        'HAVE_PTHREAD_H',
                        'HAVE_UNISTD_H',
                        'HAVE_RAND_R',
                        'BUILDING_NODE_EXTENSION',
                    ],
                }]
            ],
        }
    ]
}
