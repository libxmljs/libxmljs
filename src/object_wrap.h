// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_OBJECT_WRAP_H_
#define SRC_OBJECT_WRAP_H_

#include "./libxmljs.h"

namespace libxmljs {

class LibXmlObj {
  public:

  virtual ~LibXmlObj() {
    if (!handle_.IsEmpty()) {
      assert(handle_.IsNearDeath());
      handle_->SetInternalField(0, v8::Undefined());
      handle_.Dispose();
      handle_.Clear();
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
    assert(handle_.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    handle_ = v8::Persistent<v8::Object>::New(handle);
    handle_->SetInternalField(0, v8::External::New(this));
    MakeWeak();
  }

  inline void
  MakeWeak(void) {
    handle_.MakeWeak(this, WeakCallback);
  }

  v8::Persistent<v8::Object> handle_;  // ro

  private:

  static void
  WeakCallback(v8::Persistent<v8::Value> value, void *data) {
    LibXmlObj *obj = static_cast<LibXmlObj*>(data);
    assert(value == obj->handle_);
    delete obj;
  }
};

// Wraps/Unwraps a JS object so it can be set on the XML object's _private
// field
class JsObj {
  public:

  template <class T>
  static inline void
  Wrap(T *xml_obj, v8::Handle<v8::Object> js_obj) {
    xml_obj->_private = new JsObj(js_obj);
  }

  template <class T>
  static inline v8::Persistent<v8::Object>
  Unwrap(T* xml_obj) {
    assert(xml_obj->_private);
    JsObj* jsobj = static_cast<JsObj*>(xml_obj->_private);
    return jsobj->_handle;
  }

  template <class T>
  static inline v8::Persistent<v8::Object>
  UnwrapNonXmlObj(T* obj) {
    assert(obj);
    JsObj* jsobj = static_cast<JsObj*>(obj);
    return jsobj->_handle;
  }

  explicit JsObj(v8::Handle<v8::Object> jsObject) {
    _handle = v8::Persistent<v8::Object>::New(jsObject);
    MakeWeak();
  }

  ~JsObj() {
    if (!_handle.IsEmpty()) {
      assert(_handle.IsNearDeath());
      _handle.Dispose();
      _handle.Clear();
    }
  }

  inline void
  MakeWeak(void) {
    _handle.MakeWeak(this, WeakCallback);
  }

  v8::Persistent<v8::Object> _handle;

  private:

  static void
  WeakCallback(v8::Persistent<v8::Value> value, void *data) {
    JsObj *obj = static_cast<JsObj*>(data);
    assert(value == obj->_handle);
    delete obj;
  }
};

}  // namespace libxmljs

#endif  // SRC_OBJECT_WRAP_H_
