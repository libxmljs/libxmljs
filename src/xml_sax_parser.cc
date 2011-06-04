// Copyright 2009, Squish Tech, LLC.
#include "xml_sax_parser.h"

namespace libxmljs {

  XmlSaxParser::XmlSaxParser() : sax_handler_(new xmlSAXHandler), context_(NULL) {

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
    SaxParserCallback::start_document,  // startDocument;
    SaxParserCallback::end_document,  // endDocument;
    0,  // startElement;
    0,  // endElement;
    0,  // reference;
    SaxParserCallback::characters,  // characters;
    0,  // ignorableWhitespace;
    0,  // processingInstruction;
    SaxParserCallback::comment,  // comment;
    SaxParserCallback::warning,  // warning;
    SaxParserCallback::error,  // error;
    0,  // fatalError; /* unused error() get all the errors */
    0,  // getParameterEntity;
    SaxParserCallback::cdata_block,  // cdataBlock;
    0,  // externalSubset;
    XML_SAX2_MAGIC, /* force SAX2 */
    this,  /* _private */
    SaxParserCallback::start_element_ns,  // startElementNs;
    SaxParserCallback::end_element_ns,  // endElementNs;
    0  // SaxParserCallback::structured_error // serror
  };
  *sax_handler_ = tmp;
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

  XmlSaxParser *parser = new XmlSaxParser();
  parser->Wrap(args.This());

  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsFunction,
                               "Bad argument: function required");
  parser->SetCallbacks(args.This(), v8::Local<v8::Function>::Cast(args[0]));

  return scope.Close(args.This());
}

v8::Handle<v8::Value>
XmlSaxParser::NewPushParser(const v8::Arguments& args) {
  v8::HandleScope scope;

  v8::Handle<v8::Value> return_val = NewParser(args);

  XmlSaxParser *parser = LibXmlObj::Unwrap<XmlSaxParser>(args.Holder());
  parser->initialize_push_parser();

  return scope.Close(return_val);
}

void
XmlSaxParser::SetCallbacks(v8::Handle<v8::Object> self,
                           const v8::Handle<v8::Function> callbacks) {
  v8::HandleScope scope;

  v8::Handle<v8::Function> set_callbacks = v8::Handle<v8::Function>::Cast(
    self->Get(v8::String::NewSymbol("setCallbacks")));

  v8::Handle<v8::Value> argv[1] = { callbacks };
  callbacks_ = v8::Persistent<v8::Object>::New(
    set_callbacks->Call(self, 1, argv)->ToObject());
}

void
XmlSaxParser::Callback(const char* what) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[0];
  Callback(what, 0, argv);
}

void
XmlSaxParser::Callback(const char* what,
                       int argc,
                       v8::Handle<v8::Value> argv[]) {
  v8::HandleScope scope;

  v8::Handle<v8::Function> callback = v8::Handle<v8::Function>::Cast(
    callbacks_->Get(v8::String::New("callback")));
  assert(callback->IsFunction());

  v8::Handle<v8::Value> args[argc+1];
  args[0] = v8::String::New(what);
  for (int i = 1; i <= argc; i++) {
    args[i] = argv[i-1];
  }

  v8::Handle<v8::Object> global = v8::Context::GetCurrent()->Global();
  callback->Call(global, argc+1, args);
}

v8::Handle<v8::Value>
XmlSaxParser::Push(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = LibXmlObj::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());

  bool terminate = args.Length() > 1 ? args[1]->ToBoolean()->Value() : false;

  parser->push(*parsable, parsable.length(), terminate);

  return scope.Close(v8::Boolean::New(true));
}

void
XmlSaxParser::initialize_push_parser() {
  context_ = xmlCreatePushParserCtxt(sax_handler_, NULL, NULL, 0, "");
  context_->replaceEntities = 1;
  initializeContext();
}

void
XmlSaxParser::push(const char* str,
                   unsigned int size,
                   bool terminate = false) {
  int e = xmlParseChunk(context_, str, size, terminate);
}

v8::Handle<v8::Value>
XmlSaxParser::ParseString(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseString requires a string");

  XmlSaxParser *parser = LibXmlObj::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());
  parser->parse_string(*parsable, parsable.length());

  // TODO(sprsquish): return based on the parser
  return scope.Close(v8::Boolean::New(true));
}

void
XmlSaxParser::parse_string(const char* str,
                           unsigned int size) {
  context_ = xmlCreateMemoryParserCtxt(str, size);
  parse();
  context_->sax = NULL;
  releaseContext();
}

v8::Handle<v8::Value>
XmlSaxParser::ParseFile(const v8::Arguments& args) {
  v8::HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0],
                               IsString,
                               "Bad Argument: parseFile requires a filename");

  XmlSaxParser *parser = LibXmlObj::Unwrap<XmlSaxParser>(args.Holder());

  v8::String::Utf8Value parsable(args[0]->ToString());
  parser->parse_file(*parsable);

  // TODO(sprsquish): return based on the parser
  return scope.Close(v8::Boolean::New(true));
}

void
XmlSaxParser::parse_file(const char* filename) {
  context_ = xmlCreateFileParserCtxt(filename);
  parse();
  context_->sax = NULL;
  releaseContext();
}

void
XmlSaxParser::parse() {
  initializeContext();
  context_->replaceEntities = 1;
  context_->sax = sax_handler_;
  int e = xmlParseDocument(context_);
}

void
XmlSaxParser::start_document() {
  Callback("startDocument");
}

void
XmlSaxParser::end_document() {
  Callback("endDocument");
}

void
XmlSaxParser::start_element_ns(const xmlChar* localname,
                               const xmlChar* prefix,
                               const xmlChar* uri,
                               int nb_namespaces,
                               const xmlChar** namespaces,
                               int nb_attributes,
                               int nb_defaulted,
                               const xmlChar** attributes) {
  v8::HandleScope scope;

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

  Callback("startElementNS", argc, argv);
}

void
XmlSaxParser::end_element_ns(const xmlChar* localname,
                             const xmlChar* prefix,
                             const xmlChar* uri) {
  v8::HandleScope scope;

  v8::Handle<v8::Value> argv[3] = {
    v8::String::New((const char*)localname),
    prefix ? v8::String::New((const char*)prefix) : v8::Null(),
    uri ? v8::String::New((const char*)uri) : v8::Null()
  };

  Callback("endElementNS", 3, argv);
}

void
XmlSaxParser::characters(const xmlChar* ch,
                         int len) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)ch, len) };
  Callback("characters", 1, argv);
}

void
XmlSaxParser::comment(const xmlChar* value) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)value) };
  Callback("comment", 1, argv);
}

void
XmlSaxParser::cdata_block(const xmlChar* value,
                          int len) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)value, len) };
  Callback("cdata", 1, argv);
}

void
XmlSaxParser::warning(const char* message) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)message) };
  Callback("warning", 1, argv);
}


void
XmlSaxParser::error(const char* message) {
  v8::HandleScope scope;
  v8::Handle<v8::Value> argv[1] = { v8::String::New((const char*)message) };
  Callback("error", 1, argv);
}


// TODO(sprsquish)
// void
// XmlSaxParser::structured_error(
//   xmlErrorPtr xerror)
// {
// }


void
SaxParserCallback::start_document(void* context) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->start_document();
}

void
SaxParserCallback::end_document(void* context) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->end_document();
}

void
SaxParserCallback::start_element_ns(void* context,
                                    const xmlChar* localname,
                                    const xmlChar* prefix,
                                    const xmlChar* uri,
                                    int nb_namespaces,
                                    const xmlChar** namespaces,
                                    int nb_attributes,
                                    int nb_defaulted,
                                    const xmlChar** attributes) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->start_element_ns(localname,
                           prefix,
                           uri,
                           nb_namespaces,
                           namespaces,
                           nb_attributes,
                           nb_defaulted,
                           attributes);
}

void
SaxParserCallback::end_element_ns(void* context,
                                  const xmlChar* localname,
                                  const xmlChar* prefix,
                                  const xmlChar* uri) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->end_element_ns(localname, prefix, uri);
}

void
SaxParserCallback::characters(void* context,
                              const xmlChar* ch,
                              int len) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->characters(ch, len);
}

void
SaxParserCallback::comment(void* context,
                           const xmlChar* value) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->comment(value);
}

void
SaxParserCallback::cdata_block(void* context,
                               const xmlChar* value,
                               int len) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);
  parser->cdata_block(value, len);
}

void
SaxParserCallback::warning(void* context,
                           const char* msg,
                           ...) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

  char* message;

  va_list args;
  va_start(args, msg);
  vasprintf(&message, msg, args);
  va_end(args);

  parser->warning(message);

  free(message);
}

void
SaxParserCallback::error(void* context,
                         const char* msg,
                         ...) {
  XmlSaxParser* parser = LXJS_GET_PARSER_FROM_CONTEXT(context);

  char* message;

  va_list args;
  va_start(args, msg);
  vasprintf(&message, msg, args);
  va_end(args);

  parser->error(message);

  free(message);
}

// TODO(sprsquish)
// void
// SaxParserCallback::structured_error(
//   void *ctx,
//   xmlErrorPtr xerror)
// {
// }

void
XmlSaxParser::Initialize(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  // SAX Parser
  v8::Local<v8::FunctionTemplate> parser_t =
    v8::FunctionTemplate::New(NewParser);

  v8::Persistent<v8::FunctionTemplate> sax_parser_template =
    v8::Persistent<v8::FunctionTemplate>::New(parser_t);

  sax_parser_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(sax_parser_template,
                        "parseString",
                        XmlSaxParser::ParseString);

  LXJS_SET_PROTO_METHOD(sax_parser_template,
                        "parseFile",
                        XmlSaxParser::ParseFile);

  target->Set(v8::String::NewSymbol("SaxParser"),
              sax_parser_template->GetFunction());


  v8::Local<v8::FunctionTemplate> push_parser_t =
    v8::FunctionTemplate::New(NewPushParser);

  // Push Parser
  v8::Persistent<v8::FunctionTemplate> sax_push_parser_template =
    v8::Persistent<v8::FunctionTemplate>::New(push_parser_t);

  sax_push_parser_template->InstanceTemplate()->SetInternalFieldCount(1);

  LXJS_SET_PROTO_METHOD(sax_push_parser_template,
                        "push",
                        XmlSaxParser::Push);

  target->Set(v8::String::NewSymbol("SaxPushParser"),
              sax_push_parser_template->GetFunction());
}
}  // namespace libxmljs
