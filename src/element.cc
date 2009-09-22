#include "element.h"
#include "document.h"
#include "attribute.h"

#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>

using namespace v8;
using namespace libxmljs;

#define UNWRAP_ELEMENT(from)                              \
  Element *element = ObjectWrap::Unwrap<Element>(from);   \
  assert(element);

#define NAME_SYMBOL     String::NewSymbol("name")
#define CONTENT_SYMBOL  String::NewSymbol("content")

Persistent<FunctionTemplate> Element::constructor_template;

// doc, name, attrs, content, callback
Handle<Value>
Element::New(
  const Arguments& args)
{
  HandleScope scope;
  if (args.Length() == 0 || args[0]->IsNull()) // was created by the libxml callback
    return args.This();

  Document *document = ObjectWrap::Unwrap<Document>(args[0]->ToObject());
  String::Utf8Value name(args[1]);

  String::Utf8Value *content = NULL;
  Handle<Function> callback;

  if (args[3]->IsString())
    content = new String::Utf8Value(args[3]->ToString());

  if (args[4]->IsFunction())
    callback = Handle<Function>::Cast(args[4]);

  xmlNode* elem = xmlNewDocNode(document->xml_obj, NULL, (const xmlChar*)*name, content?(const xmlChar*)**content:NULL);
  Persistent<Object> obj = XmlObj::Unwrap(elem);
  Element *element = ObjectWrap::Unwrap<Element>(obj);

  if (args[2]->IsObject()) {
    Handle<Object> attributes = args[2]->ToObject();
    Handle<Array> props = attributes->GetPropertyNames();
    for (unsigned int i = 0; i < props->Length(); i++) {
      String::Utf8Value name(props->Get(Number::New(i)));
      String::Utf8Value value(attributes->Get(props->Get(Number::New(i))));
      element->set_attr(*name, *value);
    }
  }

  obj->Set(DOCUMENT_SYMBOL, args[0]->ToObject());

  if (*callback && !callback->IsNull()) {
    Handle<Value> argv[1] = { obj };
    *callback->Call(obj, 1, argv);
  }

  return obj;
}

Handle<Value>
Element::Name(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  if (args.Length() == 0)
    return element->get_name();

  String::Utf8Value name(args[0]->ToString());
  element->set_name(*name);
  return args.This();
}

Handle<Value>
Element::Attr(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  Handle<Object> attrs;

  switch (args.Length()) {
    case 0: // return all attributes
      break;

    case 1:
      if (args[0]->IsString()) {
        String::Utf8Value name(args[0]);
        return element->get_attr(*name);

      } else {
        attrs = args[0]->ToObject();

      }
      break;

    default:
      attrs = Object::New();
      attrs->Set(args[0]->ToString(), args[1]->ToString());
  }

  Handle<Array> properties = attrs->GetPropertyNames();
  for (unsigned int i = 0; i < properties->Length(); i++) {
    Local<String> prop_name = properties->Get(Number::New(i))->ToString();
    String::Utf8Value name(prop_name);
    String::Utf8Value value(attrs->Get(prop_name));
    element->set_attr(*name, *value);
  }

  return args.This();
}

Handle<Value>
Element::AddChild(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  Element *child = ObjectWrap::Unwrap<Element>(args[0]->ToObject());
  assert(child);

  element->add_child(child);
  return args.This();
}

Handle<Value>
Element::Find(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  String::Utf8Value xpath(args[0]);
  return element->find(*xpath);
}

Handle<Value>
Element::Text(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  if (args.Length() == 0) {
    return element->get_content();

  } else {
    element->set_content(*String::Utf8Value(args[0]));
  }

  return args.This();
}

Handle<Value>
Element::Child(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  double idx = 1;

  if (args.Length() > 0) {
    if (!args[0]->IsNumber()) {
      LIBXMLJS_THROW_EXCEPTION("Bad argument: must provide #child() with a number");

    } else {
      idx = args[0]->ToNumber()->Value();
    }
  }

  return element->get_child(idx);
}

Handle<Value>
Element::Children(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  return element->get_children();
}

Handle<Value>
Element::Path(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  return element->get_path();
}

void
Element::set_name(
  const char * name)
{
  xmlNodeSetName(xml_obj, (const xmlChar*)name);
}

Handle<Value>
Element::get_name()
{
  return String::New((const char*)xml_obj->name);
}

// TODO make these work with namespaces
Handle<Value>
Element::get_attr(
  const char * name)
{
  xmlAttr* attr = xmlHasProp(xml_obj, (const xmlChar*)name);
  if (attr)
    return XmlObj::Unwrap(attr);

  return Null();
}

// TODO make these work with namespaces
void
Element::set_attr(
  const char * name,
  const char * value)
{
  HandleScope scope;
  Handle<Value> argv[3] = { XmlObj::Unwrap(xml_obj), String::New(name), String::New(value) };
  Persistent<Object>::New(Attribute::constructor_template->GetFunction()->NewInstance(3, argv));
}

void
Element::add_child(
  Element * child)
{
  xmlAddChild(xml_obj, child->xml_obj);
}

Handle<Value>
Element::get_child(
  double idx)
{
  double i = 1;
  xmlNode * child = xml_obj->children;

  while (child && i < idx) {
    child = child->next;
    i++;
  }

  if (!child)
    return Null();
  
  return XmlObj::Unwrap(child);
}

Handle<Value>
Element::get_children()
{
  xmlNode * child = xml_obj->children;
  xmlNodeSetPtr set = xmlXPathNodeSetCreate(child);

  if(!child)
    return Array::New();

  do {
    xmlXPathNodeSetAdd(set, child);
  } while((child = child->next));

  Handle<Array> children = Array::New(set->nodeNr);
  for (int i = 0; i < set->nodeNr; ++i)
    children->Set(Number::New(i), XmlObj::Unwrap(set->nodeTab[i]));

  return children;
}

Handle<Value>
Element::get_path()
{
  xmlChar* path = xmlGetNodePath(xml_obj);
  const char * return_path = path ? (char*)path : "";
  Handle<String> js_obj = String::New(return_path, xmlStrlen((const xmlChar*)return_path));
  xmlFree(path);
  return js_obj;
}

void
Element::set_content(
  const char * content)
{
  xmlNodeSetContent(xml_obj, (const xmlChar*)content);
}

Handle<Value>
Element::get_content()
{
  xmlChar* content = xmlNodeGetContent(xml_obj);
  if (*content != 0) {
    Handle<String> ret_content = String::New((const char *)content);
    xmlFree(content);
    return ret_content;
  }

  return Null();
}

Handle<Value>
Element::find(
  const char * xpath)
{
  xmlXPathContext* ctxt = xmlXPathNewContext(xml_obj->doc);
  ctxt->node = xml_obj;
  xmlXPathObject* result = xmlXPathEval((const xmlChar*)xpath, ctxt);

  if(!result) {
    xmlXPathFreeContext(ctxt);
    return Array::New(0);
  }

  if(result->type != XPATH_NODESET) {
    xmlXPathFreeObject(result);
    xmlXPathFreeContext(ctxt);
    return Array::New(0);
  }

  Handle<Array> nodes = Array::New(result->nodesetval->nodeNr);
  for (int i = 0; i != result->nodesetval->nodeNr; ++i)
    nodes->Set(Number::New(i), XmlObj::Unwrap(result->nodesetval->nodeTab[i]));

  xmlXPathFreeObject(result);
  xmlXPathFreeContext(ctxt);

  return nodes;
}

void
Element::Initialize(
  Handle<Object> target)
{
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  constructor_template = Persistent<FunctionTemplate>::New(t);
  constructor_template->Inherit(Node::constructor_template);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "name", Element::Name);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "attr", Element::Attr);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "find", Element::Find);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "text", Element::Text);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "child", Element::Child);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "children", Element::Children);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "path", Element::Path);
  LIBXMLJS_SET_PROTOTYPE_METHOD(constructor_template, "addChild", Element::AddChild);

  target->Set(String::NewSymbol("Element"), constructor_template->GetFunction());
}
