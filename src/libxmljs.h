// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_LIBXMLJS_H_
#define SRC_LIBXMLJS_H_

#include <v8.h>
#include <node.h>

#include <libxml/xmlmemory.h>
#include <libxml/parser.h>
#include <libxml/parserInternals.h>
#include <libxml/xmlstring.h>
#include <libxml/xmlsave.h>
#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>
#include <libxml/HTMLparser.h>
#include <libxml/HTMLtree.h>

#include <memory>
#include <string.h>
#include <cassert>  // for assert()

#define LIBXMLJS_VERSION "v0.4.0"

#define BAD_ARGUMENTS Exception::TypeError(String::New("Bad argument"))

#define LIBXMLJS_SET_METHOD(obj, name, callback)                              \
  obj->Set(v8::String::NewSymbol(name),                                       \
           v8::FunctionTemplate::New(callback)->GetFunction())

#define LXJS_SET_PROTO_METHOD(templ, name, callback)                          \
do {                                                                          \
  v8::Local<v8::Signature> __callback##_SIG = v8::Signature::New(templ);      \
  v8::Local<v8::FunctionTemplate> __callback##_TEM =                          \
    v8::FunctionTemplate::New(callback,                                       \
                              v8::Handle<v8::Value>(),                        \
                              __callback##_SIG);                              \
  templ->PrototypeTemplate()->Set(v8::String::NewSymbol(name),                \
                                  __callback##_TEM);                          \
} while (0)

#define LIBXMLJS_THROW_EXCEPTION(err)                                         \
  v8::Local<v8::Value> exception = v8::Exception::TypeError(                  \
    v8::String::New(err));                                                    \
  return v8::ThrowException(exception);

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                          \
  if (!arg->type()) {                                                         \
    v8::Local<v8::Value> exception = v8::Exception::TypeError(                \
      v8::String::New(err));                                                  \
    return v8::ThrowException(exception);                                     \
  }

#define BUILD_NODE(klass, node)                                               \
({                                                                            \
  klass *__klass##_OBJ = new klass(node);                                     \
  node->_private = static_cast<void *>(__klass##_OBJ);                        \
  v8::Handle<v8::Value> __jsobj_ARG[1] = { v8::Null() };                      \
  v8::Handle<v8::Object> __jsobj_JS =                                         \
    klass::constructor_template->GetFunction()->NewInstance(1, __jsobj_ARG);  \
  __klass##_OBJ->Wrap(__jsobj_JS);                                            \
})

#define LXJS_GET_MAYBE_BUILD(klass, node)                                     \
({                                                                            \
  if (!node->_private)                                                        \
    BUILD_NODE(klass, node);                                                  \
  static_cast<klass *>(node->_private)->handle_;                              \
})

namespace libxmljs {

#ifdef LIBXML_DEBUG_ENABLED
static const bool debugging = true;
#endif

#ifndef LIBXML_DEBUG_ENABLED
static const bool debugging = false;
#endif

    static long current_xml_memory = 0;
    void UpdateV8Memory();

// Ensure that libxml is properly initialised:
class LibXMLJS {
  public:

  LibXMLJS();
  virtual ~LibXMLJS();

  private:

  static LibXMLJS init_;
};

}  // namespace libxmljs

#include "natives.h"
#include "object_wrap.h"

#endif  // SRC_LIBXMLJS_H_
