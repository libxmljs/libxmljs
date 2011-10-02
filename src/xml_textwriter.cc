// Copyright 2011, Squish Tech, LLC.
#include "xml_textwriter.h"

namespace libxmljs {

XmlTextWriter::XmlTextWriter() {
  textWriter = NULL;
  writerBuffer = NULL;
}

XmlTextWriter::~XmlTextWriter() {
  if (textWriter) {
    xmlFreeTextWriter(textWriter);
  }
  if (writerBuffer) {
    xmlBufferFree(writerBuffer);
  }
}

v8::Handle<v8::Value>
XmlTextWriter::NewTextWriter(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = new XmlTextWriter();
  writer->Wrap(args.This());

  return scope.Close(args.This());
}

v8::Handle<v8::Value>
XmlTextWriter::OpenMemory(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = LibXmlObj::Unwrap<XmlTextWriter>(args.Holder());
  if (writer->is_open()) {
    LIBXMLJS_THROW_EXCEPTION("openXXX may only be called once. Output already set.");
  }

  writer->open_memory();

  return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value>
XmlTextWriter::OutputMemory(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = LibXmlObj::Unwrap<XmlTextWriter>(args.Holder());

  bool flush = true;
  if (!args[0]->IsUndefined()) {
    LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                                 IsBoolean,
                                 "Bad Argument: must be a boolean");
    flush = args[0]->ToBoolean()->Value();
  }

  const xmlChar *buf = writer->output_memory();
  if (!writer->is_open()) {
    LIBXMLJS_THROW_EXCEPTION("No output method set. Call outputXXX once before trying to write.");
  }
  if (!writer->is_inmemory()) {
    LIBXMLJS_THROW_EXCEPTION("May not retreive output memory if this is not an inmemory writer opened using openMemory().");
  }

  v8::Handle<v8::String> result = v8::String::New((const char*)buf);

  if (flush) {
    writer->output_memory_flush();
  }

  return scope.Close(result);
}

v8::Handle<v8::Value>
XmlTextWriter::OpenURI(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: must be a string");

  XmlTextWriter *writer = LibXmlObj::Unwrap<XmlTextWriter>(args.Holder());
  if (writer->is_open()) {
    LIBXMLJS_THROW_EXCEPTION("openXXX may only be called once. Output already set.");
  }

  v8::String::Utf8Value uri(args[0]->ToString());
  writer->open_uri(*uri);

  return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value>
XmlTextWriter::StartDocument(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!args[0]->IsUndefined()) {
    LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                                 IsString,
                                 "Bad Argument: first argument of startDocument must be a string (e.g. '1.0' or undefined)");
  }
  if (!args[1]->IsUndefined()) {
    LIBXMLJS_ARGUMENT_TYPE_CHECK(args[1],
                                 IsString,
                                 "Bad Argument: second argument of startDocument must be a string (e.g. 'UTF-8' or undefined)");
  }
  if (!args[2]->IsUndefined()) {
    LIBXMLJS_ARGUMENT_TYPE_CHECK(args[2],
                                 IsString,
                                 "Bad Argument: third argument of startDocument must be a string (e.g. 'yes', 'no' or undefined)");
  }

  XmlTextWriter *writer = LibXmlObj::Unwrap<XmlTextWriter>(args.Holder());
  if (!writer->is_open()) {
    LIBXMLJS_THROW_EXCEPTION("No output method set. Call outputXXX once before trying to write.");
  }

  v8::String::Utf8Value version(args[0]->ToString());
  v8::String::Utf8Value encoding(args[1]->ToString());
  v8::String::Utf8Value standalone(args[2]->ToString());
  int result = writer->start_document(*version, *encoding, *standalone);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndDocument(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = LibXmlObj::Unwrap<XmlTextWriter>(args.Holder());
  if (!writer->is_open()) {
    LIBXMLJS_THROW_EXCEPTION("No output method set. Call outputXXX once before trying to write.");
  }

  int result = writer->end_document();

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::StartElementNS(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::EndElement(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::StartAttributeNS(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::EndAttribute(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::StartCdata(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::EndCdata(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::StartComment(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::EndComment(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

v8::Handle<v8::Value>
XmlTextWriter::WriteString(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::Boolean::New(true));
}

void
XmlTextWriter::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  v8::Local<v8::FunctionTemplate> writer_t =
    v8::FunctionTemplate::New(NewTextWriter);

  v8::Persistent<v8::FunctionTemplate> xml_writer_template =
    v8::Persistent<v8::FunctionTemplate>::New(writer_t);

  xml_writer_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "openMemory",
          XmlTextWriter::OpenMemory);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "outputMemory",
          XmlTextWriter::OutputMemory);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "openURI",
          XmlTextWriter::OpenURI);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "startDocument",
          XmlTextWriter::StartDocument);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "endDocument",
          XmlTextWriter::EndDocument);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "startElementNS",
          XmlTextWriter::StartElementNS);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "endElement",
          XmlTextWriter::EndElement);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "startAttributeNS",
          XmlTextWriter::StartAttributeNS);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "endAttribute",
          XmlTextWriter::EndAttribute);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "startCdata",
          XmlTextWriter::StartCdata);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "endCdata",
          XmlTextWriter::EndCdata);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "startComment",
          XmlTextWriter::StartComment);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "endComment",
          XmlTextWriter::EndComment);

  LXJS_SET_PROTO_METHOD(xml_writer_template,
          "writeString",
          XmlTextWriter::WriteString);

  target->Set(v8::String::NewSymbol("TextWriter"),
              xml_writer_template->GetFunction());
}


inline bool
XmlTextWriter::open_memory() {
  writerBuffer = xmlBufferCreate();
  if (!writerBuffer) {
    return false;
  }

  textWriter = xmlNewTextWriterMemory(writerBuffer, 0);
  if (!textWriter) {
    xmlBufferFree(writerBuffer);
    return false;
  }

  return true;
}

const xmlChar*
XmlTextWriter::output_memory() {
  return xmlBufferContent(writerBuffer);
}

inline void
XmlTextWriter::output_memory_flush() {
  xmlBufferEmpty(writerBuffer);
}

inline bool
XmlTextWriter::open_uri(const char *uri) {
  textWriter = xmlNewTextWriterFilename(uri, 0);
  return (textWriter != NULL);
}

inline bool
XmlTextWriter::is_open() {
  return (textWriter != NULL);
}

inline bool
XmlTextWriter::is_inmemory() {
  return (writerBuffer != NULL);
}

inline int
XmlTextWriter::start_document(const char *version, const char *charset, const char* standalone) {
  return xmlTextWriterStartDocument(textWriter, version, charset, NULL);
}

inline int
XmlTextWriter::end_document() {
  return xmlTextWriterEndDocument(textWriter);
}

}  // namespace libxmljs
