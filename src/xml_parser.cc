// Copyright 2009, Squish Tech, LLC.
#include "xml_syntax_error.h"
#include "xml_parser.h"
#include "xml_sax_parser.h"
#include "xml_document.h"

namespace libxmljs {

v8::Handle<v8::Value>
ParseXmlString(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!args[0]->IsString())
        return v8::ThrowException(v8::Exception::Error(
                    v8::String::New("Must supply parseHtmlString with a string")));

    v8::Local<v8::Array> errors = v8::Array::New();
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(*errors),
            XmlSyntaxError::PushToArray);

    v8::String::Utf8Value str(args[0]->ToString());
    xmlDocPtr doc = xmlReadMemory(*str, str.length(), NULL, "UTF-8", 0);

    xmlSetStructuredErrorFunc(NULL, NULL);

    if (!doc) {
        xmlError* error = xmlGetLastError();
        if (error) {
            return v8::ThrowException(XmlSyntaxError::BuildSyntaxError(error));
        }
        return v8::ThrowException(v8::Exception::Error(
                    v8::String::New("Could not parse XML string")));
    }

    v8::Handle<v8::Object> built_doc = LibXmlObj::GetMaybeBuild<XmlDocument, xmlDoc>(doc);
    built_doc->Set(v8::String::New("errors"), errors);

    return scope.Close(built_doc);
}

}  // namespace libxmljs
