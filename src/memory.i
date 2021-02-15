%header %{
    // extern "C" {
    //     #include "dynbuf.h"
    // }

    // t_dynbuf* references = NULL;

    #define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                          \
    if (!arg->type()) {                                                         \
        return Nan::ThrowTypeError(err);                                            \
    }

    class LIBXMLJS_API WorkerParent {
    public:
        WorkerParent();
        virtual ~WorkerParent();
    private:
        friend void adjustMem(ssize_t);
        ssize_t memAdjustments;
    };

    // An object of the following class must be created in the worker thread,
    // and kept alive as long as the worker interfaces with libxmljs.
    // It must eventually be destroyed while still in the worker thread.
    class LIBXMLJS_API WorkerSentinel {
    public:
        WorkerSentinel(WorkerParent& parent);
        virtual ~WorkerSentinel();
    private:
        friend void adjustMem(ssize_t);
        WorkerParent& parent;
    };

    // track how much memory libxml2 is using
    ssize_t xml_memory_used = 0; // Mainly for testing

    // track how many nodes haven't been freed
    int xml_node_count = 0;

    int getMemUsed() {
        return xml_memory_used;
    }

    int getNodeCount() {
        return xml_node_count;
    }

    bool tlsInitialized = false;
    Nan::nauv_key_t tlsKey;
    bool isAsync = false; // Only set on V8 thread when no workers are running
    int numWorkers = 0; // Only access from V8 thread

    struct memHdr {
        size_t size;
        double data;
    };

    #define HDR_SIZE offsetof(memHdr, data)

    inline void* hdr2client(memHdr* hdr) {
        return static_cast<void*>(reinterpret_cast<char*>(hdr) + HDR_SIZE);
    }

    inline memHdr* client2hdr(void* client) {
        return reinterpret_cast<memHdr*>(static_cast<char*>(client) - HDR_SIZE);
    }

    int xml_memory_diff = 0;
    int xml_memory_last_change = 0;

    inline void actuallyAdjustMem(ssize_t diff)  {
        xml_memory_used += diff;
        xml_memory_diff += diff;

        // throttle calls to Nan::AdjustExternalMemory, which is very slow
        if (abs(xml_memory_diff) > xml_memory_last_change) {
            xml_memory_last_change = abs(xml_memory_diff);
            // printf("adjustMem %i - %i\n", xml_memory_diff, xml_memory_used);
            Nan::AdjustExternalMemory(xml_memory_diff);
            xml_memory_diff = 0;
        }
    }

    void adjustMem(ssize_t diff) {
        if (isAsync) {
            WorkerSentinel* worker =
                static_cast<WorkerSentinel*>(Nan::nauv_key_get(&tlsKey));

            if (worker) {
                worker->parent.memAdjustments += diff;
                return;
            }
        }
        // if v8 is no longer running, don't try to adjust memory
        // this happens when the v8 vm is shutdown and the program is exiting
        // our cleanup routines for libxml will be called (freeing memory)
        // but v8 is already offline and does not need to be informed
        // trying to adjust after shutdown will result in a fatal error
    #if (NODE_MODULE_VERSION > 14)
        if (v8::Isolate::GetCurrent() == 0 ||
            v8::Isolate::GetCurrent()->IsDead())  {
            return;
        }
    #elif (NODE_MODULE_VERSION > 0x000B)
        if (v8::Isolate::GetCurrent() == 0) {
            assert(diff <= 0);
            return;
        }
    #else
        if (v8::V8::IsDead()) {
            assert(diff <= 0);
            return;
        }
    #endif
        actuallyAdjustMem(diff);
    }

    void* xmlMemMallocWrap(size_t size) {
        if (libxmljs_debug) {
            printf("xmlMemMallocWrap\n");
        }
        size_t totalSize = size + HDR_SIZE;
        memHdr* mem = static_cast<memHdr*>(malloc(totalSize));
        if (!mem) return NULL;
        mem->size = size;
        adjustMem(totalSize);
        return hdr2client(mem);
    }

    void xmlMemFreeWrap(void* p) {
        if (libxmljs_debug) {
            printf("xmlMemFreeWrap\n");
        }
        if (!p) return;
        memHdr* mem = client2hdr(p);
        ssize_t totalSize = mem->size + HDR_SIZE;
        adjustMem(-totalSize);
        free(mem);
    }

    void* xmlMemReallocWrap(void* ptr, size_t size) {
        if (libxmljs_debug) {
            printf("xmlMemReallocWrap\n");
        }
        if (!ptr) return xmlMemMallocWrap(size);
        memHdr* mem1 = client2hdr(ptr);
        ssize_t oldSize = mem1->size;
        memHdr* mem2 = static_cast<memHdr*>(realloc(mem1, size + HDR_SIZE));
        if (!mem2) return NULL;
        mem2->size = size;
        adjustMem(ssize_t(size) - oldSize);
        return hdr2client(mem2);
    }

    char* xmlMemoryStrdupWrap(const char* str) {
        if (libxmljs_debug) {
            printf("xmlMemoryStrdupWrap\n");
        }
        size_t size = strlen(str) + 1;
        char* res = static_cast<char*>(xmlMemMallocWrap(size));
        if (res) memcpy(res, str, size);
        return res;
    }

    // Set up in V8 thread
    WorkerParent::WorkerParent() : memAdjustments(0) {
        if (!tlsInitialized)
        {
            Nan::nauv_key_create(&tlsKey);
            tlsInitialized = true;
        }
        if (numWorkers++ == 0)
        {
            isAsync = true;
        }
    }

    // Tear down in V8 thread
    WorkerParent::~WorkerParent() {
        actuallyAdjustMem(memAdjustments);
        if (--numWorkers == 0)
        {
            isAsync = false;
        }
    }

    // Set up in worker thread
    WorkerSentinel::WorkerSentinel(WorkerParent& parent) : parent(parent) {
        Nan::nauv_key_set(&tlsKey, this);
        xmlMemSetup(xmlMemFreeWrap, xmlMemMallocWrap, xmlMemReallocWrap, xmlMemoryStrdupWrap);
    }

    // Tear down in worker thread
    WorkerSentinel::~WorkerSentinel() {
        Nan::nauv_key_set(&tlsKey, NULL);
    }
%}

%init %{
    // populated debugxml_memory_used (see xmlmemory.h/c) and makes the call to
    // xmlMemUsed work, this must happen first!
    xmlMemSetup(xmlMemFreeWrap, xmlMemMallocWrap,
            xmlMemReallocWrap, xmlMemoryStrdupWrap);

    // initial memory usage
    xml_memory_used = xmlMemUsed();
%}