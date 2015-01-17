// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <libxml/xmlsave.h>

#include "xml_node.h"
#include "xml_document.h"
#include "xml_namespace.h"
#include "xml_element.h"
#include "xml_comment.h"
#include "xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNode::constructor_template;

NAN_METHOD(XmlNode::Doc) {
  NanScope();
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_doc());
}

NAN_METHOD(XmlNode::Namespace) {
  NanScope();
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  // #namespace() Get the node's namespace
  if (args.Length() == 0) {
      NanReturnValue(node->get_namespace());
  }

  if (args[0]->IsNull())
      NanReturnValue(node->remove_namespace());

  XmlNamespace* ns = NULL;

  // #namespace(ns) libxml.Namespace object was provided
  // TODO(sprsquish): check that it was actually given a namespace obj
  if (args[0]->IsObject())
    ns = ObjectWrap::Unwrap<XmlNamespace>(args[0]->ToObject());

  // #namespace(href) or #namespace(prefix, href)
  // if the namespace has already been defined on the node, just set it
  if (args[0]->IsString()) {
    v8::String::Utf8Value ns_to_find(args[0]->ToString());
    xmlNs* found_ns = node->find_namespace(*ns_to_find);
    if (found_ns) {
        // maybe build
        v8::Local<v8::Object> existing = XmlNamespace::New(found_ns);
        ns = ObjectWrap::Unwrap<XmlNamespace>(existing);
    }
  }

  // Namespace does not seem to exist, so create it.
  if (!ns) {
      const unsigned int argc = 3;
      v8::Local<v8::Value> argv[argc];
      argv[0] = args.Holder();

      if (args.Length() == 1) {
          argv[1] = NanNull();
          argv[2] = args[0];
      } else {
          argv[1] = args[0];
          argv[2] = args[1];
      }

      v8::Local<v8::Function> define_namespace =
          NanNew(XmlNamespace::constructor_template)->GetFunction();

      // will create a new namespace attached to this node
      // since we keep the document around, the namespace, like the node, won't be
      // garbage collected
      v8::Local<v8::Value> new_ns = define_namespace->NewInstance(argc, argv);
      ns = ObjectWrap::Unwrap<XmlNamespace>(new_ns->ToObject());
  }

  node->set_namespace(ns->xml_obj);
  NanReturnValue(node->get_namespace());
}

NAN_METHOD(XmlNode::Namespaces) {
  NanScope();
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_all_namespaces());
}

NAN_METHOD(XmlNode::Parent) {
  NanScope();
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_parent());
}

NAN_METHOD(XmlNode::PrevSibling) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_prev_sibling());
}

NAN_METHOD(XmlNode::NextSibling) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_next_sibling());
}

NAN_METHOD(XmlNode::LineNumber) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_line_number());
}

NAN_METHOD(XmlNode::Type) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->get_type());
}

NAN_METHOD(XmlNode::ToString) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  NanReturnValue(node->to_string());
}

NAN_METHOD(XmlNode::Remove) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  node->remove();

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlNode::Clone) {
  NanScope();
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  bool recurse = true;

  if (args.Length() == 1 && args[0]->IsBoolean())
      recurse = args[0]->ToBoolean()->BooleanValue();

  NanReturnValue(node->clone(recurse));
}

v8::Local<v8::Value>
XmlNode::New(xmlNode* node)
{
  switch (node->type) {
  case XML_ATTRIBUTE_NODE:
    return XmlAttribute::New(reinterpret_cast<xmlAttr *>(node));

  default:
    // if we don't know how to convert to specific libxmljs wrapper,
    // wrap in an XmlElement.  There should probably be specific
    // wrapper types for text nodes etc., but this is what existing
    // code expects.
    return XmlElement::New(node);
  }
}

XmlNode::XmlNode(xmlNode* node) : xml_obj(node) {
    xml_obj->_private = this;

    // this will prevent the document from being cleaned up
    // we keep the document if any of the nodes attached to it are still alive
    XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->doc->_private);
    doc->ref();
}

XmlNode::~XmlNode() {
    xml_obj->_private = NULL;

    // release the hold and allow the document to be freed
    XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->doc->_private);
    doc->unref();

    // We do not free the xmlNode here if it is linked to a document
    // It will be freed when the doc is freed
    if (xml_obj->parent == NULL)
      xmlFreeNode(xml_obj);
}

v8::Local<v8::Value>
XmlNode::get_doc() {
    return XmlDocument::New(xml_obj->doc);
}

v8::Local<v8::Value>
XmlNode::remove_namespace() {
  xml_obj->ns = NULL;
  return NanNull();
}

v8::Local<v8::Value>
XmlNode::get_namespace() {
  NanEscapableScope();
  if (!xml_obj->ns)
  {
      return NanEscapeScope(NanNull());
  }

  return NanEscapeScope(XmlNamespace::New(xml_obj->ns));
}

void
XmlNode::set_namespace(xmlNs* ns) {
  xmlSetNs(xml_obj, ns);
  assert(xml_obj->ns);
}

xmlNs*
XmlNode::find_namespace(const char* search_str) {
  xmlNs* ns = NULL;

  // Find by prefix first
  ns = xmlSearchNs(xml_obj->doc, xml_obj, (const xmlChar*)search_str);

  // Or find by href
  if (!ns)
    ns = xmlSearchNsByHref(xml_obj->doc, xml_obj, (const xmlChar*)search_str);

  return ns;
}

v8::Local<v8::Value>
XmlNode::get_all_namespaces() {
  NanEscapableScope();

  // Iterate through namespaces
  v8::Local<v8::Array> namespaces = NanNew<v8::Array>();
  xmlNs** nsList = xmlGetNsList(xml_obj->doc, xml_obj);
  if (nsList != NULL) {
    for (int i = 0; nsList[i] != NULL; i++) {
      v8::Local<v8::Number> index = NanNew<v8::Number>(i);
      v8::Local<v8::Object> ns = XmlNamespace::New(nsList[i]);
      namespaces->Set(index, ns);
    }
  }

  return NanEscapeScope(namespaces);
}

v8::Local<v8::Value>
XmlNode::get_parent() {
  NanEscapableScope();

  if (xml_obj->parent) {
      return NanEscapeScope(XmlElement::New(xml_obj->parent));
  }

  return NanEscapeScope(XmlDocument::New(xml_obj->doc));
}

v8::Local<v8::Value>
XmlNode::get_prev_sibling() {
  NanEscapableScope();
  if (xml_obj->prev) {
      return NanEscapeScope(XmlNode::New(xml_obj->prev));
  }

  return NanEscapeScope(NanNull());
}

v8::Local<v8::Value>
XmlNode::get_next_sibling() {
  NanEscapableScope();
  if (xml_obj->next) {
      return NanEscapeScope(XmlNode::New(xml_obj->next));
  }

  return NanEscapeScope(NanNull());
}

v8::Local<v8::Value>
XmlNode::get_line_number() {
  NanEscapableScope();
  return NanEscapeScope(NanNew<v8::Integer>(uint32_t(xmlGetLineNo(xml_obj))));
}

v8::Local<v8::Value>
XmlNode::clone(bool recurse) {
  NanEscapableScope();

  xmlNode* new_xml_obj = xmlDocCopyNode(xml_obj, xml_obj->doc, recurse);
  return NanEscapeScope(XmlNode::New(new_xml_obj));
}

v8::Local<v8::Value>
XmlNode::to_string() {
  NanEscapableScope();

  xmlBuffer* buf = xmlBufferCreate();
  const char* enc = "UTF-8";

  xmlSaveCtxt* savectx = xmlSaveToBuffer(buf, enc, 0);
  xmlSaveTree(savectx, xml_obj);
  xmlSaveFlush(savectx);

  const xmlChar* xmlstr = xmlBufferContent(buf);

  if(xmlstr) {
      v8::Local<v8::String> str = NanNew<v8::String>((char*)xmlstr, xmlBufferLength(buf));
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return NanEscapeScope(str);
  } else {
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return NanEscapeScope(NanNull());
  }
}

void
XmlNode::remove() {
  xmlUnlinkNode(xml_obj);
}

v8::Local<v8::Value>
XmlNode::get_type() {
  switch (xml_obj->type) {
  case  XML_ELEMENT_NODE:
    return NanNew<v8::String>("element");
  case XML_ATTRIBUTE_NODE:
    return NanNew<v8::String>("attribute");
  case XML_TEXT_NODE:
    return NanNew<v8::String>("text");
  case XML_CDATA_SECTION_NODE:
    return NanNew<v8::String>("cdata");
  case XML_ENTITY_REF_NODE:
    return NanNew<v8::String>("entity_ref");
  case XML_ENTITY_NODE:
    return NanNew<v8::String>("entity");
  case XML_PI_NODE:
    return NanNew<v8::String>("pi");
  case XML_COMMENT_NODE:
    return NanNew<v8::String>("comment");
  case XML_DOCUMENT_NODE:
    return NanNew<v8::String>("document");
  case XML_DOCUMENT_TYPE_NODE:
    return NanNew<v8::String>("document_type");
  case XML_DOCUMENT_FRAG_NODE:
    return NanNew<v8::String>("document_frag");
  case XML_NOTATION_NODE:
    return NanNew<v8::String>("notation");
  case XML_HTML_DOCUMENT_NODE:
    return NanNew<v8::String>("html_document");
  case XML_DTD_NODE:
    return NanNew<v8::String>("dtd");
  case XML_ELEMENT_DECL:
    return NanNew<v8::String>("element_decl");
  case XML_ATTRIBUTE_DECL:
    return NanNew<v8::String>("attribute_decl");
  case XML_ENTITY_DECL:
    return NanNew<v8::String>("entity_decl");
  case XML_NAMESPACE_DECL:
    return NanNew<v8::String>("namespace_decl");
  case XML_XINCLUDE_START:
    return NanNew<v8::String>("xinclude_start");
  case XML_XINCLUDE_END:
    return NanNew<v8::String>("xinclude_end");
  case XML_DOCB_DOCUMENT_NODE:
    return NanNew<v8::String>("docb_document");
  }

  return NanNull();
}

void
XmlNode::Initialize(v8::Handle<v8::Object> target) {
  NanScope();
  v8::Local<v8::FunctionTemplate> tmpl = NanNew<v8::FunctionTemplate>();
  NanAssignPersistent(constructor_template, tmpl);
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "doc",
                        XmlNode::Doc);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "parent",
                        XmlNode::Parent);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "namespace",
                        XmlNode::Namespace);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "namespaces",
                        XmlNode::Namespaces);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "prevSibling",
                        XmlNode::PrevSibling);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "nextSibling",
                        XmlNode::NextSibling);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "line",
                        XmlNode::LineNumber);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "type",
                        XmlNode::Type);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "remove",
                        XmlNode::Remove);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "clone",
                        XmlNode::Clone);

  NODE_SET_PROTOTYPE_METHOD(tmpl,
                        "toString",
                        XmlNode::ToString);

  XmlElement::Initialize(target);
  XmlComment::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
