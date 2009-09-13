#include "sax_parser.h"

using namespace v8;
using namespace libxmljs;

SaxParser::SaxParser()
: sax_handler_( new _xmlSAXHandler )
{
  xmlSAXHandler tmp = {
    0, // internalSubset;
    0, // isStandalone;
    0, // hasInternalSubset;
    0, // hasExternalSubset;
    0, // resolveEntity;
    0, // getEntity;
    0, // entityDecl;
    0, // notationDecl;
    0, // attributeDecl;
    0, // elementDecl;
    0, // unparsedEntityDecl;
    0, // setDocumentLocator;
    SaxParserCallback::start_document, // startDocument;
    SaxParserCallback::end_document, // endDocument;
    0, // startElement;
    0, // endElement;
    0, // reference;
    SaxParserCallback::characters, // characters;
    0, // ignorableWhitespace;
    0, // processingInstruction;
    SaxParserCallback::comment, // comment;
    SaxParserCallback::warning, // warning;
    SaxParserCallback::error, // error;
    0, // fatalError; /* unused error() get all the errors */
    0, // getParameterEntity;
    SaxParserCallback::cdata_block, // cdataBlock;
    0, // externalSubset;
    XML_SAX2_MAGIC, /* force SAX2 */
    this, /* _private */
    SaxParserCallback::start_element_ns, // startElementNs;
    SaxParserCallback::end_element_ns, // endElementNs;
    0 //SaxParserCallback::structured_error // serror
  };
  *sax_handler_ = tmp;
}

Handle<Value>
SaxParser::NewParser(
  const Arguments& args)
{
  HandleScope scope;

  SaxParser *parser = new SaxParser();
  parser->Wrap(args.This());

  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0], IsFunction, "Bad argument: createSAXParser takes a function");
  parser->SetCallbacks(Local<Function>::Cast(args[0]));

  return args.This();
}

Handle<Value>
SaxParser::NewPushParser(
  const Arguments& args)
{
  HandleScope scope;

  Handle<Value> return_val = NewParser(args);

  SaxParser *parser = ObjectWrap::Unwrap<SaxParser>(args.Holder());
  parser->initialize_push_parser();

  return return_val;
}

void
SaxParser::SetCallbacks(
  const Handle<Function> callbacks)
{
  HandleScope scope;

  Handle<Object> global = Context::GetCurrent()->Global();
  Handle<Value> cb_obj = global->Get(String::NewSymbol("LibXMLSaxCallbacks"));

  if (!cb_obj->IsFunction()) {
    Local<Value> exception = Exception::TypeError(String::New("LibXMLSaxCallbacks"));
    ThrowException(exception);
  }

  Handle<Object> cb_fun = Handle<Function>::Cast(cb_obj)->NewInstance();
  callbacks_ = Persistent<Object>::New(cb_fun);

  Handle<Value> argv[1] = { callbacks_ };
  callbacks->Call(global, 1, argv);
}

void
SaxParser::Callback(
  const char * what)
{
  HandleScope scope;
  Handle<Value> argv[0];
  Callback(what, 0, argv);
}

void
SaxParser::Callback(
  const char * what,
  int argc,
  Handle<Value> argv[])
{
  HandleScope scope;

  Handle<Function> callback = Handle<Function>::Cast(callbacks_->Get(String::New("callback")));
  assert(callback->IsFunction());

  Handle<Value> args[argc+1];
  args[0] = String::New(what);
  for (int i = 1; i <= argc; i++) {
    args[i] = argv[i-1];
  }

  Handle<Object> global = Context::GetCurrent()->Global();
  callback->Call(global, argc+1, args);
}

Handle<Value>
SaxParser::Push(
 const Arguments& args)
{
  HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0], IsString, "Bad Argument: parseString requires a string");

  SaxParser *parser = ObjectWrap::Unwrap<SaxParser>(args.Holder());

  String::Utf8Value parsable(args[0]->ToString());

  bool terminate = args.Length() > 1 ? args[1]->ToBoolean()->Value() : false;

  parser->push(*parsable, parsable.length(), terminate);

  return Boolean::New(true);
}

void
SaxParser::initialize_push_parser()
{
  context_ = xmlCreatePushParserCtxt(sax_handler_, NULL, NULL, 0, "");
  initializeContext();
}

void
SaxParser::push(
  const char* string,
  unsigned int size,
  bool terminate = false)
{
  xmlParseChunk(context_, string, size, terminate);
}

Handle<Value>
SaxParser::ParseString(
 const Arguments& args)
{
  HandleScope scope;
  LIBXMLJS_ARGUMENT_TYPE_CHECK(args[0], IsString, "Bad Argument: parseString requires a string");

  SaxParser *parser = ObjectWrap::Unwrap<SaxParser>(args.Holder());

  String::Utf8Value parsable(args[0]->ToString());
  parser->parse_string(*parsable, parsable.length());

  return Boolean::New(true);
}

void
SaxParser::parse_string(
  const char* string,
  unsigned int size)
{
  context_ = xmlCreateMemoryParserCtxt(string, size);
  parse();
  xmlFreeParserCtxt(context_);
}

void
SaxParser::parse()
{
  initializeContext();
  context_->sax = sax_handler_;
  xmlParseDocument(context_);
}

void
SaxParser::start_document()
{
  Callback("startDocument");
}

void
SaxParser::end_document()
{
  Callback("endDocument");
}

void
SaxParser::start_element_ns(
  const xmlChar * localname,
  const xmlChar * prefix,
  const xmlChar * uri,
  int nb_namespaces,
  const xmlChar ** namespaces,
  int nb_attributes,
  int nb_defaulted,
  const xmlChar ** attributes)
{
  HandleScope scope;

  const int argc = 5;
  const char *ns_pref, *ns_uri;
  const xmlChar *nsPref, *nsUri, *attrLocal, *attrPref, *attrUri, *attrVal;
  int i, j;

  Local<Array> elem;

  // Initialize argv with localname, prefix, and uri
  Handle<Value> argv[argc] = {
    String::New((const char*)localname),
  };

  // Build attributes list
  // Each attribute is an array of [localname, prefix, URI, value, end]
  Local<Array> attrList = Array::New(nb_attributes);
  if (attributes) {
    for (i = 0, j = 0; j < nb_attributes; i += 5, j++) {
      attrLocal = attributes[i+0];
      attrPref  = attributes[i+1];
      attrUri   = attributes[i+2];
      attrVal   = attributes[i+3];

      elem = Array::New(4);
      elem->Set(Integer::New(0), String::New((const char*)attrLocal, xmlStrlen(attrLocal)));
      elem->Set(Integer::New(1), String::New((const char*)attrPref, xmlStrlen(attrPref)));
      elem->Set(Integer::New(2), String::New((const char*)attrUri, xmlStrlen(attrUri)));
      elem->Set(Integer::New(3), String::New((const char*)attrVal, attributes[i+4]-attrVal));

      attrList->Set(Integer::New(j), elem);
    }
  }
  argv[1] = attrList;

  argv[2] = prefix ? String::New((const char*)prefix) : Null();
  argv[3] = uri ? String::New((const char*)uri) : Null();

  // Build namespace array of arrays [[prefix, ns], [prefix, ns]]
  Local<Array> nsList = Array::New(nb_namespaces);
  if (namespaces) {
    for (i = 0, j = 0; j < nb_namespaces; j++) {
      nsPref = namespaces[i++];
      nsUri  = namespaces[i++];

      elem = Array::New(2);
      elem->Set(Integer::New(0), xmlStrlen(nsPref) == 0 ? Null() : String::New((const char *)nsPref, xmlStrlen(nsPref)));
      elem->Set(Integer::New(1), String::New((const char *)nsUri, xmlStrlen(nsUri)));

      nsList->Set(Integer::New(j), elem);
    }
  }
  argv[4] = nsList;

  Callback("startElementNS", argc, argv);
}

void
SaxParser::end_element_ns (
  const xmlChar * localname,
  const xmlChar * prefix,
  const xmlChar * uri)
{
  HandleScope scope;

  Handle<Value> argv[3] = {
    String::New((const char*)localname),
    prefix ? String::New((const char*)prefix) : Null(),
    uri ? String::New((const char*)uri) : Null()
  };

  Callback("endElementNS", 3, argv);
}

void
SaxParser::characters(
  const xmlChar* ch,
  int len)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New((const char*)ch, len) };
  Callback("characters", 1, argv);
}

void
SaxParser::comment(
  const xmlChar* value)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New((const char*)value) };
  Callback("comment", 1, argv);
}

void
SaxParser::cdata_block(
  const xmlChar* value,
  int len)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New((const char*)value, len) };
  Callback("cdata", 1, argv);
}

void
SaxParser::warning(
  const char* message)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New((const char*)message) };
  Callback("warning", 1, argv);
}


void
SaxParser::error(
  const char* message)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New((const char*)message) };
  Callback("error", 1, argv);
}


void
SaxParser::structured_error(
  xmlErrorPtr xerror)
{
  //TODO
}


void
SaxParserCallback::start_document(
  void* context)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->start_document();
}

void
SaxParserCallback::end_document(
  void* context)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->end_document();
}

void
SaxParserCallback::start_element_ns(
  void * context,
  const xmlChar * localname,
  const xmlChar * prefix,
  const xmlChar * uri,
  int nb_namespaces,
  const xmlChar ** namespaces,
  int nb_attributes,
  int nb_defaulted,
  const xmlChar ** attributes)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->start_element_ns(localname, prefix, uri, nb_namespaces, namespaces, nb_attributes, nb_defaulted, attributes);
}

void
SaxParserCallback::end_element_ns (
  void * context,
  const xmlChar * localname,
  const xmlChar * prefix,
  const xmlChar * uri)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->end_element_ns(localname, prefix, uri);
}

void
SaxParserCallback::characters(
  void* context,
  const xmlChar* ch,
  int len)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->characters(ch, len);
}

void
SaxParserCallback::comment(
  void* context,
  const xmlChar* value)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->comment(value);
}

void
SaxParserCallback::cdata_block(
  void* context,
  const xmlChar* value,
  int len)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);
  parser->cdata_block(value, len);
}

void
SaxParserCallback::warning(
  void* context,
  const char* msg,
  ...)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);

  char * message;

  va_list args;
  va_start(args, msg);
  vasprintf(&message, msg, args);
  va_end(args);

  parser->warning(message);

  free(message);
}

void
SaxParserCallback::error(
  void* context,
  const char* msg,
  ...)
{
  SaxParser* parser = LIBXML_JS_GET_PARSER_FROM_CONTEXT(context);

  char * message;

  va_list args;
  va_start(args, msg);
  vasprintf(&message, msg, args);
  va_end(args);

  parser->error(message);

  free(message);
}

void
SaxParserCallback::structured_error(
  void *ctx,
  xmlErrorPtr xerror)
{
  // TODO
}

void
SaxParser::Initialize (Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> parser_t = FunctionTemplate::New(NewParser);
  Persistent<FunctionTemplate> sax_parser_template = Persistent<FunctionTemplate>::New(parser_t);
  sax_parser_template->InstanceTemplate()->SetInternalFieldCount(1);
  LIBXMLJS_SET_PROTOTYPE_METHOD(sax_parser_template, "parseString", SaxParser::ParseString);
  target->Set(String::NewSymbol("createSAXParser"), sax_parser_template->GetFunction());


  Local<FunctionTemplate> push_parser_t = FunctionTemplate::New(NewPushParser);
  Persistent<FunctionTemplate> sax_push_parser_template = Persistent<FunctionTemplate>::New(push_parser_t);
  sax_push_parser_template->InstanceTemplate()->SetInternalFieldCount(1);
  LIBXMLJS_SET_PROTOTYPE_METHOD(sax_push_parser_template, "push", SaxParser::Push);
  target->Set(String::NewSymbol("createSAXPushParser"), sax_push_parser_template->GetFunction());
}
