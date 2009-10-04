// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_PARSER_H_
#define SRC_PARSER_H_

#include <v8.h>

#include <libxml/parser.h>
#include <libxml/parserInternals.h>  // for xmlCreateFileParserCtxt

#include <cassert>  // for assert()

#include "libxmljs.h"
#include "object_wrap.h"

namespace libxmljs {

class Parser : public ObjectWrap {
  public:

  Parser() : context_(0) {}
  static void Initialize(v8::Handle<v8::Object> target);

  v8::Handle<v8::Value> parse_string(const char* str, int len);
  v8::Handle<v8::Value> parse_file(const char* filename);

  protected:

  v8::Handle<v8::Value> parse_context();

  virtual void initializeContext();
  virtual void releaseContext();

  _xmlParserCtxt* context_;
};

}  // namespace libxmljs

#endif  // SRC_PARSER_H_
