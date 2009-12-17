// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_SYNTAX_ERROR_H_
#define SRC_XML_SYNTAX_ERROR_H_

#include "./libxmljs.h"

namespace libxmljs {

#define DOMAIN_SYMBOL   v8::String::NewSymbol("domain")
#define CODE_SYMBOL     v8::String::NewSymbol("code")
#define LEVEL_SYMBOL    v8::String::NewSymbol("level")
#define FILE_SYMBOL     v8::String::NewSymbol("file")
#define LINE_SYMBOL     v8::String::NewSymbol("line")
#define STR1_SYMBOL     v8::String::NewSymbol("str1")
#define STR2_SYMBOL     v8::String::NewSymbol("str2")
#define STR3_SYMBOL     v8::String::NewSymbol("str3")
#define INT1_SYMBOL     v8::String::NewSymbol("int1")
#define COLUMN_SYMBOL   v8::String::NewSymbol("column")

#define ERR_RETURN_STR_OR_NULL(field)                                         \
({                                                                            \
  v8::HandleScope scope;                                                      \
  if (xml_obj && xml_obj->field)                                              \
    return v8::String::New((const char *)xml_obj->field,                      \
                           xmlStrlen((const xmlChar*)xml_obj->field));        \
                                                                              \
  return v8::Null();                                                          \
})

#define ERR_RETURN_NUM_OR_NULL(field)                                         \
({                                                                            \
  v8::HandleScope scope;                                                      \
  if (xml_obj && xml_obj->field)                                              \
    return v8::Number::New((double)xml_obj->field);                           \
                                                                              \
  return v8::Null();                                                          \
})

#define THROW_SYNTAX_ERROR(error)                                             \
({                                                                            \
  XmlSyntaxError *syntax_error = new XmlSyntaxError(error);                   \
  v8::Handle<v8::Value> args[1] = { v8::Null() };                             \
  v8::Handle<v8::Object> js_error_obj =                                       \
    XmlSyntaxError::constructor_template->                                    \
    GetFunction()->                                                           \
    NewInstance(1, args);                                                     \
  syntax_error->Wrap(js_error_obj);                                           \
  v8::ThrowException(js_error_obj);                                           \
})

  class XmlSyntaxError : public LibXmlObj {
    public:

    xmlError *xml_obj;

    explicit XmlSyntaxError(xmlError *error) : xml_obj(error) {}
    virtual ~XmlSyntaxError();

    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Persistent<v8::FunctionTemplate> constructor_template;

    static void PushToArray(void *ctx, xmlError *error);

    protected:

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> Getter(v8::Local<v8::String> property,
                                        const v8::AccessorInfo& info);

    v8::Handle<v8::Value> get_domain();
    v8::Handle<v8::Value> get_code();
    v8::Handle<v8::Value> get_level();
    v8::Handle<v8::Value> get_file();
    v8::Handle<v8::Value> get_line();
    v8::Handle<v8::Value> get_str1();
    v8::Handle<v8::Value> get_str2();
    v8::Handle<v8::Value> get_str3();
    v8::Handle<v8::Value> get_int1();
    v8::Handle<v8::Value> get_column();
  };

}  // namespace libxmljs

#endif SRC_XML_SYNTAX_ERROR_H_
