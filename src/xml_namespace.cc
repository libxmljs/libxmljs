// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include "xml_namespace.h"
#include "xml_node.h"
#include "xml_document.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNamespace::constructor_template;

NAN_METHOD(XmlNamespace::New) {
  NanScope();

  // created for an already existing namespace
  if (args.Length() == 0)
  {
      NanReturnValue(args.Holder());
  }

  // TODO(sprsquish): ensure this is an actual Node object
  if (!args[0]->IsObject())
    return NanThrowError("You must provide a node to attach this namespace to");

  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args[0].As<v8::Object>());

  v8::String::Utf8Value* prefix = 0;
  v8::String::Utf8Value* href = 0;

  if (args[1]->IsString())
  {
      prefix = new v8::String::Utf8Value(args[1]);
  }

  href = new v8::String::Utf8Value(args[2]);

  xmlNs* ns = xmlNewNs(node->xml_obj,
          (const xmlChar*)(href->operator*()),
          prefix ? (const xmlChar*)(prefix->operator*()) : NULL);

  delete prefix;
  delete href;

  XmlNamespace* namesp = new XmlNamespace(ns);
  namesp->Wrap(args.Holder());

  NanReturnValue(args.Holder());
}

v8::Local<v8::Object>
XmlNamespace::New(xmlNs* node)
{
    if (node->_private) {
        return NanObjectWrapHandle(static_cast<XmlNamespace*>(node->_private));
    }

    XmlNamespace* ns = new XmlNamespace(node);
    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();
    ns->Wrap(obj);
    return obj;
}

XmlNamespace::XmlNamespace(xmlNs* node) : xml_obj(node)
{
    xml_obj->_private = this;

    if (xml_obj->context)
    {
        // a namespace must be created on a given node
        XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->context->_private);
        doc->ref();
    }
}

XmlNamespace::~XmlNamespace()
{
    xml_obj->_private = NULL;

    if (xml_obj->context)
    {
        // release the hold and allow the document to be freed
        XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->context->_private);
        doc->unref();
    }

    // We do not free the xmlNode here. It could still be part of a document
    // It will be freed when the doc is freed
    // xmlFree(xml_obj);
}

NAN_METHOD(XmlNamespace::Href) {
  NanScope();
  XmlNamespace *ns = ObjectWrap::Unwrap<XmlNamespace>(args.Holder());
  assert(ns);
  NanReturnValue(ns->get_href());
}

NAN_METHOD(XmlNamespace::Prefix) {
  NanScope();
  XmlNamespace *ns = ObjectWrap::Unwrap<XmlNamespace>(args.Holder());
  assert(ns);
  NanReturnValue(ns->get_prefix());
}

v8::Local<v8::Value>
XmlNamespace::get_href() {
  NanEscapableScope();
  if (xml_obj->href)
    return NanEscapeScope(NanNew<v8::String>((const char*)xml_obj->href,
                           xmlStrlen(xml_obj->href)));

  return NanEscapeScope(NanNull());
}

v8::Local<v8::Value>
XmlNamespace::get_prefix() {
  NanEscapableScope();
  if (xml_obj->prefix)
    return NanEscapeScope(NanNew<v8::String>((const char*)xml_obj->prefix,
                           xmlStrlen(xml_obj->prefix)));

  return NanEscapeScope(NanNull());
}

void
XmlNamespace::Initialize(v8::Handle<v8::Object> target) {
  NanScope();
  v8::Local<v8::FunctionTemplate> tmpl =
    NanNew<v8::FunctionTemplate>(New);
  NanAssignPersistent(constructor_template, tmpl);
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "href",
                        XmlNamespace::Href);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "prefix",
                        XmlNamespace::Prefix);

  target->Set(NanNew<v8::String>("Namespace"),
              tmpl->GetFunction());
}
}  // namespace libxmljs
