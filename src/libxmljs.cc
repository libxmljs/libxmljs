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
    Nan::AdjustExternalMemory(diff);
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
#if (NODE_MODULE_VERSION > 0x000B)
    if (v8::Isolate::GetCurrent() == 0)
    {
        return;
    }
#endif
    if (v8::V8::IsDead())
    {
        return;
    }

    const int diff = xmlMemUsed() - xml_memory_used;
    xml_memory_used += diff;
    Nan::AdjustExternalMemory(diff);
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
    Nan::AdjustExternalMemory(diff);
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
    Nan::AdjustExternalMemory(diff);
    return res;
}

// callback function for `xmlDeregisterNodeDefault`
void xmlDeregisterNodeCallback(xmlNode* xml_obj)
{
    if (xml_obj->_private)
    {
        XmlNode* node = static_cast<XmlNode*>(xml_obj->_private);

        // flag the XmlNode object as freed
        node->freed = true;

        // save a reference to the doc so we can still `unref` it
        node->doc = xml_obj->doc;
    }
    return;
}

LibXMLJS::LibXMLJS()
{
    // set the callback for when a node is about to be freed
    xmlDeregisterNodeDefault(xmlDeregisterNodeCallback);

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

v8::Local<v8::Object> listFeatures() {
    v8::Local<v8::Object> target = Nan::New<v8::Object>();
#define FEAT(x) Nan::Set(target, Nan::New<v8::String>(# x).ToLocalChecked(), \
                    Nan::New<v8::Boolean>(xmlHasFeature(XML_WITH_ ## x)))
    // See enum xmlFeature in parser.h
    FEAT(THREAD);
    FEAT(TREE);
    FEAT(OUTPUT);
    FEAT(PUSH);
    FEAT(READER);
    FEAT(PATTERN);
    FEAT(WRITER);
    FEAT(SAX1);
    FEAT(FTP);
    FEAT(HTTP);
    FEAT(VALID);
    FEAT(HTML);
    FEAT(LEGACY);
    FEAT(C14N);
    FEAT(CATALOG);
    FEAT(XPATH);
    FEAT(XPTR);
    FEAT(XINCLUDE);
    FEAT(ICONV);
    FEAT(ISO8859X);
    FEAT(UNICODE);
    FEAT(REGEXP);
    FEAT(AUTOMATA);
    FEAT(EXPR);
    FEAT(SCHEMAS);
    FEAT(SCHEMATRON);
    FEAT(MODULES);
    FEAT(DEBUG);
    FEAT(DEBUG_MEM);
    FEAT(DEBUG_RUN);
    FEAT(ZLIB);
    FEAT(ICU);
    FEAT(LZMA);
    return target;
}

NAN_MODULE_INIT(init)
{
      Nan::HandleScope scope;

      XmlDocument::Initialize(target);
      XmlSaxParser::Initialize(target);

      Nan::Set(target, Nan::New<v8::String>("libxml_version").ToLocalChecked(),
                  Nan::New<v8::String>(LIBXML_DOTTED_VERSION).ToLocalChecked());

      Nan::Set(target, Nan::New<v8::String>("libxml_parser_version").ToLocalChecked(),
                  Nan::New<v8::String>(xmlParserVersion).ToLocalChecked());

      Nan::Set(target, Nan::New<v8::String>("libxml_debug_enabled").ToLocalChecked(),
                  Nan::New<v8::Boolean>(debugging));

      Nan::Set(target, Nan::New<v8::String>("features").ToLocalChecked(), listFeatures());

      Nan::Set(target, Nan::New<v8::String>("libxml").ToLocalChecked(), target);
}

NODE_MODULE(xmljs, init)

}  // namespace libxmljs
