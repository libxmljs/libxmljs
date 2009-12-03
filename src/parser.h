// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_PARSER_H_
#define SRC_PARSER_H_

#include <v8.h>

#include <libxml/parser.h>
#include <libxml/parserInternals.h>  // for xmlCreateFileParserCtxt

#include <cassert>  // for assert()

#include "./libxmljs.h"
#include "./object_wrap.h"

namespace libxmljs {

class Parser : public LibXmlObj {
  public:

  static void Initialize(v8::Handle<v8::Object> target);
};

}  // namespace libxmljs

#endif  // SRC_PARSER_H_
