#include "attribute.h"
#include "element.h"

using namespace v8;
using namespace libxmljs;

#define UNWRAP_ATTRIBUTE(from)                            \
  Attribute *attr = ObjectWrap::Unwrap<Attribute>(from);  \
  assert(attr);

Persistent<FunctionTemplate> Attribute::constructor_template;

Handle<Value>
Attribute::New(
  const Arguments& args)
{
  HandleScope scope;
  if (args.Length() == 1 && args[0]->IsNull()) // was created by the libxml callback
    return args.This();

  Element *element = ObjectWrap::Unwrap<Element>(args[0]->ToObject());

  String::Utf8Value name(args[1]->ToString());
  String::Utf8Value value(args[2]->ToString());

  xmlAttr* elem = xmlSetProp(element->xml_obj, (const xmlChar*)*name, (const xmlChar*)*value);

  return XmlObj::Unwrap<xmlAttr>(elem);
}

Handle<Value>
Attribute::Name(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ATTRIBUTE(args.This());

  return attr->get_name();
}

Handle<Value>
Attribute::Value(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ATTRIBUTE(args.This());

  return attr->get_value();
}

Handle<Value>
Attribute::get_name()
{
  if (xml_obj->name)
    return String::New((const char*)xml_obj->name, xmlStrlen(xml_obj->name));

  return Null();
}

Handle<Value>
Attribute::get_value()
{
  xmlChar* value = xmlNodeGetContent(xml_obj);
  if (value != NULL) {
    Handle<String> ret_value = String::New((const char*)value, xmlStrlen(value));
    xmlFree(value);
    return ret_value;
  }

  return Null();
}

void
Attribute::Initialize(
  Handle<Object> target)
{
  Local<FunctionTemplate> t = FunctionTemplate::New(Attribute::New);
  constructor_template = Persistent<FunctionTemplate>::New(t);
  constructor_template->Inherit(Node::constructor_template);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "name", Attribute::Name);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "value", Attribute::Value);

  target->Set(String::NewSymbol("Attribute"), constructor_template->GetFunction());
}
