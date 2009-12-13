// Copyright 2009, Squish Tech, LLC.
#include "./xml_node.h"
#include "./xml_document.h"
#include "./xml_namespace.h"
#include "./xml_element.h"
#include "./xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNode::constructor_template;

v8::Handle<v8::Value>
XmlNode::Doc(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return node->get_doc();
}

v8::Handle<v8::Value>
XmlNode::Namespace(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  // #namespace() Get the node's namespace
  if (args.Length() == 0)
    return node->get_namespace();

  if (args[0]->IsNull())
    return node->remove_namespace();

  XmlNamespace *ns = NULL;

  // #namespace(ns) libxml.Namespace object was provided
  // TODO(sprsquish): check that it was actually given a namespace obj
  if (args[0]->IsObject())
    ns = LibXmlObj::Unwrap<XmlNamespace>(args[0]->ToObject());

  // #namespace(href) or #namespace(prefix, href)
  // if the namespace has already been defined on the node, just set it
  if (args[0]->IsString()) {
    v8::String::Utf8Value ns_to_find(args[0]->ToString());
    xmlNs* found_ns = node->find_namespace(*ns_to_find);
    if (found_ns)
      ns = LibXmlObj::Unwrap<XmlNamespace>(
        JsObj::Unwrap<xmlNs>(found_ns));
  }

  // Namespace does not seem to exist, so create it.
  if (!ns) {
    int argc = 3;
    v8::Handle<v8::Value> argv[argc];
    argv[0] = args.This();

    if (args.Length() == 1) {
      argv[1] = v8::Null();
      argv[2] = args[0];
    } else {
      argv[1] = args[0];
      argv[2] = args[1];
    }

    v8::Handle<v8::Function> define_namespace =
      XmlNamespace::constructor_template->GetFunction();

    v8::Persistent<v8::Object> new_ns = v8::Persistent<v8::Object>::New(
      define_namespace->Call(args.This(), argc, argv)->ToObject());
    ns = LibXmlObj::Unwrap<XmlNamespace>(new_ns);
  }

  node->set_namespace(ns->xml_obj);

  return node->get_namespace();
}

v8::Handle<v8::Value>
XmlNode::Parent(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return node->get_parent();
}

v8::Handle<v8::Value>
XmlNode::PrevSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return node->get_prev_sibling();
}

v8::Handle<v8::Value>
XmlNode::NextSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return node->get_next_sibling();
}

XmlNode::XmlNode(xmlNode* node) : xml_obj(node) {
  xml_obj->_private = this;
}

XmlNode::~XmlNode() {
  xmlFree(xml_obj);
}

v8::Handle<v8::Value>
XmlNode::get_doc() {
  return JsObj::Unwrap<xmlDoc>(xml_obj->doc);
}

v8::Handle<v8::Value>
XmlNode::remove_namespace() {
  xml_obj->ns = NULL;
  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_namespace() {
  if (!xml_obj->ns)
    return v8::Null();

  if (!xml_obj->ns->_private)
    return XmlNamespace::New(xml_obj->ns);

  return JsObj::Unwrap<xmlNs>(xml_obj->ns);
}

void
XmlNode::set_namespace(xmlNs* ns) {
  xmlSetNs(xml_obj, ns);
}

xmlNs*
XmlNode::find_namespace(const char* search_str) {
  xmlNs* ns = NULL;

  // Find by prefix first
  ns = xmlSearchNs(xml_obj->doc, xml_obj, (const xmlChar*)search_str);

  // Or find by href
  if (!ns)
    ns = xmlSearchNsByHref(xml_obj->doc, xml_obj, (const xmlChar*)search_str);

  return ns;
}

v8::Handle<v8::Value>
XmlNode::get_parent() {
  if (xml_obj->parent)
    return LIBXMLJS_GET_MAYBE_BUILD(XmlElement, xmlNode, xml_obj->parent);

  return LIBXMLJS_GET_MAYBE_BUILD(XmlDocument, xmlDoc, xml_obj->doc);
}

v8::Handle<v8::Value>
XmlNode::get_prev_sibling() {
  if (xml_obj->prev)
    return LIBXMLJS_GET_MAYBE_BUILD(XmlElement, xmlNode, xml_obj->prev);

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_next_sibling() {
  if (xml_obj->next)
    return LIBXMLJS_GET_MAYBE_BUILD(XmlElement, xmlNode, xml_obj->next);

  return v8::Null();
}

void
XmlNode::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  constructor_template =
    v8::Persistent<v8::FunctionTemplate>::New(v8::FunctionTemplate::New());
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "doc",
                        XmlNode::Doc);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "parent",
                        XmlNode::Parent);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "namespace",
                        XmlNode::Namespace);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "prev_sibling",
                        XmlNode::PrevSibling);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "next_sibling",
                        XmlNode::NextSibling);

  XmlElement::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
