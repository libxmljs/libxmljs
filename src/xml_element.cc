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
v8::Handle<v8::Value>
XmlElement::New(const v8::Arguments& args) {
  v8::HandleScope scope;

  // if we were created for an existing xml node, then we don't need
  // to create a new node on the document
  if (args.Length() == 0)
  {
      return scope.Close(args.Holder());
  }

  XmlDocument* document = ObjectWrap::Unwrap<XmlDocument>(args[0]->ToObject());
  assert(document);

  v8::String::Utf8Value name(args[1]);

  v8::Handle<v8::Value> contentOpt;
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
  args.Holder()->Set(v8::String::NewSymbol("document"), args[0]);

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::Name(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() == 0)
      return scope.Close(element->get_name());

  v8::String::Utf8Value name(args[0]->ToString());
  element->set_name(*name);
  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::Attr(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  // getter
  if (args.Length() == 1)
  {
      v8::String::Utf8Value name(args[0]);
      return scope.Close(element->get_attr(*name));
  }

  // setter
  v8::String::Utf8Value name(args[0]->ToString());
  v8::String::Utf8Value value(args[1]->ToString());
  element->set_attr(*name, *value);

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::Attrs(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  return scope.Close(element->get_attrs());
}

v8::Handle<v8::Value>
XmlElement::AddChild(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* child = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(child);

  child = element->import_element(child);

  if(child == NULL) {
      return ThrowError("Could not add child. Failed to copy node to new Document.");
  }

  element->add_child(child);
  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::AddCData(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  v8::Handle<v8::Value> contentOpt;
  if(args[0]->IsString()) {
      contentOpt = args[0];
  }
  v8::String::Utf8Value contentRaw(contentOpt);
  const char* content = (contentRaw.length()) ? *contentRaw : NULL;

  xmlNode* elem = xmlNewCDataBlock(element->xml_obj->doc,
                                  (const xmlChar*)content,
                                  xmlStrlen((const xmlChar*)content));

  element->add_cdata(elem);
  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::Find(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  v8::String::Utf8Value xpath(args[0]);

  XmlXpathContext ctxt(element->xml_obj);

  if (args.Length() == 2) {
    if (args[1]->IsString()) {
      v8::String::Utf8Value uri(args[1]);
      ctxt.register_ns((const xmlChar*)"xmlns", (const xmlChar*)*uri);

    } else if (args[1]->IsObject()) {
      v8::Handle<v8::Object> namespaces = args[1]->ToObject();
      v8::Handle<v8::Array> properties = namespaces->GetPropertyNames();
      for (unsigned int i = 0; i < properties->Length(); i++) {
        v8::Local<v8::String> prop_name = properties->Get(
          v8::Number::New(i))->ToString();
        v8::String::Utf8Value prefix(prop_name);
        v8::String::Utf8Value uri(namespaces->Get(prop_name));
        ctxt.register_ns((const xmlChar*)*prefix, (const xmlChar*)*uri);
      }
    }
  }

  return scope.Close(ctxt.evaluate((const xmlChar*)*xpath));
}

v8::Handle<v8::Value>
XmlElement::NextElement(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  return scope.Close(element->get_next_element());
}

v8::Handle<v8::Value>
XmlElement::PrevElement(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  return scope.Close(element->get_prev_element());
}

v8::Handle<v8::Value>
XmlElement::Text(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() == 0) {
    return scope.Close(element->get_content());
  } else {
    element->set_content(*v8::String::Utf8Value(args[0]));
  }

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlElement::Child(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args.Length() != 1 || !args[0]->IsInt32())
  {
      ThrowError("Bad argument: must provide #child() with a number");
  }

  const int32_t idx = args[0]->Int32Value();
  return scope.Close(element->get_child(idx));
}

v8::Handle<v8::Value>
XmlElement::ChildNodes(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  if (args[0]->IsInt32())
      return scope.Close(element->get_child(args[0]->Int32Value()));

  return scope.Close(element->get_child_nodes());
}

v8::Handle<v8::Value>
XmlElement::Path(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement *element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  return scope.Close(element->get_path());
}

v8::Handle<v8::Value>
XmlElement::AddPrevSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* new_sibling = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_prev_sibling(new_sibling);

  return scope.Close(args[0]);
}

v8::Handle<v8::Value>
XmlElement::AddNextSibling(const v8::Arguments& args) {
  v8::HandleScope scope;
  XmlElement* element = ObjectWrap::Unwrap<XmlElement>(args.Holder());
  assert(element);

  XmlElement* new_sibling = ObjectWrap::Unwrap<XmlElement>(args[0]->ToObject());
  assert(new_sibling);

  new_sibling = element->import_element(new_sibling);

  element->add_next_sibling(new_sibling);

  return scope.Close(args[0]);
}

void
XmlElement::set_name(const char* name) {
  xmlNodeSetName(xml_obj, (const xmlChar*)name);
}

v8::Handle<v8::Value>
XmlElement::get_name() {
    if(xml_obj->name) return v8::String::New((const char*)xml_obj->name);
    else return v8::Undefined();
}

// TODO(sprsquish) make these work with namespaces
v8::Handle<v8::Value>
XmlElement::get_attr(const char* name) {
  v8::HandleScope scope;
  xmlAttr* attr = xmlHasProp(xml_obj, (const xmlChar*)name);

  // why do we need a reference to the element here?
  if (attr) {
      return scope.Close(XmlAttribute::New(attr));
  }

  return v8::Null();
}

// TODO(sprsquish) make these work with namespaces
void
XmlElement::set_attr(const char* name,
                     const char* value)
{
    XmlAttribute::New(xml_obj, (const xmlChar*)name, (const xmlChar*)value);
}

v8::Handle<v8::Value>
XmlElement::get_attrs() {
  v8::HandleScope scope;
  xmlAttr* attr = xml_obj->properties;

  if (!attr)
      return scope.Close(v8::Array::New(0));

  v8::Handle<v8::Array> attributes = v8::Array::New();
  v8::Handle<v8::Function> push = v8::Handle<v8::Function>::Cast(
    attributes->Get(v8::String::NewSymbol("push")));
  v8::Handle<v8::Value> argv[1];
  do {
      argv[0] = XmlAttribute::New(attr);
      push->Call(attributes, 1, argv);
  } while ((attr = attr->next));

  return scope.Close(attributes);
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


v8::Handle<v8::Value>
XmlElement::get_child(int32_t idx) {
  v8::HandleScope scope;
  xmlNode* child = xml_obj->children;

  int32_t i = 0;
  while (child && i < idx) {
    child = child->next;
    ++i;
  }

  if (!child)
    return v8::Null();

  return scope.Close(XmlElement::New(child));
}

v8::Handle<v8::Value>
XmlElement::get_child_nodes() {
    v8::HandleScope scope;

    xmlNode* child = xml_obj->children;
    if (!child)
        return scope.Close(v8::Array::New(0));

    uint32_t len = 0;
    do {
        ++len;
    } while ((child = child->next));

    v8::Handle<v8::Array> children = v8::Array::New(len);
    child = xml_obj->children;

    uint32_t i = 0;
    do {
        children->Set(i, XmlNode::New(child));
    } while ((child = child->next) && ++i < len);

    return scope.Close(children);
}

v8::Handle<v8::Value>
XmlElement::get_path() {
  xmlChar* path = xmlGetNodePath(xml_obj);
  const char* return_path = path ? reinterpret_cast<char*>(path) : "";
  int str_len = xmlStrlen((const xmlChar*)return_path);
  v8::Handle<v8::String> js_obj = v8::String::New(return_path, str_len);
  xmlFree(path);
  return js_obj;
}

void
XmlElement::set_content(const char* content) {
  xmlChar *encoded = xmlEncodeSpecialChars(xml_obj->doc, (const xmlChar*)content);
  xmlNodeSetContent(xml_obj, encoded);
  xmlFree(encoded);
}

v8::Handle<v8::Value>
XmlElement::get_content() {
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (content) {
    v8::Handle<v8::String> ret_content =
      v8::String::New((const char *)content);
    xmlFree(content);
    return ret_content;
  }

  return v8::String::Empty();
}

v8::Handle<v8::Value>
XmlElement::get_next_element() {
  v8::HandleScope scope;

  xmlNode* sibling = xml_obj->next;
  if (!sibling)
    return v8::Null();

  while (sibling && sibling->type != XML_ELEMENT_NODE)
    sibling = sibling->next;

  if (sibling) {
      return scope.Close(XmlElement::New(sibling));
  }

  return v8::Null();
}

v8::Handle<v8::Value>
XmlElement::get_prev_element() {
  v8::HandleScope scope;

  xmlNode* sibling = xml_obj->prev;
  if (!sibling)
    return v8::Null();

  while (sibling && sibling->type != XML_ELEMENT_NODE) {
    sibling = sibling->prev;
  }

  if (sibling) {
      return scope.Close(XmlElement::New(sibling));
  }

  return v8::Null();
}

v8::Handle<v8::Object>
XmlElement::New(xmlNode* node)
{
    if (node->_private) {
        return static_cast<XmlNode*>(node->_private)->handle_;
    }

    XmlElement* element = new XmlElement(node);
    v8::Local<v8::Object> obj = constructor_template->GetFunction()->NewInstance();
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
        v8::Handle<v8::Object> new_elem = XmlElement::New(new_child);
        return ObjectWrap::Unwrap<XmlElement>(new_elem);
    }
}

void
XmlElement::Initialize(v8::Handle<v8::Object> target)
{
    v8::HandleScope scope;
    v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
    constructor_template = v8::Persistent<v8::FunctionTemplate>::New(t);
    constructor_template->Inherit(XmlNode::constructor_template);
    constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "addChild",
            XmlElement::AddChild);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "addCData",
            XmlElement::AddCData);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "_attr",
            XmlElement::Attr);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "attrs",
            XmlElement::Attrs);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "child",
            XmlElement::Child);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "childNodes",
            XmlElement::ChildNodes);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "find",
            XmlElement::Find);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "nextElement",
            XmlElement::NextElement);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "prevElement",
            XmlElement::PrevElement);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "name",
            XmlElement::Name);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "path",
            XmlElement::Path);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "text",
            XmlElement::Text);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "addPrevSibling",
            XmlElement::AddPrevSibling);

    NODE_SET_PROTOTYPE_METHOD(constructor_template,
            "addNextSibling",
            XmlElement::AddNextSibling);

    target->Set(v8::String::NewSymbol("Element"),
            constructor_template->GetFunction());
}

}  // namespace libxmljs
