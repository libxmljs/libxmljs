// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_LIBXMLJS_H_
#define SRC_LIBXMLJS_H_

#include <v8.h>
#include <node.h>

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                          \
  if (!arg->type()) {                                                         \
    v8::Local<v8::Value> exception = v8::Exception::TypeError(                \
      v8::String::New(err));                                                  \
    return v8::ThrowException(exception);                                     \
  }

namespace libxmljs {

// convenience function to create a v8 error wrapped by ThrowException
v8::Handle<v8::Value> ThrowError(const char* msg);

#ifdef LIBXML_DEBUG_ENABLED
static const bool debugging = true;
#else
static const bool debugging = false;
#endif

// Ensure that libxml is properly initialised and destructed at shutdown
class LibXMLJS {
public:
    LibXMLJS();
    virtual ~LibXMLJS();

private:
    static LibXMLJS instance;
};

}  // namespace libxmljs

#endif  // SRC_LIBXMLJS_H_
