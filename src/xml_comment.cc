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
v8::Handle<v8::Value>
XmlComment::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (args.Length() == 0)
  {
      return scope.Close(args.Holder());
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
  args.Holder()->Set(v8::String::NewSymbol("document"), args[0]);

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlComment::Text(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlComment *comment = ObjectWrap::Unwrap<XmlComment>(args.Holder());
  assert(comment);

  if (args.Length() == 0) {
    return scope.Close(comment->get_content());
  } else {
    comment->set_content(*v8::String::Utf8Value(args[0]));
  }

  return scope.Close(args.Holder());
}

void
XmlComment::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Handle<v8::Value>
XmlComment::get_content() {
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Handle<v8::String> ret_content =
      v8::String::New((const char *)content);
    xmlFree(content);
    return ret_content;
  }

  return v8::String::Empty();
}


v8::Handle<v8::Object>
XmlComment::New(xmlNode* node)
{
    if (node->_private) {
        return static_cast<XmlNode*>(node->_private)->handle_;
    }

    XmlComment* comment = new XmlComment(node);
    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();
    comment->Wrap(obj);
    return obj;
}

XmlComment::XmlComment(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlComment::Initialize(v8::Handle<v8::Object> target)
{
    v8::HandleScope scope;
    v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
    constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
    constructor_template->Inherit(XmlNode::constructor_template);
    constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "text",
            XmlComment::Text);

    target->Set(v8::String::NewSymbol("Comment"),
            constructor_template->GetFunction());
}

}  // namespace libxmljs
