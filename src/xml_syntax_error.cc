// Copyright 2009, Squish Tech, LLC.

#include <cstring>

#include "xml_syntax_error.h"

using namespace v8;
namespace
{

void set_string_field(Local<Object> obj,
                      const char *name, const char *value)
{
  Nan::HandleScope scope;
  if (!value)
  {
    return;
  }
  Nan::Set(obj, Nan::New<String>(name).ToLocalChecked(), Nan::New<String>(value, strlen(value)).ToLocalChecked());
}

void set_numeric_field(Local<Object> obj,
                       const char *name, const int value)
{
  Nan::HandleScope scope;
  Nan::Set(obj, Nan::New<String>(name).ToLocalChecked(), Nan::New<Int32>(value));
}

} // anonymous namespace

namespace libxmljs
{

Local<Value>
XmlSyntaxError::BuildSyntaxError(xmlError *error)
{
  Nan::EscapableHandleScope scope;

  Local<Value> err = Exception::Error(
      Nan::New<String>(error->message).ToLocalChecked());
  Local<Object> out = Local<Object>::Cast(err);

  set_numeric_field(out, "domain", error->domain);
  set_numeric_field(out, "code", error->code);
  set_string_field(out, "message", error->message);
  set_numeric_field(out, "level", error->level);
  set_numeric_field(out, "column", error->int2);
  set_string_field(out, "file", error->file);
  set_numeric_field(out, "line", error->line);
  set_string_field(out, "str1", error->str1);
  set_string_field(out, "str2", error->str2);
  set_string_field(out, "str3", error->str3);

  // only add if we have something interesting
  if (error->int1)
  {
    set_numeric_field(out, "int1", error->int1);
  }
  return scope.Escape(err);
}

void XmlSyntaxError::PushToArray(void *errs, xmlError *error)
{
  Nan::HandleScope scope;
  Local<Array> errors = *reinterpret_cast<Local<Array> *>(errs);
  // push method for array
  Local<Function> push = Local<Function>::Cast(Nan::Get(errors, Nan::New<String>("push").ToLocalChecked()).ToLocalChecked());

  Local<Value> argv[1] = {XmlSyntaxError::BuildSyntaxError(error)};
  Nan::Call(push, errors, 1, argv);
}

} // namespace libxmljs
