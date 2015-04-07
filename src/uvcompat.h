/* Implement thread local storage for older versions of libuv.
 * This is essentially a backport of libuv commit 5d2434bf
 * written by Ben Noordhuis and included in libuv 0.11.11.
 */

#ifndef WIN32

#include <pthread.h>

typedef pthread_key_t uv_key_t;

int uv_key_create(uv_key_t* key) {
  return -pthread_key_create(key, NULL);
}

void uv_key_delete(uv_key_t* key) {
  if (pthread_key_delete(*key))
    abort();
}

void* uv_key_get(uv_key_t* key) {
  return pthread_getspecific(*key);
}

void uv_key_set(uv_key_t* key, void* value) {
  if (pthread_setspecific(*key, value))
    abort();
}

#else

#include <Windows.h>

typedef struct {
  DWORD tls_index;
} uv_key_t;

int uv_key_create(uv_key_t* key) {
  key->tls_index = TlsAlloc();
  if (key->tls_index == TLS_OUT_OF_INDEXES)
    return UV_ENOMEM;
  return 0;
}

void uv_key_delete(uv_key_t* key) {
  if (TlsFree(key->tls_index) == FALSE)
    abort();
  key->tls_index = TLS_OUT_OF_INDEXES;
}

void* uv_key_get(uv_key_t* key) {
  void* value;

  value = TlsGetValue(key->tls_index);
  if (value == NULL)
    if (GetLastError() != ERROR_SUCCESS)
      abort();

  return value;
}

void uv_key_set(uv_key_t* key, void* value) {
  if (TlsSetValue(key->tls_index, value) == FALSE)
    abort();
}

#endif
