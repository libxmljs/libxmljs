#include <nan.h>

#if NAUV_UVVERSION < 0x10000

#ifdef _WIN32
#include <windows.h>
#else
#include <pthread.h>
#endif

NAN_INLINE int uv_thread_equal(const uv_thread_t* t1, const uv_thread_t* t2) {
#ifdef _WIN32
    return *t1 == *t2;
#else
    return pthread_equal(*t1, *t2);
#endif
}

#if !NODE_VERSION_AT_LEAST(0, 9, 2)
NAN_INLINE uv_thread_t uv_thread_self() {
#ifdef _WIN32
    return GetCurrentThreadId();
#else
    return pthread_self();
#endif
}
#endif

#endif
