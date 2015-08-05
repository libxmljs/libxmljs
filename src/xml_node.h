// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_NODE_H_
#define SRC_XML_NODE_H_

#include <libxml/tree.h>
#include "nan.h"

namespace libxmljs {

class XmlNode : public Nan::ObjectWrap {
public:

    xmlNode* xml_obj;

    // boolean value to check if `xml_obj` was already freed
    bool freed;

    // backup reference to the doc in case `xml_obj` was already freed
    xmlDoc* doc;

    explicit XmlNode(xmlNode* node);
    virtual ~XmlNode();

    static void Initialize(v8::Handle<v8::Object> target);
    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new XmlElement, XmlAttribute, etc. to wrap a libxml xmlNode
    static v8::Local<v8::Value> New(xmlNode* node);

protected:

    static NAN_METHOD(Doc);
    static NAN_METHOD(Namespace);
    static NAN_METHOD(Namespaces);
    static NAN_METHOD(Parent);
    static NAN_METHOD(NextSibling);
    static NAN_METHOD(PrevSibling);
    static NAN_METHOD(LineNumber);
    static NAN_METHOD(Type);
    static NAN_METHOD(ToString);
    static NAN_METHOD(Remove);
    static NAN_METHOD(Clone);

    v8::Local<v8::Value> get_doc();
    v8::Local<v8::Value> remove_namespace();
    v8::Local<v8::Value> get_namespace();
    void set_namespace(xmlNs* ns);
    xmlNs * find_namespace(const char * search_str);
    v8::Local<v8::Value> get_all_namespaces();
    v8::Local<v8::Value> get_parent();
    v8::Local<v8::Value> get_prev_sibling();
    v8::Local<v8::Value> get_next_sibling();
    v8::Local<v8::Value> get_line_number();
    v8::Local<v8::Value> clone(bool recurse);
    v8::Local<v8::Value> get_type();
    v8::Local<v8::Value> to_string(int options = 0);
    void remove();
};

}  // namespace libxmljs

#endif  // SRC_XML_NODE_H_
