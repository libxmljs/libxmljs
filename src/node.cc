#include "node.h"
#include "element.h"

using namespace v8;
using namespace libxmljs;

Node::Node(
  xmlNode* node)
: node(node)
{
  node->_private = this;
}

Node::~Node()
{
  xmlFree(node);
}

void
Node::Initialize(
  Handle<Object> target)
{
  Element::Initialize(target);
}
