%header %{
    #include "xml_syntax_error.h"

    v8::Local<v8::Value>
    XmlSyntaxError::BuildSyntaxError(xmlError* error) {
        Nan::EscapableHandleScope scope;

        v8::Local<v8::Value> err = v8::Exception::Error(
                Nan::New<v8::String>(error->message).ToLocalChecked());
        v8::Local<v8::Object> out = v8::Local<v8::Object>::Cast(err);

        set_numeric_field(out, "domain", error->domain);
        set_numeric_field(out, "code", error->code);
        set_string_field(out, "message", error->message);
        set_numeric_field(out, "level", error->level);
        set_numeric_field(out, "column", error->int2);
        set_string_field(out, "file", error->file);
        set_numeric_field(out, "line", error->line);
        set_string_field(out, "str1", error->str1);
        set_string_field(out, "str2", error->str2);
        set_string_field(out, "str3", error->str3);

        // only add if we have something interesting
        if (error->int1) {
            set_numeric_field(out, "int1", error->int1);
        }
        
        return scope.Escape(err);
    }

    void
    XmlSyntaxError::PushToArray(void* errs, xmlError* error) {
        Nan::HandleScope scope;

        if (errs != NULL) {
            v8::Local<v8::Array> array = *reinterpret_cast<v8::Local<v8::Array>*>(errs);
            
            // push method for array
            v8::Local<v8::Function> push = v8::Local<v8::Function>::Cast(Nan::Get(array, Nan::New<v8::String>("push").ToLocalChecked()).ToLocalChecked());

            v8::Local<v8::Value> argv[1] = { 
                XmlSyntaxError::BuildSyntaxError(error)
                    // SWIG_NewPointerObj(SWIG_as_voidptr(error), SWIGTYPE_p__xmlError, 0 |  0 )
                };

            Nan::Call(push, array, 1, argv);
        } else {
            SWIGV8_THROW_EXCEPTION(v8::Exception::Error(SWIGV8_STRING_NEW(error->message)));
        }
    }

    void
    XmlSyntaxError::GenericPushToArray(void* errs, const char *msg, ...) {
        Nan::HandleScope scope;

        if (errs != NULL) {
            v8::Local<v8::Array> array = *reinterpret_cast<v8::Local<v8::Array>*>(errs);
            
            // push method for array
            v8::Local<v8::Function> push = v8::Local<v8::Function>::Cast(Nan::Get(array, Nan::New<v8::String>("push").ToLocalChecked()).ToLocalChecked());

            v8::Local<v8::Value> argv[1] = { SWIGV8_STRING_NEW(msg) };

            Nan::Call(push, array, 1, argv);
        } else {
            SWIGV8_THROW_EXCEPTION(v8::Exception::Error(SWIGV8_STRING_NEW(msg)));
        }
    }
    
    NAN_METHOD(withStructuredErrors) {
        Nan::HandleScope scope;

        auto array = SWIGV8_ARRAY_NEW();

        xmlSetStructuredErrorFunc(reinterpret_cast<void*>(&array), XmlSyntaxError::PushToArray);

        v8::Local<v8::Value> argv[1] = { array };

        auto callback = Nan::To<v8::Function>(info[0]).ToLocalChecked();
        
        auto ret = Nan::Call(callback, Nan::GetCurrentContext()->Global(), 1, argv);

        xmlSetStructuredErrorFunc(reinterpret_cast<void*>(NULL), XmlSyntaxError::PushToArray);

        if (ret.IsEmpty()) {
          return info.GetReturnValue().Set(SWIGV8_UNDEFINED());
        }

        return info.GetReturnValue().Set(ret.ToLocalChecked());
    }
    
    NAN_METHOD(withGenericErrors) {
        Nan::HandleScope scope;

        auto array = SWIGV8_ARRAY_NEW();

        xmlSetGenericErrorFunc(reinterpret_cast<void*>(&array), XmlSyntaxError::GenericPushToArray);

        v8::Local<v8::Value> argv[1] = { array };

        auto callback = Nan::To<v8::Function>(info[0]).ToLocalChecked();

        auto ret = Nan::Call(callback, Nan::GetCurrentContext()->Global(), 1, argv);

        xmlSetGenericErrorFunc(reinterpret_cast<void*>(NULL), XmlSyntaxError::GenericPushToArray);

        if (ret.IsEmpty()) {
          return info.GetReturnValue().Set(SWIGV8_UNDEFINED());
        }

        return info.GetReturnValue().Set(ret.ToLocalChecked());
    }
%}

%init %{

    Nan::SetMethod(exports_obj, "withStructuredErrors", withStructuredErrors);
    Nan::SetMethod(exports_obj, "withGenericErrors", withGenericErrors);
%}