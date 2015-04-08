#include <nan.h>

#if NAUV_UVVERSION < 0x10000

#ifndef _WIN32
#include <pthread.h>
#endif

NAN_INLINE int uv_thread_equal(const uv_thread_t* t1, const uv_thread_t* t2) {
#ifdef _WIN32
    return *t1 == *t2;
#else
    return pthread_equal(*t1, *t2);
#endif
}

#endif
