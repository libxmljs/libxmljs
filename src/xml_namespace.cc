// Copyright 2009, Squish Tech, LLC.
#include "./xml_namespace.h"

#include <libxml/xmlstring.h>

#include "./xml_node.h"


namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> Namespace::constructor_template;

v8::Handle<v8::Value>
Namespace::New(xmlNs* ns) {
  BUILD_NODE(Namespace, xmlNs, ns);
  return JsObj::Unwrap<xmlNs>(ns);
}

v8::Handle<v8::Value>
Namespace::New(const v8::Arguments& args) {
  v8::HandleScope scope;
  if (args[0]->StrictEquals(v8::Null()))
    return args.This();

  // TODO(sprsquish): ensure this is an actual Node object
  if (!args[0]->IsObject())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("You must provide a node to attach this namespace to")));

  libxmljs::Node *node = LibXmlObj::Unwrap<libxmljs::Node>(args[0]->ToObject());

  v8::String::Utf8Value *prefix = NULL, *href = NULL;

  if (args[1]->IsString())
    prefix = new v8::String::Utf8Value(args[1]->ToString());

  href = new v8::String::Utf8Value(args[2]->ToString());

  Namespace *ns = new Namespace(node->xml_obj,
                                prefix ? **prefix : NULL,
                                **href);
  assert(ns->xml_obj);
  BUILD_NODE(Namespace, xmlNs, ns->xml_obj);
  v8::Persistent<v8::Object> obj = JsObj::Unwrap<xmlNs>(ns->xml_obj);

  delete prefix;
  delete href;

  return obj;
}

Namespace::Namespace(xmlNode* node,
                     const char* prefix,
                     const char* href) {
  xml_obj = xmlNewNs(node, (const xmlChar*)href, (const xmlChar*)prefix);
}

v8::Handle<v8::Value>
Namespace::Href(const v8::Arguments& args) {
  v8::HandleScope scope;
  Namespace *ns = LibXmlObj::Unwrap<Namespace>(args.This());
  assert(ns);
  return ns->get_href();
}

v8::Handle<v8::Value>
Namespace::Prefix(const v8::Arguments& args) {
  v8::HandleScope scope;
  Namespace *ns = LibXmlObj::Unwrap<Namespace>(args.This());
  assert(ns);
  return ns->get_prefix();
}

v8::Handle<v8::Value>
Namespace::get_href() {
  if (xml_obj->href)
    return v8::String::New((const char*)xml_obj->href,
                           xmlStrlen(xml_obj->href));

  return v8::Null();
}

v8::Handle<v8::Value>
Namespace::get_prefix() {
  if (xml_obj->prefix)
    return v8::String::New((const char*)xml_obj->prefix,
                           xmlStrlen(xml_obj->prefix));

  return v8::Null();
}

void
Namespace::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(Namespace::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template, "href", Namespace::Href);
  LXJS_SET_PROTO_METHOD(constructor_template, "prefix", Namespace::Prefix);

  target->Set(v8::String::NewSymbol("Namespace"),
              constructor_template->GetFunction());
}
}  // namespace libxmljs
