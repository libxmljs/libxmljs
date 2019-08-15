// Copyright 2009, Squish Tech, LLC.

#include <node.h>
#include <node_buffer.h>

#include <cstring>

//#include <libxml/tree.h>
#include <libxml/HTMLtree.h>
#include <libxml/HTMLparser.h>
#include <libxml/xmlschemas.h>
#include <libxml/relaxng.h>
#include <libxml/xmlsave.h>

#include "xml_document.h"
#include "xml_element.h"
#include "xml_namespace.h"
#include "xml_syntax_error.h"

namespace libxmljs {

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
    Nan::Utf8String encoding(Nan::To<v8::String>(info[0]).ToLocalChecked());
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
    XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(Nan::To<v8::Object>(info[0]).ToLocalChecked());
    assert(element);
    xmlDocSetRootElement(document->xml_obj, element->xml_obj);
    element->ref_wrapped_ancestor();
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

    Nan::Utf8String name(info[0]);

    v8::Local<v8::Value> extIdOpt;
    v8::Local<v8::Value> sysIdOpt;
    if (info.Length() > 1 && info[1]->IsString()) {
      extIdOpt = info[1];
    }
    if (info.Length() > 2 && info[2]->IsString()) {
      sysIdOpt = info[2];
    }

    Nan::Utf8String extIdRaw(extIdOpt);
    Nan::Utf8String sysIdRaw(sysIdOpt);

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

    int options = 0;

    if (info.Length() > 0) {
    if (info[0]->IsBoolean()) {
        if (Nan::To<v8::Boolean>(info[0]).ToLocalChecked()->Value() == true) {
            options |= XML_SAVE_FORMAT;
        }
    } else if (info[0]->IsObject()) {
        v8::Local<v8::Object> obj = Nan::To<v8::Object>(info[0]).ToLocalChecked();

        // drop the xml declaration
        if (Nan::Get(obj, Nan::New<v8::String>("declaration").ToLocalChecked()).ToLocalChecked()->IsFalse()) {
            options |= XML_SAVE_NO_DECL;
        }

        // format save output
        if (Nan::Get(obj, Nan::New<v8::String>("format").ToLocalChecked()).ToLocalChecked()->IsTrue()) {
            options |= XML_SAVE_FORMAT;
        }

        // no empty tags (only works with XML) ex: <title></title> becomes <title/>
        if (Nan::Get(obj, Nan::New<v8::String>("selfCloseEmpty").ToLocalChecked()).ToLocalChecked()->IsFalse()) {
            options |= XML_SAVE_NO_EMPTY;
        }

        // format with non-significant whitespace
        if (Nan::Get(obj, Nan::New<v8::String>("whitespace").ToLocalChecked()).ToLocalChecked()->IsTrue()) {
            options |= XML_SAVE_WSNONSIG;
        }

        v8::Local<v8::Value> type = Nan::Get(obj, Nan::New<v8::String>("type").ToLocalChecked()).ToLocalChecked();
        if (Nan::Equals(type, Nan::New<v8::String>("XML").ToLocalChecked()).ToChecked() ||
            Nan::Equals(type, Nan::New<v8::String>("xml").ToLocalChecked()).ToChecked()) {
            options |= XML_SAVE_AS_XML;    // force XML serialization on HTML doc
        } else if (Nan::Equals(type, Nan::New<v8::String>("HTML").ToLocalChecked()).ToChecked() ||
                 Nan::Equals(type, Nan::New<v8::String>("html").ToLocalChecked()).ToChecked()) {
            options |= XML_SAVE_AS_HTML;   // force HTML serialization on XML doc
            // if the document is XML and we want formatted HTML output
            // we must use the XHTML serializer because the default HTML
            // serializer only formats node->type = HTML_NODE and not XML_NODEs
            if ((options & XML_SAVE_FORMAT) && (options & XML_SAVE_XHTML) == false) {
              options |= XML_SAVE_XHTML;
            }
        } else if (Nan::Equals(type, Nan::New<v8::String>("XHTML").ToLocalChecked()).ToChecked() ||
                 Nan::Equals(type, Nan::New<v8::String>("xhtml").ToLocalChecked()).ToChecked()) {
                options |= XML_SAVE_XHTML;    // force XHTML serialization
            }
        }
    }

    xmlBuffer* buf = xmlBufferCreate();
    xmlSaveCtxt* savectx = xmlSaveToBuffer(buf, "UTF-8", options);
    xmlSaveTree(savectx, (xmlNode*)document->xml_obj);
    xmlSaveFlush(savectx);
    xmlSaveClose(savectx);
    v8::Local<v8::Value> ret = Nan::Null();
    if (xmlBufferLength(buf) > 0)
        ret = Nan::New<v8::String>((char*)xmlBufferContent(buf), xmlBufferLength(buf)).ToLocalChecked();
    xmlBufferFree(buf);

    return info.GetReturnValue().Set(ret);
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

    v8::Local<v8::Object> obj = Nan::NewInstance(Nan::GetFunction(Nan::New(constructor_template)).ToLocalChecked()).ToLocalChecked();

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

int getParserOption(v8::Local<v8::Object> props, const char *key, int value, bool defaultValue = true) {
    Nan::HandleScope scope;
    v8::Local<v8::Value> prop = Nan::Get(props, Nan::New<v8::String>(key).ToLocalChecked()).ToLocalChecked();
    return !prop->IsUndefined() && Nan::To<v8::Boolean>(prop).ToLocalChecked()->Value() == defaultValue ? value : 0;
}

xmlParserOption getParserOptions(v8::Local<v8::Object> props) {
    int ret = 0;

    // http://xmlsoft.org/html/libxml-parser.html#xmlParserOption
    // http://www.xmlsoft.org/html/libxml-HTMLparser.html#htmlParserOption

    ret |= getParserOption(props, "recover", XML_PARSE_RECOVER);            // 1: recover on errors
    /*ret |= getParserOption(props, "recover", HTML_PARSE_RECOVER);           // 1: Relaxed parsing*/

    ret |= getParserOption(props, "noent", XML_PARSE_NOENT);                // 2: substitute entities

    ret |= getParserOption(props, "dtdload", XML_PARSE_DTDLOAD);            // 4: load the external subset
    ret |= getParserOption(props, "doctype", HTML_PARSE_NODEFDTD, false);   // 4: do not default a doctype if not found

    ret |= getParserOption(props, "dtdattr", XML_PARSE_DTDATTR);            // 8: default DTD attributes
    ret |= getParserOption(props, "dtdvalid", XML_PARSE_DTDVALID);          // 16: validate with the DTD

    ret |= getParserOption(props, "noerror", XML_PARSE_NOERROR);            // 32: suppress error reports
    ret |= getParserOption(props, "errors",  HTML_PARSE_NOERROR, false);    // 32: suppress error reports

    ret |= getParserOption(props, "nowarning", XML_PARSE_NOWARNING);        // 64: suppress warning reports
    ret |= getParserOption(props, "warnings", HTML_PARSE_NOWARNING, false); // 64: suppress warning reports

    ret |= getParserOption(props, "pedantic", XML_PARSE_PEDANTIC);          // 128: pedantic error reporting
    /*ret |= getParserOption(props, "pedantic", HTML_PARSE_PEDANTIC);         // 128: pedantic error reporting*/

    ret |= getParserOption(props, "noblanks", XML_PARSE_NOBLANKS);          // 256: remove blank nodes
    ret |= getParserOption(props, "blanks", HTML_PARSE_NOBLANKS, false);    // 256: remove blank nodes

    ret |= getParserOption(props, "sax1", XML_PARSE_SAX1);                  // 512: use the SAX1 interface internally
    ret |= getParserOption(props, "xinclude", XML_PARSE_XINCLUDE);          // 1024: Implement XInclude substitition

    ret |= getParserOption(props, "nonet", XML_PARSE_NONET);                // 2048: Forbid network access
    ret |= getParserOption(props, "net", HTML_PARSE_NONET, false);          // 2048: Forbid network access

    ret |= getParserOption(props, "nodict", XML_PARSE_NODICT);              // 4096: Do not reuse the context dictionnary
    ret |= getParserOption(props, "dict", XML_PARSE_NODICT, false);         // 4096: Do not reuse the context dictionnary

    ret |= getParserOption(props, "nsclean", XML_PARSE_NSCLEAN);            // 8192: remove redundant namespaces declarations
    ret |= getParserOption(props, "implied", HTML_PARSE_NOIMPLIED, false);  // 8192: Do not add implied html/body elements

    ret |= getParserOption(props, "nocdata", XML_PARSE_NOCDATA);            // 16384: merge CDATA as text nodes
    ret |= getParserOption(props, "cdata", XML_PARSE_NOCDATA, false);       // 16384: merge CDATA as text nodes

    ret |= getParserOption(props, "noxincnode", XML_PARSE_NOXINCNODE);      // 32768: do not generate XINCLUDE START/END nodes
    ret |= getParserOption(props, "xincnode", XML_PARSE_NOXINCNODE, false); // 32768: do not generate XINCLUDE START/END nodes

    ret |= getParserOption(props, "compact", XML_PARSE_COMPACT);            // 65536: compact small text nodes; no modification of the tree allowed afterwards (will possibly crash if you try to modify the tree)
    /*ret |= getParserOption(props, "compact", HTML_PARSE_COMPACT , false);   // 65536: compact small text nodes*/

    ret |= getParserOption(props, "old10", XML_PARSE_OLD10);                // 131072: parse using XML-1.0 before update 5

    ret |= getParserOption(props, "nobasefix", XML_PARSE_NOBASEFIX);        // 262144: do not fixup XINCLUDE xml:base uris
    ret |= getParserOption(props, "basefix", XML_PARSE_NOBASEFIX, false);   // 262144: do not fixup XINCLUDE xml:base uris

    ret |= getParserOption(props, "huge", XML_PARSE_HUGE);                  // 524288: relax any hardcoded limit from the parser
    ret |= getParserOption(props, "oldsax", XML_PARSE_OLDSAX);              // 1048576: parse using SAX2 interface before 2.7.0

    ret |= getParserOption(props, "ignore_enc", XML_PARSE_IGNORE_ENC);      // 2097152: ignore internal document encoding hint
    /*ret |= getParserOption(props, "ignore_enc", HTML_PARSE_IGNORE_ENC);      // 2097152: ignore internal document encoding hint*/

    ret |= getParserOption(props, "big_lines", XML_PARSE_BIG_LINES);        // 4194304: Store big lines numbers in text PSVI field

    return (xmlParserOption)ret;
}

NAN_METHOD(XmlDocument::FromHtml)
{
    Nan::HandleScope scope;

    v8::Local<v8::Object> options = Nan::To<v8::Object>(info[1]).ToLocalChecked();
    v8::Local<v8::Value>  baseUrlOpt  = Nan::Get(options,
        Nan::New<v8::String>("baseUrl").ToLocalChecked()).ToLocalChecked();
    v8::Local<v8::Value>  encodingOpt = Nan::Get(options,
        Nan::New<v8::String>("encoding").ToLocalChecked()).ToLocalChecked();
    v8::Local<v8::Value> excludeImpliedElementsOpt = Nan::Get(options,
        Nan::New<v8::String>("excludeImpliedElements").ToLocalChecked()).ToLocalChecked();

    // the base URL that will be used for this HTML parsed document
    Nan::Utf8String baseUrl_(Nan::To<v8::String>(baseUrlOpt).ToLocalChecked());
    const char * baseUrl = *baseUrl_;
    if (!baseUrlOpt->IsString()) {
        baseUrl = NULL;
    }

    // the encoding to be used for this document
    // (leave NULL for libxml to autodetect)
    Nan::Utf8String encoding_(Nan::To<v8::String>(encodingOpt).ToLocalChecked());
    const char * encoding = *encoding_;

    if (!encodingOpt->IsString()) {
        encoding = NULL;
    }

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void*>(&errors), XmlSyntaxError::PushToArray);

    int opts = (int)getParserOptions(options);
    if (Nan::To<v8::Boolean>(excludeImpliedElementsOpt).ToLocalChecked()->Value())
        opts |= HTML_PARSE_NOIMPLIED | HTML_PARSE_NODEFDTD;

    htmlDocPtr doc;
    if (!node::Buffer::HasInstance(info[0])) {
        // Parse a string
        Nan::Utf8String str(Nan::To<v8::String>(info[0]).ToLocalChecked());
        doc = htmlReadMemory(*str, str.length(), baseUrl, encoding, opts);
    }
    else {
        // Parse a buffer
        v8::Local<v8::Object> buf = Nan::To<v8::Object>(info[0]).ToLocalChecked();
        doc = htmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                            baseUrl, encoding, opts);
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

// FIXME: this method is almost identical to FromHtml above.
// The two should be refactored to use a common function for most
// of the work
NAN_METHOD(XmlDocument::FromXml)
{
    Nan::HandleScope scope;

    v8::Local<v8::Array> errors = Nan::New<v8::Array>();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errors),
            XmlSyntaxError::PushToArray);

    v8::Local<v8::Object> options = Nan::To<v8::Object>(info[1]).ToLocalChecked();
    v8::Local<v8::Value>  baseUrlOpt  = Nan::Get(options,
        Nan::New<v8::String>("baseUrl").ToLocalChecked()).ToLocalChecked();
    v8::Local<v8::Value>  encodingOpt = Nan::Get(options,
        Nan::New<v8::String>("encoding").ToLocalChecked()).ToLocalChecked();

    // the base URL that will be used for this document
    Nan::Utf8String baseUrl_(Nan::To<v8::String>(baseUrlOpt).ToLocalChecked());
    const char * baseUrl = *baseUrl_;
    if (!baseUrlOpt->IsString()) {
        baseUrl = NULL;
    }

    // the encoding to be used for this document
    // (leave NULL for libxml to autodetect)
    Nan::Utf8String encoding_(Nan::To<v8::String>(encodingOpt).ToLocalChecked());
    const char * encoding = *encoding_;
    if (!encodingOpt->IsString()) {
        encoding = NULL;
    }

    int opts = (int) getParserOptions(options);
    xmlDocPtr doc;
    if (!node::Buffer::HasInstance(info[0])) {
      // Parse a string
      Nan::Utf8String str(Nan::To<v8::String>(info[0]).ToLocalChecked());
      doc = xmlReadMemory(*str, str.length(), baseUrl, "UTF-8", opts);
    }
    else {
      // Parse a buffer
      v8::Local<v8::Object> buf = Nan::To<v8::Object>(info[0]).ToLocalChecked();
      doc = xmlReadMemory(node::Buffer::Data(buf), node::Buffer::Length(buf),
                          baseUrl, encoding, opts);
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
    XmlDocument* documentSchema = Nan::ObjectWrap::Unwrap<XmlDocument>(Nan::To<v8::Object>(info[0]).ToLocalChecked());

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
    Nan::Set(info.Holder(), Nan::New<v8::String>("validationErrors").ToLocalChecked(), errors);

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
    XmlDocument* documentSchema = Nan::ObjectWrap::Unwrap<XmlDocument>(Nan::To<v8::Object>(info[0]).ToLocalChecked());

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
    Nan::Set(info.Holder(), Nan::New<v8::String>("validationErrors").ToLocalChecked(), errors);

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

    Nan::Utf8String version(Nan::To<v8::String>(info[0]).ToLocalChecked());
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
XmlDocument::Initialize(v8::Local<v8::Object> target)
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
    Nan::Set(target, Nan::New<v8::String>("Document").ToLocalChecked(), Nan::GetFunction(tmpl).ToLocalChecked());

    XmlNode::Initialize(target);
    XmlNamespace::Initialize(target);
}
}  // namespcae libxmljs
