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

    static void Initialize(v8::Local<v8::Object> target);
    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    static v8::Local<v8::Object> New(xmlNode* xml_obj,
            const xmlChar* name, const xmlChar* value);

    static v8::Local<v8::Object> New(xmlAttr* attr);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Name);
    static NAN_METHOD(Value);
    static NAN_METHOD(Node);
    static NAN_METHOD(Namespace);

    v8::Local<v8::Value> get_name();
    v8::Local<v8::Value> get_value();
    void set_value(const char* value);
    v8::Local<v8::Value> get_element();
    v8::Local<v8::Value> get_namespace();
};

}  // namespace libxmljs

#endif  // SRC_XML_ATTRIBUTE_H_
