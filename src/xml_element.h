// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_ELEMENT_H_
#define SRC_XML_ELEMENT_H_

#include "libxmljs.h"
#include "xml_non_attribute_node.h"
#include "xml_node.h"

namespace libxmljs {

class XmlElement : public XmlNonAttributeNode {
public:

    explicit XmlElement(xmlNode* node);

    static void Initialize(v8::Handle<v8::Object> target);

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml element to wrap the node
    static v8::Local<v8::Object> New(xmlNode* node);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Name);
    static NAN_METHOD(Attr);
    static NAN_METHOD(Attrs);
    static NAN_METHOD(Find);
    static NAN_METHOD(Child);
    static NAN_METHOD(ChildNodes);
    static NAN_METHOD(AddChild);
    static NAN_METHOD(AddCData);

    void set_name(const char* name);
    v8::Local<v8::Value> get_name();
    v8::Local<v8::Value> get_child(int32_t idx);
    v8::Local<v8::Value> get_child_nodes();
    v8::Local<v8::Value> get_attr(const char* name);
    v8::Local<v8::Value> get_attrs();
    void set_attr(const char* name, const char* value);
    void add_child(xmlNode* child);
    bool child_will_merge(xmlNode* child);
};

}  // namespace libxmljs

#endif  // SRC_XML_ELEMENT_H_
