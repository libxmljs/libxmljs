// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_DOCUMENT_H_
#define SRC_XML_DOCUMENT_H_

#include <libxml/tree.h>

#include "libxmljs.h"

namespace libxmljs {

class XmlDocument : public node::ObjectWrap {

    // used to create new instanced of a document handle
    static v8::Persistent<v8::FunctionTemplate> constructor_template;

public:
    // TODO make private with accessor
    xmlDoc* xml_obj;

    virtual ~XmlDocument();

    // setup the document handle bindings and internal constructor
    static void Initialize(v8::Handle<v8::Object> target);

    // create a new document handle initalized with the
    // given xmlDoc object, intended for use in c++ space
    static v8::Handle<v8::Object> New(xmlDoc* doc);

    void ref() {
        Ref();
    }

    void unref() {
        Unref();
    }

protected:

    // initialize a new document
    explicit XmlDocument(xmlDoc* doc);

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> FromHtml(const v8::Arguments& args);
    static v8::Handle<v8::Value> FromXml(const v8::Arguments& args);
    static v8::Handle<v8::Value> SetDtd(const v8::Arguments& args);

    // document handle methods
    static v8::Handle<v8::Value> Root(const v8::Arguments& args);
    static v8::Handle<v8::Value> Encoding(const v8::Arguments& args);
    static v8::Handle<v8::Value> Version(const v8::Arguments& args);
    static v8::Handle<v8::Value> Doc(const v8::Arguments& args);
    static v8::Handle<v8::Value> Errors(const v8::Arguments& args);
    static v8::Handle<v8::Value> ToString(const v8::Arguments& args);
    static v8::Handle<v8::Value> Validate(const v8::Arguments& args);
};

}  // namespace libxmljs

#endif  // SRC_XML_DOCUMENT_H_
