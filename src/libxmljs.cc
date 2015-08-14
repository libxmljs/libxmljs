// Copyright 2009, Squish Tech, LLC.

#include <v8.h>
#include <uv.h>
#include "uv-compat.h"

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
ssize_t xml_memory_diff = 0;
uv_async_t xml_memory_handle;
uv_mutex_t xml_memory_mutex;
uv_thread_t xml_thread;

typedef struct alloc {
    size_t size;
    double data;
} alloc_t;

#define ALLOC_HEADER_SIZE offsetof(alloc, data)

NAN_INLINE alloc_t* mem_data_to_header(void* ptr) {
    return (alloc_t*) ((uintptr_t) ptr - ALLOC_HEADER_SIZE);
}

NAN_INLINE void* mem_header_to_data(alloc_t* ptr) {
    return (alloc_t*) ((uintptr_t) ptr + ALLOC_HEADER_SIZE);
}

NAUV_WORK_CB(xml_memory_cb) {
    uv_mutex_lock(&xml_memory_mutex);
    const ssize_t diff = xml_memory_diff;
    xml_memory_diff = 0;
    uv_mutex_unlock(&xml_memory_mutex);

    NanAdjustExternalMemory(diff);
}

NAN_INLINE void xml_memory_update(ssize_t diff) {
    if (diff == 0) {
        return;
    }

    uv_thread_t current_thread = uv_thread_self();
    if (uv_thread_equal(&xml_thread, &current_thread)) {
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

        NanAdjustExternalMemory(diff);
    }
    else {
        uv_mutex_lock(&xml_memory_mutex);

        xml_memory_diff += diff;
        size_t abs_diff = diff < 0 ? -diff : diff;
        if (abs_diff > 0x10000) {
            uv_async_send(&xml_memory_handle);
        }

        uv_mutex_unlock(&xml_memory_mutex);
    }
}

// wrapper for malloc to update v8's knowledge of memory used
// the GC relies on this information
void* xml_malloc(size_t size)
{
    size += ALLOC_HEADER_SIZE;
    alloc_t* header = (alloc_t*) malloc(size);

    // no need to update memory if we didn't allocate
    if (!header)
    {
        return NULL;
    }

    header->size = size;

    xml_memory_update(size);

    return mem_header_to_data(header);
}

// wrapper for free to update v8's knowledge of memory used
// the GC relies on this information
void xml_free(void* ptr)
{
    alloc_t* header = mem_data_to_header(ptr);
    size_t size = header->size;
    free(header);

    xml_memory_update(-size);
}

// wrapper for realloc to update v8's knowledge of memory used
void* xml_realloc(void* ptr, size_t size)
{
    alloc_t* oldHeader = mem_data_to_header(ptr);
    size_t old_size = oldHeader->size;

    size += ALLOC_HEADER_SIZE;
    alloc_t* newHeader = (alloc_t*) realloc(oldHeader, size);

    // if realloc fails, no need to update v8 memory state
    if (!newHeader)
    {
        return NULL;
    }

    xml_memory_update(size - old_size);

    return mem_header_to_data(newHeader);
}

// replacement for strdup to update v8's knowledge of memory used
char* xml_strdup(const char* str)
{
    size_t len = strlen(str) + 1;
    char* res = (char*) xml_malloc(len);

    if (!res) {
        return NULL;
    }

    memcpy((void*) res, (void*) str, len);

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

    uv_mutex_init(&xml_memory_mutex);
    uv_async_init(uv_default_loop(), &xml_memory_handle, xml_memory_cb);
    uv_unref((uv_handle_t*) &xml_memory_handle);
    xml_thread = uv_thread_self();

    // set libxml up with wrappers for memory allocation,
    // so we can keep track of memory usage to report to V8.
    // this needs to happen before any use of libxml.
    xmlMemSetup(xml_free, xml_malloc,
            xml_realloc, xml_strdup);

    // initialize libxml
    LIBXML_TEST_VERSION;
}

LibXMLJS::~LibXMLJS()
{
    xmlCleanupParser();
}

v8::Local<v8::Object> listFeatures() {
    v8::Local<v8::Object> target = NanNew<v8::Object>();
#define FEAT(x) target->Set(NanNew<v8::String>(# x), \
                    NanNew<v8::Boolean>(xmlHasFeature(XML_WITH_ ## x)))
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

      target->Set(NanNew<v8::String>("features"), listFeatures());

      target->Set(NanNew<v8::String>("libxml"), target);
}

NODE_MODULE(xmljs, init)

}  // namespace libxmljs
