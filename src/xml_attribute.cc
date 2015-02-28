// Copyright 2009, Squish Tech, LLC.
#include "xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlAttribute::constructor_template;

NAN_METHOD(XmlAttribute::New) {
  NanScope();

  NanReturnValue(args.Holder());
}

v8::Local<v8::Object>
XmlAttribute::New(xmlNode* xml_obj, const xmlChar* name, const xmlChar* value)
{
    xmlAttr* attr = xmlSetProp(xml_obj, name, value);
    assert(attr);

    if (attr->_private) {
        return NanObjectWrapHandle(static_cast<XmlNode*>(xml_obj->_private));
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();
    attribute->Wrap(obj);
    return obj;
}

v8::Local<v8::Object>
XmlAttribute::New(xmlAttr* attr)
{
    assert(attr->type == XML_ATTRIBUTE_NODE);

    if (attr->_private) {
        return NanObjectWrapHandle(static_cast<XmlNode*>(attr->_private));
    }

    XmlAttribute* attribute = new XmlAttribute(attr);
    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();
    attribute->Wrap(obj);
    return obj;
}

NAN_METHOD(XmlAttribute::Name) {
  NanScope();
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  NanReturnValue(attr->get_name());
}

NAN_METHOD(XmlAttribute::Value) {
  NanScope();
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  // attr.value('new value');
  if (args.Length() > 0) {
    attr->set_value(*v8::String::Utf8Value(args[0]));
    NanReturnValue(args.Holder());
  }

  // attr.value();
  NanReturnValue(attr->get_value());
}

NAN_METHOD(XmlAttribute::Node) {
  NanScope();
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  NanReturnValue(attr->get_element());
}

NAN_METHOD(XmlAttribute::Namespace) {
  NanScope();
  XmlAttribute *attr = ObjectWrap::Unwrap<XmlAttribute>(args.Holder());
  assert(attr);

  NanReturnValue(attr->get_namespace());
}

v8::Local<v8::Value>
XmlAttribute::get_name() {
  if (xml_obj->name)
    return NanNew<v8::String>((const char*)xml_obj->name,
                           xmlStrlen(xml_obj->name));

  return NanNull();
}

v8::Local<v8::Value>
XmlAttribute::get_value() {
  NanEscapableScope();
  xmlChar* value = xmlNodeGetContent(xml_obj);
  if (value != NULL) {
    v8::Local<v8::String> ret_value = NanNew<v8::String>((const char*)value,
                                                       xmlStrlen(value));
    xmlFree(value);
    return NanEscapeScope(ret_value);
  }

  return NanNull();
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
    return XmlElement::New(xml_obj->parent);
}

v8::Local<v8::Value>
XmlAttribute::get_namespace() {
    if (!xml_obj->ns) {
        return NanNull();
    }
    return XmlNamespace::New(xml_obj->ns);
}

void
XmlAttribute::Initialize(v8::Handle<v8::Object> target) {
  NanScope();
  v8::Local<v8::FunctionTemplate> tmpl =
   NanNew<v8::FunctionTemplate>(XmlAttribute::New);
  NanAssignPersistent(constructor_template, tmpl);
  tmpl->Inherit(NanNew(XmlNode::constructor_template));
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tmpl, "name", XmlAttribute::Name);
  NODE_SET_PROTOTYPE_METHOD(tmpl, "value", XmlAttribute::Value);
  NODE_SET_PROTOTYPE_METHOD(tmpl, "node", XmlAttribute::Node);
  NODE_SET_PROTOTYPE_METHOD(tmpl, "namespace", XmlAttribute::Namespace);

  target->Set(NanNew<v8::String>("Attribute"),
              tmpl->GetFunction());
}

}  // namespace libxmljs
