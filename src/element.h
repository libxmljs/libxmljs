#ifndef __element_h__
#define __element_h__

#include "libxmljs.h"
#include "node.h"

#include <libxml/xmlstring.h>

namespace libxmljs {

#define NAME_SYMBOL String::NewSymbol("name")

class Element : public Node {
public:
  Element(
    xmlNode* node);

  virtual ~Element();

  static void
  Initialize(
    v8::Handle<v8::Object> target);

  static v8::Handle<v8::Value>
  New(
    const v8::Arguments& args);

  static v8::Handle<v8::Value>
  GetProperty(
    v8::Local<v8::String> property,
    const v8::AccessorInfo& info);

  static void
  SetProperty(
    v8::Local<v8::String> property,
    v8::Local<v8::Value> value,
    const v8::AccessorInfo& info);

  void
  set_name(
    const char * name);

  const char *
  get_name();

};

} // namespace libxmljs

#endif // __element_h__
