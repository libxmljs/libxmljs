#include "element.h"
#include "document.h"

using namespace v8;
using namespace libxmljs;

// doc, name, attrs, content, callback
Handle<Value>
Element::New(
  const Arguments& args)
{
  HandleScope scope;

  Document *document = ObjectWrap::Unwrap<Document>(args[0]->ToObject());
  String::Utf8Value name(args[1]);

  String::Utf8Value *content = NULL;
  Handle<Function> callback;

  if (args[3]->IsString())
    content = new String::Utf8Value(args[3]->ToString());

  if (args[4]->IsFunction())
    callback = Handle<Function>::Cast(args[4]);

  xmlNode* elem = xmlNewDocNode(document->get_document(), NULL, (const xmlChar*)*name, content?(const xmlChar*)**content:NULL);
  Element *element = new Element(elem);
  elem->_private = *Persistent<Object>::New(args.This());
  element->Wrap(args.This());

  if (args[2]->IsObject()) {
    Handle<Object> attributes = args[2]->ToObject();
    Handle<Array> props = attributes->GetPropertyNames();
    for (unsigned int i = 0; i < props->Length(); i++) {
      String::Utf8Value name(props->Get(Number::New(i)));
      String::Utf8Value value(attributes->Get(props->Get(Number::New(i))));
      element->set_attr(*name, *value);
    }
  }

  args.This()->Set(DOCUMENT_SYMBOL, args[0]->ToObject());

  if (*callback && !callback->IsNull()) {
    Handle<Value> argv[1] = { args.This() };
    *callback->Call(args.This(), 1, argv);
  }

  return args.This();
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

Element::Element(
  xmlNode* node)
: Node(node)
{}

Element::~Element()
{}

void
Element::set_name(
  const char * name)
{
  xmlNodeSetName(node, (const xmlChar*)name);
}

Handle<Value>
Element::get_name()
{
  return String::New((const char*)node->name);
}

// TODO make these work with namespaces
Handle<Value>
Element::get_attr(
  const char * name)
{
  xmlAttr* attr = xmlHasProp(node, (const xmlChar*)name);
  if (attr) {
    xmlChar * attr = xmlGetNsProp(node, (const xmlChar*)name, NULL);
    Handle<String> ret_attr = String::New((const char*)attr);
    xmlFree(attr);
    return ret_attr;
  }

  return Null();
}

// TODO make these work with namespaces
void
Element::set_attr(
  const char * name,
  const char * value)
{
  xmlSetProp(node, (const xmlChar*)name, (const xmlChar*)value);
}

void
Element::add_child(
  Element * child)
{
  xmlAddChild(node, child->node);
}

void
Element::set_content(
  const char * content)
{
  xmlNodeSetContent(node, (const xmlChar*)content);
}

Handle<Value>
Element::get_content()
{
  xmlChar* content = xmlNodeGetContent(node);
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
  xmlXPathContext* ctxt = xmlXPathNewContext(node->doc);
  ctxt->node = node;
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
    nodes->Set(Number::New(i), Persistent<Object>((Object*)result->nodesetval->nodeTab[i]->_private));

  xmlXPathFreeObject(result);
  xmlXPathFreeContext(ctxt);

  return nodes;
}

void
Element::Initialize(
  Handle<Object> target)
{
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Persistent<FunctionTemplate> elem_template = Persistent<FunctionTemplate>::New(t);
  elem_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "name", Element::Name);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "attr", Element::Attr);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "addChild", Element::AddChild);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "find", Element::Find);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "text", Element::Text);

  target->Set(String::NewSymbol("Element"), elem_template->GetFunction());
  
}

