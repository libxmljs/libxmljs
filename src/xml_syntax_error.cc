// Copyright 2009, Squish Tech, LLC.

#include <cstring>

#include "xml_syntax_error.h"

namespace {

void set_string_field(v8::Local<v8::Object> obj,
        const char* name, const char* value) {
    Nan::HandleScope scope;
    if (!value) {
        return;
    }
    Nan::Set(obj, Nan::New<v8::String>(name).ToLocalChecked(), Nan::New<v8::String>(value, strlen(value)).ToLocalChecked());
}

void set_numeric_field(v8::Local<v8::Object> obj,
        const char* name, const int value) {
    Nan::HandleScope scope;
    Nan::Set(obj, Nan::New<v8::String>(name).ToLocalChecked(), Nan::New<v8::Int32>(value));
}

} // anonymous namespace

namespace libxmljs {

v8::Local<v8::Value>
XmlSyntaxError::BuildSyntaxError(xmlError* error) {
    Nan::EscapableHandleScope scope;

    v8::Local<v8::Value> err = v8::Exception::Error(
            Nan::New<v8::String>(error->message).ToLocalChecked());
    v8::Local<v8::Object> out = v8::Local<v8::Object>::Cast(err);

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
    if (error->int1) {
        set_numeric_field(out, "int1", error->int1);
    }
    return scope.Escape(err);
}

void
XmlSyntaxError::PushToArray(void* errs, xmlError* error) {
    Nan::HandleScope scope;
    v8::Local<v8::Array> errors = *reinterpret_cast<v8::Local<v8::Array>*>(errs);
    // push method for array
    v8::Local<v8::Function> push = v8::Local<v8::Function>::Cast(errors->Get(Nan::New<v8::String>("push").ToLocalChecked()));

    v8::Local<v8::Value> argv[1] = { XmlSyntaxError::BuildSyntaxError(error) };
    push->Call(errors, 1, argv);
}

}  // namespace libxmljs
