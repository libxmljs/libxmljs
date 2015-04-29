// Copyright 2009, Squish Tech, LLC.

#include <node.h>

#include <libxml/parserInternals.h>

#include "libxmljs.h"

#include "xml_sax_parser.h"

libxmljs::XmlSaxParser* LXJS_GET_PARSER_FROM_CONTEXT(void *context)
{
    _xmlParserCtxt* the_context = static_cast<_xmlParserCtxt*>(context);
    return static_cast<libxmljs::XmlSaxParser*>(the_context->_private);
}

#define EMIT_SYMBOL_STRING "emit"

namespace {
    using namespace v8; // node 0.4.7 fails to use v8:: in NODE_PSYMBOL
    v8::Persistent<v8::String> emit_symbol;
}

namespace libxmljs {

XmlSaxParser::XmlSaxParser()
    : context_(NULL)
{
    xmlSAXHandler tmp = {
        0,  // internalSubset;
        0,  // isStandalone;
        0,  // hasInternalSubset;
        0,  // hasExternalSubset;
        0,  // resolveEntity;
        0,  // getEntity;
        0,  // entityDecl;
        0,  // notationDecl;
        0,  // attributeDecl;
        0,  // elementDecl;
        0,  // unparsedEntityDecl;
        0,  // setDocumentLocator;
        XmlSaxParser::start_document,
        XmlSaxParser::end_document,  // endDocument;
        0,  // startElement;
        0,  // endElement;
        0,  // reference;
        XmlSaxParser::characters,  // characters;
        0,  // ignorableWhitespace;
        0,  // processingInstruction;
        XmlSaxParser::comment,  // comment;
        XmlSaxParser::warning,  // warning;
        XmlSaxParser::error,  // error;
        0,  // fatalError; /* unused error() get all the errors */
        0,  // getParameterEntity;
        XmlSaxParser::cdata_block,  // cdataBlock;
        0,  // externalSubset;
        XML_SAX2_MAGIC, /* force SAX2 */
        this,  /* _private */
        XmlSaxParser::start_element_ns,  // startElementNs;
        XmlSaxParser::end_element_ns,  // endElementNs;
        0  // SaxParserCallback::structured_error // serror
    };

    sax_handler_ = tmp;
}

XmlSaxParser::~XmlSaxParser() {
  this->releaseContext();
}

void
XmlSaxParser::initializeContext() {
  assert(context_);
  context_->validate = 0;
  context_->_private = this;
}

void
XmlSaxParser::releaseContext() {
  if (context_) {
    context_->_private = 0;
    if (context_->myDoc != NULL)
    {
      xmlFreeDoc(context_->myDoc);
      context_->myDoc = NULL;
    }

    xmlFreeParserCtxt(context_);
    context_ = 0;
  }
}


NAN_METHOD(XmlSaxParser::NewParser) {
  NanScope();
  XmlSaxParser* parser = new XmlSaxParser();
  parser->Wrap(args.Holder());

  NanReturnValue(args.Holder());
}

NAN_METHOD(XmlSaxParser::NewPushParser) {
  NanScope();
  XmlSaxParser* parser = new XmlSaxParser();
  parser->initialize_push_parser();
  parser->Wrap(args.Holder());

  NanReturnValue(args.Holder());
}

void
XmlSaxParser::Callback(const char* what,
                       int argc,
                       v8::Local<v8::Value> argv[]) {
    NanScope();

    // new arguments array with first argument being the event name
    v8::Local<v8::Value>* args = new v8::Local<v8::Value>[argc+1];
    args[0] = NanNew<v8::String>(what);
    for (int i = 1; i <= argc; ++i)
    {
        args[i] = argv[i-1];
    }

    // get the 'emit' function from ourselves
    v8::Local<v8::Value> emit_v = NanObjectWrapHandle(this)->Get(NanNew(emit_symbol));
    assert(emit_v->IsFunction());

    // trigger the event
    NanMakeCallback(NanObjectWrapHandle(this), v8::Local<v8::Function>::Cast(emit_v), argc + 1, args);

    delete[] args;
}

NAN_METHOD(XmlSaxParser::Push) {
  NanScope();
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = ObjectWrap::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());

  bool terminate = args.Length() > 1 ? args[1]->ToBoolean()->Value() : false;

  parser->push(*parsable, parsable.length(), terminate);

  NanReturnValue(NanTrue());
}

void
XmlSaxParser::initialize_push_parser() {
  context_ = xmlCreatePushParserCtxt(&sax_handler_, NULL, NULL, 0, "");
  context_->replaceEntities = 1;
  initializeContext();
}

void
XmlSaxParser::push(const char* str,
                   unsigned int size,
                   bool terminate = false) {
  xmlParseChunk(context_, str, size, terminate);
}

NAN_METHOD(XmlSaxParser::ParseString) {
  NanScope();
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = ObjectWrap::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());
  parser->parse_string(*parsable, parsable.length());

  // TODO(sprsquish): return based on the parser
  NanReturnValue(NanTrue());
}

void
XmlSaxParser::parse_string(const char* str,
                           unsigned int size) {
  context_ = xmlCreateMemoryParserCtxt(str, size);
  initializeContext();
  context_->replaceEntities = 1;
  xmlSAXHandler* old_sax = context_->sax;
  context_->sax = &sax_handler_;
  xmlParseDocument(context_);
  context_->sax = old_sax;
  releaseContext();
}

void
XmlSaxParser::start_document(void* context)
{
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    parser->Callback("startDocument");
}

void
XmlSaxParser::end_document(void* context)
{
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    parser->Callback("endDocument");
}

void
XmlSaxParser::start_element_ns(void* context,
                               const xmlChar* localname,
                               const xmlChar* prefix,
                               const xmlChar* uri,
                               int nb_namespaces,
                               const xmlChar** namespaces,
                               int nb_attributes,
                               int nb_defaulted,
                               const xmlChar** attributes) {
  NanScope();
  libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

  const int argc = 5;
  const xmlChar *nsPref, *nsUri, *attrLocal, *attrPref, *attrUri, *attrVal;
  int i, j;

  v8::Local<v8::Array> elem;

  // Initialize argv with localname, prefix, and uri
  v8::Local<v8::Value> argv[argc] = {
    NanNew<v8::String>((const char*)localname)
  };

  // Build attributes list
  // Each attribute is an array of [localname, prefix, URI, value, end]
  v8::Local<v8::Array> attrList = NanNew<v8::Array>(nb_attributes);
  if (attributes) {
    for (i = 0, j = 0; j < nb_attributes; i += 5, j++) {
      attrLocal = attributes[i+0];
      attrPref  = attributes[i+1];
      attrUri   = attributes[i+2];
      attrVal   = attributes[i+3];

      elem = NanNew<v8::Array>(4);

      elem->Set(NanNew<v8::Integer>(0),
                NanNew<v8::String>((const char*)attrLocal, xmlStrlen(attrLocal)));

      elem->Set(NanNew<v8::Integer>(1),
                NanNew<v8::String>((const char*)attrPref, xmlStrlen(attrPref)));

      elem->Set(NanNew<v8::Integer>(2),
                NanNew<v8::String>((const char*)attrUri, xmlStrlen(attrUri)));

      elem->Set(NanNew<v8::Integer>(3),
                NanNew<v8::String>((const char*)attrVal, attributes[i+4]-attrVal));

      attrList->Set(NanNew<v8::Integer>(j), elem);
    }
  }
  argv[1] = attrList;

  if (prefix) {
    argv[2] = NanNew<v8::String>((const char*)prefix);
  } else {
    argv[2] = NanNull();
  }

  if (uri) {
    argv[3] = NanNew<v8::String>((const char*)uri);
  } else {
    argv[3] = NanNull();
  }

  // Build namespace array of arrays [[prefix, ns], [prefix, ns]]
  v8::Local<v8::Array> nsList = NanNew<v8::Array>(nb_namespaces);
  if (namespaces) {
    for (i = 0, j = 0; j < nb_namespaces; j++) {
      nsPref = namespaces[i++];
      nsUri  = namespaces[i++];

      elem = NanNew<v8::Array>(2);
      if (xmlStrlen(nsPref) == 0) {
        elem->Set(NanNew<v8::Integer>(0), NanNull());
      } else {
        elem->Set(NanNew<v8::Integer>(0), NanNew<v8::String>((const char *)nsPref, xmlStrlen(nsPref)));
      }

      elem->Set(NanNew<v8::Integer>(1),
                NanNew<v8::String>((const char *)nsUri,
                xmlStrlen(nsUri)));

      nsList->Set(NanNew<v8::Integer>(j), elem);
    }
  }
  argv[4] = nsList;

  parser->Callback("startElementNS", argc, argv);
}

void
XmlSaxParser::end_element_ns(void* context,
        const xmlChar* localname,
        const xmlChar* prefix,
        const xmlChar* uri)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    v8::Local<v8::Value> argv[3];
    argv[0] = NanNew<v8::String>((const char*)localname);

    if (prefix) {
        argv[1] = NanNew<v8::String>((const char*)prefix);
    } else {
        argv[1] = NanNull();
    }

    if (uri) {
        argv[2] = NanNew<v8::String>((const char*)uri);
    } else {
        argv[2] = NanNull();
    }

    parser->Callback("endElementNS", 3, argv);
}

void
XmlSaxParser::characters(void* context,
                         const xmlChar* ch,
                         int len)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    v8::Local<v8::Value> argv[1] = { NanNew<v8::String>((const char*)ch, len) };
    parser->Callback("characters", 1, argv);
}

void
XmlSaxParser::comment(void* context, const xmlChar* value)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    v8::Local<v8::Value> argv[1] = { NanNew<v8::String>((const char*)value) };
    parser->Callback("comment", 1, argv);
}

void
XmlSaxParser::cdata_block(void* context, const xmlChar* value,
                          int len)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    v8::Local<v8::Value> argv[1] = { NanNew<v8::String>((const char*)value, len) };
    parser->Callback("cdata", 1, argv);
}

#ifdef WIN32
//https://github.com/json-c/json-c/blob/master/printbuf.c
//Copyright (c) 2004, 2005 Metaparadigm Pte Ltd
static int vasprintf(char **buf, const char *fmt, va_list ap)
{
    int chars;
    char *b;

    if(!buf) {
        return -1;
    }

    chars = _vscprintf(fmt, ap)+1;

    b = (char*)malloc(sizeof(char)*chars);
    if(!b) {
        return -1;
    }

    if((chars = vsprintf(b, fmt, ap)) < 0)
    {
        free(b);
    } else {
        *buf = b;
    }

    return chars;
}
#endif /* WIN32 */

void
XmlSaxParser::warning(void* context, const char* msg, ...)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    char* message;

    va_list args;
    va_start(args, msg);
    if (vasprintf(&message, msg, args) >= 0)
    {
        v8::Local<v8::Value> argv[1] = { NanNew<v8::String>((const char*)message) };
        parser->Callback("warning", 1, argv);
    }

    va_end(args);
    free(message);
}

void
XmlSaxParser::error(void* context, const char* msg, ...)
{
    NanScope();
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    char* message;

    va_list args;
    va_start(args, msg);
    if (vasprintf(&message, msg, args) >= 0)
    {
        v8::Local<v8::Value> argv[1] = { NanNew<v8::String>((const char*)message) };
        parser->Callback("error", 1, argv);
    }

    va_end(args);
    free(message);
}

void
XmlSaxParser::Initialize(v8::Handle<v8::Object> target) {
  NanScope();

  NanAssignPersistent(emit_symbol, NanNew<v8::String>(EMIT_SYMBOL_STRING));


  // SAX Parser
  v8::Local<v8::FunctionTemplate> parser_t =
    NanNew<v8::FunctionTemplate>(NewParser);

  v8::Persistent<v8::FunctionTemplate> sax_parser_template;
  NanAssignPersistent(sax_parser_template, parser_t);

  parser_t->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(parser_t,
                        "parseString",
                        XmlSaxParser::ParseString);

  target->Set(NanNew<v8::String>("SaxParser"),
              parser_t->GetFunction());

  v8::Local<v8::FunctionTemplate> push_parser_t =
    NanNew<v8::FunctionTemplate>(NewPushParser);

  // Push Parser
  v8::Persistent<v8::FunctionTemplate> sax_push_parser_template;
  NanAssignPersistent(sax_push_parser_template, push_parser_t);

  push_parser_t->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(push_parser_t,
                        "push",
                        XmlSaxParser::Push);

  target->Set(NanNew<v8::String>("SaxPushParser"),
              push_parser_t->GetFunction());
}
}  // namespace libxmljs
