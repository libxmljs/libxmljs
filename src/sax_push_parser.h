#ifndef __sax_push_parser_h__
#define __sax_push_parser_h__

#include "libxmljs.h"
#include "sax_parser.h"

#include <v8.h>

namespace libxmljs {

class SaxPushParser : public SaxParser {
public:
  static void Initialize (v8::Handle<v8::Object> target);

  SaxPushParser(v8::Handle<v8::Object> callbacks);
  ~SaxPushParser();

};

} // namespace libxmljs

#endif //__sax_push_parser_h__
