// Copyright 2009, Squish Tech, LLC.
#include "xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlAttribute::constructor_template;

v8::Handle<v8::Value>
XmlAttribute::New(const v8::Arguments& args) {
  v8::HandleScope scope;
  // was created by BUILD_NODE
  if (args.Length() == 1 && args[0]->StrictEquals(v8::Null()))
      return scope.Close(args.This());

  XmlElement *element = LibXmlObj::Unwrap<XmlElement>(args[0]->ToObject());

  v8::String::Utf8Value name(args[1]->ToString());
  v8::String::Utf8Value value(args[2]->ToString());

  xmlAttr *elem = xmlSetProp(element->xml_obj,
                             (const xmlChar*)*name,
                             (const xmlChar*)*value);

  UpdateV8Memory();

  // namespace passed in
  if (args.Length() == 4 && args[3]->IsObject()) {
    XmlNamespace *ns = LibXmlObj::Unwrap<XmlNamespace>(args[3]->ToObject());
    assert(ns);

    v8::Handle<v8::Object> js_attr =
        LibXmlObj::GetMaybeBuild<XmlAttribute, xmlAttr>(elem);
    XmlAttribute *attr = LibXmlObj::Unwrap<XmlAttribute>(js_attr);
    attr->set_namespace(ns->xml_obj);
  }

  return scope.Close(LibXmlObj::GetMaybeBuild<XmlAttribute, xmlAttr>(elem));
}

v8::Handle<v8::Value>
XmlAttribute::Name(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = LibXmlObj::Unwrap<XmlAttribute>(args.This());
  assert(attr);

  return scope.Close(attr->get_name());
}

v8::Handle<v8::Value>
XmlAttribute::Value(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = LibXmlObj::Unwrap<XmlAttribute>(args.This());
  assert(attr);

  // attr.value('new value');
  if (args.Length() > 0) {
    attr->set_value(*v8::String::Utf8Value(args[0]));
    return scope.Close(args.This());
  }

  // attr.value();
  return scope.Close(attr->get_value());
}

v8::Handle<v8::Value>
XmlAttribute::Node(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = LibXmlObj::Unwrap<XmlAttribute>(args.This());
  assert(attr);

  return scope.Close(attr->get_element());
}

v8::Handle<v8::Value>
XmlAttribute::get_name() {
  if (xml_obj->name)
    return v8::String::New((const char*)xml_obj->name,
                           xmlStrlen(xml_obj->name));

  return v8::Null();
}

v8::Handle<v8::Value>
XmlAttribute::get_value() {
  v8::HandleScope scope;
  xmlChar* value = xmlNodeGetContent(xml_obj);
  if (value != NULL) {
    v8::Handle<v8::String> ret_value = v8::String::New((const char*)value,
                                                       xmlStrlen(value));
    xmlFree(value);
    return scope.Close(ret_value);
  }

  return v8::Null();
}

void
XmlAttribute::set_value(const char* value) {
  if (xml_obj->children)
    xmlFreeNodeList(xml_obj->children);

  xml_obj->children = xml_obj->last = NULL;

  if (value) {
    xmlChar *buffer;
    xmlNode *tmp;

    // Encode our content
    buffer = xmlEncodeEntitiesReentrant(xml_obj->doc, (const xmlChar*)value);

    xml_obj->children = xmlStringGetNodeList(xml_obj->doc, buffer);
    xml_obj->last = NULL;
    tmp = xml_obj->children;

    // Loop through the children
    for (tmp = xml_obj->children; tmp; tmp = tmp->next) {
      tmp->parent = reinterpret_cast<xmlNode *>(xml_obj);
      tmp->doc = xml_obj->doc;
      if (tmp->next == NULL) xml_obj->last = tmp;
    }

    // Free up memory
    xmlFree(buffer);
  }
}

v8::Handle<v8::Value>
XmlAttribute::get_element() {
    return LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(xml_obj->parent);
}

void
XmlAttribute::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t =
    v8::FunctionTemplate::New(XmlAttribute::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->Inherit(XmlNode::constructor_template);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "name",
                        XmlAttribute::Name);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "value",
                        XmlAttribute::Value);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "node",
                        XmlAttribute::Node);

  target->Set(v8::String::NewSymbol("Attribute"),
              constructor_template->GetFunction());
}

}  // namespace libxmljs
