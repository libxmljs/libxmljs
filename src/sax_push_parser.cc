#include <libxml_js.h>

void
SaxPushParser::Initialize (Handle<Object> target)
{
  HandleScope scope;

  // POSIX Wrappers
  NODE_SET_METHOD(target, "close", Close);
  NODE_SET_METHOD(target, "open", Open);
  NODE_SET_METHOD(target, "read", Read);
  NODE_SET_METHOD(target, "rename", Rename);
  NODE_SET_METHOD(target, "rmdir", RMDir);
  NODE_SET_METHOD(target, "stat", Stat);
  NODE_SET_METHOD(target, "unlink", Unlink);
  NODE_SET_METHOD(target, "write", Write);

  NODE_SET_METHOD(target, "strerror",  StrError);
}
