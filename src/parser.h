#ifndef __parser_h__
#define __parser_h__

#include "libxml_js.h"

#include <v8.h>
#include <cassert> // for assert()

extern "C" {
  struct _xmlParserCtxt;
  struct _xmlSAXHandler;
}

namespace libxmljs {

class Parser {
public:
  Parser() : context_(0) {};
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

} // namespace libxmljs

#endif //__parser_h__
