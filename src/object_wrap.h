// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_OBJECT_WRAP_H_
#define SRC_OBJECT_WRAP_H_

#include "libxmljs.h"

namespace libxmljs {

class LibXmlObj {
  public:

  virtual ~LibXmlObj() {
    if (!_handle.IsEmpty()) {
      assert(_handle.IsNearDeath());
      _handle->SetInternalField(0, v8::Undefined());
      _handle.Dispose();
      _handle.Clear();
    }
  }

  template <class T>
  static inline T*
  Unwrap(v8::Handle<v8::Object> handle) {
    assert(!handle.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    return static_cast<T*>(v8::Handle<v8::External>::Cast(
        handle->GetInternalField(0))->Value());
  }

  inline void
  Wrap(v8::Handle<v8::Object> handle) {
    assert(_handle.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    _handle = v8::Persistent<v8::Object>::New(handle);
    _handle->SetInternalField(0, v8::External::New(this));
    MakeWeak();
  }

  inline void
  MakeWeak(void) {
    _handle.MakeWeak(this, WeakCallback);
  }

  v8::Persistent<v8::Object> _handle;  // ro

  private:

  static void
  WeakCallback(v8::Persistent<v8::Value> value, void *data) {
    LibXmlObj *obj = static_cast<LibXmlObj*>(data);
    assert(value == obj->_handle);
    value.Dispose();
    value.Clear();
    delete obj;
  }
};

}  // namespace libxmljs

#endif  // SRC_OBJECT_WRAP_H_
