// Copyright 2009, Squish Tech, LLC.

#include "xml_node.h"
#include "xml_document.h"
#include "xml_namespace.h"
#include "xml_element.h"
#include "xml_attribute.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlNode::constructor_template;

v8::Handle<v8::Value>
XmlNode::Doc(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->get_doc());
}

v8::Handle<v8::Value>
XmlNode::Namespace(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  // #namespace() Get the node's namespace
  if (args.Length() == 0)
      return scope.Close(node->get_namespace());

  if (args[0]->IsNull())
      return scope.Close(node->remove_namespace());

  XmlNamespace *ns = NULL;

  // #namespace(ns) libxml.Namespace object was provided
  // TODO(sprsquish): check that it was actually given a namespace obj
  if (args[0]->IsObject())
    ns = LibXmlObj::Unwrap<XmlNamespace>(args[0]->ToObject());

  // #namespace(href) or #namespace(prefix, href)
  // if the namespace has already been defined on the node, just set it
  if (args[0]->IsString()) {
    v8::String::Utf8Value ns_to_find(args[0]->ToString());
    xmlNs* found_ns = node->find_namespace(*ns_to_find);
    if (found_ns) {
      ns = LibXmlObj::Unwrap<XmlNamespace>(
             LibXmlObj::GetMaybeBuild<XmlNamespace, xmlNs>(found_ns));
    }
  }

  // Namespace does not seem to exist, so create it.
  if (!ns) {
    int argc = 3;
    v8::Handle<v8::Value> argv[argc];
    argv[0] = args.This();

    if (args.Length() == 1) {
      argv[1] = v8::Null();
      argv[2] = args[0];
    } else {
      argv[1] = args[0];
      argv[2] = args[1];
    }

    v8::Handle<v8::Function> define_namespace =
      XmlNamespace::constructor_template->GetFunction();

    v8::Handle<v8::Value> new_ns = define_namespace->Call(args.This(), argc, argv);
    ns = LibXmlObj::Unwrap<XmlNamespace>(new_ns->ToObject());
  }

  node->set_namespace(ns->xml_obj);

  return scope.Close(node->get_namespace());
}

v8::Handle<v8::Value>
XmlNode::Parent(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->get_parent());
}

v8::Handle<v8::Value>
XmlNode::PrevSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->get_prev_sibling());
}

v8::Handle<v8::Value>
XmlNode::NextSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->get_next_sibling());
}

v8::Handle<v8::Value>
XmlNode::Type(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->get_type());
}

v8::Handle<v8::Value>
XmlNode::ToString(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  return scope.Close(node->to_string());
}

v8::Handle<v8::Value>
XmlNode::Remove(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);

  node->remove();

  return scope.Close(args.This());
}

v8::Handle<v8::Value>
XmlNode::Clone(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = LibXmlObj::Unwrap<XmlNode>(args.This());
  assert(node);
  
  bool recurse = true;
  
  if (args.Length() == 1 && args[0]->IsBoolean())
      recurse = args[0]->ToBoolean()->BooleanValue();

  return scope.Close(node->clone(recurse)); 
}

XmlNode::XmlNode(xmlNode* node) : xml_obj(node) {
    xml_obj->_private = this;
    if(xml_obj->doc) {
        doc = v8::Persistent<v8::Value>::New(LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(xml_obj->doc));
    }
}

XmlNode::~XmlNode() {
    xml_obj->_private = NULL;
    doc.Dispose();
    doc.Clear();

  // We do not free the xmlNode here. It could still be part of a document
  // It will be freed when the doc is freed
  // xmlFree(xml_obj);
}

v8::Handle<v8::Value>
XmlNode::get_doc() {
  v8::HandleScope scope;
  return scope.Close(LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(xml_obj->doc));
}

v8::Handle<v8::Value>
XmlNode::remove_namespace() {
  xml_obj->ns = NULL;
  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_namespace() {
  v8::HandleScope scope;
  if (!xml_obj->ns)
    return v8::Null();

  return scope.Close(LibXmlObj::GetMaybeBuild<XmlNamespace, xmlNs>(xml_obj->ns));
}

void
XmlNode::set_namespace(xmlNs* ns) {
  xmlSetNs(xml_obj, ns);
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

v8::Handle<v8::Value>
XmlNode::get_parent() {
  v8::HandleScope scope;
  if (xml_obj->parent) {
      return scope.Close(LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(xml_obj->parent));
  }

  return scope.Close(LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(xml_obj->doc));
}

v8::Handle<v8::Value>
XmlNode::get_prev_sibling() {
  v8::HandleScope scope;
  if (xml_obj->prev) {
      return scope.Close(LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(xml_obj->prev));
  }

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_next_sibling() {
  v8::HandleScope scope;
  if (xml_obj->next) {
      return scope.Close(LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(xml_obj->next));
  }

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::clone(bool recurse) {
  v8::HandleScope scope;
 
  return scope.Close(LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(xmlCopyNode(xml_obj, recurse))); 
}

v8::Handle<v8::Value>
XmlNode::to_string() {
  v8::HandleScope scope;

  xmlBuffer* buf = xmlBufferCreate();
  const char* enc = "UTF-8";

  xmlSaveCtxt* savectx = xmlSaveToBuffer(buf, enc, NULL);
  xmlSaveTree(savectx, xml_obj);
  xmlSaveFlush(savectx);

  const xmlChar* xmlstr = xmlBufferContent(buf);

  if(xmlstr) {
      v8::Handle<v8::String> str = v8::String::New((char*)xmlstr, xmlBufferLength(buf));
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return scope.Close(str);
  } else { 
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return v8::Null();
  }
}
  
void
XmlNode::remove() {
  xmlUnlinkNode(xml_obj);
}

v8::Handle<v8::Value>
XmlNode::get_type() {
  switch (xml_obj->type) {
  case  XML_ELEMENT_NODE:
    return v8::String::NewSymbol("element");
  case XML_ATTRIBUTE_NODE:
    return v8::String::NewSymbol("attribute");
  case XML_TEXT_NODE:
    return v8::String::NewSymbol("text");
  case XML_CDATA_SECTION_NODE:
    return v8::String::NewSymbol("cdata");
  case XML_ENTITY_REF_NODE:
    return v8::String::NewSymbol("entity_ref");
  case XML_ENTITY_NODE:
    return v8::String::NewSymbol("entity");
  case XML_PI_NODE:
    return v8::String::NewSymbol("pi");
  case XML_COMMENT_NODE:
    return v8::String::NewSymbol("comment");
  case XML_DOCUMENT_NODE:
    return v8::String::NewSymbol("document");
  case XML_DOCUMENT_TYPE_NODE:
    return v8::String::NewSymbol("document_type");
  case XML_DOCUMENT_FRAG_NODE:
    return v8::String::NewSymbol("document_frag");
  case XML_NOTATION_NODE:
    return v8::String::NewSymbol("notation");
  case XML_HTML_DOCUMENT_NODE:
    return v8::String::NewSymbol("html_document");
  case XML_DTD_NODE:
    return v8::String::NewSymbol("dtd");
  case XML_ELEMENT_DECL:
    return v8::String::NewSymbol("element_decl");
  case XML_ATTRIBUTE_DECL:
    return v8::String::NewSymbol("attribute_decl");
  case XML_ENTITY_DECL:
    return v8::String::NewSymbol("entity_decl");
  case XML_NAMESPACE_DECL:
    return v8::String::NewSymbol("namespace_decl");
  case XML_XINCLUDE_START:
    return v8::String::NewSymbol("xinclude_start");
  case XML_XINCLUDE_END:
    return v8::String::NewSymbol("xinclude_end");
  case XML_DOCB_DOCUMENT_NODE:
    return v8::String::NewSymbol("docb_document");
  }

  return v8::Null();
}

void
XmlNode::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  constructor_template =
    v8::Persistent<v8::FunctionTemplate>::New(v8::FunctionTemplate::New());
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "doc",
                        XmlNode::Doc);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "parent",
                        XmlNode::Parent);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "namespace",
                        XmlNode::Namespace);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "prevSibling",
                        XmlNode::PrevSibling);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "nextSibling",
                        XmlNode::NextSibling);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "type",
                        XmlNode::Type);

  LXJS_SET_PROTO_METHOD(constructor_template,
                        "remove",
                        XmlNode::Remove);
						
  LXJS_SET_PROTO_METHOD(constructor_template,
                        "clone",
                        XmlNode::Clone);
						
  LXJS_SET_PROTO_METHOD(constructor_template,
                        "toString",
                        XmlNode::ToString);

  XmlElement::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
