// Copyright 2009, Squish Tech, LLC.

#include <v8.h>

#include <libxml/xmlmemory.h>

#include "libxmljs.h"
#include "xml_document.h"
#include "xml_node.h"
#include "xml_sax_parser.h"

namespace libxmljs {

// ensure destruction at exit time
// v8 doesn't cleanup its resources
LibXMLJS LibXMLJS::instance;

// track how much memory libxml2 is using
int xml_memory_used = 0;

// wrapper for xmlMemMalloc to update v8's knowledge of memory used
// the GC relies on this information
void* xmlMemMallocWrap(size_t size)
{
    void* res = xmlMemMalloc(size);

    // no need to udpate memory if we didn't allocate
    if (!res)
    {
        return res;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
    return res;
}

// wrapper for xmlMemFree to update v8's knowledge of memory used
// the GC relies on this information
void xmlMemFreeWrap(void* p)
{
    xmlMemFree(p);

    // if v8 is no longer running, don't try to adjust memory
    // this happens when the v8 vm is shutdown and the program is exiting
    // our cleanup routines for libxml will be called (freeing memory)
    // but v8 is already offline and does not need to be informed
    // trying to adjust after shutdown will result in a fatal error
    if (v8::V8::IsDead())
    {
        return;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
}

// wrapper for xmlMemRealloc to update v8's knowledge of memory used
void* xmlMemReallocWrap(void* ptr, size_t size)
{
    void* res = xmlMemRealloc(ptr, size);

    // if realloc fails, no need to update v8 memory state
    if (!res)
    {
        return res;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
    return res;
}

// wrapper for xmlMemoryStrdupWrap to update v8's knowledge of memory used
char* xmlMemoryStrdupWrap(const char* str)
{
    char* res = xmlMemoryStrdup(str);

    // if strdup fails, no need to update v8 memory state
    if (!res)
    {
        return res;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    v8::V8::AdjustAmountOfExternalAllocatedMemory(diff);
    return res;
}

v8::Handle<v8::Value> ThrowError(const char* msg)
{
    return v8::ThrowException(v8::Exception::Error(v8::String::New(msg)));
}

LibXMLJS::LibXMLJS()
{

    // populated debugMemSize (see xmlmemory.h/c) and makes the call to
    // xmlMemUsed work, this must happen first!
    xmlMemSetup(xmlMemFreeWrap, xmlMemMallocWrap,
            xmlMemReallocWrap, xmlMemoryStrdupWrap);

    // initialize libxml
    LIBXML_TEST_VERSION;

    // initial memory usage
    xml_memory_used = xmlMemUsed();
}

LibXMLJS::~LibXMLJS()
{
    xmlCleanupParser();
}

// used by node.js to initialize libraries
extern "C" void
init(v8::Handle<v8::Object> target)
{
      v8::HandleScope scope;

      XmlDocument::Initialize(target);
      XmlSaxParser::Initialize(target);

      target->Set(v8::String::NewSymbol("libxml_version"),
                  v8::String::New(LIBXML_DOTTED_VERSION));

      target->Set(v8::String::NewSymbol("libxml_parser_version"),
                  v8::String::New(xmlParserVersion));

      target->Set(v8::String::NewSymbol("libxml_debug_enabled"),
                  v8::Boolean::New(debugging));

      target->Set(v8::String::NewSymbol("libxml"), target);
}

NODE_MODULE(xmljs, init)

}  // namespace libxmljs
