// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_element.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlElement::constructor_template;

// doc, name, content
NAN_METHOD(XmlElement::New) {
  Nan::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (info.Length() == 0)
  {
      return info.GetReturnValue().Set(info.Holder());
  }

  XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());
  assert(document);

  v8::String::Utf8Value name(info[1]);

  v8::Local<v8::Value> contentOpt;
  if(info[2]->IsString()) {
      contentOpt = info[2];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlChar* encodedContent = content ? xmlEncodeSpecialChars(document->xml_obj, (const xmlChar*)content) : NULL;
  xmlNode* elem = xmlNewDocNode(document->xml_obj,
                                NULL,
                                (const xmlChar*) *name,
                                encodedContent);
  if (encodedContent)
      xmlFree(encodedContent);

  XmlElement* element = new XmlElement(elem);
  elem->_private = element;
  element->Wrap(info.Holder());

  // this prevents the document from going away
  info.Holder()->Set(Nan::New<v8::String>("document").ToLocalChecked(), info[0]);

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlElement::Name) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  if (info.Length() == 0)
      return info.GetReturnValue().Set(element->get_name());

  v8::String::Utf8Value name(info[0]->ToString());
  element->set_name(*name);
  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlElement::Attr) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  // getter
  if (info.Length() == 1)
  {
      v8::String::Utf8Value name(info[0]);
      return info.GetReturnValue().Set(element->get_attr(*name));
  }

  // setter
  v8::String::Utf8Value name(info[0]->ToString());
  v8::String::Utf8Value value(info[1]->ToString());
  element->set_attr(*name, *value);

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlElement::Attrs) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_attrs());
}

NAN_METHOD(XmlElement::AddChild) {
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlElement* child = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
  assert(child);

  xmlNode *imported_child = element->import_node(child);
  if (imported_child == NULL) {
      return Nan::ThrowError("Could not add child. Failed to copy node to new Document.");
  }
  element->add_child(imported_child);

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlElement::AddCData) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  v8::Local<v8::Value> contentOpt;
  if(info[0]->IsString()) {
      contentOpt = info[0];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlNode* elem = xmlNewCDataBlock(element->xml_obj->doc,
                                  (const xmlChar*)content,
                                  xmlStrlen((const xmlChar*)content));

  element->add_cdata(elem);
  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlElement::Find) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  v8::String::Utf8Value xpath(info[0]);

  XmlXpathContext ctxt(element->xml_obj);

  if (info.Length() == 2) {
    if (info[1]->IsString()) {
      v8::String::Utf8Value uri(info[1]);
      ctxt.register_ns((const xmlChar*)"xmlns", (const xmlChar*)*uri);

    } else if (info[1]->IsObject()) {
      v8::Local<v8::Object> namespaces = info[1]->ToObject();
      v8::Local<v8::Array> properties = namespaces->GetPropertyNames();
      for (unsigned int i = 0; i < properties->Length(); i++) {
        v8::Local<v8::String> prop_name = properties->Get(
          Nan::New<v8::Number>(i))->ToString();
        v8::String::Utf8Value prefix(prop_name);
        v8::String::Utf8Value uri(namespaces->Get(prop_name));
        ctxt.register_ns((const xmlChar*)*prefix, (const xmlChar*)*uri);
      }
    }
  }

  return info.GetReturnValue().Set(ctxt.evaluate((const xmlChar*)*xpath));
}

NAN_METHOD(XmlElement::Child) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  if (info.Length() != 1 || !info[0]->IsInt32())
  {
      return Nan::ThrowError("Bad argument: must provide #child() with a number");
  }

  const int32_t idx = info[0]->Int32Value();
  return info.GetReturnValue().Set(element->get_child(idx));
}

NAN_METHOD(XmlElement::ChildNodes) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  if (info[0]->IsInt32())
      return info.GetReturnValue().Set(element->get_child(info[0]->Int32Value()));

  return info.GetReturnValue().Set(element->get_child_nodes());
}

NAN_METHOD(XmlElement::Path) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_path());
}

void
XmlElement::set_name(const char* name) {
  xmlNodeSetName(xml_obj, (const xmlChar*)name);
}

v8::Local<v8::Value>
XmlElement::get_name() {
    Nan::EscapableHandleScope scope;
    if(xml_obj->name) return scope.Escape(Nan::New<v8::String>((const char*)xml_obj->name).ToLocalChecked());
    else return scope.Escape(Nan::Undefined());
}

// TODO(sprsquish) make these work with namespaces
v8::Local<v8::Value>
XmlElement::get_attr(const char* name) {
  Nan::EscapableHandleScope scope;
  xmlAttr* attr = xmlHasProp(xml_obj, (const xmlChar*)name);

  // why do we need a reference to the element here?
  if (attr) {
      return scope.Escape(XmlAttribute::New(attr));
  }

  return scope.Escape(Nan::Null());
}

// TODO(sprsquish) make these work with namespaces
void
XmlElement::set_attr(const char* name,
                     const char* value)
{
    Nan::HandleScope scope;
    XmlAttribute::New(xml_obj, (const xmlChar*)name, (const xmlChar*)value);
}

v8::Local<v8::Value>
XmlElement::get_attrs() {
  Nan::EscapableHandleScope scope;
  xmlAttr* attr = xml_obj->properties;

  if (!attr)
      return scope.Escape(Nan::New<v8::Array>(0));

  v8::Local<v8::Array> attributes = Nan::New<v8::Array>();
  v8::Local<v8::Function> push = v8::Local<v8::Function>::Cast(
    attributes->Get(Nan::New<v8::String>("push").ToLocalChecked()));
  v8::Local<v8::Value> argv[1];
  do {
      argv[0] = XmlAttribute::New(attr);
      push->Call(attributes, 1, argv);
  } while ((attr = attr->next));

  return scope.Escape(attributes);
}

void
XmlElement::add_child(xmlNode* child) {
  xmlAddChild(xml_obj, child);
}

void
XmlElement::add_cdata(xmlNode* cdata) {
  xmlAddChild(xml_obj, cdata);
}


v8::Local<v8::Value>
XmlElement::get_child(int32_t idx) {
  Nan::EscapableHandleScope scope;
  xmlNode* child = xml_obj->children;

  int32_t i = 0;
  while (child && i < idx) {
    child = child->next;
    ++i;
  }

  if (!child)
    return scope.Escape(Nan::Null());

  return scope.Escape(XmlElement::New(child));
}

v8::Local<v8::Value>
XmlElement::get_child_nodes() {
    Nan::EscapableHandleScope scope;

    xmlNode* child = xml_obj->children;
    if (!child)
        return scope.Escape(Nan::New<v8::Array>(0));

    uint32_t len = 0;
    do {
        ++len;
    } while ((child = child->next));

    v8::Local<v8::Array> children = Nan::New<v8::Array>(len);
    child = xml_obj->children;

    uint32_t i = 0;
    do {
        Nan::Set(children, i, XmlNode::New(child));
    } while ((child = child->next) && ++i < len);

    return scope.Escape(children);
}

v8::Local<v8::Value>
XmlElement::get_path() {
  Nan::EscapableHandleScope scope;
  xmlChar* path = xmlGetNodePath(xml_obj);
  const char* return_path = path ? reinterpret_cast<char*>(path) : "";
  int str_len = xmlStrlen((const xmlChar*)return_path);
  v8::Local<v8::String> js_obj = Nan::New<v8::String>(return_path, str_len).ToLocalChecked();
  xmlFree(path);
  return scope.Escape(js_obj);
}

v8::Local<v8::Object>
XmlElement::New(xmlNode* node)
{
    Nan::EscapableHandleScope scope;
    if (node->_private) {
        return scope.Escape(static_cast<XmlNode*>(node->_private)->handle());
    }

    XmlElement* element = new XmlElement(node);
    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();
    element->Wrap(obj);
    return scope.Escape(obj);
}

XmlElement::XmlElement(xmlNode* node)
    : XmlFraternalNode(node)
{
}

void
XmlElement::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>(New);
    constructor_template.Reset( tmpl);
    tmpl->Inherit(Nan::New(XmlFraternalNode::constructor_template));
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tmpl,
            "addChild",
            XmlElement::AddChild);

    Nan::SetPrototypeMethod(tmpl,
            "addCData",
            XmlElement::AddCData);

    Nan::SetPrototypeMethod(tmpl,
            "_attr",
            XmlElement::Attr);

    Nan::SetPrototypeMethod(tmpl,
            "attrs",
            XmlElement::Attrs);

    Nan::SetPrototypeMethod(tmpl,
            "child",
            XmlElement::Child);

    Nan::SetPrototypeMethod(tmpl,
            "childNodes",
            XmlElement::ChildNodes);

    Nan::SetPrototypeMethod(tmpl,
            "find",
            XmlElement::Find);

    Nan::SetPrototypeMethod(tmpl,
            "name",
            XmlElement::Name);

    Nan::SetPrototypeMethod(tmpl,
            "path",
            XmlElement::Path);

    Nan::Set(target, Nan::New<v8::String>("Element").ToLocalChecked(),
            tmpl->GetFunction());

}

}  // namespace libxmljs
