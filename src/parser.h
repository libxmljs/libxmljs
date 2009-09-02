#ifndef parser_h
#define parser_h

#include <v8.h>

namespace libxml_js {

class Parser {
public:
  static void Initialize (v8::Handle<v8::Object> target);
};

} // namespace libxml_js

#endif //parser_h
