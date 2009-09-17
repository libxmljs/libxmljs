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
Element::GetProperty(
  Local<String> property,
  const AccessorInfo& info)
{
  HandleScope scope;
  UNWRAP_ELEMENT(info.This());

  const char * value = NULL;

  if (property == NAME_SYMBOL) {
    value = element->get_name();
  }

  return String::New(value, xmlStrlen((const xmlChar*)value));
}

void
Element::SetProperty(
  Local<String> property,
  Local<Value> value,
  const AccessorInfo& info)
{
  HandleScope scope;
  UNWRAP_ELEMENT(info.This());

  if (property == NAME_SYMBOL) {
    String::Utf8Value name(value);
    element->set_name(*name);
  }
}

Handle<Value>
Element::GetAttribute(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  String::Utf8Value name(args[0]);
  const char * value = element->get_attr(*name);
  if (value)
    return String::New(value);
  else
    return Null();
}

Handle<Value>
Element::SetAttribute(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_ELEMENT(args.This());

  String::Utf8Value name(args[0]);
  String::Utf8Value value(args[1]);
  element->set_attr(*name, *value);

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

const char *
Element::get_name()
{
  return (const char*)node->name;
}

// TODO make these work with namespaces
const char *
Element::get_attr(
  const char * name)
{
  xmlAttr* attr = xmlHasProp(node, (const xmlChar*)name);
  if (attr)
    return (const char*)xmlGetNsProp(node, (const xmlChar*)name, NULL);
  else
    return NULL;
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
Element::Initialize(
  Handle<Object> target)
{
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Persistent<FunctionTemplate> elem_template = Persistent<FunctionTemplate>::New(t);
  elem_template->InstanceTemplate()->SetInternalFieldCount(1);

  elem_template->PrototypeTemplate()->SetAccessor(NAME_SYMBOL, GetProperty, SetProperty);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "getAttribute", Element::GetAttribute);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "setAttribute", Element::SetAttribute);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "addChild", Element::AddChild);
  LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "find", Element::Find);
  // LIBXMLJS_SET_PROTOTYPE_METHOD(elem_template, "getAttributes", GetAttributes);

  target->Set(String::NewSymbol("Element"), elem_template->GetFunction());
  
}

