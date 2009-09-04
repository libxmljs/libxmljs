#include <libxml_js.h>

using namespace v8;
using namespace libxml_js;

static Handle<Value>
CreatePushParser (const Arguments& args)
{
  if (args.Length() < 1 || !args[0]->IsObject())
    return ThrowException(BAD_ARGUMENTS);

  Handle<ObjectTemplate> point_templ = ObjectTemplate::New();
  point_templ->SetInternalFieldCount(1);
  Local<Object> obj = point_templ->NewInstance();
  bj->SetInternalField(0, External::New(p));
}

void
SaxPushParser::Initialize (Handle<Object> target)
{
  HandleScope scope;

  target->Set(String::NewSymbol("createPushParser"), FunctionTemplate::New(CreatePushParser));
}
