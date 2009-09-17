#include "node.h"
#include "element.h"

using namespace v8;
using namespace libxmljs;

Node::Node(
  xmlNode* node)
: node_(node)
{
  node_->_private = this;
}

Node::~Node()
{}

void
Node::Initialize(
  Handle<Object> target)
{
  Element::Initialize(target);
}
