// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_HTML_PARSER_H_
#define SRC_HTML_PARSER_H_

#include "libxmljs.h"

namespace libxmljs {

class HtmlParser : public LibXmlObj {
  public:

  static void Initialize(v8::Handle<v8::Object> target);
};

}  // namespace libxmljs

#endif  // SRC_HTML_PARSER_H_
