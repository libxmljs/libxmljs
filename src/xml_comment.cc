#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_comment.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlComment::constructor_template;

// doc, content
NAN_METHOD(XmlComment::New) {
  Nan::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (info.Length() == 0)
  {
      return info.GetReturnValue().Set(info.Holder());
  }

  XmlDocument* document = Nan::ObjectWrap::Unwrap<XmlDocument>(info[0]->ToObject());
  assert(document);

  v8::Local<v8::Value> contentOpt;
  if(info[1]->IsString()) {
      contentOpt = info[1];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlChar* encoded = content ? xmlEncodeSpecialChars(document->xml_obj, (const xmlChar*)content) : NULL;
  xmlNode* comm = xmlNewDocComment(document->xml_obj,
                                   encoded);
  if (encoded)
      xmlFree(encoded);

  XmlComment* comment = new XmlComment(comm);
  comm->_private = comment;
  comment->Wrap(info.Holder());

  // this prevents the document from going away
  info.Holder()->Set(Nan::New<v8::String>("document").ToLocalChecked(), info[0]);

  return info.GetReturnValue().Set(info.Holder());
}

v8::Local<v8::Object>
XmlComment::New(xmlNode* node)
{
    Nan::EscapableHandleScope scope;
    if (node->_private) {
        return scope.Escape(static_cast<XmlComment*>(node->_private)->handle());
    }

    XmlComment* comment = new XmlComment(node);
    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();
    comment->Wrap(obj);
    return scope.Escape(obj);
}

XmlComment::XmlComment(xmlNode* node)
    : XmlFraternalNode(node)
{
}

void
XmlComment::Initialize(v8::Handle<v8::Object> target)
{
    Nan::HandleScope scope;
    v8::Local<v8::FunctionTemplate> t = Nan::New<v8::FunctionTemplate>(static_cast<NAN_METHOD((*))>(New));
    t->Inherit(Nan::New(XmlFraternalNode::constructor_template));
    t->InstanceTemplate()->SetInternalFieldCount(1);
    constructor_template.Reset( t);

    Nan::Set(target, Nan::New<v8::String>("Comment").ToLocalChecked(),
            t->GetFunction());
}

}  // namespace libxmljs
