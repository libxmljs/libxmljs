// Copyright 2009, Squish Tech, LLC.
#include "xml_attribute.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlAttribute::constructor_template;

NAN_METHOD(XmlAttribute::New) {
  Nan::HandleScope scope;

  return info.GetReturnValue().Set(info.Holder());
}

v8::Local<v8::Object>
XmlAttribute::New(xmlNode* xml_obj, const xmlChar* name, const xmlChar* value)
{
    Nan::EscapableHandleScope scope;
    xmlAttr* attr = xmlSetProp(xml_obj, name, value);
    assert(attr);

    if (attr->_private) {
        return scope.Escape(static_cast<XmlNode*>(xml_obj->_private)->handle());
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = Nan::NewInstance(Nan::GetFunction(Nan::New(constructor_template)).ToLocalChecked()).ToLocalChecked();
    attribute->Wrap(obj);
    return scope.Escape(obj);
}

v8::Local<v8::Object>
XmlAttribute::New(xmlAttr* attr)
{
    Nan::EscapableHandleScope scope;
    assert(attr->type == XML_ATTRIBUTE_NODE);

    if (attr->_private) {
        return scope.Escape(static_cast<XmlNode*>(attr->_private)->handle());
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = Nan::NewInstance(Nan::GetFunction(Nan::New(constructor_template)).ToLocalChecked()).ToLocalChecked();
    attribute->Wrap(obj);
    return scope.Escape(obj);
}

NAN_METHOD(XmlAttribute::Name) {
  Nan::HandleScope scope;
  XmlAttribute *attr = Nan::ObjectWrap::Unwrap<XmlAttribute>(info.Holder());
  assert(attr);

  return info.GetReturnValue().Set(attr->get_name());
}

NAN_METHOD(XmlAttribute::Value) {
  Nan::HandleScope scope;
  XmlAttribute *attr = Nan::ObjectWrap::Unwrap<XmlAttribute>(info.Holder());
  assert(attr);

  // attr.value('new value');
  if (info.Length() > 0) {
    attr->set_value(*Nan::Utf8String(info[0]));
    return info.GetReturnValue().Set(info.Holder());
  }

  // attr.value();
  return info.GetReturnValue().Set(attr->get_value());
}

NAN_METHOD(XmlAttribute::Node) {
  Nan::HandleScope scope;
  XmlAttribute *attr = Nan::ObjectWrap::Unwrap<XmlAttribute>(info.Holder());
  assert(attr);

  return info.GetReturnValue().Set(attr->get_element());
}

NAN_METHOD(XmlAttribute::Namespace) {
  Nan::HandleScope scope;
  XmlAttribute *attr = Nan::ObjectWrap::Unwrap<XmlAttribute>(info.Holder());
  assert(attr);

  return info.GetReturnValue().Set(attr->get_namespace());
}

v8::Local<v8::Value>
XmlAttribute::get_name() {
  Nan::EscapableHandleScope scope;
  if (xml_obj->name)
    return scope.Escape(Nan::New<v8::String>((const char*)xml_obj->name,
                           xmlStrlen(xml_obj->name)).ToLocalChecked());

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlAttribute::get_value() {
  Nan::EscapableHandleScope scope;
  xmlChar* value = xmlNodeGetContent(xml_obj);
  if (value != NULL) {
    v8::Local<v8::String> ret_value = Nan::New<v8::String>((const char*)value,
                                                       xmlStrlen(value)).ToLocalChecked();
    xmlFree(value);
    return scope.Escape(ret_value);
  }

  return scope.Escape(Nan::Null());
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

v8::Local<v8::Value>
XmlAttribute::get_element() {
    Nan::EscapableHandleScope scope;
    return scope.Escape(XmlElement::New(xml_obj->parent));
}

v8::Local<v8::Value>
XmlAttribute::get_namespace() {
    Nan::EscapableHandleScope scope;
    if (!xml_obj->ns) {
        return scope.Escape(Nan::Null());
    }
    return scope.Escape(XmlNamespace::New(xml_obj->ns));
}

void
XmlAttribute::Initialize(v8::Local<v8::Object> target) {
  Nan::HandleScope scope;
  v8::Local<v8::FunctionTemplate> tmpl =
   Nan::New<v8::FunctionTemplate>(XmlAttribute::New);
  constructor_template.Reset( tmpl);
  tmpl->Inherit(Nan::New(XmlNode::constructor_template));
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tmpl, "name", XmlAttribute::Name);
  Nan::SetPrototypeMethod(tmpl, "value", XmlAttribute::Value);
  Nan::SetPrototypeMethod(tmpl, "node", XmlAttribute::Node);
  Nan::SetPrototypeMethod(tmpl, "namespace", XmlAttribute::Namespace);

  Nan::Set(target, Nan::New<v8::String>("Attribute").ToLocalChecked(),
              Nan::GetFunction(tmpl).ToLocalChecked());
}

}  // namespace libxmljs
