// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_NAMESPACE_H_
#define SRC_XML_NAMESPACE_H_

#include <node.h>

#include <libxml/tree.h>

namespace libxmljs {

class XmlNamespace : public node::ObjectWrap {
public:

    xmlNs* xml_obj;

    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Persistent<v8::FunctionTemplate> constructor_template;

    explicit XmlNamespace(xmlNs* ns);
    XmlNamespace(xmlNs* node, const char* prefix, const char* href);
    ~XmlNamespace();

    static v8::Handle<v8::Object> New(xmlNs* ns);

protected:

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> Href(const v8::Arguments& args);
    static v8::Handle<v8::Value> Prefix(const v8::Arguments& args);

    v8::Handle<v8::Value> get_href();
    v8::Handle<v8::Value> get_prefix();

    friend class Node;
};
}  // namespace libxmljs

#endif  // SRC_XML_NAMESPACE_H_
