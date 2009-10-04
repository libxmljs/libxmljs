// Copyright 2009, Squish Tech, LLC.
#include "parser.h"

#include "sax_parser.h"

namespace libxmljs {

v8::Handle<v8::Value>
ParseString(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseString with a string")));

  Parser * parser = new Parser();
  v8::String::Utf8Value str(args[0]->ToString());
  return parser->parse_string(*str, str.length());
}

v8::Handle<v8::Value>
ParseFile(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsString())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("Must supply parseFile with a filename")));

  Parser * parser = new Parser();
  v8::String::Utf8Value str(args[0]->ToString());
  return parser->parse_file(*str);
}

void
Parser::initializeContext() {
  assert(context_);
  context_->validate = 0;
  context_->_private = this;
}

void
Parser::releaseContext() {
  if (context_) {
    context_->_private = 0;
    if (context_->myDoc != NULL)
      xmlFreeDoc(context_->myDoc);

    xmlFreeParserCtxt(context_);
    context_ = 0;
  }
}

v8::Handle<v8::Value>
Parser::parse_file(const char * filename) {
  releaseContext();  // Free any existing document.

  // The following is based on the implementation of
  // xmlParseFile(), in xmlSAXParseFileWithData():
  context_ = xmlCreateFileParserCtxt(filename);

  if (context_->directory == 0) {
    xmlChar* directory = reinterpret_cast<xmlChar*>(xmlParserGetDirectory(filename));
    context_->directory = reinterpret_cast<char *>(xmlStrdup(directory));
  }

  return parse_context();
}

v8::Handle<v8::Value>
Parser::parse_string(const char * str, int len) {
  releaseContext();  // Free any existing document.

  // The following is based on the implementation of
  // xmlParseFile(), in xmlSAXParseFileWithData():
  context_ = xmlCreateMemoryParserCtxt(str, len);
  return parse_context();
}

v8::Handle<v8::Value>
Parser::parse_context() {
  // The following is based on the implementation of
  // xmlParseFile(), in xmlSAXParseFileWithData():
  // and the implementation of xmlParseMemory(), in
  // xmlSaxParseMemoryWithData().
  initializeContext();

  if (!context_)
    return v8::Null();

  xmlParseDocument(context_);

  if (!context_->wellFormed) {
    releaseContext();  // Free doc_;
    return v8::Null();
  }

  if (context_->errNo != 0) {
    releaseContext();
    return v8::Null();
  }

  v8::Persistent<v8::Object> doc = XmlObj::Unwrap(context_->myDoc);

  // This is to indicate to release_underlying that we took the
  // ownership on the doc.
  context_->myDoc = NULL;

  // Free the parse context, but keep the document alive
  // so people can navigate the DOM tree:
  // TODO(sprsquish): Why not keep the context alive too?
  releaseContext();

  return doc;
}

void
Parser::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  LIBXMLJS_SET_METHOD(target, "parseString", ParseString);
  LIBXMLJS_SET_METHOD(target, "parseFile", ParseFile);

  SaxParser::Initialize(target);
}
}  // namespace libxmljs
