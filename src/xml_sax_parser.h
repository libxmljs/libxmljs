// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_SAX_PARSER_H_
#define SRC_XML_SAX_PARSER_H_

#include "libxmljs.h"
#include "xml_parser.h"

namespace libxmljs {

#define LXJS_GET_PARSER_FROM_CONTEXT(context)                                 \
({                                                                            \
  _xmlParserCtxt* the_context = static_cast<_xmlParserCtxt*>(context);        \
  static_cast<XmlSaxParser*>(the_context->_private);                          \
})

class XmlSaxParser : public XmlParser {
  public:

  XmlSaxParser();
  virtual ~XmlSaxParser();

  static void
  Initialize(v8::Handle<v8::Object> target);

  static v8::Handle<v8::Value>
  NewParser(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  NewPushParser(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  ParseString(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  ParseFile(const v8::Arguments& args);

  static v8::Handle<v8::Value>
  Push(const v8::Arguments& args);

  void
  SetCallbacks(const v8::Handle<v8::Object> context,
               const v8::Handle<v8::Function> callbacks);

  void
  Callback(const char* what);

  void
  Callback(const char* what,
           int argc,
           v8::Handle<v8::Value> argv[]);

  void
  parse_string(const char* str,
               unsigned int size);

  void
  parse_file(const char* filename);

  void
  initialize_push_parser();

  void
  push(const char* str,
       unsigned int size,
       bool terminate);

  void
  start_document();

  void
  end_document();

  void
  start_element(const xmlChar* name,
                const xmlChar** p);

  void
  end_element(const xmlChar* name);

  void
  start_element_ns(const xmlChar* localname,
                   const xmlChar* prefix,
                   const xmlChar* uri,
                   int nb_namespaces,
                   const xmlChar** namespaces,
                   int nb_attributes,
                   int nb_defaulted,
                   const xmlChar** attributes);

  void
  end_element_ns(const xmlChar* localname,
                 const xmlChar* prefix,
                 const xmlChar* uri);

  void
  characters(const xmlChar* ch,
             int len);

  void
  comment(const xmlChar* value);

  void
  cdata_block(const xmlChar* value,
              int len);

  void
  warning(const char* message);

  void
  error(const char* message);

  // TODO(sprsquish)
  // void
  // structured_error(
  //   xmlErrorPtr xerror);

  protected:

  void initializeContext();
  void releaseContext();

  xmlParserCtxt* context_;

  v8::Persistent<v8::Object> callbacks_;
  xmlSAXHandler* sax_handler_;

  private:

  friend struct SaxParserCallback;
  void parse();
};

struct SaxParserCallback {
  static void
  start_document(void* context);

  static void
  end_document(void* context);

  static void
  start_element_ns(void* context,
                   const xmlChar* localname,
                   const xmlChar* prefix,
                   const xmlChar* uri,
                   int nb_namespaces,
                   const xmlChar** namespaces,
                   int nb_attributes,
                   int nb_defaulted,
                   const xmlChar** attributes);

  static void
  end_element_ns(void* context,
                 const xmlChar* localname,
                 const xmlChar* prefix,
                 const xmlChar* uri);

  static void
  characters(void* context,
             const xmlChar* ch,
             int len);

  static void
  comment(void* context,
          const xmlChar* value);

  static void
  cdata_block(void* context,
              const xmlChar* value,
              int len);

  static void
  warning(void* context,
          const char* fmt,
          ...);

  static void
  error(void* context,
        const char* fmt,
        ...);

  // TODO(sprsquish)
  // static void
  // structured_error(
  //   void *ctx,
  //   xmlErrorPtr xerror);
};
}  // namespace libxmljs

#endif  // SRC_XML_SAX_PARSER_H_
