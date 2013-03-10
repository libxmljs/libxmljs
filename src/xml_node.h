// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_NODE_H_
#define SRC_XML_NODE_H_

#include <libxml/tree.h>

namespace libxmljs {

class XmlNode : public node::ObjectWrap {
public:

    xmlNode* xml_obj;

    explicit XmlNode(xmlNode* node);
    virtual ~XmlNode();

    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Persistent<v8::FunctionTemplate> constructor_template;

    // create new XmlElement, XmlAttribute, etc. to wrap a libxml xmlNode
    static v8::Handle<v8::Value> New(xmlNode* node);

protected:

    static v8::Handle<v8::Value> Doc(const v8::Arguments& args);
    static v8::Handle<v8::Value> Namespace(const v8::Arguments& args);
    static v8::Handle<v8::Value> Namespaces(const v8::Arguments& args);
    static v8::Handle<v8::Value> Parent(const v8::Arguments& args);
    static v8::Handle<v8::Value> NextSibling(const v8::Arguments& args);
    static v8::Handle<v8::Value> PrevSibling(const v8::Arguments& args);
    static v8::Handle<v8::Value> LineNumber(const v8::Arguments& args);
    static v8::Handle<v8::Value> Type(const v8::Arguments& args);
    static v8::Handle<v8::Value> ToString(const v8::Arguments& args);
    static v8::Handle<v8::Value> Remove(const v8::Arguments& args);
    static v8::Handle<v8::Value> Clone(const v8::Arguments& args);

    v8::Handle<v8::Value> get_doc();
    v8::Handle<v8::Value> remove_namespace();
    v8::Handle<v8::Value> get_namespace();
    void set_namespace(xmlNs* ns);
    xmlNs * find_namespace(const char * search_str);
    v8::Handle<v8::Value> get_all_namespaces();
    v8::Handle<v8::Value> get_parent();
    v8::Handle<v8::Value> get_prev_sibling();
    v8::Handle<v8::Value> get_next_sibling();
    v8::Handle<v8::Value> get_line_number();
    v8::Handle<v8::Value> clone(bool recurse);
    v8::Handle<v8::Value> get_type();
    v8::Handle<v8::Value> to_string();
    void remove();
};

}  // namespace libxmljs

#endif  // SRC_XML_NODE_H_
