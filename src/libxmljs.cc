// Copyright 2009, Squish Tech, LLC.

#include <v8.h>

#include "libxmljs.h"
#include "xml_syntax_error.h"
#include "xml_document.h"
#include "xml_node.h"
#include "xml_parser.h"
#include "html_parser.h"

namespace libxmljs {

// ensure destruction at exit time
// v8 doesn't cleanup its resources
LibXMLJS LibXMLJS::instance;

// track how much memory libxml2 is using
int xml_memory_used = 0;

// wrapper for xmlMemMalloc to update v8's knowledge of memory used
// the GC relies on this information
void* xmlMemMallocWrap(size_t size) {
    void* res = xmlMemMalloc(size);

    // no need to udpate memory if we didn't allocate
    if (!res) {
        return res;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
    return res;
}

// wrapper for xmlMemFree to update v8's knowledge of memory used
// the GC relies on this information
void xmlMemFreeWrap(void* p) {
    xmlMemFree(p);

    // if v8 is no longer running, don't try to adjust memory
    // this happens when the v8 vm is shutdown and the program is exiting
    // our cleanup routines for libxml will be called (freeing memory)
    // but v8 is already offline and does not need to be informed
    // trying to adjust after shutdown will result in a fatal error
    if (v8::V8::IsDead()) {
        return;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
}

LibXMLJS::LibXMLJS() {

    // populated debugMemSize (see xmlmemory.h/c) and makes the call to
    // xmlMemUsed work, this must happen first!
    xmlMemSetup(xmlMemFreeWrap, xmlMemMallocWrap, xmlMemRealloc, xmlMemoryStrdup);

    // initialize libxml
    LIBXML_TEST_VERSION;

    // initial memory usage
    xml_memory_used = xmlMemUsed();
}

LibXMLJS::~LibXMLJS() {
    xmlCleanupParser();
}

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
