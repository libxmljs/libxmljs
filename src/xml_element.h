// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_ELEMENT_H_
#define SRC_XML_ELEMENT_H_

#include "libxmljs.h"
#include "xml_node.h"

namespace libxmljs {

class XmlElement : public XmlNode {
public:

    explicit XmlElement(xmlNode* node);

    static void Initialize(v8::Local<v8::Object> target);

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml element to wrap the node
    static v8::Local<v8::Object> New(xmlNode* node);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Name);
    static NAN_METHOD(Attr);
    static NAN_METHOD(Attrs);
    static NAN_METHOD(Find);
    static NAN_METHOD(Text);
    static NAN_METHOD(Path);
    static NAN_METHOD(Child);
    static NAN_METHOD(ChildNodes);
    static NAN_METHOD(AddChild);
    static NAN_METHOD(AddCData);
    static NAN_METHOD(NextElement);
    static NAN_METHOD(PrevElement);
    static NAN_METHOD(AddPrevSibling);
    static NAN_METHOD(AddNextSibling);
    static NAN_METHOD(Replace);

    void set_name(const char* name);

    v8::Local<v8::Value> get_name();
    v8::Local<v8::Value> get_child(int32_t idx);
    v8::Local<v8::Value> get_child_nodes();
    v8::Local<v8::Value> get_path();
    v8::Local<v8::Value> get_attr(const char* name);
    v8::Local<v8::Value> get_attrs();
    void set_attr(const char* name, const char* value);
    void add_cdata(xmlNode* cdata);
    void unlink_children();
    void set_content(const char* content);
    v8::Local<v8::Value> get_content();
    v8::Local<v8::Value> get_next_element();
    v8::Local<v8::Value> get_prev_element();
    void replace_element(xmlNode* element);
    void replace_text(const char* content);
    bool child_will_merge(xmlNode* child);
    bool prev_sibling_will_merge(xmlNode* node);
    bool next_sibling_will_merge(xmlNode* node);
};

}  // namespace libxmljs

#endif  // SRC_XML_ELEMENT_H_
