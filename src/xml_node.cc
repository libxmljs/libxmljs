// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <libxml/xmlsave.h>

#include "xml_node.h"
#include "xml_document.h"
#include "xml_namespace.h"
#include "xml_element.h"
#include "xml_comment.h"
#include "xml_text.h"
#include "xml_attribute.h"

namespace libxmljs {

Nan::Persistent<v8::FunctionTemplate> XmlNode::constructor_template;

NAN_METHOD(XmlNode::Doc) {
  Nan::HandleScope scope;
  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_doc());
}

NAN_METHOD(XmlNode::Namespace) {
  Nan::HandleScope scope;
  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  // #namespace() Get the node's namespace
  if (info.Length() == 0) {
      return info.GetReturnValue().Set(node->get_namespace());
  }

  if (info[0]->IsNull())
      return info.GetReturnValue().Set(node->remove_namespace());

  XmlNamespace* ns = NULL;

  // #namespace(ns) libxml.Namespace object was provided
  // TODO(sprsquish): check that it was actually given a namespace obj
  if (info[0]->IsObject())
    ns = Nan::ObjectWrap::Unwrap<XmlNamespace>(info[0]->ToObject());

  // #namespace(href) or #namespace(prefix, href)
  // if the namespace has already been defined on the node, just set it
  if (info[0]->IsString()) {
    v8::String::Utf8Value ns_to_find(info[0]->ToString());
    xmlNs* found_ns = node->find_namespace(*ns_to_find);
    if (found_ns) {
        // maybe build
        v8::Local<v8::Object> existing = XmlNamespace::New(found_ns);
        ns = Nan::ObjectWrap::Unwrap<XmlNamespace>(existing);
    }
  }

  // Namespace does not seem to exist, so create it.
  if (!ns) {
      const unsigned int argc = 3;
      v8::Local<v8::Value> argv[argc];
      argv[0] = info.Holder();

      if (info.Length() == 1) {
          argv[1] = Nan::Null();
          argv[2] = info[0];
      } else {
          argv[1] = info[0];
          argv[2] = info[1];
      }

      v8::Local<v8::Function> define_namespace =
          Nan::New(XmlNamespace::constructor_template)->GetFunction();

      // will create a new namespace attached to this node
      // since we keep the document around, the namespace, like the node, won't be
      // garbage collected
      v8::Local<v8::Value> new_ns = define_namespace->NewInstance(argc, argv);
      ns = Nan::ObjectWrap::Unwrap<XmlNamespace>(new_ns->ToObject());
  }

  node->set_namespace(ns->xml_obj);
  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlNode::Namespaces) {
  Nan::HandleScope scope;
  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  // ignore everything but a literal true; different from IsFalse
  if ((info.Length() == 0) || !info[0]->IsTrue()) {
      return info.GetReturnValue().Set(node->get_all_namespaces());
  }

  return info.GetReturnValue().Set(node->get_local_namespaces());
}

NAN_METHOD(XmlNode::Parent) {
  Nan::HandleScope scope;
  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_parent());
}

NAN_METHOD(XmlNode::PrevSibling) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_prev_sibling());
}

NAN_METHOD(XmlNode::NextSibling) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_next_sibling());
}

NAN_METHOD(XmlNode::LineNumber) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_line_number());
}

NAN_METHOD(XmlNode::Type) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_type());
}

NAN_METHOD(XmlNode::ToString) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  int options = 0;

  if (info.Length() > 0) {
      if (info[0]->IsBoolean()) {
          if (info[0]->ToBoolean()->BooleanValue() == true) {
              options |= XML_SAVE_FORMAT;
          }
      } else if (info[0]->IsObject()) {
          v8::Local<v8::Object> obj = info[0]->ToObject();

          // drop the xml declaration
          if (obj->Get(Nan::New<v8::String>("declaration").ToLocalChecked())->IsFalse()) {
              options |= XML_SAVE_NO_DECL;
          }

          // format save output
          if (obj->Get(Nan::New<v8::String>("format").ToLocalChecked())->IsTrue()) {
              options |= XML_SAVE_FORMAT;
          }

          // no empty tags (only works with XML) ex: <title></title> becomes <title/>
          if (obj->Get(Nan::New<v8::String>("selfCloseEmpty").ToLocalChecked())->IsFalse()) {
              options |= XML_SAVE_NO_EMPTY;
          }

          // format with non-significant whitespace
          if (obj->Get(Nan::New<v8::String>("whitespace").ToLocalChecked())->IsTrue()) {
              options |= XML_SAVE_WSNONSIG;
          }

          v8::Local<v8::Value> type = obj->Get(Nan::New<v8::String>("type").ToLocalChecked());
          if (type->Equals(Nan::New<v8::String>("XML").ToLocalChecked()) ||
              type->Equals(Nan::New<v8::String>("xml").ToLocalChecked())) {
              options |= XML_SAVE_AS_XML;    // force XML serialization on HTML doc
          } else if (type->Equals(Nan::New<v8::String>("HTML").ToLocalChecked()) ||
                     type->Equals(Nan::New<v8::String>("html").ToLocalChecked())) {
              options |= XML_SAVE_AS_HTML;   // force HTML serialization on XML doc
              // if the document is XML and we want formatted HTML output
              // we must use the XHTML serializer because the default HTML
              // serializer only formats node->type = HTML_NODE and not XML_NODEs
              if ((options & XML_SAVE_FORMAT) && (options & XML_SAVE_XHTML) == false) {
                  options |= XML_SAVE_XHTML;
              }
          } else if (type->Equals(Nan::New<v8::String>("XHTML").ToLocalChecked()) ||
                     type->Equals(Nan::New<v8::String>("xhtml").ToLocalChecked())) {
              options |= XML_SAVE_XHTML;    // force XHTML serialization
          }
      }
  }
  return info.GetReturnValue().Set(node->to_string(options));
}

NAN_METHOD(XmlNode::Remove) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  node->remove();

  return info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(XmlNode::Clone) {
  Nan::HandleScope scope;
  XmlNode *node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  bool recurse = true;

  if (info.Length() == 1 && info[0]->IsBoolean())
      recurse = info[0]->ToBoolean()->BooleanValue();

  return info.GetReturnValue().Set(node->clone(recurse));
}

v8::Local<v8::Value>
XmlNode::New(xmlNode* node)
{
  Nan::EscapableHandleScope scope;
  switch (node->type) {
  case XML_ATTRIBUTE_NODE:
    return scope.Escape(XmlAttribute::New(reinterpret_cast<xmlAttr *>(node)));

  default:
    // if we don't know how to convert to specific libxmljs wrapper,
    // wrap in an XmlElement.  There should probably be specific
    // wrapper types for text nodes etc., but this is what existing
    // code expects.
    return scope.Escape(XmlElement::New(node));
  }
}

XmlNode::XmlNode(xmlNode* node) : xml_obj(node) {
    xml_obj->_private = this;
    this->ancestor = NULL;

    if ((xml_obj->doc != NULL) && (xml_obj->doc->_private != NULL)) {
        this->doc = xml_obj->doc;
        static_cast<XmlDocument*>(this->doc->_private)->Ref();
    }

    this->ref_wrapped_ancestor();
}

/*
 * Return the (non-document) root, or a wrapped ancestor: whichever is closest
 */
xmlNode*
get_wrapped_ancestor_or_root(xmlNode *xml_obj) {
    while ((xml_obj->parent != NULL) &&
           (static_cast<void*>(xml_obj->doc) != static_cast<void*>(xml_obj->parent))  &&
           (xml_obj->parent->_private == NULL)) {
        xml_obj = xml_obj->parent;
    }
    return ((xml_obj->parent != NULL) &&
            (static_cast<void*>(xml_obj->doc) != static_cast<void*>(xml_obj->parent))) ?
        xml_obj->parent : xml_obj;
}


/*
 * Search linked list for javascript wrapper, ignoring given node.
 */
xmlAttr*
get_wrapped_attr_in_list(xmlAttr *xml_obj, void *skip_xml_obj) {
    xmlAttr *wrapped_attr = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_attr = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return wrapped_attr;
}

xmlNs*
get_wrapped_ns_in_list(xmlNs *xml_obj, void *skip_xml_obj) {
    xmlNs *wrapped_ns = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_ns = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return wrapped_ns;
}

xmlNode* get_wrapped_node_in_children(xmlNode *xml_obj, xmlNode *skip_xml_obj);

/*
 * Search document for javascript wrapper, ignoring given node.
 * Based on xmlFreeDoc.
 */
xmlNode*
get_wrapped_node_in_document(xmlDoc *xml_obj, xmlNode *skip_xml_obj) {
    xmlNode *wrapped_node = NULL;
    if ((xml_obj->extSubset != NULL) &&
        (xml_obj->extSubset->_private != NULL) &&
        (static_cast<void*>(xml_obj->extSubset) != skip_xml_obj)) {
        wrapped_node = reinterpret_cast<xmlNode*>(xml_obj->extSubset);
    }
    if ((wrapped_node == NULL) &&
        (xml_obj->intSubset != NULL) &&
        (xml_obj->intSubset->_private != NULL) &&
        (static_cast<void*>(xml_obj->intSubset) != skip_xml_obj)) {
        wrapped_node = reinterpret_cast<xmlNode*>(xml_obj->intSubset);
    }
    if ((wrapped_node == NULL) && (xml_obj->children != NULL)) {
        wrapped_node =
            get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }
    if ((wrapped_node == NULL) && (xml_obj->oldNs != NULL)) {
        wrapped_node =
            reinterpret_cast<xmlNode*>(get_wrapped_ns_in_list(xml_obj->oldNs, skip_xml_obj));

    }
    return wrapped_node;
}

/*
 * Search children of node for javascript wrapper, ignoring given node.
 * Based on xmlFreeNodeList.
 */
xmlNode*
get_wrapped_node_in_children(xmlNode *xml_obj, xmlNode *skip_xml_obj) {

    xmlNode* wrapped_node = NULL;

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return reinterpret_cast<xmlNode*>(
            get_wrapped_ns_in_list(reinterpret_cast<xmlNs*>(xml_obj), skip_xml_obj)
        );
    }

    if ((xml_obj->type == XML_DOCUMENT_NODE) ||
#ifdef LIBXML_DOCB_ENABLED
        (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
#endif
        (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
        return get_wrapped_node_in_document(reinterpret_cast<xmlDoc*>(xml_obj), skip_xml_obj);
    }

    xmlNode *next;
    while (xml_obj != NULL) {
        next = xml_obj->next;

        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_node = xml_obj;
        }
        else {

            if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
                wrapped_node = get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
            }

            if ((wrapped_node == NULL) &&
                ((xml_obj->type == XML_ELEMENT_NODE) ||
                 (xml_obj->type == XML_XINCLUDE_START) ||
                 (xml_obj->type == XML_XINCLUDE_END))) {

                if ((wrapped_node == NULL) && (xml_obj->properties != NULL)) {
                    wrapped_node =
                        reinterpret_cast<xmlNode*>(get_wrapped_attr_in_list(xml_obj->properties, skip_xml_obj));
                }

                if ((wrapped_node == NULL) && (xml_obj->nsDef != NULL)) {
                    wrapped_node =
                        reinterpret_cast<xmlNode*>(get_wrapped_ns_in_list(xml_obj->nsDef, skip_xml_obj));
                }
            }

        }

        if (wrapped_node != NULL) {
            break;
        }

        xml_obj = next;
    }

    return wrapped_node;
}

/*
 * Search descendants of node to find javascript wrapper,
 * optionally ignoring given node. Based on xmlFreeNode.
 */
xmlNode*
get_wrapped_descendant(xmlNode *xml_obj, xmlNode *skip_xml_obj=NULL) {

    xmlNode* wrapped_descendant = NULL;

    if (xml_obj->type == XML_DTD_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return NULL;
    }

    if (xml_obj->type == XML_ATTRIBUTE_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
        wrapped_descendant =
            get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->type == XML_ELEMENT_NODE) ||
        (xml_obj->type == XML_XINCLUDE_START) ||
        (xml_obj->type == XML_XINCLUDE_END)) {

        if ((wrapped_descendant == NULL) && (xml_obj->properties != NULL)) {
            wrapped_descendant =
                reinterpret_cast<xmlNode*>(get_wrapped_attr_in_list(xml_obj->properties, skip_xml_obj));
        }

        if ((wrapped_descendant == NULL) && (xml_obj->nsDef != NULL)) {
            wrapped_descendant =
                reinterpret_cast<xmlNode*>(get_wrapped_ns_in_list(xml_obj->nsDef, skip_xml_obj));
        }
    }

    return wrapped_descendant;
}

XmlNode::~XmlNode() {
    if ((this->doc != NULL) && (this->doc->_private != NULL)) {
      static_cast<XmlDocument*>(this->doc->_private)->Unref();
    }
    this->unref_wrapped_ancestor();
    if (xml_obj == NULL) return;

    xml_obj->_private = NULL;
    if (xml_obj->parent == NULL) {
        if (get_wrapped_descendant(xml_obj) == NULL) {
            xmlFreeNode(xml_obj);
        }
    }
    else {
        xmlNode *ancestor = get_wrapped_ancestor_or_root(xml_obj);
        if ((ancestor->_private == NULL) &&
            (ancestor->parent == NULL) &&
            (get_wrapped_descendant(ancestor, xml_obj) == NULL)) {
            xmlFreeNode(ancestor);
        }
    }
}

xmlNode*
XmlNode::get_wrapped_ancestor() {
    xmlNode* ancestor = get_wrapped_ancestor_or_root(xml_obj);
    return ((xml_obj == ancestor) || (ancestor->_private == NULL)) ? NULL : ancestor;
}

void
XmlNode::ref_wrapped_ancestor() {
    xmlNode* ancestor = this->get_wrapped_ancestor();

    // if our closest wrapped ancestor has changed then we either
    // got removed, added, or a closer ancestor was wrapped
    if (ancestor != this->ancestor) {
        this->unref_wrapped_ancestor();
        this->ancestor = ancestor;
    }

    if (this->ancestor != NULL) {
        XmlNode* node = static_cast<XmlNode*>(this->ancestor->_private);
        node->Ref();
    }
}

void
XmlNode::unref_wrapped_ancestor() {
    if ((this->ancestor != NULL) && (this->ancestor->_private != NULL)) {
        (static_cast<XmlNode*>(this->ancestor->_private))->Unref();
    }
    this->ancestor = NULL;
}

v8::Local<v8::Value>
XmlNode::get_doc() {
    Nan::EscapableHandleScope scope;
    return scope.Escape(XmlDocument::New(xml_obj->doc));
}

v8::Local<v8::Value>
XmlNode::remove_namespace() {
  xml_obj->ns = NULL;
  return Nan::Null();
}

v8::Local<v8::Value>
XmlNode::get_namespace() {
  Nan::EscapableHandleScope scope;
  if (!xml_obj->ns)
  {
      return scope.Escape(Nan::Null());
  }

  return scope.Escape(XmlNamespace::New(xml_obj->ns));
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
  Nan::EscapableHandleScope scope;

  // Iterate through namespaces
  v8::Local<v8::Array> namespaces = Nan::New<v8::Array>();
  xmlNs** nsList = xmlGetNsList(xml_obj->doc, xml_obj);
  if (nsList != NULL) {
    for (int i = 0; nsList[i] != NULL; i++) {
      v8::Local<v8::Number> index = Nan::New<v8::Number>(i);
      v8::Local<v8::Object> ns = XmlNamespace::New(nsList[i]);
      Nan::Set(namespaces, index, ns);
    }
    xmlFree(nsList);
  }

  return scope.Escape(namespaces);
}

v8::Local<v8::Value>
XmlNode::get_local_namespaces() {
  Nan::EscapableHandleScope scope;

  // Iterate through local namespaces
  v8::Local<v8::Array> namespaces = Nan::New<v8::Array>();
  xmlNs* nsDef = xml_obj->nsDef;
  for(int i=0; nsDef; i++, nsDef = nsDef->next) {
      v8::Local<v8::Number> index = Nan::New<v8::Number>(i);
      v8::Local<v8::Object> ns = XmlNamespace::New(nsDef);
      Nan::Set(namespaces, index, ns);
  }

  return scope.Escape(namespaces);
}

v8::Local<v8::Value>
XmlNode::get_parent() {
  Nan::EscapableHandleScope scope;

  if (xml_obj->parent) {
      return scope.Escape(XmlElement::New(xml_obj->parent));
  }

  return scope.Escape(XmlDocument::New(xml_obj->doc));
}

v8::Local<v8::Value>
XmlNode::get_prev_sibling() {
  Nan::EscapableHandleScope scope;
  if (xml_obj->prev) {
      return scope.Escape(XmlNode::New(xml_obj->prev));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlNode::get_next_sibling() {
  Nan::EscapableHandleScope scope;
  if (xml_obj->next) {
      return scope.Escape(XmlNode::New(xml_obj->next));
  }

  return scope.Escape(Nan::Null());
}

v8::Local<v8::Value>
XmlNode::get_line_number() {
  Nan::EscapableHandleScope scope;
  return scope.Escape(Nan::New<v8::Integer>(uint32_t(xmlGetLineNo(xml_obj))));
}

v8::Local<v8::Value>
XmlNode::clone(bool recurse) {
  Nan::EscapableHandleScope scope;

  xmlNode* new_xml_obj = xmlDocCopyNode(xml_obj, xml_obj->doc, recurse);
  return scope.Escape(XmlNode::New(new_xml_obj));
}

v8::Local<v8::Value>
XmlNode::to_string(int options) {
  Nan::EscapableHandleScope scope;

  xmlBuffer* buf = xmlBufferCreate();
  const char* enc = "UTF-8";

  xmlSaveCtxt* savectx = xmlSaveToBuffer(buf, enc, options);
  xmlSaveTree(savectx, xml_obj);
  xmlSaveFlush(savectx);

  const xmlChar* xmlstr = xmlBufferContent(buf);

  if(xmlstr) {
      v8::Local<v8::String> str = Nan::New<v8::String>((char*)xmlstr, xmlBufferLength(buf)).ToLocalChecked();
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return scope.Escape(str);
  } else {
      xmlSaveClose(savectx);

      xmlBufferFree(buf);

      return scope.Escape(Nan::Null());
  }
}

void
XmlNode::remove() {
  this->unref_wrapped_ancestor();
  xmlUnlinkNode(xml_obj);
}

void
XmlNode::add_child(xmlNode* child) {
  xmlAddChild(xml_obj, child);
}

void
XmlNode::add_prev_sibling(xmlNode* node) {
  xmlAddPrevSibling(xml_obj, node);
}

void
XmlNode::add_next_sibling(xmlNode* node) {
  xmlAddNextSibling(xml_obj, node);
}

xmlNode*
XmlNode::import_node(xmlNode *node) {
  if (xml_obj->doc == node->doc) {
      if ((node->parent != NULL) && (node->_private != NULL)) {
        static_cast<XmlNode*>(node->_private)->remove();
      }
      return node;
  }else{
      return xmlDocCopyNode(node, xml_obj->doc, 1);
  }
}

v8::Local<v8::Value>
XmlNode::get_type() {
  Nan::EscapableHandleScope scope;
  switch (xml_obj->type) {
  case  XML_ELEMENT_NODE:
    return scope.Escape(Nan::New<v8::String>("element").ToLocalChecked());
  case XML_ATTRIBUTE_NODE:
    return scope.Escape(Nan::New<v8::String>("attribute").ToLocalChecked());
  case XML_TEXT_NODE:
    return scope.Escape(Nan::New<v8::String>("text").ToLocalChecked());
  case XML_CDATA_SECTION_NODE:
    return scope.Escape(Nan::New<v8::String>("cdata").ToLocalChecked());
  case XML_ENTITY_REF_NODE:
    return scope.Escape(Nan::New<v8::String>("entity_ref").ToLocalChecked());
  case XML_ENTITY_NODE:
    return scope.Escape(Nan::New<v8::String>("entity").ToLocalChecked());
  case XML_PI_NODE:
    return scope.Escape(Nan::New<v8::String>("pi").ToLocalChecked());
  case XML_COMMENT_NODE:
    return scope.Escape(Nan::New<v8::String>("comment").ToLocalChecked());
  case XML_DOCUMENT_NODE:
    return scope.Escape(Nan::New<v8::String>("document").ToLocalChecked());
  case XML_DOCUMENT_TYPE_NODE:
    return scope.Escape(Nan::New<v8::String>("document_type").ToLocalChecked());
  case XML_DOCUMENT_FRAG_NODE:
    return scope.Escape(Nan::New<v8::String>("document_frag").ToLocalChecked());
  case XML_NOTATION_NODE:
    return scope.Escape(Nan::New<v8::String>("notation").ToLocalChecked());
  case XML_HTML_DOCUMENT_NODE:
    return scope.Escape(Nan::New<v8::String>("html_document").ToLocalChecked());
  case XML_DTD_NODE:
    return scope.Escape(Nan::New<v8::String>("dtd").ToLocalChecked());
  case XML_ELEMENT_DECL:
    return scope.Escape(Nan::New<v8::String>("element_decl").ToLocalChecked());
  case XML_ATTRIBUTE_DECL:
    return scope.Escape(Nan::New<v8::String>("attribute_decl").ToLocalChecked());
  case XML_ENTITY_DECL:
    return scope.Escape(Nan::New<v8::String>("entity_decl").ToLocalChecked());
  case XML_NAMESPACE_DECL:
    return scope.Escape(Nan::New<v8::String>("namespace_decl").ToLocalChecked());
  case XML_XINCLUDE_START:
    return scope.Escape(Nan::New<v8::String>("xinclude_start").ToLocalChecked());
  case XML_XINCLUDE_END:
    return scope.Escape(Nan::New<v8::String>("xinclude_end").ToLocalChecked());
  case XML_DOCB_DOCUMENT_NODE:
    return scope.Escape(Nan::New<v8::String>("docb_document").ToLocalChecked());
  }

  return scope.Escape(Nan::Null());
}

void
XmlNode::Initialize(v8::Handle<v8::Object> target) {
  Nan::HandleScope scope;
  v8::Local<v8::FunctionTemplate> tmpl = Nan::New<v8::FunctionTemplate>();
  constructor_template.Reset( tmpl);
  tmpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tmpl,
                        "doc",
                        XmlNode::Doc);

  Nan::SetPrototypeMethod(tmpl,
                        "parent",
                        XmlNode::Parent);

  Nan::SetPrototypeMethod(tmpl,
                        "namespace",
                        XmlNode::Namespace);

  Nan::SetPrototypeMethod(tmpl,
                        "namespaces",
                        XmlNode::Namespaces);

  Nan::SetPrototypeMethod(tmpl,
                        "prevSibling",
                        XmlNode::PrevSibling);

  Nan::SetPrototypeMethod(tmpl,
                        "nextSibling",
                        XmlNode::NextSibling);

  Nan::SetPrototypeMethod(tmpl,
                        "line",
                        XmlNode::LineNumber);

  Nan::SetPrototypeMethod(tmpl,
                        "type",
                        XmlNode::Type);

  Nan::SetPrototypeMethod(tmpl,
                        "remove",
                        XmlNode::Remove);

  Nan::SetPrototypeMethod(tmpl,
                        "clone",
                        XmlNode::Clone);

  Nan::SetPrototypeMethod(tmpl,
                        "toString",
                        XmlNode::ToString);

  XmlElement::Initialize(target);
  XmlText::Initialize(target);
  XmlComment::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
