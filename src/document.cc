#include "document.h"
#include "node.h"
#include "element.h"

#include <cstring> // for memcpy

using namespace v8;
using namespace libxmljs;

void
Document::SetRoot(
  Local<String> property,
  Local<Value> value,
  const AccessorInfo& info)
{
  HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(info.This());
  assert(document);
  assert(property == ROOT_SYMBOL);

  Element *element = ObjectWrap::Unwrap<Element>(value->ToObject());
  assert(element);
  assert(element->node);
  document->set_root(element->node);
}

Handle<Value>
Document::GetRoot(
  Local<String> property,
  const AccessorInfo& info)
{
  HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(info.This());
  assert(document);
  assert(property == ROOT_SYMBOL);

  xmlNodePtr root = document->get_root();
  if (root) {
    return Persistent<Object>((Object*)root->_private);
  } else {
    return Null();
  }
}

Handle<Value>
Document::GetProperty(
  Local<String> property,
  const AccessorInfo& info)
{
  HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(info.This());
  assert(document);
  
  const char * value = NULL;

  if (property == VERSION_SYMBOL) {
    value = document->get_version();

  } else if (property == ENCODING_SYMBOL) {
    value = document->get_encoding();

  } else if (property == DOCUMENT_SYMBOL) {
    return info.This();

  } else {
    assert("Should not get here!");
    return ThrowException(Exception::Error(String::New("Should not get here!")));

  }

  return String::New(value, xmlStrlen((const xmlChar*)value));
}

void
Document::SetEncoding(
  Local<String> property,
  Local<Value> value,
  const AccessorInfo& info)
{
  HandleScope scope;
  Document *document = ObjectWrap::Unwrap<Document>(info.This());
  assert(document);
  assert(property == ENCODING_SYMBOL);

  String::Utf8Value encoding(value->ToString());
  document->set_encoding(*encoding);
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

const char *
Document::get_encoding()
{
  assert(doc);

  const char * encoding = NULL;
  if(doc->encoding)
    encoding = (const char*)doc->encoding;
    
  return encoding;
}

const char *
Document::get_version()
{
  assert(doc);

  const char * version = NULL;
  if(doc->version)
    version = (const char*)doc->version;
    
  return version;  
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

xmlNodePtr
Document::get_root()
{
  return xmlDocGetRootElement(doc);
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

  doc_template->PrototypeTemplate()->SetAccessor(ENCODING_SYMBOL, Document::GetProperty, Document::SetEncoding);
  doc_template->PrototypeTemplate()->SetAccessor(VERSION_SYMBOL, Document::GetProperty);
  doc_template->PrototypeTemplate()->SetAccessor(DOCUMENT_SYMBOL, Document::GetProperty);
  doc_template->PrototypeTemplate()->SetAccessor(ROOT_SYMBOL, Document::GetRoot, Document::SetRoot);

  LIBXMLJS_SET_PROTOTYPE_METHOD(doc_template, "toString", Document::ToString);

  target->Set(String::NewSymbol("Document"), doc_template->GetFunction());

  Node::Initialize(target);
}
