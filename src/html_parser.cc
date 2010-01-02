// Copyright 2009, Squish Tech, LLC.
#include "./xml_syntax_error.h"
#include "./html_parser.h"
#include "./html_document.h"

namespace libxmljs {

inline v8::Handle<v8::Value>
BuildDoc(xmlDoc *doc, v8::Handle<v8::Array> errors) {
  if (doc == NULL) {
    xmlFreeDoc(doc);
    xmlError *error = xmlGetLastError();
    if (error) {
      return THROW_SYNTAX_ERROR(error);

    } else {
      return v8::ThrowException(v8::Exception::Error(
        v8::String::New("Could not parse XML string")));
    }
    return v8::Null();
  }

  v8::Handle<v8::Object> jsDoc =
    LXJS_GET_MAYBE_BUILD(HtmlDocument, xmlDoc, doc);
  HtmlDocument *document = LibXmlObj::Unwrap<HtmlDocument>(jsDoc);
  document->errors = v8::Persistent<v8::Array>::New(errors);
  return jsDoc;
}

v8::Handle<v8::Value>
ParseHtmlString(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseHtmlString with a string")));

  v8::Local<v8::Array> errors = v8::Array::New();
  void *errs = new JsObj(errors);
  xmlResetLastError();
  xmlSetStructuredErrorFunc(reinterpret_cast<void *>(errs),
                            XmlSyntaxError::PushToArray);

  v8::String::Utf8Value str(args[0]->ToString());
  htmlDocPtr doc = htmlReadMemory(*str, str.length(), NULL, NULL, 0);

  xmlSetStructuredErrorFunc(NULL, NULL);

  return BuildDoc(doc, errors);
}

v8::Handle<v8::Value>
ParseHtmlFile(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseHtmlFile with a filename")));

  v8::Local<v8::Array> errors = v8::Array::New();
  void *errs = new JsObj(errors);
  xmlResetLastError();
  xmlSetStructuredErrorFunc(reinterpret_cast<void *>(errs),
                            XmlSyntaxError::PushToArray);

  v8::String::Utf8Value str(args[0]->ToString());
  htmlDocPtr doc = htmlReadFile(*str, NULL, 0);

  xmlSetStructuredErrorFunc(NULL, NULL);

  return BuildDoc(doc, errors);
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
