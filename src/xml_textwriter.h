// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_TEXTWRITER_H_
#define SRC_XML_TEXTWRITER_H_

#include <node.h>
#include <libxml/xmlwriter.h>

namespace libxmljs {

class XmlTextWriter : public Nan::ObjectWrap {
  public:

  XmlTextWriter();
  virtual ~XmlTextWriter();

  static void
  Initialize(v8::Handle<v8::Object> target);

  static NAN_METHOD(NewTextWriter);

  static NAN_METHOD(OpenMemory);

  static NAN_METHOD(BufferContent);

  static NAN_METHOD(BufferEmpty);

  static NAN_METHOD(StartDocument);

  static NAN_METHOD(EndDocument);

  static NAN_METHOD(StartElementNS);

  static NAN_METHOD(EndElement);

  static NAN_METHOD(StartAttributeNS);

  static NAN_METHOD(EndAttribute);

  static NAN_METHOD(StartCdata);

  static NAN_METHOD(EndCdata);

  static NAN_METHOD(StartComment);

  static NAN_METHOD(EndComment);

  static NAN_METHOD(WriteString);


  private:
  xmlTextWriterPtr textWriter;
  xmlBufferPtr  writerBuffer;

  bool is_open();

  bool is_inmemory();
};
}

#endif  // SRC_XML_TEXTWRITER_H_
