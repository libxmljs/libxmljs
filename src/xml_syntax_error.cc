// Copyright 2009, Squish Tech, LLC.
#include "xml_syntax_error.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlSyntaxError::constructor_template;

void
XmlSyntaxError::PushToArray(void *errs, xmlError *error) {
  v8::HandleScope scope;

  v8::Persistent<v8::Object> errors =
    reinterpret_cast<v8::Object*>(errs);
  v8::Handle<v8::Function> push = v8::Handle<v8::Function>::Cast(
    errors->Get(v8::String::NewSymbol("push")));
  v8::Handle<v8::Value> argv[1] =
      { BuildSyntaxError(error) };
  push->Call(errors, 1, argv);
}

v8::Handle<v8::Value>
XmlSyntaxError::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  xmlError *err = NULL;
  XmlSyntaxError *error = new XmlSyntaxError(err);
  error->Wrap(args.This());

  return scope.Close(args.This());
}

#define STRING_OR_NULL(error, field)                                          \
({                                                                            \
  if (error != NULL && error->field) {                                        \
    field = v8::Persistent<v8::String>::New(v8::String::New(                  \
      (const char *)error->field, xmlStrlen((const xmlChar*)error->field)));  \
  } else {                                                                    \
    field = v8::Persistent<v8::Value>::New(v8::Null());                       \
  }                                                                           \
})

#define NUMBER_OR_NULL(error, field)                                          \
({                                                                            \
  if (error != NULL && error->field) {                                        \
    field = v8::Persistent<v8::Number>::New(v8::Number::New(                  \
      static_cast<double>(error->field)));                                    \
  } else {                                                                    \
    field = v8::Persistent<v8::Value>::New(v8::Null());                       \
  }                                                                           \
})

XmlSyntaxError::XmlSyntaxError(xmlError *error) {
  v8::HandleScope scope;

  NUMBER_OR_NULL(error, domain);
  NUMBER_OR_NULL(error, code);
  STRING_OR_NULL(error, message);
  NUMBER_OR_NULL(error, level);
  STRING_OR_NULL(error, file);
  NUMBER_OR_NULL(error, line);
  STRING_OR_NULL(error, str1);
  STRING_OR_NULL(error, str2);
  STRING_OR_NULL(error, str3);
  NUMBER_OR_NULL(error, int1);
  NUMBER_OR_NULL(error, int2);
}

XmlSyntaxError::~XmlSyntaxError() {
  // xmlFree(xml_obj);
}

v8::Handle<v8::Value>
XmlSyntaxError::Getter(v8::Local<v8::String> property,
                       const v8::AccessorInfo& info) {
  v8::HandleScope scope;
  XmlSyntaxError *error = LibXmlObj::Unwrap<XmlSyntaxError>(info.This());
  assert(error);

  if (property == DOMAIN_SYMBOL)
    return error->domain;
  else if (property == CODE_SYMBOL)
    return error->code;
  else if (property == MESSAGE_SYMBOL)
    return error->message;
  else if (property == LEVEL_SYMBOL)
    return error->level;
  else if (property == FILE_SYMBOL)
    return error->file;
  else if (property == LINE_SYMBOL)
    return error->line;
  else if (property == STR1_SYMBOL)
    return error->str1;
  else if (property == STR2_SYMBOL)
    return error->str2;
  else if (property == STR3_SYMBOL)
    return error->str3;
  else if (property == INT1_SYMBOL)
    return error->int1;
  else if (property == COLUMN_SYMBOL)
    return error->int2;

  assert(0 && "This shouldnt happen");
  return v8::ThrowException(v8::Exception::Error(
        v8::String::New("This shouldn't happen.")));
}


void
XmlSyntaxError::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);

  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  constructor_template->InstanceTemplate()->SetAccessor(
    DOMAIN_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    CODE_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    MESSAGE_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    LEVEL_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    FILE_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    LINE_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    STR1_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    STR2_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    STR3_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    INT1_SYMBOL,
    XmlSyntaxError::Getter);

  constructor_template->InstanceTemplate()->SetAccessor(
    COLUMN_SYMBOL,
    XmlSyntaxError::Getter);

  target->Set(v8::String::NewSymbol("SyntaxError"),
              constructor_template->GetFunction());
}
}  // namespace libxmljs
