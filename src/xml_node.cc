// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <libxml/xmlsave.h>

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
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_doc());
}

v8::Handle<v8::Value>
XmlNode::Namespace(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  // #namespace() Get the node's namespace
  if (args.Length() == 0) {
      return scope.Close(node->get_namespace());
  }

  if (args[0]->IsNull())
      return scope.Close(node->remove_namespace());

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
        v8::Handle<v8::Object> existing = XmlNamespace::New(found_ns);
        ns = ObjectWrap::Unwrap<XmlNamespace>(existing);
    }
  }

  // Namespace does not seem to exist, so create it.
  if (!ns) {
      const unsigned int argc = 3;
      v8::Handle<v8::Value> argv[argc];
      argv[0] = args.Holder();

      if (args.Length() == 1) {
          argv[1] = v8::Null();
          argv[2] = args[0];
      } else {
          argv[1] = args[0];
          argv[2] = args[1];
      }

      v8::Handle<v8::Function> define_namespace =
          XmlNamespace::constructor_template->GetFunction();

      // will create a new namespace attached to this node
      // since we keep the document around, the namespace, like the node, won't be
      // garbage collected
      v8::Handle<v8::Value> new_ns = define_namespace->NewInstance(argc, argv);
      ns = ObjectWrap::Unwrap<XmlNamespace>(new_ns->ToObject());
  }

  node->set_namespace(ns->xml_obj);
  return scope.Close(node->get_namespace());
}

v8::Handle<v8::Value>
XmlNode::Namespaces(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_all_namespaces());
}

v8::Handle<v8::Value>
XmlNode::Parent(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode* node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_parent());
}

v8::Handle<v8::Value>
XmlNode::PrevSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_prev_sibling());
}

v8::Handle<v8::Value>
XmlNode::NextSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_next_sibling());
}

v8::Handle<v8::Value>
XmlNode::LineNumber(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_line_number());
}

v8::Handle<v8::Value>
XmlNode::Type(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->get_type());
}

v8::Handle<v8::Value>
XmlNode::ToString(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  return scope.Close(node->to_string());
}

v8::Handle<v8::Value>
XmlNode::Remove(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);

  node->remove();

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlNode::Clone(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlNode *node = ObjectWrap::Unwrap<XmlNode>(args.Holder());
  assert(node);
  
  bool recurse = true;
  
  if (args.Length() == 1 && args[0]->IsBoolean())
      recurse = args[0]->ToBoolean()->BooleanValue();

  return scope.Close(node->clone(recurse)); 
}

v8::Handle<v8::Value>
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

v8::Handle<v8::Value>
XmlNode::get_doc() {
    return XmlDocument::New(xml_obj->doc);
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
  {
      return v8::Null();
  }

  return scope.Close(XmlNamespace::New(xml_obj->ns));
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

v8::Handle<v8::Value>
XmlNode::get_all_namespaces() {
  v8::HandleScope scope;

  // Iterate through namespaces
  v8::Local<v8::Array> namespaces = v8::Array::New();
  xmlNs** nsList = xmlGetNsList(xml_obj->doc, xml_obj);
  if (nsList != NULL) {
    for (int i = 0; nsList[i] != NULL; i++) {
      v8::Handle<v8::Number> index = v8::Number::New(i);
      v8::Handle<v8::Object> ns = XmlNamespace::New(nsList[i]);
      namespaces->Set(index, ns);
    }
  }

  return scope.Close(namespaces);
}

v8::Handle<v8::Value>
XmlNode::get_parent() {
  v8::HandleScope scope;

  if (xml_obj->parent) {
      return scope.Close(XmlElement::New(xml_obj->parent));
  }

  return scope.Close(XmlDocument::New(xml_obj->doc));
}

v8::Handle<v8::Value>
XmlNode::get_prev_sibling() {
  v8::HandleScope scope;
  if (xml_obj->prev) {
      return scope.Close(XmlNode::New(xml_obj->prev));
  }

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_next_sibling() {
  v8::HandleScope scope;
  if (xml_obj->next) {
      return scope.Close(XmlNode::New(xml_obj->next));
  }

  return v8::Null();
}

v8::Handle<v8::Value>
XmlNode::get_line_number() {
  v8::HandleScope scope;
  return scope.Close(v8::Integer::New(xmlGetLineNo(xml_obj)));
}

v8::Handle<v8::Value>
XmlNode::clone(bool recurse) {
  v8::HandleScope scope;

  xmlNode* new_xml_obj = xmlDocCopyNode(xml_obj, xml_obj->doc, recurse);
  return scope.Close(XmlNode::New(new_xml_obj));
}

v8::Handle<v8::Value>
XmlNode::to_string() {
  v8::HandleScope scope;

  xmlBuffer* buf = xmlBufferCreate();
  const char* enc = "UTF-8";

  xmlSaveCtxt* savectx = xmlSaveToBuffer(buf, enc, 0);
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

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "doc",
                        XmlNode::Doc);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "parent",
                        XmlNode::Parent);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "namespace",
                        XmlNode::Namespace);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "namespaces",
                        XmlNode::Namespaces);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "prevSibling",
                        XmlNode::PrevSibling);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "nextSibling",
                        XmlNode::NextSibling);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "line",
                        XmlNode::LineNumber);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "type",
                        XmlNode::Type);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "remove",
                        XmlNode::Remove);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "clone",
                        XmlNode::Clone);

  NODE_SET_PROTOTYPE_METHOD(constructor_template,
                        "toString",
                        XmlNode::ToString);

  XmlElement::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
