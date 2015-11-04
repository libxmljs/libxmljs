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
  return info.GetReturnValue().Set(node->get_namespace());
}

NAN_METHOD(XmlNode::Namespaces) {
  Nan::HandleScope scope;
  XmlNode* node = Nan::ObjectWrap::Unwrap<XmlNode>(info.Holder());
  assert(node);

  return info.GetReturnValue().Set(node->get_all_namespaces());
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

    // this will prevent the document from being cleaned up
    // we keep the document if any of the nodes attached to it are still alive
    this->doc = xml_obj->doc;
    XmlDocument* doc = static_cast<XmlDocument*>(this->doc->_private);
    doc->ref();
}

/*
 * Return the (non-document) root, or a proxied ancestor: whichever is closest
 */
xmlNode*
findProxiedAncestorOrRoot(xmlNode *xml_obj) {
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
 * Search linked list for javascript proxy, ignoring given node.
 */
xmlAttr*
findProxiedAttrInList(xmlAttr *xml_obj, void *skip_xml_obj) {
    xmlAttr *proxied_attr = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            proxied_attr = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return proxied_attr;
}

xmlNs*
findProxiedNsInList(xmlNs *xml_obj, void *skip_xml_obj) {
    xmlNs *proxied_ns = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            proxied_ns = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return proxied_ns;
}

xmlNode* findProxiedNodeInChildren(xmlNode *xml_obj, void *skip_xml_obj);

/*
 * Search document for javascript proxy, ignoring given node.
 * Based on xmlFreeDoc.
 */
xmlNode*
findProxiedNodeInDocument(xmlDoc *xml_obj, void *skip_xml_obj) {
    xmlNode *proxied_node = NULL;
    if ((xml_obj->extSubset != NULL) &&
        (xml_obj->extSubset->_private != NULL) &&
        (static_cast<void*>(xml_obj->extSubset) != skip_xml_obj)) {
        proxied_node = reinterpret_cast<xmlNode*>(xml_obj->extSubset);
    }
    if ((proxied_node == NULL) &&
        (xml_obj->intSubset != NULL) &&
        (xml_obj->intSubset->_private != NULL) &&
        (static_cast<void*>(xml_obj->intSubset) != skip_xml_obj)) {
        proxied_node = reinterpret_cast<xmlNode*>(xml_obj->intSubset);
    }
    if ((proxied_node == NULL) && (xml_obj->children != NULL)) {
        proxied_node =
            findProxiedNodeInChildren(xml_obj->children, skip_xml_obj);
    }
    if ((proxied_node == NULL) && (xml_obj->oldNs != NULL)) {
        proxied_node =
            reinterpret_cast<xmlNode*>(findProxiedNsInList(xml_obj->oldNs, skip_xml_obj));

    }
    return proxied_node;
}

/*
 * Search children of node for javascript proxy, ignoring given node.
 * Based on xmlFreeNodeList.
 */
xmlNode*
findProxiedNodeInChildren(xmlNode *xml_obj, xmlNode *skip_xml_obj) {

    xmlNode* proxied_node = NULL;

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return reinterpret_cast<xmlNode*>(
            findProxiedNsInList(reinterpret_cast<xmlNs*>(xml_obj), skip_xml_obj)
        );
    }

    if ((xml_obj->type == XML_DOCUMENT_NODE) ||
#ifdef LIBXML_DOCB_ENABLED
        (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
#endif
        (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
        return findProxiedNodeInDocument(reinterpret_cast<xmlDoc*>(xml_obj), skip_xml_obj);
    }

    xmlNode *next;
    while (xml_obj != NULL) {
        next = xml_obj->next;

        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            proxied_node = xml_obj;
        }
        else {

            if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
                proxied_node = findProxiedNodeInChildren(xml_obj->children, skip_xml_obj);
            }

            if ((proxied_node == NULL) &&
                ((xml_obj->type == XML_ELEMENT_NODE) ||
                 (xml_obj->type == XML_XINCLUDE_START) ||
                 (xml_obj->type == XML_XINCLUDE_END))) {

                if ((proxied_node == NULL) && (xml_obj->properties != NULL)) {
                    proxied_node =
                        reinterpret_cast<xmlNode*>(findProxiedAttrInList(xml_obj->properties, skip_xml_obj));
                }

                if ((proxied_node == NULL) && (xml_obj->nsDef != NULL)) {
                    proxied_node =
                        reinterpret_cast<xmlNode*>(findProxiedNsInList(xml_obj->nsDef, skip_xml_obj));
                }
            }

        }

        if (proxied_node != NULL) {
            break;
        }

        xml_obj = next;
    }

    return proxied_node;
}

/*
 * Search descendants of node to find javascript proxy,
 * optionally ignoring given node. Based on xmlFreeNode.
 */
xmlNode*
findProxiedDescendant(xmlNode *xml_obj, xmlNode *skip_xml_obj=NULL) {

    xmlNode* proxied_descendant = NULL;

    if (xml_obj->type == XML_DTD_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : findProxiedNodeInChildren(xml_obj->children, skip_xml_obj);
    }

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return NULL;
    }

    if (xml_obj->type == XML_ATTRIBUTE_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : findProxiedNodeInChildren(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
        proxied_descendant =
            findProxiedNodeInChildren(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->type == XML_ELEMENT_NODE) ||
        (xml_obj->type == XML_XINCLUDE_START) ||
        (xml_obj->type == XML_XINCLUDE_END)) {

        if ((proxied_descendant == NULL) && (xml_obj->properties != NULL)) {
            proxied_descendant =
                reinterpret_cast<xmlNode*>(findProxiedAttrInList(xml_obj->properties, skip_xml_obj));
        }

        if ((proxied_descendant == NULL) && (xml_obj->nsDef != NULL)) {
            proxied_descendant =
                reinterpret_cast<xmlNode*>(findProxiedNsInList(xml_obj->nsDef, skip_xml_obj));
        }
    }

    return proxied_descendant;
}

XmlNode::~XmlNode() {

    // check if `xml_obj` has been freed so we don't access bad memory
    if (!this->xml_obj)
    {

        // unref the doc
        if ((this->doc) && (this->doc->_private != NULL))
        {
            XmlDocument* doc = static_cast<XmlDocument*>(this->doc->_private);
            doc->unref();
            this->doc = NULL;
        }

        // return so we don't attempt to use `xml_obj`
        return;
    }

    xml_obj->_private = NULL;

    if ((this->doc) && (this->doc->_private != NULL)) {
        XmlDocument* doc = static_cast<XmlDocument*>(xml_obj->doc->_private);
        doc->unref();
        this->doc = NULL;
    }

    if (xml_obj->parent == NULL) {
        if (findProxiedDescendant(xml_obj) == NULL) {
            xmlFreeNode(xml_obj);
        }
    }
    else {
        xmlNode *ancestor = findProxiedAncestorOrRoot(xml_obj);
        if ((ancestor->_private == NULL) &&
            (ancestor->parent == NULL) &&
            (findProxiedDescendant(ancestor, xml_obj) == NULL)) {
            xmlFreeNode(ancestor);
        }
    }
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
  xmlUnlinkNode(xml_obj);
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
  XmlComment::Initialize(target);
  XmlAttribute::Initialize(target);
}
}  // namespace libxmljs
