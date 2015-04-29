#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_comment.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlComment::constructor_template;

// doc, content
NAN_METHOD(XmlComment::New) {
  NanScope();

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (args.Length() == 0)
  {
      NanReturnValue(args.Holder());
  }

  XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());
  assert(document);

  v8::Handle<v8::Value> contentOpt;
  if(args[1]->IsString()) {
      contentOpt = args[1];
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
  comment->Wrap(args.Holder());

  // this prevents the document from going away
  args.Holder()->Set(NanNew<v8::String>("document"), args[0]);

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlComment::Text) {
  NanScope();
  XmlComment *comment = ObjectWrap::Unwrap<XmlComment>(args.Holder());
  assert(comment);

  if (args.Length() == 0) {
    NanReturnValue(comment->get_content());
  } else {
    comment->set_content(*v8::String::Utf8Value(args[0]));
  }

  NanReturnValue(args.Holder());
}

void
XmlComment::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Handle<v8::Value>
XmlComment::get_content() {
  NanEscapableScope();
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Local<v8::String> ret_content =
      NanNew<v8::String>((const char *)content);
    xmlFree(content);
    return NanEscapeScope(ret_content);
  }

  return NanEscapeScope(NanNew<v8::String>(""));
}


v8::Handle<v8::Object>
XmlComment::New(xmlNode* node)
{
    NanEscapableScope();
    if (node->_private) {
        return NanEscapeScope(NanObjectWrapHandle(static_cast<XmlNode*>(node->_private)));
    }

    XmlComment* comment = new XmlComment(node);
    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();
    comment->Wrap(obj);
    return NanEscapeScope(obj);
}

XmlComment::XmlComment(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlComment::Initialize(v8::Handle<v8::Object> target)
{
    NanScope();
    v8::Local<v8::FunctionTemplate> t = NanNew<v8::FunctionTemplate>(static_cast<NAN_METHOD((*))>(New));
    t->Inherit(NanNew(XmlNode::constructor_template));
    t->InstanceTemplate()->SetInternalFieldCount(1);
    NanAssignPersistent(constructor_template, t);

    NODE_SET_PROTOTYPE_METHOD(t,
            "text",
            XmlComment::Text);

    target->Set(NanNew<v8::String>("Comment"),
            t->GetFunction());
}

}  // namespace libxmljs
