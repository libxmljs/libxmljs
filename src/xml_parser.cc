// Copyright 2009, Squish Tech, LLC.
#include "./xml_parser.h"

#include "./xml_document.h"
#include "./xml_sax_parser.h"

namespace libxmljs {

v8::Handle<v8::Value>
ParseString(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseString with a string")));

  v8::String::Utf8Value str(args[0]->ToString());
  xmlResetLastError();
  xmlDoc *doc = xmlReadMemory(*str, str.length(), NULL, NULL, 0);
  if (doc == NULL) {
    xmlFreeDoc(doc);
    return v8::Null();
  }

  return LIBXMLJS_GET_MAYBE_BUILD(Document, xmlDoc, doc);
}

v8::Handle<v8::Value>
ParseHTML(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseHTML with a string")));

  v8::String::Utf8Value str(args[0]->ToString());
  xmlResetLastError();
  xmlDoc *doc = htmlReadMemory(*str, str.length(), NULL, NULL, 0);
  if (doc == NULL) {
    xmlFreeDoc(doc);
    return v8::Null();
  }

  return LIBXMLJS_GET_MAYBE_BUILD(Document, xmlDoc, doc);
}

v8::Handle<v8::Value>
ParseFile(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseFile with a filename")));

  v8::String::Utf8Value str(args[0]->ToString());
  xmlResetLastError();
  xmlDoc *doc = xmlReadFile(*str, NULL, 0);
  if (doc == NULL) {
    xmlFreeDoc(doc);
    return v8::Null();
  }

  return LIBXMLJS_GET_MAYBE_BUILD(Document, xmlDoc, doc);
}

void
Parser::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  LIBXMLJS_SET_METHOD(target, "parseHTML", ParseHTML);
  LIBXMLJS_SET_METHOD(target, "parseString", ParseString);
  LIBXMLJS_SET_METHOD(target, "parseFile", ParseFile);

  SaxParser::Initialize(target);
}
}  // namespace libxmljs
