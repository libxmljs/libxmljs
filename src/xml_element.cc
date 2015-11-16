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

  XmlNode* child = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());
  assert(child);

  xmlNode *imported_child = element->import_node(child->xml_obj);
  if (imported_child == NULL) {
      return Nan::ThrowError("Could not add child. Failed to copy node to new Document.");
  }

  bool will_merge = element->child_will_merge(imported_child);
  if ((child->xml_obj == imported_child) && will_merge) {
      // merged child will be free, so ensure it is a copy
      imported_child = xmlCopyNode(imported_child, 0);
  }

  element->add_child(imported_child);

  if (!will_merge && (imported_child->_private != NULL)) {
      static_cast<XmlNode*>(imported_child->_private)->ref_wrapped_ancestor();
  }

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
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = element->import_node(new_sibling->xml_obj);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }

  bool will_merge = element->prev_sibling_will_merge(imported_sibling);
  if ((new_sibling->xml_obj == imported_sibling) && will_merge) {
      imported_sibling = xmlCopyNode(imported_sibling, 0); // merged sibling is freed, so copy it
  }
  element->add_prev_sibling(imported_sibling);

  if (!will_merge && (imported_sibling->_private != NULL)) {
      static_cast<XmlNode*>(imported_sibling->_private)->ref_wrapped_ancestor();
  }

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlElement::AddNextSibling) {
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  XmlNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = element->import_node(new_sibling->xml_obj);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }

  bool will_merge = element->next_sibling_will_merge(imported_sibling);
  if ((new_sibling->xml_obj == imported_sibling) && will_merge) {
      imported_sibling = xmlCopyNode(imported_sibling, 0);
  }
  element->add_next_sibling(imported_sibling);

  if (!will_merge && (imported_sibling->_private != NULL)) {
      static_cast<XmlNode*>(imported_sibling->_private)->ref_wrapped_ancestor();
  }

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlElement::Replace) {
  XmlElement* element = Nan::ObjectWrap::Unwrap<XmlElement>(info.Holder());
  assert(element);

  if (info[0]->IsString()) {
    element->replace_text(*v8::String::Utf8Value(info[0]));
  } else {
    XmlElement* new_sibling = Nan::ObjectWrap::Unwrap<XmlElement>(info[0]->ToObject());
    assert(new_sibling);

    xmlNode *imported_sibling = element->import_node(new_sibling->xml_obj);
    if (imported_sibling == NULL) {
        return Nan::ThrowError("Could not replace. Failed to copy node to new Document.");
    }
    element->replace_element(imported_sibling);
  }

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

void
XmlElement::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Local<v8::Value>
XmlElement::get_content() {
  Nan::EscapableHandleScope scope;
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Local<v8::String> ret_content =
      Nan::New<v8::String>((const char *)content).ToLocalChecked();
    xmlFree(content);
    return scope.Escape(ret_content);
  }

  return scope.Escape(Nan::New<v8::String>("").ToLocalChecked());
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
    : XmlNode(node)
{
}

void
XmlElement::replace_element(xmlNode* element) {
  xmlReplaceNode(xml_obj, element);
  if (element->_private != NULL) {
      XmlNode* node = static_cast<XmlNode*>(element->_private);
      node->ref_wrapped_ancestor();
  }
}

void
XmlElement::replace_text(const char* content) {
  xmlNodePtr txt = xmlNewDocText(xml_obj->doc, (const xmlChar*)content);
  xmlReplaceNode(xml_obj, txt);
}

bool
XmlElement::child_will_merge(xmlNode *child) {
  return ((child->type == XML_TEXT_NODE)         &&
          (xml_obj->last != NULL)                &&
          (xml_obj->last->type == XML_TEXT_NODE) &&
          (xml_obj->last->name == child->name)   &&
          (xml_obj->last != child));
}

bool
XmlElement::next_sibling_will_merge(xmlNode *child) {
  return ((child->type == XML_TEXT_NODE) &&
          ((xml_obj->type == XML_TEXT_NODE) ||
           ((xml_obj->next != NULL) &&
            (xml_obj->next->type == XML_TEXT_NODE) &&
            (xml_obj->name == xml_obj->next->name)))); // libxml2 bug?
}

bool
XmlElement::prev_sibling_will_merge(xmlNode *child) {
  return ((child->type == XML_TEXT_NODE) &&
          ((xml_obj->type == XML_TEXT_NODE) ||
           ((xml_obj->prev != NULL) &&
            (xml_obj->prev->type == XML_TEXT_NODE) &&
            (xml_obj->name == xml_obj->prev->name))));
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

    Nan::SetPrototypeMethod(tmpl,
            "replace",
            XmlElement::Replace);

    Nan::Set(target, Nan::New<v8::String>("Element").ToLocalChecked(),
            tmpl->GetFunction());

}

}  // namespace libxmljs
