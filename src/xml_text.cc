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
    : XmlNonAttributeNode(node)
{
}

void
XmlText::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tmpl =
      Nan::New<v8::FunctionTemplate>(New);

    constructor_template.Reset(tmpl);

    tmpl->Inherit(Nan::New(XmlNonAttributeNode::constructor_template));
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::Set(target, Nan::New<v8::String>("Text").ToLocalChecked(),
            tmpl->GetFunction());

}

}  // namespace libxmljs
