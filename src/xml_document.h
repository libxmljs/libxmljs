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
    static v8::Local<v8::Object> New(xmlDoc* doc);

    void ref() {
        Ref();
    }

    void unref() {
        Unref();
    }

protected:

    // initialize a new document
    explicit XmlDocument(xmlDoc* doc);

    static NAN_METHOD(New);
    static NAN_METHOD(FromHtml);
    static NAN_METHOD(FromXml);
    static NAN_METHOD(SetDtd);

    // document handle methods
    static NAN_METHOD(Root);
    static NAN_METHOD(GetDtd);
    static NAN_METHOD(Encoding);
    static NAN_METHOD(Version);
    static NAN_METHOD(Doc);
    static NAN_METHOD(Errors);
    static NAN_METHOD(ToString);
    static NAN_METHOD(Validate);
    static NAN_METHOD(RngValidate);	
};

}  // namespace libxmljs

#endif  // SRC_XML_DOCUMENT_H_
