#ifndef __sax_parser_h__
#define __sax_parser_h__

#include "libxmljs.h"
#include "parser.h"

#include <v8.h>
#include <memory>

#include <libxml/parser.h>
#include <libxml/parserInternals.h> // for xmlCreateFileParserCtxt

namespace libxmljs {

#define LIBXML_JS_GET_PARSER_FROM_CONTEXT(context) \
  ({ \
    _xmlParserCtxt* the_context = static_cast<_xmlParserCtxt*>(context); \
    static_cast<SaxParser*>(the_context->_private); \
  })

static v8::Handle<v8::Value>
CreateSAXParser(
  const v8::Arguments& args);


class SaxParser : public Parser {
public:
  SaxParser();

  static void
  Initialize (
    v8::Handle<v8::Object> target);

  static v8::Handle<v8::Value>
  NewParser(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  NewPushParser(
    const v8::Arguments& args);

  // Coming Soon
  // virtual void parseFile(const char* filename);
  static v8::Handle<v8::Value>
  ParseString(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  Push(
    const v8::Arguments& args);

  void
  SetCallbacks(
    const v8::Handle<v8::Function> callbacks);

  void
  Callback(
    const char * what);

  void
  Callback(
    const char * what,
    int argc,
    v8::Handle<v8::Value> argv[]);

  void
  parse_string(
    const char* string,
    unsigned int size);

  void
  initialize_push_parser();

  void
  push(
    const char* string,
    unsigned int size,
    bool terminate);

  void
  start_document();

  void
  end_document();

  void
  start_element(
    const xmlChar* name,
    const xmlChar** p);

  void
  end_element(
    const xmlChar* name);

  void
  start_element_ns(
    const xmlChar * localname,
    const xmlChar * prefix,
    const xmlChar * uri,
    int nb_namespaces,
    const xmlChar ** namespaces,
    int nb_attributes,
    int nb_defaulted,
    const xmlChar ** attributes);

  void
  end_element_ns (
    const xmlChar * localname,
    const xmlChar * prefix,
    const xmlChar * uri);

  void
  characters(
    const xmlChar* ch,
    int len);

  void
  comment(
    const xmlChar* value);

  void
  cdata_block(
    const xmlChar* value,
    int len);

  void
  warning(
    const char* message);

  void
  error(
    const char* message);

  void
  structured_error(
    xmlErrorPtr xerror);

protected:
  v8::Persistent<v8::Object> callbacks_;
  _xmlSAXHandler * sax_handler_;

private:
  friend struct SaxParserCallback;
  void parse();
};

struct SaxParserCallback
{
  static void
  start_document(
    void* context);

  static void
  end_document(
    void* context);

  static void
  start_element_ns(
    void * context,
    const xmlChar * localname,
    const xmlChar * prefix,
    const xmlChar * uri,
    int nb_namespaces,
    const xmlChar ** namespaces,
    int nb_attributes,
    int nb_defaulted,
    const xmlChar ** attributes);

  static void
  end_element_ns (
    void * context,
    const xmlChar * localname,
    const xmlChar * prefix,
    const xmlChar * uri);

  static void
  characters(
    void* context,
    const xmlChar* ch,
    int len);

  static void
  comment(
    void* context,
    const xmlChar* value);

  static void
  cdata_block(
    void* context,
    const xmlChar* value,
    int len);

  static void
  warning(
    void* context,
    const char* fmt,
    ...);

  static void
  error(
    void* context,
    const char* fmt,
    ...);

  static void
  structured_error(
    void *ctx,
    xmlErrorPtr xerror);
};

} // namespace libxmljs

#endif //__sax_parser_h__
