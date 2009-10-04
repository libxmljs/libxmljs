// Copyright 2009, Squish Tech, LLC.
#include "node.h"

#include "element.h"
#include "attribute.h"
#include "namespace.h"

namespace libxmljs {

#define UNWRAP_NODE(from)                                 \
  Node *node = ObjectWrap::Unwrap<libxmljs::Node>(from);  \
  assert(node);

v8::Persistent<v8::FunctionTemplate> Node::constructor_template;

v8::Handle<v8::Value>
Node::Doc(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_doc();
}

v8::Handle<v8::Value>
Node::Namespace(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_NODE(args.This());

  if (args.Length() == 0)
    return node->get_namespace();

  libxmljs::Namespace *ns = ObjectWrap::Unwrap<libxmljs::Namespace>(args[0]->ToObject());
  node->set_namespace(ns->xml_obj);

  return v8::Null();
}

v8::Handle<v8::Value>
Node::Parent(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_parent();
}

v8::Handle<v8::Value>
Node::PrevSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_prev_sibling();
}

v8::Handle<v8::Value>
Node::NextSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_next_sibling();
}

Node::Node(xmlNode* node) : xml_obj(node) {
  xml_obj->_private = this;
}

Node::~Node() {
  xmlFree(xml_obj);
}

v8::Handle<v8::Value>
Node::get_doc() {
  return XmlObj::Unwrap<xmlDoc>(xml_obj->doc);
}

v8::Handle<v8::Value>
Node::get_namespace() {
  if (!xml_obj->ns)
    return v8::Null();

  if (!xml_obj->ns->_private)
    return Namespace::New(xml_obj->ns);

  return XmlObj::Unwrap<xmlNs>(xml_obj->ns);
}

void
Node::set_namespace(xmlNs* ns) {
  xmlSetNs(xml_obj, ns);
}

v8::Handle<v8::Value>
Node::get_parent() {
  if (xml_obj->parent)
    return XmlObj::Unwrap<xmlNode>(xml_obj->parent);

  return XmlObj::Unwrap<xmlDoc>(xml_obj->doc);
}

v8::Handle<v8::Value>
Node::get_prev_sibling() {
  if (xml_obj->prev)
    return XmlObj::Unwrap<xmlNode>(xml_obj->prev);

  return v8::Null();
}

v8::Handle<v8::Value>
Node::get_next_sibling() {
  if (xml_obj->next)
    return XmlObj::Unwrap<xmlNode>(xml_obj->next);

  return v8::Null();
}

void
Node::Initialize(v8::Handle<v8::Object> target) {
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(v8::FunctionTemplate::New());
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "doc", Element::Doc);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "parent", Element::Parent);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "namespace", Element::Namespace);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "prev_sibling", Element::PrevSibling);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "next_sibling", Element::NextSibling);

  Element::Initialize(target);
  Attribute::Initialize(target);
}
}  // namespace libxmljs
