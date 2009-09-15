#ifndef __libxmljs_h__
#define __libxmljs_h__

#define LIBXMLJS_VERSION '0.0.1'

#define BAD_ARGUMENTS      Exception::TypeError(String::New("Bad argument"))

#define LIBXMLJS_SET_METHOD(obj, name, callback)                      \
  obj->Set(v8::String::NewSymbol(name),                               \
           v8::FunctionTemplate::New(callback)->GetFunction())

#define LIBXMLJS_SET_PROTOTYPE_METHOD(templ, name, callback)                \
  do {                                                                      \
    v8::Local<v8::Signature> __callback##_SIG = v8::Signature::New(templ);  \
    v8::Local<v8::FunctionTemplate> __callback##_TEM =                      \
      FunctionTemplate::New(callback, v8::Handle<v8::Value>(),              \
                            __callback##_SIG);                              \
    templ->PrototypeTemplate()->Set(v8::String::NewSymbol(name),            \
                                    __callback##_TEM);                      \
  } while (0)


#define LIBXMLJS_THROW_EXCEPTION(err)                               \
  Local<Value> exception = Exception::TypeError(String::New(err));  \
  ThrowException(exception);

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                  \
  if (!arg->type()) {                                                 \
    Local<Value> exception = Exception::TypeError(String::New(err));  \
    return ThrowException(exception);                                 \
  }


#include <v8.h>
#include <libxml/parser.h>

namespace libxmljs {


} //namespace libxmljs

#endif //__libxmljs_h__
