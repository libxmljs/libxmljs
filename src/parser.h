#ifndef parser_h
#define parser_h

#include <v8.h>

extern "C" {
  struct _xmlParserCtxt;
}

namespace libxml_js {

class Parser {
public:
  Parser();
  virtual ~Parser();

  static void Initialize (v8::Handle<v8::Object> target);

  // Coming Soon
  // virtual void parseFile(const char* filename);
  // virtual void parseString(const char* string, unsigned int size);

protected:
  virtual void initializeContext();
  virtual void releaseContext();

  _xmlParserCtxt* context_;
};

} // namespace libxml_js

#endif //parser_h
