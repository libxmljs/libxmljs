
#include "libxmljs.h"
#include "xml_fraternal_node.h"
#include "xml_element.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlFraternalNode::constructor_template;

NAN_METHOD(XmlFraternalNode::NextElement) {
  Nan::HandleScope scope;
  XmlFraternalNode *node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_next_element());
}

NAN_METHOD(XmlFraternalNode::PrevElement) {
  Nan::HandleScope scope;
  XmlFraternalNode *node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_prev_element());
}

NAN_METHOD(XmlFraternalNode::Text) {
  Nan::HandleScope scope;
  XmlFraternalNode *node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  if (info.Length() == 0) {
    return info.GetReturnValue().Set(node->get_content());
  } else {
    node->set_content(*v8::String::Utf8Value(info[0]));
  }

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlFraternalNode::Replace) {
  XmlFraternalNode* node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  if (info[0]->IsString()) {
    node->replace_text(*v8::String::Utf8Value(info[0]));
  } else {
    XmlFraternalNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info[0]->ToObject());
    assert(new_sibling);

    xmlNode *imported_sibling = node->import_node(new_sibling);
    if (imported_sibling == NULL) {
        return Nan::ThrowError("Could not replace. Failed to copy node to new Document.");
    }
    node->replace_node(imported_sibling);
  }

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlFraternalNode::AddPrevSibling) {
  XmlFraternalNode* node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  XmlFraternalNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = node->import_node(new_sibling);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }
  else if ((new_sibling->xml_obj == imported_sibling) && node->prev_sibling_will_merge(imported_sibling)) {
      imported_sibling = xmlCopyNode(imported_sibling, 0); // merged sibling is freed, so copy it
  }
  node->add_prev_sibling(imported_sibling);

  return info.GetReturnValue().Set(info[0]);
}

NAN_METHOD(XmlFraternalNode::AddNextSibling) {
  XmlFraternalNode* node = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info.Holder());
  assert(node);

  XmlFraternalNode* new_sibling = Nan::ObjectWrap::Unwrap<XmlFraternalNode>(info[0]->ToObject());
  assert(new_sibling);

  xmlNode *imported_sibling = node->import_node(new_sibling);
  if (imported_sibling == NULL) {
      return Nan::ThrowError("Could not add sibling. Failed to copy node to new Document.");
  }
  else if ((new_sibling->xml_obj == imported_sibling) && node->next_sibling_will_merge(imported_sibling)) {
      imported_sibling = xmlCopyNode(imported_sibling, 0);
  }
  node->add_next_sibling(imported_sibling);

  return info.GetReturnValue().Set(info[0]);
}

void
XmlFraternalNode::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Local<v8::Value>
XmlFraternalNode::get_content() {
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
XmlFraternalNode::get_next_element() {
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
XmlFraternalNode::get_prev_element() {
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

void
XmlFraternalNode::add_prev_sibling(xmlNode* node) {
  xmlAddPrevSibling(xml_obj, node);
  // if both are text, xml_obj is appended and node is FREED!
  // if adjacent sibling is text, should merge, but name bug if elem is non-named non-text

}

void
XmlFraternalNode::add_next_sibling(xmlNode* node) {
  xmlAddNextSibling(xml_obj, node);
}

void
XmlFraternalNode::replace_node(xmlNode* node) {
  xmlReplaceNode(xml_obj, node);
}

void
XmlFraternalNode::replace_text(const char* content) {
  xmlNodePtr txt = xmlNewDocText(xml_obj->doc, (const xmlChar*)content);
  xmlReplaceNode(xml_obj, txt);
}

bool
XmlFraternalNode::next_sibling_will_merge(xmlNode *child) {
  return ((child->type == XML_TEXT_NODE) &&
          ((xml_obj->type == XML_TEXT_NODE) ||
           ((xml_obj->next != NULL) &&
            (xml_obj->next->type == XML_TEXT_NODE) &&
            (xml_obj->name == xml_obj->next->name)))); // libxml2 bug?
}

bool
XmlFraternalNode::prev_sibling_will_merge(xmlNode *child) {
  return ((child->type == XML_TEXT_NODE) &&
          ((xml_obj->type == XML_TEXT_NODE) ||
           ((xml_obj->prev != NULL) &&
            (xml_obj->prev->type == XML_TEXT_NODE) &&
            (xml_obj->name == xml_obj->prev->name))));
}

XmlFraternalNode::XmlFraternalNode(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlFraternalNode::Initialize()
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>();
    constructor_template.Reset(tmpl);
    tmpl->Inherit(Nan::New(XmlNode::constructor_template));

    Nan::SetPrototypeMethod(tmpl,
            "nextElement",
            XmlFraternalNode::NextElement);

    Nan::SetPrototypeMethod(tmpl,
            "prevElement",
            XmlFraternalNode::PrevElement);

    Nan::SetPrototypeMethod(tmpl,
            "text",
            XmlFraternalNode::Text);

    Nan::SetPrototypeMethod(tmpl,
            "replace",
            XmlFraternalNode::Replace);

    Nan::SetPrototypeMethod(tmpl,
            "addPrevSibling",
            XmlFraternalNode::AddPrevSibling);

    Nan::SetPrototypeMethod(tmpl,
            "addNextSibling",
            XmlFraternalNode::AddNextSibling);

}

}  // namespace libxmljs

