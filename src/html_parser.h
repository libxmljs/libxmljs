// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_HTML_PARSER_H_
#define SRC_HTML_PARSER_H_

#include "libxmljs.h"

namespace libxmljs {

v8::Handle<v8::Value>
ParseHtmlString(const v8::Arguments& args);

}  // namespace libxmljs

#endif  // SRC_HTML_PARSER_H_
