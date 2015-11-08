// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include "xml_namespace.h"
#include "xml_node.h"
#include "xml_document.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlNamespace::constructor_template;

NAN_METHOD(XmlNamespace::New) {
  Nan::HandleScope scope;

  // created for an already existing namespace
  if (info.Length() == 0)
  {
      return info.GetReturnValue().Set(info.Holder());
  }

  // TODO(sprsquish): ensure this is an actual Node object
  if (!info[0]->IsObject())
    return Nan::ThrowError("You must provide a node to attach this namespace to");

  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info[0]->ToObject());

  v8::String::Utf8Value* prefix = 0;
  v8::String::Utf8Value* href = 0;

  if (info[1]->IsString())
  {
      prefix = new v8::String::Utf8Value(info[1]);
  }

  href = new v8::String::Utf8Value(info[2]);

  xmlNs* ns = xmlNewNs(node->xml_obj,
          (const xmlChar*)(href->operator*()),
          prefix ? (const xmlChar*)(prefix->operator*()) : NULL);

  delete prefix;
  delete href;

  XmlNamespace* namesp = new XmlNamespace(ns);
  namesp->Wrap(info.Holder());

  return info.GetReturnValue().Set(info.Holder());
}

v8::Local<v8::Object>
XmlNamespace::New(xmlNs* node)
{
    Nan::EscapableHandleScope scope;
    if (node->_private) {
        return scope.Escape(static_cast<XmlNamespace*>(node->_private)->handle());
    }

    XmlNamespace* ns = new XmlNamespace(node);
    v8::Local<v8::Object> obj = Nan::New(constructor_template)->GetFunction()->NewInstance();
    ns->Wrap(obj);
    return scope.Escape(obj);
}

XmlNamespace::XmlNamespace(xmlNs* node) : xml_obj(node)
{
    xml_obj->_private = this;

    /*
     * If a context is present and wrapped, increment its refcount to ensure
     * that it is considered accessible from javascript for as long as the
     * namespace is accessible.
     */
    if ((xml_obj->context) && (xml_obj->context->_private != NULL))
    {
        this->context = xml_obj->context;
        // a namespace must be created on a given node
        XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->context->_private);
        doc->ref();
    }
    else {
        this->context = NULL;
    }
}

XmlNamespace::~XmlNamespace()
{
    /*
     * `xml_obj` may have been nulled by `xmlDeregisterNodeCallback` when
     * the `xmlNs` was freed along with an attached node or document.
     */
    if (xml_obj != NULL) {
        xml_obj->_private = NULL;
    }

    /*
     * The context pointer is only set if this wrapper has incremented the
     * refcount of the context wrapper.
     */
    if (this->context != NULL)
    {
        if (this->context->_private != NULL) {
            // release the hold and allow the document to be freed
            XmlDocument* doc = static_cast<XmlDocument*>(this->context->_private);
            doc->unref();
        }
        this->context = NULL;
    }

    // We do not free the xmlNode here. It could still be part of a document
    // It will be freed when the doc is freed
}

NAN_METHOD(XmlNamespace::Href) {
  Nan::HandleScope scope;
  XmlNamespace *ns = Nan::ObjectWrap::Unwrap<XmlNamespace>(info.Holder());
  assert(ns);
  return info.GetReturnValue().Set(ns->get_href());
}

NAN_METHOD(XmlNamespace::Prefix) {
  Nan::HandleScope scope;
  XmlNamespace *ns = Nan::ObjectWrap::Unwrap<XmlNamespace>(info.Holder());
  assert(ns);
  return info.GetReturnValue().Set(ns->get_prefix());
}

v8::Local<v8::Value>
XmlNamespace::get_href() {
  Nan::EscapableHandleScope scope;
  if (xml_obj->href)
    return scope.Escape(Nan::New<v8::String>((const char*)xml_obj->href,
                           xmlStrlen(xml_obj->href)).ToLocalChecked());

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlNamespace::get_prefix() {
  Nan::EscapableHandleScope scope;
  if (xml_obj->prefix)
    return scope.Escape(Nan::New<v8::String>((const char*)xml_obj->prefix,
                           xmlStrlen(xml_obj->prefix)).ToLocalChecked());

  return scope.Escape(Nan::Null());
}

void
XmlNamespace::Initialize(v8::Handle<v8::Object> target) {
  Nan::HandleScope scope;
  v8::Local<v8::FunctionTemplate> tmpl =
    Nan::New<v8::FunctionTemplate>(New);
  constructor_template.Reset( tmpl);
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tmpl,
                        "href",
                        XmlNamespace::Href);

  Nan::SetPrototypeMethod(tmpl,
                        "prefix",
                        XmlNamespace::Prefix);

  Nan::Set(target, Nan::New<v8::String>("Namespace").ToLocalChecked(),
              tmpl->GetFunction());
}
}  // namespace libxmljs
