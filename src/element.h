// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_ELEMENT_H_
#define SRC_ELEMENT_H_

#include "libxmljs.h"
#include "node.h"

namespace libxmljs {

class Element : public Node {
  public:

  explicit Element(xmlNode* node) : Node(node) {}

  static void Initialize(v8::Handle<v8::Object> target);
  static v8::Persistent<v8::FunctionTemplate> constructor_template;

  protected:

  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> Name(const v8::Arguments& args);
  static v8::Handle<v8::Value> Attr(const v8::Arguments& args);
  static v8::Handle<v8::Value> Attrs(const v8::Arguments& args);
  static v8::Handle<v8::Value> Find(const v8::Arguments& args);
  static v8::Handle<v8::Value> Text(const v8::Arguments& args);
  static v8::Handle<v8::Value> Path(const v8::Arguments& args);
  static v8::Handle<v8::Value> Child(const v8::Arguments& args);
  static v8::Handle<v8::Value> Children(const v8::Arguments& args);
  static v8::Handle<v8::Value> AddChild(const v8::Arguments& args);

  void set_name(const char* name);

  v8::Handle<v8::Value> get_name();
  v8::Handle<v8::Value> get_child(double idx);
  v8::Handle<v8::Value> get_children();
  v8::Handle<v8::Value> get_path();
  v8::Handle<v8::Value> get_attr(const char* name);
  v8::Handle<v8::Value> get_attrs();
  void set_attr(const char* name, const char* value);
  void add_child(Element* child);
  void set_content(const char* content);
  v8::Handle<v8::Value> get_content();
  v8::Handle<v8::Value> find(const char* xpath);
};

}  // namespace libxmljs

#endif  // SRC_ELEMENT_H_
