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

  xmlChar* encoded = content ? xmlEncodeSpecialChars(document->xml_obj, (const xmlChar*)content) : NULL;
  xmlNode* elem = xmlNewDocNode(document->xml_obj,
                                NULL,
                                (const xmlChar*)*name,
                                encoded);
  if (encoded)
      xmlFree(encoded);

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
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlElement* child = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
  assert(child);

  child = element->import_element(child);

  if(child == NULL) {
      return Nan::ThrowError("Could not add child. Failed to copy node to new Document.");
  }

  element->add_child(child);
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

NAN_METHOD(XmlElement::NextElement) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_next_element());
}

NAN_METHOD(XmlElement::PrevElement) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_prev_element());
}

NAN_METHOD(XmlElement::Text) {
  Nan::HandleScope scope;
  XmlElement *element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  if (info.Length() == 0) {
    return info.GetReturnValue().Set(element->get_content());
  } else {
    element->set_content(*v8::String::Utf8Value(info[0]));
  }

  return info.GetReturnValue().Set(info.Holder());
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

NAN_METHOD(XmlElement::AddPrevSibling) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlElement* new_sibling = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_prev_sibling(new_sibling);

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlElement::AddNextSibling) {
  Nan::HandleScope scope;
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlElement* new_sibling = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_next_sibling(new_sibling);

  return info.GetReturnValue().Set(info[0]);
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
XmlElement::add_child(XmlElement* child) {
  xmlNodePtr node = xmlAddChild(xml_obj, child->xml_obj);
  if (node != child->xml_obj)
  {
    // xmlAddChild deleted child->xml_obj by merging it with xml_obj last child
    // recreate a valid xml_obj for child to avoid any memory issue
    child->xml_obj = xmlNewDocText(xml_obj->doc, (const xmlChar*) "");
  }
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
  xmlChar* path = xmlGetNodePath(xml_obj);
  const char* return_path = path ? reinterpret_cast<char*>(path) : "";
  int str_len = xmlStrlen((const xmlChar*)return_path);
  v8::Local<v8::String> js_obj = Nan::New<v8::String>(return_path, str_len).ToLocalChecked();
  xmlFree(path);
  return js_obj;
}

void
XmlElement::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Local<v8::Value>
XmlElement::get_content() {
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Local<v8::String> ret_content =
      Nan::New<v8::String>((const char *)content).ToLocalChecked();
    xmlFree(content);
    return ret_content;
  }

  return Nan::New<v8::String>("").ToLocalChecked();
}

v8::Local<v8::Value>
XmlElement::get_next_element() {
  Nan::EscapableHandleScope scope;

  xmlNode* sibling = xml_obj->next;
  if (!sibling)
    return scope.Escape(Nan::Null());

  while (sibling && sibling->type != XML_ELEMENT_NODE)
    sibling = sibling->next;

  if (sibling) {
      return scope.Escape(XmlElement::New(sibling));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlElement::get_prev_element() {
  Nan::EscapableHandleScope scope;

  xmlNode* sibling = xml_obj->prev;
  if (!sibling)
    return scope.Escape(Nan::Null());

  while (sibling && sibling->type != XML_ELEMENT_NODE) {
    sibling = sibling->prev;
  }

  if (sibling) {
      return scope.Escape(XmlElement::New(sibling));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Object>
XmlElement::New(xmlNode* node)
{
    if (node->_private) {
        return static_cast<XmlNode*>(node->_private)->handle();
    }

    XmlElement* element = new XmlElement(node);
    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();
    element->Wrap(obj);
    return obj;
}

XmlElement::XmlElement(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlElement::add_prev_sibling(XmlElement* element) {
  xmlAddPrevSibling(xml_obj, element->xml_obj);
}

void
XmlElement::add_next_sibling(XmlElement* element) {
  xmlAddNextSibling(xml_obj, element->xml_obj);
}

XmlElement *
XmlElement::import_element(XmlElement *element) {

    xmlNode* new_child;

    if (xml_obj->doc == element->xml_obj->doc) {
       return element;
    } else {
        new_child = xmlDocCopyNode(element->xml_obj, xml_obj->doc, 1);
        if(new_child == NULL) {
            return NULL;
        }

        // this is like this because we cannot just create XmlElement objects
        // we have to have handles to attach them to
        // the problem with this approach tho is that the object could be reclaimed
        // what prevents v8 from garbage collecting it?
        v8::Local<v8::Object> new_elem = XmlElement::New(new_child);
        return Nan::ObjectWrap::Unwrap<XmlElement>(new_elem);
    }
}

void
XmlElement::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>(New);
    constructor_template.Reset( tmpl);
    tmpl->Inherit(Nan::New(XmlNode::constructor_template));
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
            "nextElement",
            XmlElement::NextElement);

    Nan::SetPrototypeMethod(tmpl,
            "prevElement",
            XmlElement::PrevElement);

    Nan::SetPrototypeMethod(tmpl,
            "name",
            XmlElement::Name);

    Nan::SetPrototypeMethod(tmpl,
            "path",
            XmlElement::Path);

    Nan::SetPrototypeMethod(tmpl,
            "text",
            XmlElement::Text);

    Nan::SetPrototypeMethod(tmpl,
            "addPrevSibling",
            XmlElement::AddPrevSibling);

    Nan::SetPrototypeMethod(tmpl,
            "addNextSibling",
            XmlElement::AddNextSibling);

    Nan::Set(target, Nan::New<v8::String>("Element").ToLocalChecked(),
            tmpl->GetFunction());
}

}  // namespace libxmljs
