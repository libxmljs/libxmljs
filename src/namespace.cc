#include "namespace.h"
#include "node.h"

#include <libxml/xmlstring.h>

using namespace v8;
using namespace libxmljs;

#define UNWRAP_NAMESPACE(from)                          \
  Namespace *ns = ObjectWrap::Unwrap<Namespace>(from);  \
  assert(ns);

Persistent<FunctionTemplate> Namespace::constructor_template;

Handle<Value>
Namespace::New(
  xmlNs * ns)
{
  BUILD_NODE(Namespace, xmlNs, name_space, ns);
  return XmlObj::Unwrap<xmlNs>(ns);
}

Handle<Value>
Namespace::New(
  const Arguments& args)
{
  HandleScope scope;
  if (args[0]->IsNull())
    return args.This();

  if (!args[0]->IsObject())
    return ThrowException(Exception::Error(String::New("You must provide a node to attach this namespace to")));

  libxmljs::Node *node = ObjectWrap::Unwrap<libxmljs::Node>(args[0]->ToObject());

  String::Utf8Value *prefix = NULL, *href = NULL;

  if (args[1]->IsString())
    prefix = new String::Utf8Value(args[1]->ToString());

  href = new String::Utf8Value(args[2]->ToString());

  Namespace *ns = new Namespace(node->xml_obj, prefix?**prefix:NULL, **href);
  BUILD_NODE(Namespace, xmlNs, name_space, ns->xml_obj);
  Persistent<Object> obj = XmlObj::Unwrap<xmlNs>(ns->xml_obj);

  delete ns;
  delete prefix;
  delete href;

  return obj;
}

Namespace::Namespace(
  xmlNode * node,
  const char * prefix,
  const char * href)
{
  xml_obj = xmlNewNs(node, (const xmlChar*)href, (const xmlChar*)prefix);
}

Handle<Value>
Namespace::Node(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NAMESPACE(args.This());
  return ns->get_node();
}

Handle<Value>
Namespace::Href(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NAMESPACE(args.This());
  return ns->get_href();
}

Handle<Value>
Namespace::Prefix(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_NAMESPACE(args.This());
  return ns->get_prefix();
}

Handle<Value>
Namespace::get_node()
{
  return Null();
}

Handle<Value>
Namespace::get_href()
{
  if (xml_obj->href)
    return String::New((const char*)xml_obj->href, xmlStrlen(xml_obj->href));

  return Null();
}

Handle<Value>
Namespace::get_prefix()
{
  if (xml_obj->prefix)
    return String::New((const char*)xml_obj->prefix, xmlStrlen(xml_obj->prefix));

  return Null();
}

void
Namespace::Initialize(
  Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(Namespace::New);
  constructor_template = Persistent<FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "node", Namespace::Node);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "href", Namespace::Href);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "prefix", Namespace::Prefix);

  target->Set(String::NewSymbol("Namespace"), constructor_template->GetFunction());
}
