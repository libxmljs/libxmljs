// Copyright 2009, Squish Tech, LLC.

#include <cstring>

#include "xml_syntax_error.h"

namespace {

void set_string_field(v8::Local<v8::Object> obj,
        const char* name, const char* value) {
    if (!value) {
        return;
    }
    obj->Set(NanNew<v8::String>(name), NanNew<v8::String>(value, strlen(value)));
}

void set_numeric_field(v8::Local<v8::Object> obj,
        const char* name, const int value) {
    obj->Set(NanNew<v8::String>(name), NanNew<v8::Int32>(value));
}

} // anonymous namespace

namespace libxmljs {

XmlSyntaxErrorsSync::XmlSyntaxErrorsSync() {
    errors = NanNew<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(this, ErrorFunc);
}

XmlSyntaxErrorsSync::~XmlSyntaxErrorsSync() {
    xmlSetStructuredErrorFunc(NULL, NULL);
}

v8::Local<v8::Value>
XmlSyntaxErrorsSync::BuildSyntaxError(xmlError* error) {
    v8::Local<v8::Value> err = v8::Exception::Error(
            NanNew<v8::String>(error->message));
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
    return err;
}

void
XmlSyntaxErrorsSync::ErrorFunc(void* errs, xmlError* error) {
    XmlSyntaxErrorsSync* self = static_cast<XmlSyntaxErrorsSync*>(errs);
    self->errors->Set(self->errors->Length(), BuildSyntaxError(error));
}

XmlSyntaxErrorsStore::~XmlSyntaxErrorsStore() {
    typedef std::vector<xmlError*>::reverse_iterator iter;
    for (iter i = errors.rbegin(), e = errors.rend(); i != e; ++i)
        FreeError(*i);
}

v8::Local<v8::Array>
XmlSyntaxErrorsStore::ToArray() {
    v8::Local<v8::Array> array = NanNew<v8::Array>(errors.size());
    for (uint32_t i = 0; i != errors.size(); ++i)
        array->Set(i, XmlSyntaxErrorsSync::BuildSyntaxError(errors[i]));
    return array;
}

void
XmlSyntaxErrorsStore::ErrorFunc(void* errs, xmlError* error) {
    XmlSyntaxErrorsStore* self = static_cast<XmlSyntaxErrorsStore*>(errs);
    xmlError* clone = CloneError(error);
    if (clone)
        self->errors.push_back(clone);
}

xmlError*
XmlSyntaxErrorsStore::CloneError(xmlError* err1) {
    if (!err1) return NULL;
    xmlError* err2 = static_cast<xmlError*>(xmlMalloc(sizeof(xmlError)));
    if (!err2) return NULL;
    *err2 = *err1;
    if(err1->message) err2->message = xmlMemStrdup(err1->message);
    if(err1->file   ) err2->file    = xmlMemStrdup(err1->file   );
    if(err1->str1   ) err2->str1    = xmlMemStrdup(err1->str1   );
    if(err1->str2   ) err2->str2    = xmlMemStrdup(err1->str2   );
    if(err1->str3   ) err2->str3    = xmlMemStrdup(err1->str3   );
    return err2;
}

void
XmlSyntaxErrorsStore::FreeError(xmlError* err) {
    if (err->message) xmlFree(err->message);
    if (err->file) xmlFree(err->file);
    if (err->str1) xmlFree(err->str1);
    if (err->str2) xmlFree(err->str2);
    if (err->str3) xmlFree(err->str3);
    xmlFree(err);
}

}  // namespace libxmljs
