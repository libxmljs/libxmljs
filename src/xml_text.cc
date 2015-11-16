// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_text.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlText::constructor_template;

// doc, name, content
NAN_METHOD(XmlText::New) {
  Nan::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (info.Length() == 0) {
      return info.GetReturnValue().Set(info.Holder());
  }

  XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());
  assert(document);

  v8::Local<v8::Value> contentOpt;
  if (info[1]->IsString()) {
      contentOpt = info[1];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlChar* encodedContent = content ? xmlEncodeSpecialChars(document->xml_obj, (const xmlChar*) content) : NULL;

  xmlNode* textNode = xmlNewDocText(document->xml_obj, encodedContent);
  if (encodedContent) {
      xmlFree(encodedContent);
  }

  XmlText* element = new XmlText(textNode);
  textNode->_private = element;
  element->Wrap(info.Holder());

  // this prevents the document from going away
  info.Holder()->Set(Nan::New<v8::String>("document").ToLocalChecked(), info[0]);

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlText::NextElement) {
  Nan::HandleScope scope;
  XmlText *element = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_next_element());
}

NAN_METHOD(XmlText::PrevElement) {
  Nan::HandleScope scope;
  XmlText *element = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(element);

  return info.GetReturnValue().Set(element->get_prev_element());
}

NAN_METHOD(XmlText::Text) {
  Nan::HandleScope scope;
  XmlText *element = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(element);

  if (info.Length() == 0) {
    return info.GetReturnValue().Set(element->get_content());
  } else {
    element->set_content(*v8::String::Utf8Value(info[0]));
  }

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlText::AddPrevSibling) {
  XmlText* text = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(text);

  XmlNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = text->import_node(new_sibling->xml_obj);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }
  else if ((new_sibling->xml_obj == imported_sibling) && text->prev_sibling_will_merge(imported_sibling)) {
      imported_sibling = xmlCopyNode(imported_sibling, 0);
  }
  text->add_prev_sibling(imported_sibling);

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlText::AddNextSibling) {
  XmlText* text = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(text);

  XmlNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = text->import_node(new_sibling->xml_obj);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }
  else if ((new_sibling->xml_obj == imported_sibling) && text->next_sibling_will_merge(imported_sibling)) {
      imported_sibling = xmlCopyNode(imported_sibling, 0);
  }
  text->add_next_sibling(imported_sibling);

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlText::Replace) {
  XmlText* element = Nan::ObjectWrap::Unwrap<XmlText>(info.Holder());
  assert(element);

  if (info[0]->IsString()) {
    element->replace_text(*v8::String::Utf8Value(info[0]));
  } else {
    XmlText* new_sibling = Nan::ObjectWrap::Unwrap<XmlText>(info[0]->ToObject());
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
XmlText::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Local<v8::Value>
XmlText::get_content() {
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
XmlText::get_next_element() {
  Nan::EscapableHandleScope scope;

  xmlNode* sibling = xml_obj->next;
  if (!sibling)
    return scope.Escape(Nan::Null());

  while (sibling && sibling->type != XML_ELEMENT_NODE)
    sibling = sibling->next;

  if (sibling) {
      return scope.Escape(XmlText::New(sibling));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlText::get_prev_element() {
  Nan::EscapableHandleScope scope;

  xmlNode* sibling = xml_obj->prev;
  if (!sibling)
    return scope.Escape(Nan::Null());

  while (sibling && sibling->type != XML_ELEMENT_NODE) {
    sibling = sibling->prev;
  }

  if (sibling) {
      return scope.Escape(XmlText::New(sibling));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Object>
XmlText::New(xmlNode* node)
{
    Nan::EscapableHandleScope scope;
    if (node->_private) {
        return scope.Escape(static_cast<XmlNode*>(node->_private)->handle());
    }

    XmlText* element = new XmlText(node);
    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();
    element->Wrap(obj);
    return scope.Escape(obj);
}

XmlText::XmlText(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlText::add_prev_sibling(xmlNode* element) {
  xmlAddPrevSibling(xml_obj, element);
}

void
XmlText::add_next_sibling(xmlNode* element) {
  xmlAddNextSibling(xml_obj, element);
}

void
XmlText::replace_element(xmlNode* element) {
  xmlReplaceNode(xml_obj, element);
}

void
XmlText::replace_text(const char* content) {
  xmlNodePtr txt = xmlNewDocText(xml_obj->doc, (const xmlChar*)content);
  xmlReplaceNode(xml_obj, txt);
}

bool
XmlText::next_sibling_will_merge(xmlNode *child) {
  return (child->type == XML_TEXT_NODE);
}

bool
XmlText::prev_sibling_will_merge(xmlNode *child) {
  return (child->type == XML_TEXT_NODE);
}

void
XmlText::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>(New);

    constructor_template.Reset(tmpl);

    tmpl->Inherit(Nan::New(XmlNode::constructor_template));
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tmpl,
            "nextElement",
            XmlText::NextElement);

    Nan::SetPrototypeMethod(tmpl,
            "prevElement",
            XmlText::PrevElement);

    Nan::SetPrototypeMethod(tmpl,
            "text",
            XmlText::Text);

    Nan::SetPrototypeMethod(tmpl,
            "replace",
            XmlText::Replace);

    Nan::Set(target, Nan::New<v8::String>("Text").ToLocalChecked(),
            tmpl->GetFunction());

}

}  // namespace libxmljs
