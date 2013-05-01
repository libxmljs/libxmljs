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

namespace {
    using namespace v8; // node 0.4.7 fails to use v8:: in NODE_PSYMBOL
    v8::Persistent<v8::String> emit_symbol = NODE_PSYMBOL("emit");
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

v8::Handle<v8::Value>
XmlSaxParser::NewParser(const v8::Arguments& args) {
  v8::HandleScope scope;

  XmlSaxParser* parser = new XmlSaxParser();
  parser->Wrap(args.Holder());

  return scope.Close(args.Holder());
}

v8::Handle<v8::Value>
XmlSaxParser::NewPushParser(const v8::Arguments& args) {
  v8::HandleScope scope;

  v8::Handle<v8::Value> return_val = NewParser(args);

  XmlSaxParser *parser = ObjectWrap::Unwrap<XmlSaxParser>(args.Holder());
  parser->initialize_push_parser();

  return scope.Close(return_val);
}

void
XmlSaxParser::Callback(const char* what,
                       int argc,
                       v8::Handle<v8::Value> argv[]) {
    v8::HandleScope scope;

    // new arguments array with first argument being the event name
    v8::Handle<v8::Value>* args = new v8::Handle<v8::Value>[argc+1];
    args[0] = v8::String::New(what);
    for (int i = 1; i <= argc; ++i)
    {
        args[i] = argv[i-1];
    }

    // get the 'emit' function from ourselves
    v8::Local<v8::Value> emit_v = this->handle_->Get(emit_symbol);
    assert(emit_v->IsFunction());
    v8::Local<v8::Function> emit = v8::Local<v8::Function>::Cast(emit_v);

    v8::TryCatch try_catch;

    // trigger the event
    emit->Call(this->handle_, argc + 1, args);

    if (try_catch.HasCaught())
    {
        node::FatalException(try_catch);
    }

    delete[] args;
}

v8::Handle<v8::Value>
XmlSaxParser::Push(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = ObjectWrap::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());

  bool terminate = args.Length() > 1 ? args[1]->ToBoolean()->Value() : false;

  parser->push(*parsable, parsable.length(), terminate);

  return scope.Close(v8::Boolean::New(true));
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

v8::Handle<v8::Value>
XmlSaxParser::ParseString(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = ObjectWrap::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());
  parser->parse_string(*parsable, parsable.length());

  // TODO(sprsquish): return based on the parser
  return scope.Close(v8::Boolean::New(true));
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
  v8::HandleScope scope;
  libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

  const int argc = 5;
  const xmlChar *nsPref, *nsUri, *attrLocal, *attrPref, *attrUri, *attrVal;
  int i, j;

  v8::Local<v8::Array> elem;

  // Initialize argv with localname, prefix, and uri
  v8::Handle<v8::Value> argv[argc] = {
    v8::String::New((const char*)localname)
  };

  // Build attributes list
  // Each attribute is an array of [localname, prefix, URI, value, end]
  v8::Local<v8::Array> attrList = v8::Array::New(nb_attributes);
  if (attributes) {
    for (i = 0, j = 0; j < nb_attributes; i += 5, j++) {
      attrLocal = attributes[i+0];
      attrPref  = attributes[i+1];
      attrUri   = attributes[i+2];
      attrVal   = attributes[i+3];

      elem = v8::Array::New(4);

      elem->Set(v8::Integer::New(0),
                v8::String::New((const char*)attrLocal, xmlStrlen(attrLocal)));

      elem->Set(v8::Integer::New(1),
                v8::String::New((const char*)attrPref, xmlStrlen(attrPref)));

      elem->Set(v8::Integer::New(2),
                v8::String::New((const char*)attrUri, xmlStrlen(attrUri)));

      elem->Set(v8::Integer::New(3),
                v8::String::New((const char*)attrVal, attributes[i+4]-attrVal));

      attrList->Set(v8::Integer::New(j), elem);
    }
  }
  argv[1] = attrList;

  argv[2] = prefix ? v8::String::New((const char*)prefix) : v8::Null();
  argv[3] = uri ? v8::String::New((const char*)uri) : v8::Null();

  // Build namespace array of arrays [[prefix, ns], [prefix, ns]]
  v8::Local<v8::Array> nsList = v8::Array::New(nb_namespaces);
  if (namespaces) {
    for (i = 0, j = 0; j < nb_namespaces; j++) {
      nsPref = namespaces[i++];
      nsUri  = namespaces[i++];

      elem = v8::Array::New(2);
      elem->Set(v8::Integer::New(0),
                xmlStrlen(nsPref) == 0 ? v8::Null() :
                v8::String::New((const char *)nsPref, xmlStrlen(nsPref)));

      elem->Set(v8::Integer::New(1),
                v8::String::New((const char *)nsUri,
                xmlStrlen(nsUri)));

      nsList->Set(v8::Integer::New(j), elem);
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
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    v8::Handle<v8::Value> argv[3] = {
        v8::String::New((const char*)localname),
        prefix ? v8::String::New((const char*)prefix) : v8::Null(),
        uri ? v8::String::New((const char*)uri) : v8::Null()
    };

    parser->Callback("endElementNS", 3, argv);
}

void
XmlSaxParser::characters(void* context,
                         const xmlChar* ch,
                         int len)
{
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)ch, len) };
    parser->Callback("characters", 1, argv);
}

void
XmlSaxParser::comment(void* context, const xmlChar* value)
{
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)value) };
    parser->Callback("comment", 1, argv);
}

void
XmlSaxParser::cdata_block(void* context, const xmlChar* value,
                          int len)
{
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
    v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)value, len) };
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
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    char* message;

    va_list args;
    va_start(args, msg);
    if (vasprintf(&message, msg, args) >= 0)
    {
        v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)message) };
        parser->Callback("warning", 1, argv);
    }

    va_end(args);
    free(message);
}

void
XmlSaxParser::error(void* context, const char* msg, ...)
{
    v8::HandleScope scope;
    libxmljs::XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

    char* message;

    va_list args;
    va_start(args, msg);
    if (vasprintf(&message, msg, args) >= 0)
    {
        v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)message) };
        parser->Callback("error", 1, argv);
    }

    va_end(args);
    free(message);
}

void
XmlSaxParser::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  // SAX Parser
  v8::Local<v8::FunctionTemplate> parser_t =
    v8::FunctionTemplate::New(NewParser);

  v8::Persistent<v8::FunctionTemplate> sax_parser_template =
    v8::Persistent<v8::FunctionTemplate>::New(parser_t);

  sax_parser_template->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(sax_parser_template,
                        "parseString",
                        XmlSaxParser::ParseString);

  target->Set(v8::String::NewSymbol("SaxParser"),
              sax_parser_template->GetFunction());

  v8::Local<v8::FunctionTemplate> push_parser_t =
    v8::FunctionTemplate::New(NewPushParser);

  // Push Parser
  v8::Persistent<v8::FunctionTemplate> sax_push_parser_template =
    v8::Persistent<v8::FunctionTemplate>::New(push_parser_t);

  sax_push_parser_template->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(sax_push_parser_template,
                        "push",
                        XmlSaxParser::Push);

  target->Set(v8::String::NewSymbol("SaxPushParser"),
              sax_push_parser_template->GetFunction());
}
}  // namespace libxmljs
