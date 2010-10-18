// Copyright 2009, Squish Tech, LLC.
#include "xml_syntax_error.h"
#include "html_parser.h"
#include "html_document.h"

namespace libxmljs {

inline v8::Handle<v8::Value>
BuildDoc(xmlDoc *doc, v8::Handle<v8::Array> errors) {
  v8::HandleScope scope;
  if (doc == NULL) {
    xmlFree(doc);
    xmlError *error = xmlGetLastError();
    if (error) {
        return v8::ThrowException(XmlSyntaxError::BuildSyntaxError(error));
    } else {
      return v8::ThrowException(v8::Exception::Error(
        v8::String::New("Could not parse XML string")));
    }

    return v8::Null();
  }

  v8::Handle<v8::Object> jsDoc =
      LibXmlObj::GetMaybeBuild<HtmlDocument, xmlDoc>(doc);
  HtmlDocument *document = LibXmlObj::Unwrap<HtmlDocument>(jsDoc);
  document->errors = v8::Persistent<v8::Array>::New(errors);
  return scope.Close(jsDoc);
}

v8::Handle<v8::Value>
ParseHtmlString(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseHtmlString with a string")));

  v8::Persistent<v8::Array> errors = v8::Persistent<v8::Array>::New(
      v8::Array::New());
  xmlResetLastError();
  xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
                            XmlSyntaxError::PushToArray);

  v8::String::Utf8Value str(args[0]->ToString());
  htmlDocPtr doc = htmlReadMemory(*str, str.length(), NULL, NULL, 0);

  xmlSetStructuredErrorFunc(NULL, NULL);

  return scope.Close(BuildDoc(doc, errors));
}

v8::Handle<v8::Value>
ParseHtmlFile(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseHtmlFile with a filename")));

  v8::Persistent<v8::Array> errors = v8::Persistent<v8::Array>::New(
      v8::Array::New());
  xmlResetLastError();
  xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
                            XmlSyntaxError::PushToArray);

  v8::String::Utf8Value str(args[0]->ToString());
  htmlDocPtr doc = htmlReadFile(*str, NULL, 0);

  xmlSetStructuredErrorFunc(NULL, NULL);

  return scope.Close(BuildDoc(doc, errors));
}

void
HtmlParser::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  LIBXMLJS_SET_METHOD(target,
                      "parseHtmlString",
                      ParseHtmlString);

  LIBXMLJS_SET_METHOD(target,
                      "parseHtmlFile",
                      ParseHtmlFile);
}
}  // namespace libxmljs
