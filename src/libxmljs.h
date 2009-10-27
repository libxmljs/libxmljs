// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_LIBXMLJS_H_
#define SRC_LIBXMLJS_H_

#define LIBXMLJS_VERSION '0.0.1'

#define BAD_ARGUMENTS      Exception::TypeError(String::New("Bad argument"))

#define LIBXMLJS_SET_METHOD(obj, name, callback)                      \
  obj->Set(v8::String::NewSymbol(name),                               \
           v8::FunctionTemplate::New(callback)->GetFunction())

#define LIBXMLJS_SET_PROTOTYPE_METHOD(templ, name, callback)              \
{                                                                         \
  v8::Local<v8::Signature> __callback##_SIG = v8::Signature::New(templ);  \
  v8::Local<v8::FunctionTemplate> __callback##_TEM =                      \
    v8::FunctionTemplate::New(callback, v8::Handle<v8::Value>(),          \
                          __callback##_SIG);                              \
  templ->PrototypeTemplate()->Set(v8::String::NewSymbol(name),            \
                                  __callback##_TEM);                      \
}

#define LIBXMLJS_SET_METHOD(obj, name, callback)                \
  obj->Set(v8::String::NewSymbol(name),                         \
           v8::FunctionTemplate::New(callback)->GetFunction())

#define LIBXMLJS_THROW_EXCEPTION(err)                         \
  v8::Local<v8::Value> exception = v8::Exception::TypeError(  \
    v8::String::New(err));                                    \
  ThrowException(exception);

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)            \
  if (!arg->type()) {                                           \
    v8::Local<v8::Value> exception = v8::Exception::TypeError(  \
      v8::String::New(err));                                    \
    return v8::ThrowException(exception);                       \
  }

#define BUILD_NODE(klass, type, name, node)                               \
{                                                                         \
  klass *name = new klass(node);                                          \
  v8::Handle<v8::Value> argv[1] = { v8::Null() };                         \
  v8::Handle<v8::Object> name##JS = klass::constructor_template->         \
                                    GetFunction()->NewInstance(1, argv);  \
  XmlObj::Wrap<type>(node, name##JS);                                     \
  name->Wrap(name##JS);                                                   \
}


#include <v8.h>
#include <libxml/parser.h>

namespace libxmljs {

// Ensure that libxml is properly initialised:
class LibXMLJS {
  public:

  LibXMLJS();
  virtual ~LibXMLJS();

  private:

  static LibXMLJS init_;
};

}  // namespace libxmljs

#endif  // SRC_LIBXMLJS_H_
