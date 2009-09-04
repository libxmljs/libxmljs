#ifndef sax_parser_h
#define sax_parser_h

#include <v8.h>

namespace libxml_js {

#define LIBXML_JS_GET_PARSER_FROM_CONTEXT(context) \
  ({ \
    _xmlParserCtxt* the_context = static_cast<_xmlParserCtxt*>(context); \
    static_cast<SaxParser*>(the_context->_private); \
  })
  

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

class SaxParser : public Parser {
public:
  static void Initialize (v8::Handle<v8::Object> target);

  SaxParser(v8::Handle<v8::Object> callbacks) : callbacks_(callbacks);
  virtual ~SaxParser();

  void Callback(const char * what);
  void Callback(const char * what, int argc, Handle<Value> argv[]);

  // Coming Soon
  // virtual void parseFile(const char* filename);
  // virtual void parseString(const char* string, unsigned int size);

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
  v8::Handle<v8::Object> callbacks_;
};

} // namespace libxml_js

#endif //sax_parser_h
