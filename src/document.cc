// Copyright 2009, Squish Tech, LLC.
#include "document.h"

#include <libxml/xmlstring.h>

#include "node.h"
#include "element.h"
#include "attribute.h"
#include "namespace.h"


namespace libxmljs {

namespace {

// Called by libxml whenever it constructs something,
// such as a node or attribute.
// This allows us to create a C++ instance for every C instance.
void on_libxml_construct(xmlNode* node) {
  switch (node->type) {
    case XML_ATTRIBUTE_NODE:
      BUILD_NODE(Attribute, xmlNode, attr, node);
      break;

    case XML_DOCUMENT_NODE:
      BUILD_NODE(Document, xmlDoc, doc, node->doc);
      break;

    case XML_ELEMENT_NODE:
      BUILD_NODE(Element, xmlNode, elem, node);
      break;

    default:
      NULL;  // nothing. just silence the compiler warnings
  }
}

}  // namespace

Document::Init::Init() {
  xmlInitParser();  // Not always necessary, but necessary for thread safety.
  xmlRegisterNodeDefault(on_libxml_construct);
  // xmlDeregisterNodeDefault(on_libxml_destruct);
  xmlThrDefRegisterNodeDefault(on_libxml_construct);
  // xmlThrDefDeregisterNodeDefault(on_libxml_destruct);
}

Document::Init::~Init() {
  xmlCleanupParser();  // As per xmlInitParser(), or memory leak will happen.
}

Document::Init Document::init_;

v8::Persistent<v8::FunctionTemplate> Document::constructor_template;

v8::Handle<v8::Value>
Document::Doc(const v8::Arguments& args) {
  return args.This();
}

v8::Handle<v8::Value>
Document::Encoding(const v8::Arguments& args) {
  v8::HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(args.This());
  assert(document);

  if (args.Length() == 0)
    return document->get_encoding();

  v8::String::Utf8Value encoding(args[0]->ToString());
  document->set_encoding(*encoding);
  return args.This();
}

v8::Handle<v8::Value>
Document::Version(const v8::Arguments& args) {
  v8::HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(args.This());
  assert(document);

  return document->get_version();
}

v8::Handle<v8::Value>
Document::Root(const v8::Arguments& args) {
  v8::HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(args.This());
  assert(document);

  if (args.Length() == 0)
    return document->get_root();

  if (document->has_root())
    return ThrowException(v8::Exception::Error(
      v8::String::New("This document already has a root node")));

  Element *element = ObjectWrap::Unwrap<Element>(args[0]->ToObject());
  assert(element);
  document->set_root(element->xml_obj);
  return args[0];
}

v8::Handle<v8::Value>
Document::ToString(const v8::Arguments& args) {
  v8::HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(args.This());
  assert(document);
  return document->to_string();
}


v8::Handle<v8::Value>
Document::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  v8::Handle<v8::Function> callback;
  v8::String::Utf8Value *version = NULL, *encoding = NULL;

  switch (args.Length()) {
    case 0:  // newDocument()
      break;

    case 1:  // newDocument(version), newDocument(callback)
      if (args[0]->IsNull())  // was created by the libxml callback
        return args.This();

      if (args[0]->IsString()) {
        version = new v8::String::Utf8Value(args[0]->ToString());

      } else if (args[0]->IsFunction()) {
        callback = v8::Handle<v8::Function>::Cast(args[0]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newDocument([version]) or newDocument([callback])");
      }
      break;

    case 2:  // newDocument(version, encoding), newDocument(version, callback)
      if (args[0]->IsString() && args[1]->IsString()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        encoding = new v8::String::Utf8Value(args[1]->ToString());

      } else if (args[0]->IsString() && args[1]->IsFunction()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        callback = v8::Handle<v8::Function>::Cast(args[1]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newDocument([version], [encoding|callback])");
      }
      break;

    default:  // newDocument(version, encoding, callback)
      if (args[0]->IsString() && args[1]->IsString() && args[2]->IsFunction()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        encoding = new v8::String::Utf8Value(args[1]->ToString());
        callback = v8::Handle<v8::Function>::Cast(args[2]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newDocument([version], [encoding], [callback])");
      }
      break;
  }

  if (!version)
    version = new v8::String::Utf8Value(v8::String::New("1.0"));

  xmlDoc* doc = xmlNewDoc((const xmlChar*)**version);
  v8::Persistent<v8::Object> obj = XmlObj::Unwrap<xmlDoc>(doc);
  Document *document = ObjectWrap::Unwrap<Document>(obj);

  if (encoding)
    document->set_encoding(**encoding);

  if (*callback && !callback->IsNull()) {
    v8::Handle<v8::Value> argv[1] = { obj };
    *callback->Call(obj, 1, argv);
  }

  return obj;
}

Document::~Document() {
  xmlFreeDoc(xml_obj);
}

void
Document::set_encoding(const char* encoding) {
  xml_obj->encoding = (const xmlChar*)encoding;
}

v8::Handle<v8::Value>
Document::get_encoding() {
  if (xml_obj->encoding)
    return v8::String::New((const char *)xml_obj->encoding,
                           xmlStrlen((const xmlChar*)xml_obj->encoding));

  return v8::Null();
}

v8::Handle<v8::Value>
Document::get_version() {
  if (xml_obj->version)
    return v8::String::New((const char *)xml_obj->version,
                           xmlStrlen((const xmlChar*)xml_obj->version));

  return v8::Null();
}

v8::Handle<v8::Value>
Document::to_string() {
  xmlChar* buffer = 0;
  int len = 0;

  xmlDocDumpFormatMemoryEnc(xml_obj, &buffer, &len, "UTF-8", 0);
  v8::Handle<v8::String> str = v8::String::New((const char*)buffer, len);
  xmlFree(buffer);

  return str;
}

bool
Document::has_root() {
  return xmlDocGetRootElement(xml_obj) != NULL;
}

v8::Handle<v8::Value>
Document::get_root() {
  xmlNodePtr root = xmlDocGetRootElement(xml_obj);
  if (root)
    return XmlObj::Unwrap(root);
  else
    return v8::Null();
}

void
Document::set_root(xmlNodePtr node) {
  xmlDocSetRootElement(xml_obj, node);
}

void
Document::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "root", Document::Root);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "version", Document::Version);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "encoding", Document::Encoding);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "document", Document::Doc);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template,
                                "toString",
                                Document::ToString);

  target->Set(v8::String::NewSymbol("Document"),
              constructor_template->GetFunction());

  Node::Initialize(target);
  Namespace::Initialize(target);
}
}  // namespcae libxmljs
