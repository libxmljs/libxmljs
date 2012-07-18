// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include "xml_namespace.h"
#include "xml_node.h"
#include "xml_document.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNamespace::constructor_template;

v8::Handle<v8::Value>
XmlNamespace::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  // created for an already existing namespace
  if (args.Length() == 0)
  {
      return scope.Close(args.Holder());
  }

  // TODO(sprsquish): ensure this is an actual Node object
  if (!args[0]->IsObject())
    return v8::ThrowException(v8::Exception::Error(
      v8::String::New("You must provide a node to attach this namespace to")));

  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args[0]->ToObject());

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

  return scope.Close(args.Holder());
}

v8::Handle<v8::Object>
XmlNamespace::New(xmlNs* node)
{
    if (node->_private) {
        return static_cast<XmlNamespace*>(node->_private)->handle_;
    }

    XmlNamespace* ns = new XmlNamespace(node);
    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();
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

v8::Handle<v8::Value>
XmlNamespace::Href(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNamespace *ns = ObjectWrap::Unwrap<XmlNamespace>(args.Holder());
  assert(ns);
  return scope.Close(ns->get_href());
}

v8::Handle<v8::Value>
XmlNamespace::Prefix(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNamespace *ns = ObjectWrap::Unwrap<XmlNamespace>(args.Holder());
  assert(ns);
  return scope.Close(ns->get_prefix());
}

v8::Handle<v8::Value>
XmlNamespace::get_href() {
  if (xml_obj->href)
    return v8::String::New((const char*)xml_obj->href,
                           xmlStrlen(xml_obj->href));

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNamespace::get_prefix() {
  if (xml_obj->prefix)
    return v8::String::New((const char*)xml_obj->prefix,
                           xmlStrlen(xml_obj->prefix));

  return v8::Null();
}

void
XmlNamespace::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  v8::Local<v8::FunctionTemplate> t =
    v8::FunctionTemplate::New(XmlNamespace::New);
  constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "href",
                        XmlNamespace::Href);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "prefix",
                        XmlNamespace::Prefix);

  target->Set(v8::String::NewSymbol("Namespace"),
              constructor_template->GetFunction());
}
}  // namespace libxmljs
