#include "node.h"
#include "element.h"

using namespace v8;
using namespace libxmljs;

Node::Node(
  xmlNode* node)
: xml_obj(node)
{
  xml_obj->_private = this;
}

Node::~Node()
{
  xmlFree(xml_obj);
}

void
Node::Initialize(
  Handle<Object> target)
{
  Element::Initialize(target);
}
