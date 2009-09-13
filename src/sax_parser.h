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

class SaxParser : public Parser {
public:
  static void Initialize (v8::Handle<v8::Object> target);

  SaxParser(v8::Handle<v8::Object> callbacks);
  virtual ~SaxParser();

  void Callback(
    const char * what);

  void Callback(
    const char * what,
    int argc,
    v8::Handle<v8::Value> argv[]);

  // Coming Soon
  // virtual void parseFile(const char* filename);
  void
  parse_string(
    const char* string,
    unsigned int size);

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
  v8::Local<v8::Object> callbacks_;
  std::auto_ptr<_xmlSAXHandler> sax_handler_;

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
