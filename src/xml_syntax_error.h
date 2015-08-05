// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_SYNTAX_ERROR_H_
#define SRC_XML_SYNTAX_ERROR_H_

#include <libxml/xmlerror.h>
#include <vector>

#include "libxmljs.h"

namespace libxmljs {

// RAII sentinel to collect errors in synchroneous operations
class XmlSyntaxErrorsSync {

public:

    XmlSyntaxErrorsSync();
    ~XmlSyntaxErrorsSync();

    // create a v8 object for the syntax eror
    static v8::Local<v8::Value> BuildSyntaxError(xmlError* error);

    v8::Local<v8::Array> ToArray() {
        return errors;
    }

private:

    v8::Local<v8::Array> errors;

    // called from xml library to report errors,
    // will make a copy and store it in vector
    static void ErrorFunc(void* errs, xmlError* error);

};

class XmlSyntaxErrorsStore {

public:

    ~XmlSyntaxErrorsStore();

    v8::Local<v8::Array> ToArray();

    static xmlError* CloneError(xmlError* error);

    static void FreeError(xmlError* error);

private:

    // store errors in a non-v8 data structure, important for async operation
    std::vector<xmlError*> errors;

    // called from xml library to report errors,
    // will make a copy and store it in vector
    static void ErrorFunc(void* errs, xmlError* error);

    friend class XmlSyntaxErrorsAsync;

};

// RAII sentinel to collect errors in asynchroneous operation
class XmlSyntaxErrorsAsync {

public:

    XmlSyntaxErrorsAsync(XmlSyntaxErrorsStore& store) {
        xmlResetLastError();
        xmlSetStructuredErrorFunc(&store, XmlSyntaxErrorsStore::ErrorFunc);
    }

    ~XmlSyntaxErrorsAsync() {
        xmlSetStructuredErrorFunc(NULL, NULL);
    }

};

}  // namespace libxmljs

#endif  // SRC_XML_SYNTAX_ERROR_H_
