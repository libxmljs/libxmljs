// Copyright 2009, Squish Tech, LLC.
#include "libxmljs.h"
#include "xml_syntax_error.h"
#include "xml_document.h"
#include "xml_node.h"
#include "xml_parser.h"
#include "html_parser.h"

namespace libxmljs {

    v8::Persistent<v8::FunctionTemplate> memory_usage;

namespace {

void on_libxml_destruct(xmlNode* node) {
}

}  // namespace

LibXMLJS::LibXMLJS() {
  xmlMemSetup(xmlMemFree, xmlMemMalloc, xmlMemRealloc, xmlMemoryStrdup);

  xmlInitParser();  // Not always necessary, but necessary for thread safety.
  // xmlRegisterNodeDefault(on_libxml_construct);
  xmlDeregisterNodeDefault(on_libxml_destruct);
  // xmlThrDefRegisterNodeDefault(on_libxml_construct);
  xmlThrDefDeregisterNodeDefault(on_libxml_destruct);
}

LibXMLJS::~LibXMLJS() {
  xmlCleanupParser();  // As per xmlInitParser(), or memory leak will happen.
}

LibXMLJS LibXMLJS::init_;

static void
OnFatalError(const char* location,
             const char* message) {
#define FATAL_ERROR "\033[1;31mV8 FATAL ERROR.\033[m"
  if (location)
    fprintf(stderr, FATAL_ERROR " %s %s\n", location, message);
  else
    fprintf(stderr, FATAL_ERROR " %s\n", message);

  exit(1);
}

// Extracts a C str from a V8 Utf8Value.
// TODO: Fix this error state, maybe throw exception?
const char *
ToCString(const v8::String::Utf8Value& value) {
  return *value ? *value : "<str conversion failed>";
}

static void
ReportException(v8::TryCatch* try_catch) {
  v8::Handle<v8::Message> message = try_catch->Message();
  if (message.IsEmpty()) {
    fprintf(stderr, "Error: (no message)\n");
    fflush(stderr);
    return;
  }
  v8::Handle<v8::Value> error = try_catch->Exception();
  v8::Handle<v8::String> stack;
  if (error->IsObject()) {
    v8::Handle<v8::Object> obj = v8::Handle<v8::Object>::Cast(error);
    v8::Handle<v8::Value> raw_stack = obj->Get(v8::String::New("stack"));
    if (raw_stack->IsString()) stack = v8::Handle<v8::String>::Cast(raw_stack);
  }
  if (stack.IsEmpty()) {
    v8::String::Utf8Value exception(error);

    // Print (filename):(line number): (message).
    v8::String::Utf8Value filename(message->GetScriptResourceName());
    const char* filename_string = ToCString(filename);
    int linenum = message->GetLineNumber();
    fprintf(stderr, "%s:%i: %s\n", filename_string, linenum, *exception);
    // Print line of source code.
    v8::String::Utf8Value sourceline(message->GetSourceLine());
    const char* sourceline_string = ToCString(sourceline);
    fprintf(stderr, "%s\n", sourceline_string);
    // Print wavy underline (GetUnderline is deprecated).
    int start = message->GetStartColumn();
    for (int i = 0; i < start; i++) {
      fprintf(stderr, " ");
    }
    int end = message->GetEndColumn();
    for (int i = start; i < end; i++) {
      fprintf(stderr, "^");
    }
    fprintf(stderr, "\n");

    message->PrintCurrentStackTrace(stderr);


  } else {
    v8::String::Utf8Value trace(stack);
    fprintf(stderr, "%s\n", *trace);
  }
  fflush(stderr);
}

// Executes a str within the current v8 context.
v8::Handle<v8::Value>
ExecuteString(v8::Handle<v8::String> source,
              v8::Handle<v8::Value> filename) {
  v8::HandleScope scope;
  v8::TryCatch try_catch;

  v8::Handle<v8::Script> script = v8::Script::Compile(source, filename);
  if (script.IsEmpty()) {
    ReportException(&try_catch);
    exit(1);
  }

  v8::Handle<v8::Value> result = script->Run();
  if (result.IsEmpty()) {
    ReportException(&try_catch);
    exit(1);
  }

  return scope.Close(result);
}

static void
ExecuteNativeJS(const char* filename,
                const char* data) {
  v8::HandleScope scope;
  v8::TryCatch try_catch;
  ExecuteString(v8::String::New(data), v8::String::New(filename));
  if (try_catch.HasCaught())  {
    puts("There is an error in Node's built-in javascript");
    puts("This should be reported as a bug!");
    ReportException(&try_catch);
    exit(1);
  }
}

void
UpdateV8Memory() {
    v8::V8::AdjustAmountOfExternalAllocatedMemory(-current_xml_memory);
    current_xml_memory = xmlMemUsed();
    v8::V8::AdjustAmountOfExternalAllocatedMemory(current_xml_memory);
}

v8::Handle<v8::Value>
MemoryUsage(const v8::Arguments& args) {
    v8::HandleScope scope;
    v8::Local<v8::Object> obj = v8::Object::New();
    long c = xmlMemUsed();

    obj->Set(v8::String::New("libxml"), v8::Integer::New(c));
    obj->Set(v8::String::New("v8"), v8::Integer::New(current_xml_memory));

    return scope.Close(obj);
}

void
InitializeLibXMLJS(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;

  XmlSyntaxError::Initialize(target);
  XmlDocument::Initialize(target);
  XmlParser::Initialize(target);
  HtmlParser::Initialize(target);

  target->Set(v8::String::NewSymbol("version"),
              v8::String::New(LIBXMLJS_VERSION));

  target->Set(v8::String::NewSymbol("libxml_version"),
              v8::String::New(LIBXML_DOTTED_VERSION));

  target->Set(v8::String::NewSymbol("libxml_parser_version"),
              v8::String::New(xmlParserVersion));

  target->Set(v8::String::NewSymbol("libxml_debug_enabled"),
              v8::Boolean::New(debugging));

  v8::Local<v8::FunctionTemplate> func = v8::FunctionTemplate::New(MemoryUsage);
  memory_usage = v8::Persistent<v8::FunctionTemplate>::New(func);
  memory_usage->InstanceTemplate()->SetInternalFieldCount(1);

  target->Set(v8::String::NewSymbol("memoryUsage"),
              memory_usage->GetFunction());

  v8::Handle<v8::ObjectTemplate> global = v8::ObjectTemplate::New();
  v8::Handle<v8::Context> context = v8::Context::New(NULL, global);

  v8::Context::Scope context_scope(context);
  context->Global()->Set(v8::String::NewSymbol("libxml"), target);

  ExecuteNativeJS("xml_sax_parser.js", native_xml_sax_parser);
  ExecuteNativeJS("xml_document.js", native_xml_document);
  ExecuteNativeJS("xml_element.js", native_xml_element);
}

// used by node.js to initialize libraries
extern "C" void
init(v8::Handle<v8::Object> target) {
  v8::HandleScope scope;
  InitializeLibXMLJS(target);
}

int
main(int argc,
     char* argv[]) {
  v8::V8::SetFlagsFromCommandLine(&argc, argv, true);
  v8::V8::Initialize();
  v8::V8::SetFatalErrorHandler(OnFatalError);

  // Create a stack-allocated handle scope.
  v8::HandleScope handle_scope;
  // Create a new context.
  v8::Handle<v8::Context> context = v8::Context::New();
  // Enter the created context for compiling and
  // running the hello world script.
  v8::Context::Scope context_scope(context);

  v8::Local<v8::Object> global_obj = v8::Context::GetCurrent()->Global();
  v8::Local<v8::Object> libxml_obj = v8::Object::New();

  InitializeLibXMLJS(libxml_obj);

  global_obj->Set(v8::String::NewSymbol("libxml"), libxml_obj);

  // for (int i = 1; i < argc; i++) {
  //   // Create a string containing the JavaScript source code.
  //   Handle<String> source = ReadFile(argv[i]);
  //   // Compile the source code.
  //   Handle<Script> script = Script::Compile(source);
  //   // Run the script to get the result.
  //   Handle<Value> result = script->Run();
  // }

  v8::V8::Dispose();

  return 0;
}
}  // namespace libxmljs
