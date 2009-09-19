#ifndef __parser_h__
#define __parser_h__

#include "libxmljs.h"
#include "object_wrap.h"

#include <v8.h>
#include <cassert> // for assert()

#include <libxml/parser.h>
#include <libxml/parserInternals.h> // for xmlCreateFileParserCtxt

namespace libxmljs {

class Parser : public ObjectWrap {
public:
  Parser() : context_(0) {};
  static void Initialize (v8::Handle<v8::Object> target);

  v8::Handle<v8::Value> parse_string(const char * str, int len);
  v8::Handle<v8::Value> parse_file(const char * filename);

protected:
  v8::Handle<v8::Value> parse_context();

  virtual void initializeContext();
  virtual void releaseContext();

  _xmlParserCtxt* context_;
};

} // namespace libxmljs

#endif //__parser_h__
