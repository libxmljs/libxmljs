// Copyright 2009, Squish Tech, LLC.

#include <node.h>
#include <node_buffer.h>

#include <cstring>

//#include <libxml/tree.h>
#include <libxml/HTMLtree.h>
#include <libxml/HTMLparser.h>
#include <libxml/xmlschemas.h>
#include <libxml/relaxng.h>

#include "xml_document.h"
#include "xml_element.h"
#include "xml_namespace.h"
#include "xml_syntax_error.h"

namespace libxmljs {

// Static member initialization
const int XmlDocument::DEFAULT_PARSING_OPTS = 0;
const int XmlDocument::EXCLUDE_IMPLIED_ELEMENTS = HTML_PARSE_NOIMPLIED | HTML_PARSE_NODEFDTD;

Nan::Persistent<v8::FunctionTemplate> XmlDocument::constructor_template;

NAN_METHOD(XmlDocument::Encoding)
{
    Nan::HandleScope scope;
    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    // if no args, get the encoding
    if (info.Length() == 0 || info[0]->IsUndefined()) {
        if (document->xml_obj->encoding)
            return info.GetReturnValue().Set(Nan::New<v8::String>(
                        (const char *)document->xml_obj->encoding,
                        xmlStrlen((const xmlChar*)document->xml_obj->encoding)).ToLocalChecked());

        return info.GetReturnValue().Set(Nan::Null());
    }

    // set the encoding otherwise
    v8::String::Utf8Value encoding(info[0]->ToString());
    if(document->xml_obj->encoding != NULL) {
        xmlFree((xmlChar*)document->xml_obj->encoding);
    }

    document->xml_obj->encoding = xmlStrdup((const xmlChar*)*encoding);
    return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlDocument::Version)
{
    Nan::HandleScope scope;
    XmlDocument *document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    if (document->xml_obj->version)
        return info.GetReturnValue().Set(Nan::New<v8::String>((const char *)document->xml_obj->version,
                    xmlStrlen((const xmlChar*)document->xml_obj->version)).ToLocalChecked());

    return info.GetReturnValue().Set(Nan::Null());
}

NAN_METHOD(XmlDocument::Root)
{
    Nan::HandleScope scope;
    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    xmlNode* root = xmlDocGetRootElement(document->xml_obj);

    if (info.Length() == 0 || info[0]->IsUndefined())
    {
        if (!root) {
            return info.GetReturnValue().Set(Nan::Null());
        }
        return info.GetReturnValue().Set(XmlElement::New(root));
    }

    if (root != NULL) {
        return Nan::ThrowError("Holder document already has a root node");
    }

    // set the element as the root element for the document
    // allows for proper retrieval of root later
    XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
    assert(element);
    xmlDocSetRootElement(document->xml_obj, element->xml_obj);
    return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlDocument::GetDtd)
{
    Nan::HandleScope scope;
    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    xmlDtdPtr dtd = xmlGetIntSubset(document->xml_obj);

    if (!dtd) {
        return info.GetReturnValue().Set(Nan::Null());
    }

    const char* name = (const char *)dtd->name;
    const char* extId = (const char *)dtd->ExternalID;
    const char* sysId = (const char *)dtd->SystemID;

    v8::Local<v8::Object> dtdObj = Nan::New<v8::Object>();
    v8::Local<v8::Value> nameValue = (v8::Local<v8::Value>)Nan::Null();
    v8::Local<v8::Value> extValue = (v8::Local<v8::Value>)Nan::Null();
    v8::Local<v8::Value> sysValue = (v8::Local<v8::Value>)Nan::Null();

    if (name != NULL) {
        nameValue = (v8::Local<v8::Value>)Nan::New<v8::String>(name, strlen(name)).ToLocalChecked();
    }

    if (extId != NULL) {
        extValue = (v8::Local<v8::Value>)Nan::New<v8::String>(extId, strlen(extId)).ToLocalChecked();
    }

    if (sysId != NULL) {
        sysValue = (v8::Local<v8::Value>)Nan::New<v8::String>(sysId, strlen(sysId)).ToLocalChecked();
    }


    Nan::Set(dtdObj, Nan::New<v8::String>("name").ToLocalChecked(), nameValue);

    Nan::Set(dtdObj, Nan::New<v8::String>("externalId").ToLocalChecked(), extValue);

    Nan::Set(dtdObj, Nan::New<v8::String>("systemId").ToLocalChecked(), sysValue);

    return info.GetReturnValue().Set(dtdObj);

}

NAN_METHOD(XmlDocument::SetDtd)
{
    Nan::HandleScope scope;

    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    v8::String::Utf8Value name(info[0]);

    v8::Local<v8::Value> extIdOpt;
    v8::Local<v8::Value> sysIdOpt;
    if (info.Length() > 1 && info[1]->IsString()) {
      extIdOpt = info[1];
    }
    if (info.Length() > 2 && info[2]->IsString()) {
      sysIdOpt = info[2];
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

    return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlDocument::ToString)
{
    Nan::HandleScope scope;

    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    assert(document);

    xmlChar* buffer = NULL;
    int len = 0;
    if (document->xml_obj->type == XML_HTML_DOCUMENT_NODE) {
        htmlDocDumpMemoryFormat(document->xml_obj, &buffer, &len, info[0]->BooleanValue() ? 1 : 0);
    } else {
        xmlDocDumpFormatMemoryEnc(document->xml_obj, &buffer, &len, "UTF-8", info[0]->BooleanValue() ? 1 : 0);
    }
    v8::Local<v8::String> str = Nan::New<v8::String>((const char*)buffer, len).ToLocalChecked();
    xmlFree(buffer);

    return info.GetReturnValue().Set(str);
}

// not called from node
// private api
v8::Local<v8::Object>
XmlDocument::New(xmlDoc* doc)
{
    Nan::EscapableHandleScope scope;

    if (doc->_private) {
        return scope.Escape(static_cast<XmlDocument*>(doc->_private)->handle());
    }

    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();

    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(obj);

    // replace the document we created
    document->xml_obj->_private = NULL;
    xmlFreeDoc(document->xml_obj);
    document->xml_obj = doc;

    // store ourselves in the document
    // this is how we can get instances or already existing v8 objects
    doc->_private = document;

    return scope.Escape(obj);
}

NAN_METHOD(XmlDocument::FromHtml)
{
    Nan::HandleScope scope;

    v8::Local<v8::Object> options = info[1]->ToObject();
    v8::Local<v8::Value>  baseUrlOpt  = options->Get(
        Nan::New<v8::String>("baseUrl").ToLocalChecked());
    v8::Local<v8::Value>  encodingOpt = options->Get(
        Nan::New<v8::String>("encoding").ToLocalChecked());
    v8::Local<v8::Value> excludeImpliedElementsOpt = options->Get(
        Nan::New<v8::String>("excludeImpliedElements").ToLocalChecked());

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

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void*>(&errors), XmlSyntaxError::PushToArray);

    const int parsingOptions = excludeImpliedElementsOpt->ToBoolean()->Value()
        ? EXCLUDE_IMPLIED_ELEMENTS
        : DEFAULT_PARSING_OPTS;

    htmlDocPtr doc;
    if (!node::Buffer::HasInstance(info[0])) {
        // Parse a string
        v8::String::Utf8Value str(info[0]->ToString());
        doc = htmlReadMemory(*str, str.length(), baseUrl, encoding, parsingOptions);
    }
    else {
        // Parse a buffer
        v8::Local<v8::Object> buf = info[0]->ToObject();
        doc = htmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                            baseUrl, encoding, parsingOptions);
    }

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return Nan::ThrowError(XmlSyntaxError::BuildSyntaxError(error));
        }
        return Nan::ThrowError("Could not parse XML string");
    }

    v8::Local<v8::Object> doc_handle = XmlDocument::New(doc);
    Nan::Set(doc_handle, Nan::New<v8::String>("errors").ToLocalChecked(), errors);

    // create the xml document handle to return
    return info.GetReturnValue().Set(doc_handle);
}

int getXmlParserOption2(v8::Local<v8::Object> props, const char *key, int value) {
    Nan::HandleScope scope;
    v8::Local<v8::String> key2 = Nan::New<v8::String>(key).ToLocalChecked();
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
    Nan::HandleScope scope;

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    xmlParserOption opts = getXmlParserOption(info[1]->ToObject());

    xmlDocPtr doc;
    if (!node::Buffer::HasInstance(info[0])) {
      // Parse a string
      v8::String::Utf8Value str(info[0]->ToString());
      doc = xmlReadMemory(*str, str.length(), NULL, "UTF-8", opts);
    }
    else {
      // Parse a buffer
      v8::Local<v8::Object> buf = info[0]->ToObject();
      doc = xmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                          NULL, NULL, opts);
    }

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return Nan::ThrowError(XmlSyntaxError::BuildSyntaxError(error));
        }
        return Nan::ThrowError("Could not parse XML string");
    }

    v8::Local<v8::Object> doc_handle = XmlDocument::New(doc);
    Nan::Set(doc_handle, Nan::New<v8::String>("errors").ToLocalChecked(), errors);

    xmlNode* root_node = xmlDocGetRootElement(doc);
    if (root_node == NULL) {
        return Nan::ThrowError("parsed document has no root element");
    }

    // create the xml document handle to return
    return info.GetReturnValue().Set(doc_handle);
}

NAN_METHOD(XmlDocument::Validate)
{
    Nan::HandleScope scope;

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    XmlDocument* documentSchema = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());

    xmlSchemaParserCtxtPtr parser_ctxt = xmlSchemaNewDocParserCtxt(documentSchema->xml_obj);
    if (parser_ctxt == NULL) {
        return Nan::ThrowError("Could not create context for schema parser");
    }
    xmlSchemaPtr schema = xmlSchemaParse(parser_ctxt);
    if (schema == NULL) {
        return Nan::ThrowError("Invalid XSD schema");
    }
    xmlSchemaValidCtxtPtr valid_ctxt = xmlSchemaNewValidCtxt(schema);
    if (valid_ctxt == NULL) {
        return Nan::ThrowError("Unable to create a validation context for the schema");
    }
    bool valid = xmlSchemaValidateDoc(valid_ctxt, document->xml_obj) == 0;

    xmlSetStructuredErrorFunc(NULL, NULL);
    info.Holder()->Set(Nan::New<v8::String>("validationErrors").ToLocalChecked(), errors);

    xmlSchemaFreeValidCtxt(valid_ctxt);
    xmlSchemaFree(schema);
    xmlSchemaFreeParserCtxt(parser_ctxt);

    return info.GetReturnValue().Set(Nan::New<v8::Boolean>(valid));
}

NAN_METHOD(XmlDocument::RngValidate)
{
    Nan::HandleScope scope;

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info.Holder());
    XmlDocument* documentSchema = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());

    xmlRelaxNGParserCtxtPtr parser_ctxt = xmlRelaxNGNewDocParserCtxt(documentSchema->xml_obj);
    if (parser_ctxt == NULL) {
        return Nan::ThrowError("Could not create context for RELAX NG schema parser");
    }

    xmlRelaxNGPtr schema = xmlRelaxNGParse(parser_ctxt);
    if (schema == NULL) {
        return Nan::ThrowError("Invalid RELAX NG schema");
    }

    xmlRelaxNGValidCtxtPtr valid_ctxt = xmlRelaxNGNewValidCtxt(schema);
    if (valid_ctxt == NULL) {
        return Nan::ThrowError("Unable to create a validation context for the RELAX NG schema");
    }
    bool valid = xmlRelaxNGValidateDoc(valid_ctxt, document->xml_obj) == 0;

    xmlSetStructuredErrorFunc(NULL, NULL);
    info.Holder()->Set(Nan::New<v8::String>("validationErrors").ToLocalChecked(), errors);

    xmlRelaxNGFreeValidCtxt(valid_ctxt);
    xmlRelaxNGFree(schema);
    xmlRelaxNGFreeParserCtxt(parser_ctxt);

    return info.GetReturnValue().Set(Nan::New<v8::Boolean>(valid));
}

/// this is a blank object with prototype methods
/// not exposed to the user and not called from js
NAN_METHOD(XmlDocument::New)
{
    Nan::HandleScope scope;

    v8::String::Utf8Value version(info[0]->ToString());
    xmlDoc* doc = xmlNewDoc((const xmlChar*)(*version));

    XmlDocument* document = new XmlDocument(doc);
    document->Wrap(info.Holder());

    return info.GetReturnValue().Set(info.Holder());
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
    Nan::HandleScope scope;

    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>(New);
    tmpl->SetClassName(Nan::New<v8::String>("Document").ToLocalChecked());

    constructor_template.Reset( tmpl);
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    /// setup internal methods for bindings
    Nan::SetPrototypeMethod(tmpl,
            "_root",
            XmlDocument::Root);

    Nan::SetPrototypeMethod(tmpl,
            "_version",
            XmlDocument::Version);

    Nan::SetPrototypeMethod(tmpl,
            "_encoding",
            XmlDocument::Encoding);

    Nan::SetPrototypeMethod(tmpl,
            "_toString",
            XmlDocument::ToString);

    Nan::SetPrototypeMethod(tmpl,
            "_validate",
            XmlDocument::Validate);
    Nan::SetPrototypeMethod(tmpl,
            "_rngValidate",
            XmlDocument::RngValidate);
    Nan::SetPrototypeMethod(tmpl,
            "_setDtd",
            XmlDocument::SetDtd);
    Nan::SetPrototypeMethod(tmpl,
            "_getDtd",
            XmlDocument::GetDtd);


    Nan::SetMethod(target, "fromXml", XmlDocument::FromXml);
    Nan::SetMethod(target, "fromHtml", XmlDocument::FromHtml);

    // used to create new document handles
    Nan::Set(target, Nan::New<v8::String>("Document").ToLocalChecked(), tmpl->GetFunction());

    XmlNode::Initialize(target);
    XmlNamespace::Initialize(target);
}
}  // namespcae libxmljs
