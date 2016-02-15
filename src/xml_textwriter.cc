// Copyright 2011, Squish Tech, LLC.

#include "libxmljs.h"
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

NAN_METHOD(XmlTextWriter::NewTextWriter) {
  Nan::HandleScope scope;
  XmlTextWriter *writer = new XmlTextWriter();
  writer->Wrap(info.Holder());

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlTextWriter::OpenMemory) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  writer->writerBuffer = xmlBufferCreate();
  if (!writer->writerBuffer) {
    return Nan::ThrowError("Failed to create memory buffer");
  }

  writer->textWriter = xmlNewTextWriterMemory(writer->writerBuffer, 0);
  if (!writer->textWriter) {
    xmlBufferFree(writer->writerBuffer);
    return Nan::ThrowError("Failed to create buffer writer");
  }

  return info.GetReturnValue().Set(Nan::Undefined());
}

NAN_METHOD(XmlTextWriter::BufferContent) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  // Flush the output buffer of the libxml writer instance in order to push all
  // the content to our writerBuffer.
  xmlTextWriterFlush(writer->textWriter);

  // Receive bytes from the writerBuffer
  const xmlChar *buf = xmlBufferContent(writer->writerBuffer);

  return info.GetReturnValue().Set(Nan::New<v8::String>((const char*)buf,
              xmlBufferLength(writer->writerBuffer)).ToLocalChecked());
}

NAN_METHOD(XmlTextWriter::BufferEmpty) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  // Flush the output buffer of the libxml writer instance in order to push all
  // the content to our writerBuffer.
  xmlTextWriterFlush(writer->textWriter);

  // Clear the memory buffer
  xmlBufferEmpty(writer->writerBuffer);

  return info.GetReturnValue().Set(Nan::Undefined());
}

NAN_METHOD(XmlTextWriter::StartDocument) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  v8::String::Utf8Value version(info[0]->ToString());
  v8::String::Utf8Value encoding(info[1]->ToString());
  v8::String::Utf8Value standalone(info[2]->ToString());

  int result = xmlTextWriterStartDocument(
          writer->textWriter,
          info[0]->IsUndefined() ? NULL : *version,
          info[1]->IsUndefined() ? NULL : *encoding,
          info[2]->IsUndefined() ? NULL : *standalone);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::EndDocument) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterEndDocument(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::StartElementNS) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  v8::String::Utf8Value prefix(info[0]->ToString());
  v8::String::Utf8Value name(info[1]->ToString());
  v8::String::Utf8Value namespaceURI(info[2]->ToString());

  int result = xmlTextWriterStartElementNS(
          writer->textWriter,
          info[0]->IsUndefined() ? NULL : (const xmlChar*)*prefix,
          info[1]->IsUndefined() ? NULL : (const xmlChar*)*name,
          info[2]->IsUndefined() ? NULL : (const xmlChar*)*namespaceURI);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::EndElement) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterEndElement(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::StartAttributeNS) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  v8::String::Utf8Value prefix(info[0]->ToString());
  v8::String::Utf8Value name(info[1]->ToString());
  v8::String::Utf8Value namespaceURI(info[2]->ToString());

  int result = xmlTextWriterStartAttributeNS(
          writer->textWriter,
          info[0]->IsUndefined() ? NULL : (const xmlChar*)*prefix,
          info[1]->IsUndefined() ? NULL : (const xmlChar*)*name,
          info[2]->IsUndefined() ? NULL : (const xmlChar*)*namespaceURI);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::EndAttribute) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterEndAttribute(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::StartCdata) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterStartCDATA(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::EndCdata) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterEndCDATA(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::StartComment) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterStartComment(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::EndComment) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  int result = xmlTextWriterEndComment(writer->textWriter);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

NAN_METHOD(XmlTextWriter::WriteString) {
  Nan::HandleScope scope;

  XmlTextWriter *writer = Nan::ObjectWrap::Unwrap<XmlTextWriter>(info.Holder());

  v8::String::Utf8Value string(info[0]->ToString());

  int result = xmlTextWriterWriteString(writer->textWriter,
      (const xmlChar*)*string);

  return info.GetReturnValue().Set(Nan::New<v8::Number>((double)result));
}

void
XmlTextWriter::Initialize(v8::Handle<v8::Object> target) {
  Nan::HandleScope scope;

  v8::Local<v8::FunctionTemplate> writer_t =
    Nan::New<v8::FunctionTemplate>(NewTextWriter);

  Nan::Persistent<v8::FunctionTemplate> xml_writer_template;
  xml_writer_template.Reset(writer_t);


  writer_t->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(writer_t,
          "_openMemory",
          XmlTextWriter::OpenMemory);

  Nan::SetPrototypeMethod(writer_t,
          "_bufferContent",
          XmlTextWriter::BufferContent);

  Nan::SetPrototypeMethod(writer_t,
          "_bufferEmpty",
          XmlTextWriter::BufferEmpty);

  Nan::SetPrototypeMethod(writer_t,
          "_startDocument",
          XmlTextWriter::StartDocument);

  Nan::SetPrototypeMethod(writer_t,
          "_endDocument",
          XmlTextWriter::EndDocument);

  Nan::SetPrototypeMethod(writer_t,
          "_startElementNS",
          XmlTextWriter::StartElementNS);

  Nan::SetPrototypeMethod(writer_t,
          "_endElement",
          XmlTextWriter::EndElement);

  Nan::SetPrototypeMethod(writer_t,
          "_startAttributeNS",
          XmlTextWriter::StartAttributeNS);

  Nan::SetPrototypeMethod(writer_t,
          "_endAttribute",
          XmlTextWriter::EndAttribute);

  Nan::SetPrototypeMethod(writer_t,
          "_startCdata",
          XmlTextWriter::StartCdata);

  Nan::SetPrototypeMethod(writer_t,
          "_endCdata",
          XmlTextWriter::EndCdata);

  Nan::SetPrototypeMethod(writer_t,
          "_startComment",
          XmlTextWriter::StartComment);

  Nan::SetPrototypeMethod(writer_t,
          "_endComment",
          XmlTextWriter::EndComment);

  Nan::SetPrototypeMethod(writer_t,
          "_writeString",
          XmlTextWriter::WriteString);

  Nan::Set(target, Nan::New<v8::String>("TextWriter").ToLocalChecked(),
              writer_t->GetFunction());
}
}  // namespace libxmljs
