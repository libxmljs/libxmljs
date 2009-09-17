#include "element.h"
#include "document.h"
#include <iostream>
using namespace v8;
using namespace libxmljs;

Handle<Value>
Element::New(
  const Arguments& args)
{
  HandleScope scope;

  Document *document = ObjectWrap::Unwrap<Document>(args[0]->ToObject());
  String::Utf8Value name(args[1]);

  String::Utf8Value *content = NULL;
  Handle<Function> callback;

  if (args[2]->IsObject())  
    Handle<Object> attributes = args[2]->ToObject();

  if (args[3]->IsString())
    content = new String::Utf8Value(args[3]);

  if (args[4]->IsFunction())
    callback = Handle<Function>::Cast(args[4]);

  xmlNode* elem = xmlNewDocNode(document->get_document(), NULL, (const xmlChar*)*name, (const xmlChar*)content);
  Element *element = new Element(elem);
  element->Wrap(args.This());

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
  Element *element = ObjectWrap::Unwrap<Element>(info.This());
  assert(element);

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
  Element *element = ObjectWrap::Unwrap<Element>(info.This());
  assert(element);

  if (property == NAME_SYMBOL) {
    String::Utf8Value name(value);
    element->set_name(*name);
  }
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
  xmlNodeSetName(node_, (const xmlChar*)name);
}

const char *
Element::get_name()
{
  return (const char*)node_->name;
}

void
Element::Initialize(
  Handle<Object> target)
{
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Persistent<FunctionTemplate> elem_template = Persistent<FunctionTemplate>::New(t);
  elem_template->InstanceTemplate()->SetInternalFieldCount(1);

  elem_template->PrototypeTemplate()->SetAccessor(NAME_SYMBOL, GetProperty, SetProperty);
  // doc_template->PrototypeTemplate()->SetAccessor(VERSION_SYMBOL, GetProperty);
  // doc_template->PrototypeTemplate()->SetAccessor(DOCUMENT_SYMBOL, GetProperty);

  target->Set(String::NewSymbol("Element"), elem_template->GetFunction());
  
}

