#ifndef object_wrap_h
#define object_wrap_h

#include <v8.h>
#include <assert.h>

namespace libxmljs {

class ObjectWrap {
public:
  virtual
  ~ObjectWrap()
  {
    if (!handle_.IsEmpty()) {
      assert(handle_.IsNearDeath());
      handle_->SetInternalField(0, v8::Undefined());
      handle_.Dispose();
      handle_.Clear();
    }
  }

  template <class T>
  static inline T*
  Unwrap(
    v8::Handle<v8::Object> handle)
  {
    assert(!handle.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    return static_cast<T*>(v8::Handle<v8::External>::Cast(
        handle->GetInternalField(0))->Value());
  }

  inline void
  Wrap(
    v8::Handle<v8::Object> handle)
  {
    assert(handle_.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    handle_ = v8::Persistent<v8::Object>::New(handle);
    handle_->SetInternalField(0, v8::External::New(this));
  }

  v8::Persistent<v8::Object> handle_; // ro
};

class XmlObj {
public:
  static inline void
  Wrap(
    void * xml_obj,
    v8::Handle<v8::Object> jsObject)
  {
    xmlNode * node = (xmlNode*)xml_obj;
    node->_private = new XmlObj(jsObject);
  }

  static inline v8::Persistent<v8::Object>
  Unwrap(
    void * xml_obj)
  {
    xmlNode * node = (xmlNode*)xml_obj;
    assert(node->_private);
    XmlObj * xmlobj = (XmlObj*)node->_private;
    return xmlobj->_handle;
  }

  XmlObj(
    v8::Handle<v8::Object> jsObject)
  {
    _handle = v8::Persistent<v8::Object>::New(jsObject);
  }

  ~XmlObj()
  {
    if (!_handle.IsEmpty()) {
      assert(_handle.IsNearDeath());
      _handle.Dispose();
      _handle.Clear();
    }
  }

  v8::Persistent<v8::Object> _handle;

};

} // namespace libxmljs
#endif // object_wrap_h
