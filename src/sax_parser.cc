#include <libxml_js.h>

SaxParser::SaxParser()
  : sax_handler_( new _xmlSAXHandler )
{
  xmlSAXHandler temp = {
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
    SaxParserCallback::cdata_block cdataBlock;
    0, // externalSubset;
    XML_SAX2_MAGIC, /* force SAX2 */
    0, /* _private */
    SaxParserCallback::start_element_ns, // startElementNs;
    SaxParserCallback::end_element_ns, // endElementNs;
    SaxParserCallback::structured_error serror
  };
  *sax_handler_ = temp;
}

void
SaxParser::Initialize (Handle<Object> target)
{
  HandleScope scope;
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
  int argc
  Handle<Value> argv[])
{
  HandleScope scope;
  
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

  int i;
  int j;
  Handle<Value> elem;

  // Initialize argv with localname, prefix, and uri
  Handle<Value> argv[5] = {
    String::New(localname),
    prefix ? String::New(prefix) : Value::New(),
    uri ? String::New(uri) : Value::New()
  };

  // Build namespace array of arrays [[prefix, ns], [prefix, ns]]
  Handle<Value> nsList = Array::New(nb_namespaces);
  if (namespaces) {
    for (i = 0, j = 0; i < nb_namespaces * 2; i += 2, j++) {
      elem = Array::New(2);
      elem->Set(0, String::New(namespaces[i+0]));
      elem->Set(1, String::New(namespaces[i+1]));
      nsList->Set(j, elem);
    }
  }

  // Build attributes list
  // Each attribute is an array of [localname, prefix, URI, value, end]
  Handle<Value> attrList = Array::New(nb_attributes);
  if (attributes) {
    for (i = 0, j = 0; i < nb_attributes; i += 5, j++) {
      elem = Array::New(4);
      elem->Set(0, String::New(attributes[i+0]));
      elem->Set(1, String::New(attributes[i+1]));
      elem->Set(2, String::New(attributes[i+2]));
      elem->Set(3, String::New(attributes[i+3], attributes[i+4] - attributes[i+3]));
      attrList->Set(j, elem);
    }
  }

  Callback("startElementNS", 5, argv);
}

void
SaxParser::end_element_ns (
  const xmlChar * localname,
  const xmlChar * prefix,
  const xmlChar * uri)
{
  HandleScope scope;

  Handle<Value> argv[3] = {
    String::New(localname),
    prefix ? String::New(prefix) : Value::New(),
    uri ? String::New(uri) : Value::New()
  };

  Callback("endElementNS", 3, argv);
}

void
SaxParser::characters(
  const xmlChar* ch,
  int len)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New(ch) };
  Callback("characters", 1, argv);
}

void
SaxParser::comment(
  const xmlChar* value)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New(value) };
  Callback("characters", 1, argv);
}

void
SaxParser::cdata_block(
  const xmlChar* value,
  int len)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New(value) };
  Callback("characters", 1, argv);
}
  
void 
SaxParser::warning(
  const char* message)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New(message) };
  Callback("characters", 1, argv);
}


void
SaxParser::error(
  const char* message)
{
  HandleScope scope;
  Handle<Value> argv[1] = { String::New(message) };
  Callback("characters", 1, argv);
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
  parser->start_element_ns(localname, prefix, uri, nb_namespaces, namespaces, nb_attributes, bn_defaulted, attributes);
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