// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <cstring>

#include "libxmljs.h"

#include "xml_element.h"
#include "xml_document.h"
#include "xml_attribute.h"
#include "xml_xpath_context.h"

namespace libxmljs {

v8::Persistent<v8::FunctionTemplate> XmlElement::constructor_template;

// doc, name, content
NAN_METHOD(XmlElement::New) {
  NanScope();

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (args.Length() == 0)
  {
      NanReturnValue(args.Holder());
  }

  XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());
  assert(document);

  v8::String::Utf8Value name(args[1]);

  v8::Local<v8::Value> contentOpt;
  if(args[2]->IsString()) {
      contentOpt = args[2];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlChar* encoded = content ? xmlEncodeSpecialChars(document->xml_obj, (const xmlChar*)content) : NULL;
  xmlNode* elem = xmlNewDocNode(document->xml_obj,
                                NULL,
                                (const xmlChar*)*name,
                                encoded);
  if (encoded)
      xmlFree(encoded);

  XmlElement* element = new XmlElement(elem);
  elem->_private = element;
  element->Wrap(args.Holder());

  // this prevents the document from going away
  args.Holder()->Set(NanNew<v8::String>("document"), args[0]);

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::Name) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() == 0)
      NanReturnValue(element->get_name());

  v8::String::Utf8Value name(args[0]->ToString());
  element->set_name(*name);
  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::Attr) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  // getter
  if (args.Length() == 1)
  {
      v8::String::Utf8Value name(args[0]);
      NanReturnValue(element->get_attr(*name));
  }

  // setter
  v8::String::Utf8Value name(args[0]->ToString());
  v8::String::Utf8Value value(args[1]->ToString());
  element->set_attr(*name, *value);

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::Attrs) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  NanReturnValue(element->get_attrs());
}

NAN_METHOD(XmlElement::AddChild) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* child = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(child);

  child = element->import_element(child);

  if(child == NULL) {
      return NanThrowError("Could not add child. Failed to copy node to new Document.");
  }

  element->add_child(child);
  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::AddCData) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  v8::Local<v8::Value> contentOpt;
  if(args[0]->IsString()) {
      contentOpt = args[0];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlNode* elem = xmlNewCDataBlock(element->xml_obj->doc,
                                  (const xmlChar*)content,
                                  xmlStrlen((const xmlChar*)content));

  element->add_cdata(elem);
  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::Find) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  v8::String::Utf8Value xpath(args[0]);

  XmlXpathContext ctxt(element->xml_obj);

  if (args.Length() == 2) {
    if (args[1]->IsString()) {
      v8::String::Utf8Value uri(args[1]);
      ctxt.register_ns((const xmlChar*)"xmlns", (const xmlChar*)*uri);

    } else if (args[1]->IsObject()) {
      v8::Local<v8::Object> namespaces = args[1]->ToObject();
      v8::Local<v8::Array> properties = namespaces->GetPropertyNames();
      for (unsigned int i = 0; i < properties->Length(); i++) {
        v8::Local<v8::String> prop_name = properties->Get(
          NanNew<v8::Number>(i))->ToString();
        v8::String::Utf8Value prefix(prop_name);
        v8::String::Utf8Value uri(namespaces->Get(prop_name));
        ctxt.register_ns((const xmlChar*)*prefix, (const xmlChar*)*uri);
      }
    }
  }

  NanReturnValue(ctxt.evaluate((const xmlChar*)*xpath));
}

NAN_METHOD(XmlElement::NextElement) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  NanReturnValue(element->get_next_element());
}

NAN_METHOD(XmlElement::PrevElement) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  NanReturnValue(element->get_prev_element());
}

NAN_METHOD(XmlElement::Text) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() == 0) {
    NanReturnValue(element->get_content());
  } else {
    element->set_content(*v8::String::Utf8Value(args[0]));
  }

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlElement::Child) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() != 1 || !args[0]->IsInt32())
  {
      return NanThrowError("Bad argument: must provide #child() with a number");
  }

  const int32_t idx = args[0]->Int32Value();
  NanReturnValue(element->get_child(idx));
}

NAN_METHOD(XmlElement::ChildNodes) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args[0]->IsInt32())
      NanReturnValue(element->get_child(args[0]->Int32Value()));

  NanReturnValue(element->get_child_nodes());
}

NAN_METHOD(XmlElement::Path) {
  NanScope();
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  NanReturnValue(element->get_path());
}

NAN_METHOD(XmlElement::AddPrevSibling) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* new_sibling = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_prev_sibling(new_sibling);

  NanReturnValue(args[0]);
}

NAN_METHOD(XmlElement::AddNextSibling) {
  NanScope();
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* new_sibling = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_next_sibling(new_sibling);

  NanReturnValue(args[0]);
}

void
XmlElement::set_name(const char* name) {
  xmlNodeSetName(xml_obj, (const xmlChar*)name);
}

v8::Local<v8::Value>
XmlElement::get_name() {
    NanEscapableScope();
    if(xml_obj->name) return NanEscapeScope(NanNew<v8::String>((const char*)xml_obj->name));
    else return NanEscapeScope(NanUndefined());
}

// TODO(sprsquish) make these work with namespaces
v8::Local<v8::Value>
XmlElement::get_attr(const char* name) {
  NanEscapableScope();
  xmlAttr* attr = xmlHasProp(xml_obj, (const xmlChar*)name);

  // why do we need a reference to the element here?
  if (attr) {
      return NanEscapeScope(XmlAttribute::New(attr));
  }

  return NanEscapeScope(NanNew(NanNull()));
}

// TODO(sprsquish) make these work with namespaces
void
XmlElement::set_attr(const char* name,
                     const char* value)
{
    XmlAttribute::New(xml_obj, (const xmlChar*)name, (const xmlChar*)value);
}

v8::Local<v8::Value>
XmlElement::get_attrs() {
  NanEscapableScope();
  xmlAttr* attr = xml_obj->properties;

  if (!attr)
      return NanEscapeScope(NanNew<v8::Array>(0));

  v8::Local<v8::Array> attributes = NanNew<v8::Array>();
  v8::Local<v8::Function> push = v8::Local<v8::Function>::Cast(
    attributes->Get(NanNew<v8::String>("push")));
  v8::Local<v8::Value> argv[1];
  do {
      argv[0] = XmlAttribute::New(attr);
      push->Call(attributes, 1, argv);
  } while ((attr = attr->next));

  return NanEscapeScope(attributes);
}

void
XmlElement::add_child(XmlElement* child) {
  xmlNodePtr node = xmlAddChild(xml_obj, child->xml_obj);
  if (node != child->xml_obj)
  {
    // xmlAddChild deleted child->xml_obj by merging it with xml_obj last child
    // recreate a valid xml_obj for child to avoid any memory issue
    child->xml_obj = xmlNewDocText(xml_obj->doc, (const xmlChar*) "");
  }
}

void
XmlElement::add_cdata(xmlNode* cdata) {
  xmlAddChild(xml_obj, cdata);
}


v8::Local<v8::Value>
XmlElement::get_child(int32_t idx) {
  NanEscapableScope();
  xmlNode* child = xml_obj->children;

  int32_t i = 0;
  while (child && i < idx) {
    child = child->next;
    ++i;
  }

  if (!child)
    return NanEscapeScope(NanNew(NanNull()));

  return NanEscapeScope(XmlElement::New(child));
}

v8::Local<v8::Value>
XmlElement::get_child_nodes() {
    NanEscapableScope();

    xmlNode* child = xml_obj->children;
    if (!child)
        return NanEscapeScope(NanNew<v8::Array>(0));

    uint32_t len = 0;
    do {
        ++len;
    } while ((child = child->next));

    v8::Local<v8::Array> children = NanNew<v8::Array>(len);
    child = xml_obj->children;

    uint32_t i = 0;
    do {
        children->Set(i, XmlNode::New(child));
    } while ((child = child->next) && ++i < len);

    return NanEscapeScope(children);
}

v8::Local<v8::Value>
XmlElement::get_path() {
  xmlChar* path = xmlGetNodePath(xml_obj);
  const char* return_path = path ? reinterpret_cast<char*>(path) : "";
  int str_len = xmlStrlen((const xmlChar*)return_path);
  v8::Local<v8::String> js_obj = NanNew<v8::String>(return_path, str_len);
  xmlFree(path);
  return js_obj;
}

void
XmlElement::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Local<v8::Value>
XmlElement::get_content() {
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Local<v8::String> ret_content =
      NanNew<v8::String>((const char *)content);
    xmlFree(content);
    return ret_content;
  }

  return NanNew<v8::String>("");
}

v8::Local<v8::Value>
XmlElement::get_next_element() {
  NanEscapableScope();

  xmlNode* sibling = xml_obj->next;
  if (!sibling)
    return NanEscapeScope(NanNew(NanNull()));

  while (sibling && sibling->type != XML_ELEMENT_NODE)
    sibling = sibling->next;

  if (sibling) {
      return NanEscapeScope(XmlElement::New(sibling));
  }

  return NanEscapeScope(NanNew(NanNull()));
}

v8::Local<v8::Value>
XmlElement::get_prev_element() {
  NanEscapableScope();

  xmlNode* sibling = xml_obj->prev;
  if (!sibling)
    return NanEscapeScope(NanNew(NanNull()));

  while (sibling && sibling->type != XML_ELEMENT_NODE) {
    sibling = sibling->prev;
  }

  if (sibling) {
      return NanEscapeScope(XmlElement::New(sibling));
  }

  return NanEscapeScope(NanNew(NanNull()));
}

v8::Local<v8::Object>
XmlElement::New(xmlNode* node)
{
    if (node->_private) {
        return NanObjectWrapHandle(static_cast<XmlNode*>(node->_private));
    }

    XmlElement* element = new XmlElement(node);
    v8::Local<v8::Object> obj = NanNew(constructor_template)->GetFunction()->NewInstance();
    element->Wrap(obj);
    return obj;
}

XmlElement::XmlElement(xmlNode* node)
    : XmlNode(node)
{
}

void
XmlElement::add_prev_sibling(XmlElement* element) {
  xmlAddPrevSibling(xml_obj, element->xml_obj);
}

void
XmlElement::add_next_sibling(XmlElement* element) {
  xmlAddNextSibling(xml_obj, element->xml_obj);
}

XmlElement *
XmlElement::import_element(XmlElement *element) {

    xmlNode* new_child;

    if (xml_obj->doc == element->xml_obj->doc) {
       return element;
    } else {
        new_child = xmlDocCopyNode(element->xml_obj, xml_obj->doc, 1);
        if(new_child == NULL) {
            return NULL;
        }

        // this is like this because we cannot just create XmlElement objects
        // we have to have handles to attach them to
        // the problem with this approach tho is that the object could be reclaimed
        // what prevents v8 from garbage collecting it?
        v8::Local<v8::Object> new_elem = XmlElement::New(new_child);
        return ObjectWrap::Unwrap<XmlElement>(new_elem);
    }
}

void
XmlElement::Initialize(v8::Handle<v8::Object> target)
{
    NanScope();
    v8::Local<v8::FunctionTemplate> tmpl =
      NanNew<v8::FunctionTemplate>(New);
    NanAssignPersistent(constructor_template, tmpl);
    tmpl->Inherit(NanNew(XmlNode::constructor_template));
    tmpl->InstanceTemplate()->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "addChild",
            XmlElement::AddChild);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "addCData",
            XmlElement::AddCData);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "_attr",
            XmlElement::Attr);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "attrs",
            XmlElement::Attrs);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "child",
            XmlElement::Child);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "childNodes",
            XmlElement::ChildNodes);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "find",
            XmlElement::Find);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "nextElement",
            XmlElement::NextElement);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "prevElement",
            XmlElement::PrevElement);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "name",
            XmlElement::Name);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "path",
            XmlElement::Path);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "text",
            XmlElement::Text);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "addPrevSibling",
            XmlElement::AddPrevSibling);

    NODE_SET_PROTOTYPE_METHOD(tmpl,
            "addNextSibling",
            XmlElement::AddNextSibling);

    target->Set(NanNew<v8::String>("Element"),
            tmpl->GetFunction());
}

}  // namespace libxmljs
