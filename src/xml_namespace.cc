// Copyright 2009, Squish Tech, LLC.
#include "xml_namespace.h"
#include "xml_node.h"
#include "xml_document.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNamespace::constructor_template;

v8::Handle<v8::Value>
XmlNamespace::New(const v8::Arguments& args) {
  v8::HandleScope scope;
  if (args[0]->StrictEquals(v8::Null()))
      return scope.Close(args.This());

  // TODO(sprsquish): ensure this is an actual Node object
  if (!args[0]->IsObject())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("You must provide a node to attach this namespace to")));

  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args[0]->ToObject());

  v8::String::Utf8Value *prefix = NULL, *href = NULL;

  if (args[1]->IsString())
    prefix = new v8::String::Utf8Value(args[1]->ToString());

  href = new v8::String::Utf8Value(args[2]->ToString());

  xmlNs* ns = xmlNewNs(node->xml_obj,
                       (const xmlChar*)**href,
                       prefix ? (const xmlChar*)**prefix : NULL);

  UpdateV8Memory();

  if (prefix)
    delete prefix;
  delete href;

  return scope.Close(LibXmlObj::GetMaybeBuild<XmlNamespace, xmlNs>(ns));
}

XmlNamespace::XmlNamespace(xmlNs* node) : xml_obj(node) {
    v8::HandleScope scope;
    xml_obj->_private = this;
    if(xml_obj->context) {
        doc = v8::Persistent<v8::Value>::New(LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(xml_obj->context));
    }
}

XmlNamespace::~XmlNamespace() {
    xml_obj->_private = NULL;
    doc.Dispose();
    doc.Clear();

  // We do not free the xmlNode here. It could still be part of a document
  // It will be freed when the doc is freed
  // xmlFree(xml_obj);
}

v8::Handle<v8::Value>
XmlNamespace::Href(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNamespace *ns = LibXmlObj::Unwrap<XmlNamespace>(args.This());
  assert(ns);
  return scope.Close(ns->get_href());
}

v8::Handle<v8::Value>
XmlNamespace::Prefix(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNamespace *ns = LibXmlObj::Unwrap<XmlNamespace>(args.This());
  assert(ns);
  return scope.Close(ns->get_prefix());
}

v8::Handle<v8::Value>
XmlNamespace::get_href() {
  if (xml_obj->href)
    return v8::String::New((const char*)xml_obj->href,
                           xmlStrlen(xml_obj->href));

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNamespace::get_prefix() {
  if (xml_obj->prefix)
    return v8::String::New((const char*)xml_obj->prefix,
                           xmlStrlen(xml_obj->prefix));

  return v8::Null();
}

void
XmlNamespace::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t =
    v8::FunctionTemplate::New(XmlNamespace::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "href",
                        XmlNamespace::Href);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "prefix",
                        XmlNamespace::Prefix);

  target->Set(v8::String::NewSymbol("Namespace"),
              constructor_template->GetFunction());
}
}  // namespace libxmljs
