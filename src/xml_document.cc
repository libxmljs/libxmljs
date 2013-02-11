// Copyright 2009, Squish Tech, LLC.

#include <node.h>
#include <node_buffer.h>

#include <cstring>

#include <libxml/HTMLparser.h>
#include <libxml/xmlschemas.h>

#include "xml_document.h"
#include "xml_element.h"
#include "xml_namespace.h"
#include "xml_syntax_error.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlDocument::constructor_template;

v8::Handle<v8::Value>
XmlDocument::Encoding(const v8::Arguments& args)
{
    v8::HandleScope scope;
    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    // if no args, get the encoding
    if (args.Length() == 0 || args[0]->IsUndefined()) {
        if (document->xml_obj->encoding)
            return scope.Close(v8::String::New(
                        (const char *)document->xml_obj->encoding,
                        xmlStrlen((const xmlChar*)document->xml_obj->encoding)));

        return v8::Null();
    }

    // set the encoding otherwise
    v8::String::Utf8Value encoding(args[0]->ToString());
    if(document->xml_obj->encoding != NULL) {
        xmlFree((xmlChar*)document->xml_obj->encoding);
    }

    document->xml_obj->encoding = xmlStrdup((const xmlChar*)*encoding);
    return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlDocument::Version(const v8::Arguments& args)
{
    v8::HandleScope scope;
    XmlDocument *document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    if (document->xml_obj->version)
        return scope.Close(v8::String::New((const char *)document->xml_obj->version,
                    xmlStrlen((const xmlChar*)document->xml_obj->version)));

    return v8::Null();
}

v8::Handle<v8::Value>
XmlDocument::Root(const v8::Arguments& args)
{
    v8::HandleScope scope;
    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    xmlNode* root = xmlDocGetRootElement(document->xml_obj);

    if (args.Length() == 0 || args[0]->IsUndefined())
    {
        if (!root) {
            return v8::Null();
        }
        return scope.Close(XmlElement::New(root));
    }

    if (root != NULL) {
        return ThrowException(v8::Exception::Error(
                    v8::String::New("Holder document already has a root node")));
    }

    // set the element as the root element for the document
    // allows for proper retrieval of root later
    XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
    assert(element);
    xmlDocSetRootElement(document->xml_obj, element->xml_obj);
    return scope.Close(args[0]);
}

v8::Handle<v8::Value>
XmlDocument::SetDtd(const v8::Arguments& args)
{
    v8::HandleScope scope;

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    v8::String::Utf8Value name(args[0]);

    v8::Handle<v8::Value> extIdOpt;
    v8::Handle<v8::Value> sysIdOpt;
    if (args.Length() > 1 && args[1]->IsString()) {
      extIdOpt = args[1];
    }
    if (args.Length() > 2 && args[2]->IsString()) {
      sysIdOpt = args[2];
    }

    v8::String::Utf8Value extIdRaw(extIdOpt);
    v8::String::Utf8Value sysIdRaw(sysIdOpt);

    //must be set to null in order for xmlCreateIntSubset to ignore them
    const char* extId = (extIdRaw.length()) ? *extIdRaw : NULL;
    const char* sysId = (sysIdRaw.length()) ? *sysIdRaw : NULL;

    //No good way of unsetting the doctype if it is previously set...this allows us to.
    xmlDtdPtr dtd = xmlGetIntSubset(document->xml_obj);

    xmlUnlinkNode((xmlNodePtr) dtd);
    xmlFreeNode((xmlNodePtr) dtd);

    xmlCreateIntSubset(document->xml_obj, (const xmlChar *) *name, (const xmlChar *) extId, (const xmlChar *) sysId);

    return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlDocument::ToString(const v8::Arguments& args)
{
    v8::HandleScope scope;

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    xmlChar* buffer = NULL;
    int len = 0;
    xmlDocDumpFormatMemoryEnc(document->xml_obj, &buffer, &len, "UTF-8", args[0]->BooleanValue() ? 1 : 0);
    v8::Local<v8::String> str = v8::String::New((const char*)buffer, len);
    xmlFree(buffer);

    return scope.Close(str);
}

// not called from node
// private api
v8::Handle<v8::Object>
XmlDocument::New(xmlDoc* doc)
{
    v8::HandleScope scope;

    if (doc->_private) {
        return scope.Close(static_cast<XmlDocument*>(doc->_private)->handle_);
    }

    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(obj);

    // replace the document we created
    document->xml_obj->_private = NULL;
    xmlFreeDoc(document->xml_obj);
    document->xml_obj = doc;

    // store ourselves in the document
    // this is how we can get instances or already existing v8 objects
    doc->_private = document;

    return scope.Close(obj);
}

v8::Handle<v8::Value>
XmlDocument::FromHtml(const v8::Arguments& args)
{
    v8::HandleScope scope;

    v8::Local<v8::Object> options = args[1]->ToObject();
    v8::Local<v8::Value>  baseUrlOpt  = options->Get(
        v8::String::NewSymbol("baseUrl"));
    v8::Local<v8::Value>  encodingOpt = options->Get(
        v8::String::NewSymbol("encoding"));

    // the base URL that will be used for this HTML parsed document
    v8::String::Utf8Value baseUrl_(baseUrlOpt->ToString());
    const char * baseUrl = *baseUrl_;
    if (!baseUrlOpt->IsString()) {
        baseUrl = NULL;
    }

    // the encoding to be used for this document
    // (leave NULL for libxml to autodetect)
    v8::String::Utf8Value encoding_(encodingOpt->ToString());
    const char * encoding = *encoding_;

    if (!encodingOpt->IsString()) {
        encoding = NULL;
    }

    v8::Local<v8::Array> errors = v8::Array::New();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
            XmlSyntaxError::PushToArray);

    htmlDocPtr doc;
    if (!node::Buffer::HasInstance(args[0])) {
        // Parse a string
        v8::String::Utf8Value str(args[0]->ToString());
        doc = htmlReadMemory(*str, str.length(), baseUrl, encoding, 0);
    }
    else {
        // Parse a buffer
        v8::Local<v8::Object> buf = args[0]->ToObject();
        doc = htmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                            baseUrl, encoding, 0);
    }

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return v8::ThrowException(XmlSyntaxError::BuildSyntaxError(error));
        }
        return v8::ThrowException(v8::Exception::Error(
                    v8::String::New("Could not parse XML string")));
    }

    v8::Handle<v8::Object> doc_handle = XmlDocument::New(doc);
    doc_handle->Set(v8::String::New("errors"), errors);

    // create the xml document handle to return
    return scope.Close(doc_handle);
}

v8::Handle<v8::Value>
XmlDocument::FromXml(const v8::Arguments& args)
{
    v8::HandleScope scope;

    v8::Local<v8::Array> errors = v8::Array::New();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
            XmlSyntaxError::PushToArray);

    xmlDocPtr doc;
    if (!node::Buffer::HasInstance(args[0])) {
      // Parse a string
      v8::String::Utf8Value str(args[0]->ToString());
      doc = xmlReadMemory(*str, str.length(), NULL, "UTF-8", 0);
    }
    else {
      // Parse a buffer
      v8::Local<v8::Object> buf = args[0]->ToObject();
      doc = xmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                          NULL, NULL, 0);
    }

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return v8::ThrowException(XmlSyntaxError::BuildSyntaxError(error));
        }
        return v8::ThrowException(v8::Exception::Error(
                    v8::String::New("Could not parse XML string")));
    }

    v8::Handle<v8::Object> doc_handle = XmlDocument::New(doc);
    doc_handle->Set(v8::String::New("errors"), errors);

    xmlNode* root_node = xmlDocGetRootElement(doc);
    if (root_node == NULL) {
        return ThrowException(v8::Exception::Error(
                    v8::String::New("parsed document has no root element")));
    }

    // create the xml document handle to return
    return scope.Close(doc_handle);
}

v8::Handle<v8::Value>
XmlDocument::Validate(const v8::Arguments& args)
{
    v8::HandleScope scope;

    v8::Local<v8::Array> errors = v8::Array::New();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
            XmlSyntaxError::PushToArray);

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    XmlDocument* documentSchema = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());

    xmlSchemaParserCtxtPtr parser_ctxt = xmlSchemaNewDocParserCtxt(documentSchema->xml_obj);
    if (parser_ctxt == NULL) {
        return v8::ThrowException(v8::Exception::Error(
            v8::String::New("Could not create context for schema parser")));
    }
    xmlSchemaPtr schema = xmlSchemaParse(parser_ctxt);
    if (schema == NULL) {
        return v8::ThrowException(v8::Exception::Error(
            v8::String::New("Invalid XSD schema")));
    }
    xmlSchemaValidCtxtPtr valid_ctxt = xmlSchemaNewValidCtxt(schema);
    if (valid_ctxt == NULL) {
        return v8::ThrowException(v8::Exception::Error(
            v8::String::New("Unable to create a validation context for the schema")));
    }
    bool valid = xmlSchemaValidateDoc(valid_ctxt, document->xml_obj) == 0;

    return scope.Close(v8::Boolean::New(valid));
}

/// this is a blank object with prototype methods
/// not exposed to the user and not called from js
v8::Handle<v8::Value>
XmlDocument::New(const v8::Arguments& args)
{
    v8::HandleScope scope;

    v8::String::Utf8Value version(args[0]->ToString());
    xmlDoc* doc = xmlNewDoc((const xmlChar*)(*version));

    XmlDocument* document = new XmlDocument(doc);
    document->Wrap(args.Holder());

    return scope.Close(args.Holder());
}

XmlDocument::XmlDocument(xmlDoc* doc)
    : xml_obj(doc)
{
    xml_obj->_private = this;
}

XmlDocument::~XmlDocument()
{
    xml_obj->_private = NULL;
    xmlFreeDoc(xml_obj);
}

void
XmlDocument::Initialize(v8::Handle<v8::Object> target)
{
    v8::HandleScope scope;

    v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
    t->SetClassName(v8::String::NewSymbol("Document"));

    constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
    constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

    /// setup internal methods for bindings
    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_root",
            XmlDocument::Root);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_version",
            XmlDocument::Version);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_encoding",
            XmlDocument::Encoding);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_toString",
            XmlDocument::ToString);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_validate",
            XmlDocument::Validate);
    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_setDtd",
            XmlDocument::SetDtd);


    NODE_SET_METHOD(target, "fromXml", XmlDocument::FromXml);
    NODE_SET_METHOD(target, "fromHtml", XmlDocument::FromHtml);

    // used to create new document handles
    target->Set(v8::String::NewSymbol("Document"), t->GetFunction());

    XmlNode::Initialize(target);
    XmlNamespace::Initialize(target);
}
}  // namespcae libxmljs
