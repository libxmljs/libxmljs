#ifndef sax_parser_h
#define sax_parser_h

#include <v8.h>

namespace libxml_js {

class SaxParser : public Parser {
public:
  static void Initialize (v8::Handle<v8::Object> target);
};

} // namespace libxml_js

#endif //sax_parser_h
