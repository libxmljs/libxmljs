// Copyright 2009, Squish Tech, LLC.
#include "attribute.h"
#include "element.h"

namespace libxmljs {

#define UNWRAP_ATTRIBUTE(from)                            \
  Attribute *attr = ObjectWrap::Unwrap<Attribute>(from);  \
  assert(attr);

v8::Persistent<v8::FunctionTemplate> Attribute::constructor_template;

v8::Handle<v8::Value>
Attribute::New(const v8::Arguments& args) {
  v8::HandleScope scope;
  // was created by the libxml callback
  if (args.Length() == 1 && args[0]->IsNull())
    return args.This();

  Element *element = ObjectWrap::Unwrap<Element>(args[0]->ToObject());

  v8::String::Utf8Value name(args[1]->ToString());
  v8::String::Utf8Value value(args[2]->ToString());

  xmlAttr* elem = xmlSetProp(element->xml_obj,
                             (const xmlChar*)*name,
                             (const xmlChar*)*value);

  return XmlObj::Unwrap<xmlAttr>(elem);
}

v8::Handle<v8::Value>
Attribute::Name(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_ATTRIBUTE(args.This());

  return attr->get_name();
}

v8::Handle<v8::Value>
Attribute::Value(const v8::Arguments& args) {
  v8::HandleScope scope;
  UNWRAP_ATTRIBUTE(args.This());

  return attr->get_value();
}

v8::Handle<v8::Value>
Attribute::get_name() {
  if (xml_obj->name)
    return v8::String::New((const char*)xml_obj->name,
                           xmlStrlen(xml_obj->name));

  return v8::Null();
}

v8::Handle<v8::Value>
Attribute::get_value() {
  xmlChar* value = xmlNodeGetContent(xml_obj);
  if (value != NULL) {
    v8::Handle<v8::String> ret_value = v8::String::New((const char*)value,
                                                       xmlStrlen(value));
    xmlFree(value);
    return ret_value;
  }

  return v8::Null();
}

void
Attribute::Initialize(v8::Handle<v8::Object> target) {
  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(Attribute::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->Inherit(Node::constructor_template);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "name", Attribute::Name);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "value", Attribute::Value);

  target->Set(v8::String::NewSymbol("Attribute"),
              constructor_template->GetFunction());
}

}  // namespace libxmljs
