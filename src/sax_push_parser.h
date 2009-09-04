#ifndef sax_push_parser_h
#define sax_push_parser_h

#include <v8.h>

namespace libxml_js {

class SaxPushParser : public SaxParser {
public:
  static void Initialize (v8::Handle<v8::Object> target);

  SaxPushParser(v8::Handle<v8::Object> callbacks);
  ~SaxPushParser();

};

} // namespace libxml_js

#endif //sax_push_parser_h
