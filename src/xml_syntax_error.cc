// Copyright 2009, Squish Tech, LLC.
#include "./xml_syntax_error.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlSyntaxError::constructor_template;

void
XmlSyntaxError::PushToArray(void *errs, xmlError *error) {
  v8::HandleScope scope;

  v8::Persistent<v8::Object> errors = static_cast<JsObj*>(errs)->_handle;
  v8::Handle<v8::Function> push = v8::Handle<v8::Function>::Cast(
    errors->Get(v8::String::NewSymbol("push")));
  v8::Handle<v8::Value> argv[1] =
    { BUILD_SYNTAX_ERROR(error) };
  push->Call(errors, 1, argv);
}

v8::Handle<v8::Value>
XmlSyntaxError::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  xmlError *err = NULL;
  XmlSyntaxError *error = new XmlSyntaxError(err);
  error->Wrap(args.This());

  return args.This();
}

XmlSyntaxError::~XmlSyntaxError() {
  xmlFree(xml_obj);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_domain() {
  ERR_RETURN_NUM_OR_NULL(domain);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_code() {
  ERR_RETURN_NUM_OR_NULL(code);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_level() {
  ERR_RETURN_NUM_OR_NULL(level);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_file() {
  ERR_RETURN_STR_OR_NULL(file);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_line() {
  ERR_RETURN_NUM_OR_NULL(line);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_str1() {
  ERR_RETURN_STR_OR_NULL(str1);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_str2() {
  ERR_RETURN_STR_OR_NULL(str2);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_str3() {
  ERR_RETURN_STR_OR_NULL(str3);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_int1() {
  ERR_RETURN_NUM_OR_NULL(int1);
}

v8::Handle<v8::Value>
XmlSyntaxError::get_column() {
  ERR_RETURN_NUM_OR_NULL(int2);
}


v8::Handle<v8::Value>
XmlSyntaxError::Getter(v8::Local<v8::String> property,
                       const v8::AccessorInfo& info) {
  v8::HandleScope scope;
  XmlSyntaxError *error = LibXmlObj::Unwrap<XmlSyntaxError>(info.This());
  assert(error);

  if (property == DOMAIN_SYMBOL)
    return error->get_domain();
  else if (property == CODE_SYMBOL)
    return error->get_code();
  else if (property == LEVEL_SYMBOL)
    return error->get_level();
  else if (property == FILE_SYMBOL)
    return error->get_file();
  else if (property == LINE_SYMBOL)
    return error->get_line();
  else if (property == STR1_SYMBOL)
    return error->get_str1();
  else if (property == STR2_SYMBOL)
    return error->get_str2();
  else if (property == STR3_SYMBOL)
    return error->get_str3();
  else if (property == INT1_SYMBOL)
    return error->get_int1();
  else if (property == COLUMN_SYMBOL)
    return error->get_column();

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
