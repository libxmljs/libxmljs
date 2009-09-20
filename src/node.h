#ifndef __node_h__
#define __node_h__

#include "libxmljs.h"
#include "object_wrap.h"

#include <libxml/xmlstring.h>

namespace libxmljs {

class Node : public ObjectWrap {
public:
  _xmlNode *xml_obj;

  Node(
    xmlNode* node);

  virtual ~Node();

  static void
  Initialize(
    v8::Handle<v8::Object> target);
};

} // namespace libxmljs

#endif // __node_h__
