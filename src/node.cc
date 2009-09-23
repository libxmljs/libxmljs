#include "node.h"
#include "element.h"
#include "attribute.h"
#include "namespace.h"

using namespace v8;
using namespace libxmljs;

#define UNWRAP_NODE(from)                                 \
  Node *node = ObjectWrap::Unwrap<libxmljs::Node>(from);  \
  assert(node);

Persistent<FunctionTemplate> Node::constructor_template;

Handle<Value>
Node::Doc(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_doc();
}

Handle<Value>
Node::Namespace(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NODE(args.This());

  if (args.Length() == 0)
    return node->get_namespace();

  libxmljs::Namespace *ns = ObjectWrap::Unwrap<libxmljs::Namespace>(args[0]->ToObject());
  node->set_namespace(ns->xml_obj);

  return Null();
}

Handle<Value>
Node::Parent(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_parent();
}

Handle<Value>
Node::PrevSibling(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_prev_sibling();
}

Handle<Value>
Node::NextSibling(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NODE(args.This());

  return node->get_next_sibling();
}

Node::Node(
  xmlNode* node)
: xml_obj(node)
{
  xml_obj->_private = this;
}

Node::~Node()
{
  xmlFree(xml_obj);
}

Handle<Value>
Node::get_doc()
{
  return XmlObj::Unwrap<xmlDoc>(xml_obj->doc);
}

Handle<Value>
Node::get_namespace()
{
  if (!xml_obj->ns)
    return Null();

  if (!xml_obj->ns->_private)
    return Namespace::New(xml_obj->ns);

  return XmlObj::Unwrap<xmlNs>(xml_obj->ns);
}

void
Node::set_namespace(
  xmlNs * ns)
{
  xmlSetNs(xml_obj, ns);
}

Handle<Value>
Node::get_parent()
{
  if (xml_obj->parent)
    return XmlObj::Unwrap<xmlNode>(xml_obj->parent);

  return XmlObj::Unwrap<xmlDoc>(xml_obj->doc);
}

Handle<Value>
Node::get_prev_sibling()
{
  if (xml_obj->prev)
    return XmlObj::Unwrap<xmlNode>(xml_obj->prev);

  return Null();
}

Handle<Value>
Node::get_next_sibling()
{
  if (xml_obj->next)
    return XmlObj::Unwrap<xmlNode>(xml_obj->next);

  return Null();
}

void
Node::Initialize(
  Handle<Object> target)
{
  constructor_template = Persistent<FunctionTemplate>::New(FunctionTemplate::New());
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "doc", Element::Doc);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "parent", Element::Parent);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "namespace", Element::Namespace);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "prev_sibling", Element::PrevSibling);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "next_sibling", Element::NextSibling);

  Element::Initialize(target);
  Attribute::Initialize(target);
}
