#include "node.h"
#include "element.h"
#include "attribute.h"

using namespace v8;
using namespace libxmljs;

#define UNWRAP_NODE(from)                       \
  Node *node = ObjectWrap::Unwrap<Node>(from);  \
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
  return XmlObj::Unwrap(xml_obj->doc);
}

Handle<Value>
Node::get_parent()
{
  if (xml_obj->parent)
    return XmlObj::Unwrap(xml_obj->parent);

  return XmlObj::Unwrap(xml_obj->doc);
}

Handle<Value>
Node::get_prev_sibling()
{
  if (xml_obj->prev)
    return XmlObj::Unwrap(xml_obj->prev);

  return Null();
}

Handle<Value>
Node::get_next_sibling()
{
  if (xml_obj->next)
    return XmlObj::Unwrap(xml_obj->next);

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
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "prev_sibling", Element::PrevSibling);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "next_sibling", Element::NextSibling);

  Element::Initialize(target);
  Attribute::Initialize(target);
}
