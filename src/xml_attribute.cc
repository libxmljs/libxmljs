// Copyright 2009, Squish Tech, LLC.
#include "xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlAttribute::constructor_template;

v8::Handle<v8::Value>
XmlAttribute::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  return scope.Close(args.Holder());
}

v8::Handle<v8::Object>
XmlAttribute::New(xmlNode* xml_obj, const xmlChar* name, const xmlChar* value)
{
    xmlAttr* attr = xmlSetProp(xml_obj, name, value);

    if (attr->_private) {
        return static_cast<XmlNode*>(xml_obj->_private)->handle_;
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();
    attribute->Wrap(obj);
    return obj;
}

v8::Handle<v8::Object>
XmlAttribute::New(xmlAttr* attr)
{
    assert(attr->type == XML_ATTRIBUTE_NODE);

    if (attr->_private) {
        return static_cast<XmlNode*>(attr->_private)->handle_;
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();
    attribute->Wrap(obj);
    return obj;
}

v8::Handle<v8::Value>
XmlAttribute::Name(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  return scope.Close(attr->get_name());
}

v8::Handle<v8::Value>
XmlAttribute::Value(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  // attr.value('new value');
  if (args.Length() > 0) {
    attr->set_value(*v8::String::Utf8Value(args[0]));
    return scope.Close(args.Holder());
  }

  // attr.value();
  return scope.Close(attr->get_value());
}

v8::Handle<v8::Value>
XmlAttribute::Node(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
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
    return XmlElement::New(xml_obj->parent);
}

void
XmlAttribute::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t =
    v8::FunctionTemplate::New(XmlAttribute::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->Inherit(XmlNode::constructor_template);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(constructor_template, "name", XmlAttribute::Name);
  NODE_SET_PROTOTYPE_METHOD(constructor_template, "value", XmlAttribute::Value);
  NODE_SET_PROTOTYPE_METHOD(constructor_template, "node", XmlAttribute::Node);

  target->Set(v8::String::NewSymbol("Attribute"),
              constructor_template->GetFunction());
}

}  // namespace libxmljs
