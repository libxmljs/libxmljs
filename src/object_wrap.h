// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_OBJECT_WRAP_H_
#define SRC_OBJECT_WRAP_H_

#include "libxmljs.h"

namespace libxmljs {

class LibXmlObj : public node::ObjectWrap {
 public:

  template <class T, class S>
  static inline
  v8::Handle<v8::Object>
  GetMaybeBuild (S *node)
  {
      v8::HandleScope scope;

      assert(node);

      T *obj;
      if (!(node->_private)) {
          obj = new T(node);
          node->_private = static_cast<void *>(obj);
          v8::Handle<v8::Value> __jsobj_ARG[1] = { v8::Null() };
          v8::Handle<v8::Object> __jsobj_JS =
              T::constructor_template->GetFunction()->NewInstance(1, __jsobj_ARG);
          obj->Wrap(__jsobj_JS);
      } else {
          obj = static_cast<T *>(node->_private);
      }

      return scope.Close(obj->handle_);
  }

};

}  // namespace libxmljs

#endif  // SRC_OBJECT_WRAP_H_
