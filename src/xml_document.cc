// Copyright 2009, Squish Tech, LLC.

#include <node.h>
#include <node_buffer.h>

#include <cstring>

#include <libxml/HTMLparser.h>
#include <libxml/xmlschemas.h>
#include <libxml/relaxng.h>

#include "xml_document.h"
#include "xml_element.h"
#include "xml_namespace.h"
#include "xml_syntax_error.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlDocument::constructor_template;

NAN_METHOD(XmlDocument::Encoding)
{
    NanScope();
    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    // if no args, get the encoding
    if (args.Length() == 0 || args[0]->IsUndefined()) {
        if (document->xml_obj->encoding)
            NanReturnValue(NanNew<v8::String>(
                        (const char *)document->xml_obj->encoding,
                        xmlStrlen((const xmlChar*)document->xml_obj->encoding)));

        NanReturnNull();
    }

    // set the encoding otherwise
    v8::String::Utf8Value encoding(args[0]->ToString());
    if(document->xml_obj->encoding != NULL) {
        xmlFree((xmlChar*)document->xml_obj->encoding);
    }

    document->xml_obj->encoding = xmlStrdup((const xmlChar*)*encoding);
    NanReturnValue(args.Holder());
}

NAN_METHOD(XmlDocument::Version)
{
    NanScope();
    XmlDocument *document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    if (document->xml_obj->version)
        NanReturnValue(NanNew<v8::String>((const char *)document->xml_obj->version,
                    xmlStrlen((const xmlChar*)document->xml_obj->version)));

    NanReturnNull();
}

NAN_METHOD(XmlDocument::Root)
{
    NanScope();
    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    xmlNode* root = xmlDocGetRootElement(document->xml_obj);

    if (args.Length() == 0 || args[0]->IsUndefined())
    {
        if (!root) {
            NanReturnNull();
        }
        NanReturnValue(XmlElement::New(root));
    }

    if (root != NULL) {
        return NanThrowError("Holder document already has a root node");
    }

    // set the element as the root element for the document
    // allows for proper retrieval of root later
    XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
    assert(element);
    xmlDocSetRootElement(document->xml_obj, element->xml_obj);
    NanReturnValue(args[0]);
}

NAN_METHOD(XmlDocument::GetDtd)
{
    NanScope();
    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    xmlDtdPtr dtd = xmlGetIntSubset(document->xml_obj);

    if (!dtd) {
        NanReturnNull();
    }

    const char* name = (const char *)dtd->name;
    const char* extId = (const char *)dtd->ExternalID;
    const char* sysId = (const char *)dtd->SystemID;

    v8::Local<v8::Object> dtdObj = NanNew<v8::Object>();
    v8::Handle<v8::Value> nameValue = (v8::Handle<v8::Value>)NanNull();
    v8::Handle<v8::Value> extValue = (v8::Handle<v8::Value>)NanNull();
    v8::Handle<v8::Value> sysValue = (v8::Handle<v8::Value>)NanNull();

    if (name != NULL) {
        nameValue = (v8::Handle<v8::Value>)NanNew<v8::String>(name, strlen(name));
    }

    if (extId != NULL) {
        extValue = (v8::Handle<v8::Value>)NanNew<v8::String>(extId, strlen(extId));
    }

    if (sysId != NULL) {
        sysValue = (v8::Handle<v8::Value>)NanNew<v8::String>(sysId, strlen(sysId));
    }


    dtdObj->Set(NanNew<v8::String>("name"), nameValue);

    dtdObj->Set(NanNew<v8::String>("externalId"), extValue);

    dtdObj->Set(NanNew<v8::String>("systemId"), sysValue);

    NanReturnValue(dtdObj);

}

NAN_METHOD(XmlDocument::SetDtd)
{
    NanScope();

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    v8::String::Utf8Value name(args[0]);

    v8::Local<v8::Value> extIdOpt;
    v8::Local<v8::Value> sysIdOpt;
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

    NanReturnValue(args.Holder());
}

NAN_METHOD(XmlDocument::ToString)
{
    NanScope();

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    assert(document);

    xmlChar* buffer = NULL;
    int len = 0;
    xmlDocDumpFormatMemoryEnc(document->xml_obj, &buffer, &len, "UTF-8", args[0]->BooleanValue() ? 1 : 0);
    v8::Local<v8::String> str = NanNew<v8::String>((const char*)buffer, len);
    xmlFree(buffer);

    NanReturnValue(str);
}

// not called from node
// private api
v8::Local<v8::Object>
XmlDocument::New(xmlDoc* doc)
{
    NanEscapableScope();

    if (doc->_private) {
        return NanEscapeScope(NanObjectWrapHandle(static_cast<XmlDocument*>(doc->_private)));
    }

    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(obj);

    // replace the document we created
    document->xml_obj->_private = NULL;
    xmlFreeDoc(document->xml_obj);
    document->xml_obj = doc;

    // store ourselves in the document
    // this is how we can get instances or already existing v8 objects
    doc->_private = document;

    return NanEscapeScope(obj);
}

NAN_METHOD(XmlDocument::FromHtml)
{
    NanScope();

    v8::Local<v8::Object> options = args[1]->ToObject();
    v8::Local<v8::Value>  baseUrlOpt  = options->Get(
        NanNew<v8::String>("baseUrl"));
    v8::Local<v8::Value>  encodingOpt = options->Get(
        NanNew<v8::String>("encoding"));

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

    v8::Local<v8::Array> errors = NanNew<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void*>(&errors), XmlSyntaxError::PushToArray);

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
            return NanThrowError(XmlSyntaxError::BuildSyntaxError(error));
        }
        return NanThrowError("Could not parse XML string");
    }

    v8::Local<v8::Object> doc_handle = XmlDocument::New(doc);
    doc_handle->Set(NanNew<v8::String>("errors"), errors);

    // create the xml document handle to return
    NanReturnValue(doc_handle);
}

int getXmlParserOption2(v8::Local<v8::Object> props, const char *key, int value) {
    v8::Local<v8::String> key2 = NanNew<v8::String>(key);
    v8::Local<v8::Boolean> val = props->Get(key2)->ToBoolean();
    return val->BooleanValue() ? value : 0;
}

xmlParserOption getXmlParserOption(v8::Local<v8::Object> props) {
    int ret = 0;

    // http://xmlsoft.org/html/libxml-parser.html#xmlParserOption
    ret |= getXmlParserOption2(props, "recover", XML_PARSE_RECOVER); // recover on errors
    ret |= getXmlParserOption2(props, "noent", XML_PARSE_NOENT); // substitute entities
    ret |= getXmlParserOption2(props, "dtdload", XML_PARSE_DTDLOAD); // load the external subset
    ret |= getXmlParserOption2(props, "dtdattr", XML_PARSE_DTDATTR); // default DTD attributes
    ret |= getXmlParserOption2(props, "dtdvalid", XML_PARSE_DTDVALID); // validate with the DTD
    ret |= getXmlParserOption2(props, "noerror", XML_PARSE_NOERROR); // suppress error reports
    ret |= getXmlParserOption2(props, "nowarning", XML_PARSE_NOWARNING); // suppress warning reports
    ret |= getXmlParserOption2(props, "pedantic", XML_PARSE_PEDANTIC); // pedantic error reporting
    ret |= getXmlParserOption2(props, "noblanks", XML_PARSE_NOBLANKS); // remove blank nodes
    ret |= getXmlParserOption2(props, "sax1", XML_PARSE_SAX1); // use the SAX1 interface internally
    ret |= getXmlParserOption2(props, "xinclude", XML_PARSE_XINCLUDE); // Implement XInclude substitition
    ret |= getXmlParserOption2(props, "nonet", XML_PARSE_NONET); // Forbid network access
    ret |= getXmlParserOption2(props, "nodict", XML_PARSE_NODICT); // Do not reuse the context dictionnary
    ret |= getXmlParserOption2(props, "nsclean", XML_PARSE_NSCLEAN); // remove redundant namespaces declarations
    ret |= getXmlParserOption2(props, "nocdata", XML_PARSE_NOCDATA); // merge CDATA as text nodes
    ret |= getXmlParserOption2(props, "noxincnode", XML_PARSE_NOXINCNODE); // do not generate XINCLUDE START/END nodes
    ret |= getXmlParserOption2(props, "compact", XML_PARSE_COMPACT); // compact small text nodes; no modification of the tree allowed afterwards (will possibly crash if you try to modify the tree)
    ret |= getXmlParserOption2(props, "old10", XML_PARSE_OLD10); // parse using XML-1.0 before update 5
    ret |= getXmlParserOption2(props, "nobasefix", XML_PARSE_NOBASEFIX); // do not fixup XINCLUDE xml:base uris
    ret |= getXmlParserOption2(props, "huge", XML_PARSE_HUGE); // relax any hardcoded limit from the parser
    ret |= getXmlParserOption2(props, "oldsax", XML_PARSE_OLDSAX); // parse using SAX2 interface before 2.7.0
    ret |= getXmlParserOption2(props, "ignore_enc", XML_PARSE_IGNORE_ENC); // ignore internal document encoding hint
    ret |= getXmlParserOption2(props, "big_lines", XML_PARSE_BIG_LINES); // Store big lines numbers in text PSVI field

    return (xmlParserOption)ret;
}

NAN_METHOD(XmlDocument::FromXml)
{
    NanScope();

    v8::Local<v8::Array> errors = NanNew<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    xmlParserOption opts = getXmlParserOption(args[1]->ToObject());

    xmlDocPtr doc;
    if (!node::Buffer::HasInstance(args[0])) {
      // Parse a string
      v8::String::Utf8Value str(args[0]->ToString());
      doc = xmlReadMemory(*str, str.length(), NULL, "UTF-8", opts);
    }
    else {
      // Parse a buffer
      v8::Local<v8::Object> buf = args[0]->ToObject();
      doc = xmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                          NULL, NULL, opts);
    }

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return NanThrowError(XmlSyntaxError::BuildSyntaxError(error));
        }
        return NanThrowError("Could not parse XML string");
    }

    v8::Local<v8::Object> doc_handle = XmlDocument::New(doc);
    doc_handle->Set(NanNew<v8::String>("errors"), errors);

    xmlNode* root_node = xmlDocGetRootElement(doc);
    if (root_node == NULL) {
        return NanThrowError("parsed document has no root element");
    }

    // create the xml document handle to return
    NanReturnValue(doc_handle);
}

NAN_METHOD(XmlDocument::Validate)
{
    NanScope();

    v8::Local<v8::Array> errors = NanNew<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    XmlDocument* documentSchema = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());

    xmlSchemaParserCtxtPtr parser_ctxt = xmlSchemaNewDocParserCtxt(documentSchema->xml_obj);
    if (parser_ctxt == NULL) {
        return NanThrowError("Could not create context for schema parser");
    }
    xmlSchemaPtr schema = xmlSchemaParse(parser_ctxt);
    if (schema == NULL) {
        return NanThrowError("Invalid XSD schema");
    }
    xmlSchemaValidCtxtPtr valid_ctxt = xmlSchemaNewValidCtxt(schema);
    if (valid_ctxt == NULL) {
        return NanThrowError("Unable to create a validation context for the schema");
    }
    bool valid = xmlSchemaValidateDoc(valid_ctxt, document->xml_obj) == 0;

    xmlSetStructuredErrorFunc(NULL, NULL);
    args.Holder()->Set(NanNew<v8::String>("validationErrors"), errors);

    NanReturnValue(NanNew<v8::Boolean>(valid));
}

NAN_METHOD(XmlDocument::RngValidate)
{
    NanScope();

    v8::Local<v8::Array> errors = NanNew<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args.Holder());
    XmlDocument* documentSchema = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());

	xmlRelaxNGParserCtxtPtr parser_ctxt = xmlRelaxNGNewDocParserCtxt(documentSchema->xml_obj);
    if (parser_ctxt == NULL) {
        return NanThrowError("Could not create context for RELAX NG schema parser");
    }

	xmlRelaxNGPtr schema = xmlRelaxNGParse(parser_ctxt);
    if (schema == NULL) {
        return NanThrowError("Invalid RELAX NG schema");
    }

	xmlRelaxNGValidCtxtPtr valid_ctxt = xmlRelaxNGNewValidCtxt(schema);
    if (valid_ctxt == NULL) {
        return NanThrowError("Unable to create a validation context for the RELAX NG schema");
    }
	bool valid = xmlRelaxNGValidateDoc(valid_ctxt, document->xml_obj) == 0;

    xmlSetStructuredErrorFunc(NULL, NULL);
    args.Holder()->Set(NanNew<v8::String>("validationErrors"), errors);

    NanReturnValue(NanNew<v8::Boolean>(valid));
}

/// this is a blank object with prototype methods
/// not exposed to the user and not called from js
NAN_METHOD(XmlDocument::New)
{
    NanScope();

    v8::String::Utf8Value version(args[0]->ToString());
    xmlDoc* doc = xmlNewDoc((const xmlChar*)(*version));

    XmlDocument* document = new XmlDocument(doc);
    document->Wrap(args.Holder());

    NanReturnValue(args.Holder());
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
    NanScope();

    v8::Local<v8::FunctionTemplate> tmpl =
      NanNew<v8::FunctionTemplate>(New);
    tmpl->SetClassName(NanNew<v8::String>("Document"));

    NanAssignPersistent(constructor_template, tmpl);
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    /// setup internal methods for bindings
    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_root",
            XmlDocument::Root);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_version",
            XmlDocument::Version);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_encoding",
            XmlDocument::Encoding);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_toString",
            XmlDocument::ToString);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_validate",
            XmlDocument::Validate);
    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_rngValidate",
            XmlDocument::RngValidate);
    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_setDtd",
            XmlDocument::SetDtd);
    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_getDtd",
            XmlDocument::GetDtd);


    NODE_SET_METHOD(target, "fromXml", XmlDocument::FromXml);
    NODE_SET_METHOD(target, "fromHtml", XmlDocument::FromHtml);

    // used to create new document handles
    target->Set(NanNew<v8::String>("Document"), tmpl->GetFunction());

    XmlNode::Initialize(target);
    XmlNamespace::Initialize(target);
}
}  // namespcae libxmljs
