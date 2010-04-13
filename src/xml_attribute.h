// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_ATTRIBUTE_H_
#define SRC_XML_ATTRIBUTE_H_

#include "libxmljs.h"
#include "xml_element.h"
#include "xml_namespace.h"

namespace libxmljs {

class XmlAttribute : public XmlNode {
  public:

  explicit XmlAttribute(xmlAttr* node) :
    XmlNode(reinterpret_cast<xmlNode*>(node)) {}

  static void Initialize(v8::Handle<v8::Object> target);
  static v8::Persistent<v8::FunctionTemplate> constructor_template;

  protected:

  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> Name(const v8::Arguments& args);
  static v8::Handle<v8::Value> Value(const v8::Arguments& args);
  static v8::Handle<v8::Value> Node(const v8::Arguments& args);

  v8::Handle<v8::Value> get_name();
  v8::Handle<v8::Value> get_value();
  void set_value(const char* value);
  v8::Handle<v8::Value> get_element();
};

}  // namespace libxmljs

#endif  // SRC_XML_ATTRIBUTE_H_
