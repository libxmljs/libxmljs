// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_PARSER_H_
#define SRC_XML_PARSER_H_

#include "libxmljs.h"

namespace libxmljs {

v8::Handle<v8::Value>
ParseXmlString(const v8::Arguments& args);

}  // namespace libxmljs

#endif  // SRC_XML_PARSER_H_
