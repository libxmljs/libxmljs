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
    MakeWeak();
  }

  inline void
  MakeWeak (
    void)
  {
    handle_.MakeWeak(this, WeakCallback);
  }

  v8::Persistent<v8::Object> handle_; // ro

private:
  static void
  WeakCallback(
    v8::Persistent<v8::Value> value,
    void *data)
  {
    ObjectWrap *obj = static_cast<ObjectWrap*>(data);
    assert(value == obj->handle_);
    obj->MakeWeak();
  }
};

} // namespace node
#endif // object_wrap_h
