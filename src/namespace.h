#ifndef __namespace_h__
#define __namespace_h__

#include "libxmljs.h"
#include "object_wrap.h"

namespace libxmljs {

class Namespace : public ObjectWrap {
public:
  xmlNs * xml_obj;
  static void Initialize(v8::Handle<v8::Object> target);
  static v8::Persistent<v8::FunctionTemplate> constructor_template;

  Namespace(xmlNs * ns) : xml_obj(ns) {}
  Namespace(xmlNode * node, const char * prefix, const char * href);

  static v8::Handle<v8::Value> New(xmlNs * ns);

protected:
  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> Node(const v8::Arguments& args);
  static v8::Handle<v8::Value> Href(const v8::Arguments& args);
  static v8::Handle<v8::Value> Prefix(const v8::Arguments& args);

  v8::Handle<v8::Value> get_node();
  v8::Handle<v8::Value> get_href();
  v8::Handle<v8::Value> get_prefix();

};


} // namespace libxmljs

#endif //__namespace_h__
