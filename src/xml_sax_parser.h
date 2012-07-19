// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_SAX_PARSER_H_
#define SRC_XML_SAX_PARSER_H_

#include <node.h>

namespace libxmljs {

class XmlSaxParser : public node::ObjectWrap {
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
  Push(const v8::Arguments& args);

  void
  Callback(const char* what,
           int argc = 0,
           v8::Handle<v8::Value> argv[] = NULL);

  void
  parse_string(const char* str,
               unsigned int size);

  void
  initialize_push_parser();

  void
  push(const char* str,
       unsigned int size,
       bool terminate);

  /// callbacks

  static void
  start_document(void* context);

  static void
  end_document(void* context);

  static void
  start_element(void* context,
                const xmlChar* name,
                const xmlChar** p);

  static void
  end_element(void* context, const xmlChar* name);

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
  comment(void* context, const xmlChar* value);

  static void
  cdata_block(void* context, const xmlChar* value, int len);

  static void
  warning(void* context, const char* msg, ...);

  static void
  error(void* context, const char* msg, ...);

  protected:

  void initializeContext();
  void releaseContext();

  xmlParserCtxt* context_;

  xmlSAXHandler  sax_handler_;
};

}  // namespace libxmljs

#endif  // SRC_XML_SAX_PARSER_H_
