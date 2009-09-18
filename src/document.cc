#include "document.h"
#include "node.h"
#include "element.h"

#include <cstring> // for memcpy

using namespace v8;
using namespace libxmljs;

Handle<Value>
Document::GetProperty(
  Local<String> property,
  const AccessorInfo& info)
{
  HandleScope scope;
  UNWRAP_DOCUMENT(info.This());
  
  if (property == VERSION_SYMBOL)
    return document->get_version();

  else if (property == DOCUMENT_SYMBOL)
    return info.This();

  return Undefined();
}

Handle<Value>
Document::Encoding(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_DOCUMENT(args.This());

  if (args.Length() == 0)
    return document->get_encoding();

  String::Utf8Value encoding(args[0]->ToString());
  document->set_encoding(*encoding);
  return args.This();
}

Handle<Value>
Document::Root(
  const Arguments& args)
{
  HandleScope scope;
  UNWRAP_DOCUMENT(args.This());

  if (args.Length() == 0)
    return document->get_root();

  if (document->has_root())
    return ThrowException(Exception::Error(String::New("This document already has a root node")));

  Element *element = ObjectWrap::Unwrap<Element>(args[0]->ToObject());
  assert(element);
  document->set_root(element->node);
  return args[0];
}

Handle<Value>
Document::New(
 const Arguments& args)
{
  HandleScope scope;

  Handle<Function> callback;
  String::Utf8Value *version = NULL, *encoding = NULL;

  switch (args.Length()) {
    case 0: // newDocument()
      break;

    case 1: // newDocument(version), newDocument(callback)
      if (args[0]->IsString()) {
        version = new String::Utf8Value(args[0]->ToString());

      } else if (args[0]->IsFunction()) {
        callback = Handle<Function>::Cast(args[0]);

      } else {
        LIBXMLJS_THROW_EXCEPTION("Bad argument: newDocument([version]) or newDocument([callback])");

      }
      break;

    case 2: // newDocument(version, encoding), newDocument(version, callback)
      if (args[0]->IsString() && args[1]->IsString()) {
        version = new String::Utf8Value(args[0]->ToString());
        encoding = new String::Utf8Value(args[1]->ToString());

      } else if (args[0]->IsString() && args[1]->IsFunction()) {
        version = new String::Utf8Value(args[0]->ToString());
        callback = Handle<Function>::Cast(args[1]);

      } else {
        LIBXMLJS_THROW_EXCEPTION("Bad argument: newDocument([version], [encoding]) or newDocument([version], [callback])");

      }
      break;

    default: // newDocument(version, encoding, callback)
      if (args[0]->IsString() && args[1]->IsString() && args[2]->IsFunction()) {
        version = new String::Utf8Value(args[0]->ToString());
        encoding = new String::Utf8Value(args[1]->ToString());
        callback = Handle<Function>::Cast(args[2]);

      } else {
        LIBXMLJS_THROW_EXCEPTION("Bad argument: newDocument([version], [encoding], [callback])");

      }
      break;
  }

  Document *document = version ? new Document(**version) : new Document();
  document->doc->_private = *args.This();
  document->Wrap(args.This());

  if (encoding)
    document->set_encoding(**encoding);

  if (*callback && !callback->IsNull()) {
    Handle<Value> argv[1] = { args.This() };
    *callback->Call(args.This(), 1, argv);
  }

  return args.This();
}

Handle<Value>
Document::ToString(
  const Arguments& args)
{
  HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(args.This());
  assert(document);

  char * str;
  int length;
  document->to_string(&str, &length);
  Local<String> doc_str = String::New(str, length);
  delete str;

  return doc_str;
}

Document::Document()
{
  init_document("1.0");
}

Document::Document(
  const char * version)
{
  init_document(version);
}

Document::~Document()
{
  xmlFreeDoc(doc);
}

void
Document::init_document(
  const char * version)
{
  doc = xmlNewDoc((const xmlChar*)version);
  doc->_private = this;
}

void
Document::set_encoding(
  const char * encoding)
{
  doc->encoding = (const xmlChar*)encoding;
}

Handle<Value>
Document::get_encoding()
{
  if(doc->encoding)
    return String::New((const char *)doc->encoding, xmlStrlen((const xmlChar*)doc->encoding));

  return Null();
}

Handle<Value>
Document::get_version()
{
  if(doc->version)
    return String::New((const char *)doc->version, xmlStrlen((const xmlChar*)doc->version));

  return Null();
}

void
Document::to_string(
  char ** str,
  int * length)
{
  xmlChar* buffer = 0;

  xmlDocDumpFormatMemoryEnc(doc, &buffer, length, "UTF-8", 0);

  *str = new char[*length+1];
  memcpy(*str, (char *)buffer, *length);

  xmlFree(buffer);
}

bool
Document::has_root()
{
  return xmlDocGetRootElement(doc) != NULL;
}

Handle<Value>
Document::get_root()
{
  xmlNodePtr root = xmlDocGetRootElement(doc);
  if (root)
    return Persistent<Object>((Object*)root->_private);
  else
    return Null();
}

void
Document::set_root(
  xmlNodePtr node)
{
  xmlDocSetRootElement(doc, node);
}

void
Document::Initialize (Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Persistent<FunctionTemplate> doc_template = Persistent<FunctionTemplate>::New(t);
  doc_template->InstanceTemplate()->SetInternalFieldCount(1);

  LIBXMLJS_SET_PROTOTYPE_METHOD(doc_template, "root", Document::Root);
  LIBXMLJS_SET_PROTOTYPE_METHOD(doc_template, "encoding", Document::Encoding);

  doc_template->PrototypeTemplate()->SetAccessor(DOCUMENT_SYMBOL, Document::GetProperty);
  doc_template->PrototypeTemplate()->SetAccessor(VERSION_SYMBOL, Document::GetProperty);

  LIBXMLJS_SET_PROTOTYPE_METHOD(doc_template, "toString", Document::ToString);

  target->Set(String::NewSymbol("Document"), doc_template->GetFunction());

  Node::Initialize(target);
}
