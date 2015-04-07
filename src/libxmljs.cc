// Copyright 2009, Squish Tech, LLC.

#include <v8.h>
#include <uv.h>

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
int xml_memory_used_last = 0;
uv_async_t xml_memory_handle;
uv_mutex_t xml_memory_mutex;

NAUV_WORK_CB(xml_memory_cb) {
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

    uv_mutex_lock(&xml_memory_mutex);
    const int diff = xml_memory_used - xml_memory_used_last;
    xml_memory_used_last = xml_memory_used;
    uv_mutex_unlock(&xml_memory_mutex);

    NanAdjustExternalMemory(diff);
}

NAN_INLINE void xml_memory_update() {
    uv_mutex_lock(&xml_memory_mutex);

    xml_memory_used = xmlMemUsed();
    if (xml_memory_used != xml_memory_used_last) {
        uv_async_send(&xml_memory_handle);
    }

    uv_mutex_unlock(&xml_memory_mutex);
}

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

    xml_memory_update();

    return res;
}

// wrapper for xmlMemFree to update v8's knowledge of memory used
// the GC relies on this information
void xmlMemFreeWrap(void* p)
{
    xmlMemFree(p);

    xml_memory_update();
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

    xml_memory_update();

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

    xml_memory_update();

    return res;
}

LibXMLJS::LibXMLJS()
{

    uv_mutex_init(&xml_memory_mutex);
    uv_async_init(uv_default_loop(), &xml_memory_handle, xml_memory_cb);
    uv_unref((uv_handle_t*) &xml_memory_handle);

    // populated debugMemSize (see xmlmemory.h/c) and makes the call to
    // xmlMemUsed work, this must happen first!
    xmlMemSetup(xmlMemFreeWrap, xmlMemMallocWrap,
            xmlMemReallocWrap, xmlMemoryStrdupWrap);

    // initialize libxml
    LIBXML_TEST_VERSION;

    // initial memory usage
    xml_memory_used = xml_memory_used_last = xmlMemUsed();
}

LibXMLJS::~LibXMLJS()
{
    xmlCleanupParser();
}

// used by node.js to initialize libraries
extern "C" void
init(v8::Handle<v8::Object> target)
{
      NanScope();

      XmlDocument::Initialize(target);
      XmlSaxParser::Initialize(target);

      target->Set(NanNew<v8::String>("libxml_version"),
                  NanNew<v8::String>(LIBXML_DOTTED_VERSION));

      target->Set(NanNew<v8::String>("libxml_parser_version"),
                  NanNew<v8::String>(xmlParserVersion));

      target->Set(NanNew<v8::String>("libxml_debug_enabled"),
                  NanNew<v8::Boolean>(debugging));

      target->Set(NanNew<v8::String>("libxml"), target);
}

NODE_MODULE(xmljs, init)

}  // namespace libxmljs
