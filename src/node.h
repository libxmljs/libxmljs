#ifndef __node_h__
#define __node_h__

#include "libxmljs.h"
#include "object_wrap.h"

#include <libxml/xmlstring.h>

namespace libxmljs {

class Node : public ObjectWrap {
public:
  _xmlNode *xml_obj;

  Node(xmlNode* node);
  virtual ~Node();

  static void Initialize(v8::Handle<v8::Object> target);
  static v8::Persistent<v8::FunctionTemplate> constructor_template;

protected:
  static v8::Handle<v8::Value> Doc(const v8::Arguments& args);
  static v8::Handle<v8::Value> Namespace(const v8::Arguments& args);
  static v8::Handle<v8::Value> Parent(const v8::Arguments& args);
  static v8::Handle<v8::Value> NextSibling(const v8::Arguments& args);
  static v8::Handle<v8::Value> PrevSibling(const v8::Arguments& args);

  v8::Handle<v8::Value> get_doc();
  v8::Handle<v8::Value> get_namespace();
  void set_namespace(xmlNs * ns);
  v8::Handle<v8::Value> get_parent();
  v8::Handle<v8::Value> get_prev_sibling();
  v8::Handle<v8::Value> get_next_sibling();

};

} // namespace libxmljs

#endif // __node_h__
