#ifndef __document_h__
#define __document_h__

#include "libxmljs.h"
#include "object_wrap.h"

#include <libxml/xmlstring.h>

namespace libxmljs {

#define VERSION_SYMBOL  String::NewSymbol("version")
#define DOCUMENT_SYMBOL String::NewSymbol("document")
#define ENCODING_SYMBOL     String::NewSymbol("encoding")

#define UNWRAP_DOCUMENT(from)                               \
  Document *document = ObjectWrap::Unwrap<Document>(from);  \
  assert(document);

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

  const char *
  get_encoding();

  const char *
  get_version();

  void
  to_string(
    char ** str,
    int * len);

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
