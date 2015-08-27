// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_LIBXMLJS_H_
#define SRC_LIBXMLJS_H_

#include <v8.h>
#include <node.h>
#include "nan.h"

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                          \
  if (!arg->type()) {                                                         \
    return Nan::ThrowTypeError(err);                                            \
  }

namespace libxmljs {

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
