#ifndef __document_h__
#define __document_h__

#include "libxmljs.h"
#include "object_wrap.h"

namespace libxmljs {

#define DOCUMENT_SYMBOL String::NewSymbol("document")

class Document : public ObjectWrap {
public:
  _xmlDoc* doc;

  Document();

  Document(
    const char * version);

  void
  init_document(
    const char * version);

  _xmlDoc *
  get_document()
  { return doc; }

  virtual ~Document();

  static void
  Initialize(
    v8::Handle<v8::Object> target);

  static v8::Handle<v8::Value>
  New(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  Root(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  Encoding(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  GetProperty(
    v8::Local<v8::String> property,
    const v8::AccessorInfo& info);

  static void
  SetEncoding(
    v8::Local<v8::String> property,
    v8::Local<v8::Value> value,
    const v8::AccessorInfo& info);

  static v8::Handle<v8::Value>
  ToString(
    const v8::Arguments& args);

  void
  set_encoding(
    const char * encoding);

  v8::Handle<v8::Value>
  get_encoding();

  v8::Handle<v8::Value>
  get_version();

  v8::Handle<v8::Value>
  to_string();

  v8::Handle<v8::Value>
  get_root();

  void
  set_root(
    xmlNodePtr node);

  bool
  has_root();
};

} // namespace libxmljs

#endif //__document_h__
