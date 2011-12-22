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

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  writer->writerBuffer = xmlBufferCreate();
  if (!writer->writerBuffer) {
    return ThrowException(v8::Exception::Error(v8::String::New(
                    "Failed to create memory buffer")));
  }

  writer->textWriter = xmlNewTextWriterMemory(writer->writerBuffer, 0);
  if (!writer->textWriter) {
    xmlBufferFree(writer->writerBuffer);
    return ThrowException(v8::Exception::Error(v8::String::New(
                    "Failed to create buffer writer")));
  }

  return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value>
XmlTextWriter::OutputMemory(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  bool clear = args[0]->ToBoolean()->Value();

  // Flush the output buffer of the libxml writer instance in order to push all
  // the content to our writerBuffer.
  xmlTextWriterFlush(writer->textWriter);

  // Receive bytes from the writerBuffer
  const xmlChar *buf = xmlBufferContent(writer->writerBuffer);
  v8::Handle<v8::String> result = v8::String::New((const char*)buf);

  if (clear) {
    xmlBufferEmpty(writer->writerBuffer);
  }

  return scope.Close(result);
}

v8::Handle<v8::Value>
XmlTextWriter::StartDocument(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  v8::String::Utf8Value version(args[0]->ToString());
  v8::String::Utf8Value encoding(args[1]->ToString());
  v8::String::Utf8Value standalone(args[2]->ToString());

  int result = xmlTextWriterStartDocument(
          writer->textWriter,
          args[0]->IsUndefined() ? NULL : *version,
          args[1]->IsUndefined() ? NULL : *encoding,
          args[2]->IsUndefined() ? NULL : *standalone);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndDocument(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterEndDocument(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::StartElementNS(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  v8::String::Utf8Value prefix(args[0]->ToString());
  v8::String::Utf8Value name(args[1]->ToString());
  v8::String::Utf8Value namespaceURI(args[2]->ToString());

  int result = xmlTextWriterStartElementNS(
          writer->textWriter,
          args[0]->IsUndefined() ? NULL : (const xmlChar*)*prefix,
          args[1]->IsUndefined() ? NULL : (const xmlChar*)*name,
          args[2]->IsUndefined() ? NULL : (const xmlChar*)*namespaceURI);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndElement(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterEndElement(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::StartAttributeNS(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  v8::String::Utf8Value prefix(args[0]->ToString());
  v8::String::Utf8Value name(args[1]->ToString());
  v8::String::Utf8Value namespaceURI(args[2]->ToString());

  int result = xmlTextWriterStartAttributeNS(
          writer->textWriter,
          args[0]->IsUndefined() ? NULL : (const xmlChar*)*prefix,
          args[1]->IsUndefined() ? NULL : (const xmlChar*)*name,
          args[2]->IsUndefined() ? NULL : (const xmlChar*)*namespaceURI);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndAttribute(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterEndAttribute(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::StartCdata(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterStartCDATA(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndCdata(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterEndCDATA(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::StartComment(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterStartComment(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::EndComment(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  int result = xmlTextWriterEndComment(writer->textWriter);

  return scope.Close(v8::Number::New((double)result));
}

v8::Handle<v8::Value>
XmlTextWriter::WriteString(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlTextWriter *writer = ObjectWrap::Unwrap<XmlTextWriter>(args.Holder());

  v8::String::Utf8Value string(args[0]->ToString());

  int result = xmlTextWriterWriteString(writer->textWriter,
      (const xmlChar*)*string);

  return scope.Close(v8::Number::New((double)result));
}

void
XmlTextWriter::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  v8::Local<v8::FunctionTemplate> writer_t =
    v8::FunctionTemplate::New(NewTextWriter);

  v8::Persistent<v8::FunctionTemplate> xml_writer_template =
    v8::Persistent<v8::FunctionTemplate>::New(writer_t);

  xml_writer_template->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_openMemory",
          XmlTextWriter::OpenMemory);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_outputMemory",
          XmlTextWriter::OutputMemory);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_startDocument",
          XmlTextWriter::StartDocument);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_endDocument",
          XmlTextWriter::EndDocument);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_startElementNS",
          XmlTextWriter::StartElementNS);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_endElement",
          XmlTextWriter::EndElement);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_startAttributeNS",
          XmlTextWriter::StartAttributeNS);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_endAttribute",
          XmlTextWriter::EndAttribute);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_startCdata",
          XmlTextWriter::StartCdata);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_endCdata",
          XmlTextWriter::EndCdata);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_startComment",
          XmlTextWriter::StartComment);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_endComment",
          XmlTextWriter::EndComment);

  NODE_SET_PROTOTYPE_METHOD(xml_writer_template,
          "_writeString",
          XmlTextWriter::WriteString);

  target->Set(v8::String::NewSymbol("TextWriter"),
              xml_writer_template->GetFunction());
}
}  // namespace libxmljs
