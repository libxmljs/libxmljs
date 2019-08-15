// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_NAMESPACE_H_
#define SRC_XML_NAMESPACE_H_

#include <node.h>

#include <libxml/tree.h>
#include "nan.h"

namespace libxmljs {

class XmlNamespace : public Nan::ObjectWrap {
public:

    xmlNs* xml_obj;

    xmlDoc* context; // reference-managed context

    static void Initialize(v8::Local<v8::Object> target);
    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    explicit XmlNamespace(xmlNs* ns);
    XmlNamespace(xmlNs* node, const char* prefix, const char* href);
    ~XmlNamespace();

    static v8::Local<v8::Object> New(xmlNs* ns);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Href);
    static NAN_METHOD(Prefix);

    v8::Local<v8::Value> get_href();
    v8::Local<v8::Value> get_prefix();

    friend class Node;
};
}  // namespace libxmljs

#endif  // SRC_XML_NAMESPACE_H_
