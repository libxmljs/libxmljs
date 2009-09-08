#include "parser.h"

using namespace v8;
using namespace libxmljs;

void
Parser::Initialize (Handle<Object> target)
{
  HandleScope scope;
}

Parser::~Parser()
{}

void
Parser::initializeContext()
{
  assert(context_);
  context_->validate = 0;
  context_->_private = this;
}

void
Parser::releaseContext()
{
  if (context_) {
    context_->_private = 0;
    if (context_->myDoc != NULL)
      xmlFreeDoc(context_->myDoc);

    xmlFreeParserCtxt(context_);
    context_ = 0;
  }
}
