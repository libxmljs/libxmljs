// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_TEXTWRITER_H_
#define SRC_XML_TEXTWRITER_H_

#include "libxmljs.h"

namespace libxmljs {

class XmlTextWriter : public LibXmlObj {
  public:

  XmlTextWriter();
  virtual ~XmlTextWriter();

  static void
  Initialize(v8::Handle<v8::Object> target);

  static v8::Handle<v8::Value>
  NewTextWriter(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  OpenMemory(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  OutputMemory(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  OpenURI(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  StartDocument(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  EndDocument(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  StartElementNS(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  EndElement(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  StartAttributeNS(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  EndAttribute(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  StartCdata(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  EndCdata(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  StartComment(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  EndComment(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  WriteString(const v8::Arguments& args);


  private:
  xmlTextWriterPtr textWriter;

  void open_memory();

  char* output_memory(bool flush);

  void open_uri(const char *filename);

  int start_document(const char *version, const char *charset, bool standalone);

  int end_document();
};
}

#endif  // SRC_XML_TEXTWRITER_H_
