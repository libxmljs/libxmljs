// Copyright 2009, Squish Tech, LLC.

#include <iostream>
#include <cstdlib>

#include "libxmljs.h"
#include "xml_syntax_error.h"
#include "xml_document.h"
#include "xml_node.h"
#include "xml_parser.h"
#include "html_parser.h"

namespace libxmljs {

LibXMLJS::LibXMLJS() {
    // initialize libxml
    LIBXML_TEST_VERSION
}

LibXMLJS::~LibXMLJS() {
    xmlCleanupParser();
}

LibXMLJS LibXMLJS::init_;

// used by node.js to initialize libraries
extern "C" void
init(v8::Handle<v8::Object> target) {
      v8::HandleScope scope;

      XmlSyntaxError::Initialize(target);
      XmlDocument::Initialize(target);
      XmlParser::Initialize(target);
      HtmlParser::Initialize(target);

      target->Set(v8::String::NewSymbol("version"),
                  v8::String::New(LIBXMLJS_VERSION));

      target->Set(v8::String::NewSymbol("libxml_version"),
                  v8::String::New(LIBXML_DOTTED_VERSION));

      target->Set(v8::String::NewSymbol("libxml_parser_version"),
                  v8::String::New(xmlParserVersion));

      target->Set(v8::String::NewSymbol("libxml_debug_enabled"),
                  v8::Boolean::New(debugging));

      target->Set(v8::String::NewSymbol("libxml"), target);
}

}  // namespace libxmljs
