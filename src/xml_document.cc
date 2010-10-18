// Copyright 2009, Squish Tech, LLC.
#include "xml_document.h"
#include "xml_element.h"
#include "xml_namespace.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlDocument::constructor_template;

v8::Handle<v8::Value>
XmlDocument::Doc(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(args.This());
}

v8::Handle<v8::Value>
XmlDocument::Errors(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(args.This());
  assert(document);

  return scope.Close(document->errors);
}

v8::Handle<v8::Value>
XmlDocument::Encoding(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(args.This());
  assert(document);

  if (args.Length() == 0)
      return scope.Close(document->get_encoding());

  v8::String::Utf8Value encoding(args[0]->ToString());
  document->set_encoding(*encoding);
  return scope.Close(args.This());
}

v8::Handle<v8::Value>
XmlDocument::Version(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(args.This());
  assert(document);

  return scope.Close(document->get_version());
}

v8::Handle<v8::Value>
XmlDocument::Root(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(args.This());
  assert(document);

  if (args.Length() == 0)
      return scope.Close(document->get_root());

  if (document->has_root())
    return ThrowException(v8::Exception::Error(
      v8::String::New("This document already has a root node")));

  XmlElement *element = LibXmlObj::Unwrap<XmlElement>(args[0]->ToObject());
  assert(element);
  document->set_root(element->xml_obj);
  return scope.Close(args[0]);
}

v8::Handle<v8::Value>
XmlDocument::ToString(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(args.This());
  assert(document);
  return scope.Close(document->to_string());
}


v8::Handle<v8::Value>
XmlDocument::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  v8::Handle<v8::Function> callback;
  v8::String::Utf8Value *version = NULL, *encoding = NULL;

  switch (args.Length()) {
    case 0:  // newDocument()
      break;

    case 1:  // newDocument(version|callback)
      // was created by BUILD_NODE
      if (args[0]->StrictEquals(v8::Null()))
          return scope.Close(args.This());

      if (args[0]->IsString()) {
        version = new v8::String::Utf8Value(args[0]->ToString());

      } else if (args[0]->IsFunction()) {
        callback = v8::Handle<v8::Function>::Cast(args[0]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newDocument(version|callback)");
      }
      break;

    case 2:  // newDocument(version, encoding|callback)
      if (args[0]->IsString() && args[1]->IsString()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        encoding = new v8::String::Utf8Value(args[1]->ToString());

      } else if (args[0]->IsString() && args[1]->IsFunction()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        callback = v8::Handle<v8::Function>::Cast(args[1]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newXmlDocument(version, encoding|callback)");
      }
      break;

    default:  // newDocument(version, encoding, callback)
      if (args[0]->IsString() &&
          args[1]->IsString() &&
          args[2]->IsFunction()) {
        version = new v8::String::Utf8Value(args[0]->ToString());
        encoding = new v8::String::Utf8Value(args[1]->ToString());
        callback = v8::Handle<v8::Function>::Cast(args[2]);

      } else {
        LIBXMLJS_THROW_EXCEPTION(
          "Bad argument: newXmlDocument(version, encoding, callback)");
      }
      break;
  }

  if (!version)
    version = new v8::String::Utf8Value(v8::String::New("1.0"));

  xmlDoc* doc = xmlNewDoc((const xmlChar*)**version);

  UpdateV8Memory();

  v8::Handle<v8::Object> obj =
      LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(doc);
  XmlDocument *document = LibXmlObj::Unwrap<XmlDocument>(obj);

  if (encoding)
    document->set_encoding(**encoding);

  if (*callback && !callback->IsNull()) {
    v8::Handle<v8::Value> argv[1] = { obj };
    *callback->Call(obj, 1, argv);
  }

  delete version;
  if (encoding)
    delete encoding;

  return scope.Close(obj);
}

XmlDocument::~XmlDocument() {
  xmlFree(xml_obj);
  UpdateV8Memory();
}

void
XmlDocument::set_encoding(const char* encoding) {
    if(xml_obj->encoding != NULL) xmlFree((xmlChar*)xml_obj->encoding);
    xml_obj->encoding = xmlStrdup((const xmlChar*)encoding);
}

v8::Handle<v8::Value>
XmlDocument::get_encoding() {
  v8::HandleScope scope;
  if (xml_obj->encoding)
      return scope.Close(v8::String::New((const char *)xml_obj->encoding,
                                         xmlStrlen((const xmlChar*)xml_obj->encoding)));

  return v8::Null();
}

v8::Handle<v8::Value>
XmlDocument::get_version() {
  v8::HandleScope scope;
  if (xml_obj->version)
      return scope.Close(v8::String::New((const char *)xml_obj->version,
                                         xmlStrlen((const xmlChar*)xml_obj->version)));

  return v8::Null();
}

v8::Handle<v8::Value>
XmlDocument::to_string() {
  v8::HandleScope scope;
  xmlChar* buffer = NULL;
  int len = 0;

  xmlDocDumpFormatMemoryEnc(xml_obj, &buffer, &len, "UTF-8", 0);
  v8::Local<v8::String> str = v8::String::New((const char*)buffer, len);
  xmlFree(buffer);

  return scope.Close(str);
}

bool
XmlDocument::has_root() {
  return xmlDocGetRootElement(xml_obj) != NULL;
}

v8::Handle<v8::Value>
XmlDocument::get_root() {
  v8::HandleScope scope;

  xmlNode *root = xmlDocGetRootElement(xml_obj);
  if (root) {
      v8::Handle<v8::Value> rooth = LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(root);
      return scope.Close(rooth);
  }

  return v8::Null();
}

void
XmlDocument::set_root(xmlNode *node) {
  xmlDocSetRootElement(xml_obj, node);
}

void
XmlDocument::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "root",
                        XmlDocument::Root);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "version",
                        XmlDocument::Version);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "encoding",
                        XmlDocument::Encoding);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "document",
                        XmlDocument::Doc);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "errors",
                        XmlDocument::Errors);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "toString",
                        XmlDocument::ToString);

  target->Set(v8::String::NewSymbol("Document"),
              constructor_template->GetFunction());

  XmlNode::Initialize(target);
  XmlNamespace::Initialize(target);
}
}  // namespcae libxmljs
