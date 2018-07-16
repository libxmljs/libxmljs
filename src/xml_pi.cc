#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_pi.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlProcessingInstruction::constructor_template;

// doc, content
NAN_METHOD(XmlProcessingInstruction::New) {
  Nan::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (info.Length() == 0) {
      return info.GetReturnValue().Set(info.Holder());
  }

  XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());
  assert(document);

  v8::String::Utf8Value name(info[1]);

  v8::Local<v8::Value> contentOpt;
  if (info[2]->IsString()) {
      contentOpt = info[2];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlNode* pi = xmlNewDocPI(document->xml_obj, (const xmlChar *) *name, (xmlChar *) content);

  XmlProcessingInstruction* processing_instruction = new XmlProcessingInstruction(pi);
  pi->_private = processing_instruction;
  processing_instruction->Wrap(info.Holder());

  // this prevents the document from going away
  info.Holder()->Set(Nan::New<v8::String>("document").ToLocalChecked(), info[0]);

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlProcessingInstruction::Name) {
  Nan::HandleScope scope;
  XmlProcessingInstruction *processing_instruction = Nan::ObjectWrap::Unwrap<XmlProcessingInstruction>(info.Holder());
  assert(processing_instruction);

  if (info.Length() == 0)
      return info.GetReturnValue().Set(processing_instruction->get_name());

  v8::String::Utf8Value name(info[0]->ToString());
  processing_instruction->set_name(*name);
  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlProcessingInstruction::Text) {
  Nan::HandleScope scope;
  XmlProcessingInstruction *processing_instruction = Nan::ObjectWrap::Unwrap<XmlProcessingInstruction>(info.Holder());
  assert(processing_instruction);

  if (info.Length() == 0) {
    return info.GetReturnValue().Set(processing_instruction->get_content());
  } else {
    processing_instruction->set_content(*v8::String::Utf8Value(info[0]));
  }

  return info.GetReturnValue().Set(info.Holder());
}

void
XmlProcessingInstruction::set_name(const char* name) {
  xmlNodeSetName(xml_obj, (const xmlChar*)name);
}

v8::Local<v8::Value>
XmlProcessingInstruction::get_name() {
    Nan::EscapableHandleScope scope;
    if(xml_obj->name) return scope.Escape(Nan::New<v8::String>((const char*)xml_obj->name).ToLocalChecked());
    else return scope.Escape(Nan::Undefined());
}

void
XmlProcessingInstruction::set_content(const char* content) {
  xmlNodeSetContent(xml_obj, (xmlChar*) content);
}

v8::Local<v8::Value>
XmlProcessingInstruction::get_content() {
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

v8::Local<v8::Object>
XmlProcessingInstruction::New(xmlNode* node)
{
    Nan::EscapableHandleScope scope;
    if (node->_private) {
        return scope.Escape(static_cast<XmlNode*>(node->_private)->handle());
    }

    XmlProcessingInstruction* processing_instruction = new XmlProcessingInstruction(node);
    v8::Local<v8::Object> obj = Nan::NewInstance(Nan::New(constructor_template)->GetFunction()).ToLocalChecked();
    processing_instruction->Wrap(obj);
    return scope.Escape(obj);
}

XmlProcessingInstruction::XmlProcessingInstruction(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlProcessingInstruction::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> t = Nan::New<v8::FunctionTemplate>(static_cast<NAN_METHOD((*))>(New));
    t->Inherit(Nan::New(XmlNode::constructor_template));
    t->InstanceTemplate()->SetInternalFieldCount(1);
    constructor_template.Reset( t);

    Nan::SetPrototypeMethod(t,
            "name",
            XmlProcessingInstruction::Name);

    Nan::SetPrototypeMethod(t,
            "text",
            XmlProcessingInstruction::Text);

    Nan::Set(target, Nan::New<v8::String>("ProcessingInstruction").ToLocalChecked(),
            t->GetFunction());
}

}  // namespace libxmljs
