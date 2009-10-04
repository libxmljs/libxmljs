// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_DOCUMENT_H_
#define SRC_DOCUMENT_H_

#include "libxmljs.h"
#include "object_wrap.h"

namespace libxmljs {

#define DOCUMENT_SYMBOL v8::String::NewSymbol("document")

class Document : public ObjectWrap {
  // Ensure that libxml is properly initialised:
  class Init {
    public:

    Init();
    virtual ~Init();
  };

  public:

  xmlDoc * xml_obj;
  explicit Document(xmlDoc* document) : xml_obj(document) {}
  static void Initialize(v8::Handle<v8::Object> target);
  static v8::Persistent<v8::FunctionTemplate> constructor_template;

  protected:

  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> Root(const v8::Arguments& args);
  static v8::Handle<v8::Value> Encoding(const v8::Arguments& args);
  static v8::Handle<v8::Value> Doc(const v8::Arguments& args);
  static v8::Handle<v8::Value> ToString(const v8::Arguments& args);

  static v8::Handle<v8::Value> GetProperty(
    v8::Local<v8::String> property,
    const v8::AccessorInfo& info);

  virtual ~Document();

  void init_document(const char * version);
  void set_encoding(const char * encoding);
  v8::Handle<v8::Value> get_encoding();
  v8::Handle<v8::Value> get_version();
  v8::Handle<v8::Value> to_string();
  v8::Handle<v8::Value> get_root();
  void set_root(xmlNodePtr node);
  bool has_root();

  private:

  static Init init_;
};

}  // namespace libxmljs

#endif  // SRC_DOCUMENT_H_
