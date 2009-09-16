#include "document.h"

using namespace v8;
using namespace libxmljs;

Handle<Value>
Document::SetRoot(
  const Arguments& args)
{
  return args.This();
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
  document->Wrap(args.This());

  if (encoding)
    document->set_encoding(**encoding);

  if (*callback && !callback->IsNull()) {
    Handle<Value> argv[1] = { args.This() };
    *callback->Call(args.This(), 1, argv);
  }

  return args.This();
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
  xmlFreeDoc(doc_);
}

void
Document::init_document(
  const char * version)
{
  doc_ = xmlNewDoc((const xmlChar*)version);
  doc_->_private = this;
}

void
Document::set_encoding(
  const char * encoding)
{
  doc_->encoding = (const xmlChar*)encoding;
}

const char *
Document::get_encoding()
{
  assert(doc_);

  const char * encoding = NULL;
  if(doc_->encoding)
    encoding = (const char*)doc_->encoding;
    
  return encoding;
}

const char *
Document::get_version()
{
  assert(doc_);

  const char * version = NULL;
  if(doc_->version)
    version = (const char*)doc_->version;
    
  return version;  
}

void
Document::Initialize (Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Persistent<FunctionTemplate> doc_template = Persistent<FunctionTemplate>::New(t);
  doc_template->InstanceTemplate()->SetInternalFieldCount(1);
  LIBXMLJS_SET_PROTOTYPE_METHOD(doc_template, "root", Document::SetRoot);
  doc_template->PrototypeTemplate()->SetAccessor(ENCODING_SYMBOL, GetProperty, SetEncoding);
  doc_template->PrototypeTemplate()->SetAccessor(VERSION_SYMBOL, GetProperty);
  target->Set(String::NewSymbol("newDocument"), doc_template->GetFunction());
}
