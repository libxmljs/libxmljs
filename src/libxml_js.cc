static Local<Object>
Load (int argc, char *argv[])
{
  HandleScope scope;

  Local<Object> global_obj = Context::GetCurrent()->Global();
  Local<Object> libxml_js_obj = Object::New();

  global_obj->Set(String::NewSymbol("libxml"), libxml_js_obj);

  libxml_js_obj->Set(String::NewSymbol("version"), String::New(LIBXMLJS_VERSION));

  Local<Object> sax = Object::New();
  libxml_js_obj->Set(String::NewSymbol("sax"), sax);
  // Sax::Initialize(sax);
  SaxPushParser::Initialize(sax);

  return scope.Close(libxml_js_obj);
}
