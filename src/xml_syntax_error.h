// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_SYNTAX_ERROR_H_
#define SRC_XML_SYNTAX_ERROR_H_

#include "libxmljs.h"

namespace libxmljs {

#define DOMAIN_SYMBOL   v8::String::NewSymbol("domain")
#define CODE_SYMBOL     v8::String::NewSymbol("code")
#define MESSAGE_SYMBOL  v8::String::NewSymbol("message")
#define LEVEL_SYMBOL    v8::String::NewSymbol("level")
#define FILE_SYMBOL     v8::String::NewSymbol("file")
#define LINE_SYMBOL     v8::String::NewSymbol("line")
#define STR1_SYMBOL     v8::String::NewSymbol("str1")
#define STR2_SYMBOL     v8::String::NewSymbol("str2")
#define STR3_SYMBOL     v8::String::NewSymbol("str3")
#define INT1_SYMBOL     v8::String::NewSymbol("int1")
#define COLUMN_SYMBOL   v8::String::NewSymbol("column")

  class XmlSyntaxError : public LibXmlObj {
    public:

    explicit XmlSyntaxError(xmlError *error);
    virtual ~XmlSyntaxError();

    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Persistent<v8::FunctionTemplate> constructor_template;

    static inline
    v8::Handle<v8::Value>
    BuildSyntaxError(xmlError *error) {
        v8::HandleScope scope;
        XmlSyntaxError *syntax_error = new XmlSyntaxError(error);
        v8::Handle<v8::Value> args[1] = { v8::Null() };
        v8::Handle<v8::Object> js_error_obj =
            XmlSyntaxError::constructor_template->GetFunction()->NewInstance(1, args);
        syntax_error->Wrap(js_error_obj);
        return scope.Close(js_error_obj);
    }

    static void PushToArray(void *ctx, xmlError *error);

    v8::Persistent<v8::Value> domain;
    v8::Persistent<v8::Value> code;
    v8::Persistent<v8::Value> message;
    v8::Persistent<v8::Value> level;
    v8::Persistent<v8::Value> file;
    v8::Persistent<v8::Value> line;
    v8::Persistent<v8::Value> str1;
    v8::Persistent<v8::Value> str2;
    v8::Persistent<v8::Value> str3;
    v8::Persistent<v8::Value> int1;
    v8::Persistent<v8::Value> int2;

    protected:

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> Getter(v8::Local<v8::String> property,
                                        const v8::AccessorInfo& info);
  };

}  // namespace libxmljs

#endif  // SRC_XML_SYNTAX_ERROR_H_
