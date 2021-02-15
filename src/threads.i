%wrapper %{
    // RAII sentinel to collect errors in synchroneous operations
    class LIBXMLJS_API XmlSyntaxErrorsSync {

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

    class LIBXMLJS_API XmlSyntaxErrorsStore {

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
    class LIBXMLJS_API XmlSyntaxErrorsAsync {

    public:

        XmlSyntaxErrorsAsync(XmlSyntaxErrorsStore& store) {
            xmlResetLastError();
            xmlSetStructuredErrorFunc(&store, XmlSyntaxErrorsStore::ErrorFunc);
        }

        ~XmlSyntaxErrorsAsync() {
            xmlSetStructuredErrorFunc(NULL, NULL);
        }

    };

    void set_string_field(v8::Local<v8::Object> obj,
            const char* name, const char* value) {
        Nan::HandleScope scope;
        if (!value) {
            return;
        }
        Nan::Set(obj, Nan::New<v8::String>(name).ToLocalChecked(), Nan::New<v8::String>(value, strlen(value)).ToLocalChecked());
    }

    void set_numeric_field(v8::Local<v8::Object> obj,
            const char* name, const int value) {
        Nan::HandleScope scope;
        Nan::Set(obj, Nan::New<v8::String>(name).ToLocalChecked(), Nan::New<v8::Int32>(value));
    }

    XmlSyntaxErrorsSync::XmlSyntaxErrorsSync() {
        errors = Nan::New<v8::Array>();
        xmlResetLastError();
        xmlSetStructuredErrorFunc(this, ErrorFunc);
    }

    XmlSyntaxErrorsSync::~XmlSyntaxErrorsSync() {
        xmlSetStructuredErrorFunc(NULL, NULL);
    }

    v8::Local<v8::Value>
    XmlSyntaxErrorsSync::BuildSyntaxError(xmlError* error) {
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
    XmlSyntaxErrorsSync::ErrorFunc(void* errs, xmlError* error) {
        Nan::HandleScope scope;
        XmlSyntaxErrorsSync* self = static_cast<XmlSyntaxErrorsSync*>(errs);
        SWIGV8_AppendOutput(self->errors, BuildSyntaxError(error));
    }

    XmlSyntaxErrorsStore::~XmlSyntaxErrorsStore() {
        typedef std::vector<xmlError*>::reverse_iterator iter;
        for (iter i = errors.rbegin(), e = errors.rend(); i != e; ++i)
            FreeError(*i);
    }

    v8::Local<v8::Array>
    XmlSyntaxErrorsStore::ToArray() {
        Nan::EscapableHandleScope scope;
        v8::Local<v8::Array> array = Nan::New<v8::Array>(errors.size());
        for (uint32_t i = 0; i != errors.size(); ++i)
            SWIGV8_AppendOutput(array, XmlSyntaxErrorsSync::BuildSyntaxError(errors[i]));
        return scope.Escape(array);
    }

    void
    XmlSyntaxErrorsStore::ErrorFunc(void* errs, xmlError* error) {
        XmlSyntaxErrorsStore* self = static_cast<XmlSyntaxErrorsStore*>(errs);
        xmlError* clone = CloneError(error);
        if (clone)
            self->errors.push_back(clone);
    }

    xmlError*
    XmlSyntaxErrorsStore::CloneError(xmlError* err1) {
        if (!err1) return NULL;
        xmlError* err2 = static_cast<xmlError*>(xmlMalloc(sizeof(xmlError)));
        if (!err2) return NULL;
        *err2 = *err1;
        if(err1->message) err2->message = xmlMemStrdup(err1->message);
        if(err1->file   ) err2->file    = xmlMemStrdup(err1->file   );
        if(err1->str1   ) err2->str1    = xmlMemStrdup(err1->str1   );
        if(err1->str2   ) err2->str2    = xmlMemStrdup(err1->str2   );
        if(err1->str3   ) err2->str3    = xmlMemStrdup(err1->str3   );
        return err2;
    }

    void
    XmlSyntaxErrorsStore::FreeError(xmlError* err) {
        if (err->message) xmlFree(err->message);
        if (err->file) xmlFree(err->file);
        if (err->str1) xmlFree(err->str1);
        if (err->str2) xmlFree(err->str2);
        if (err->str3) xmlFree(err->str3);
        xmlFree(err);
    }

    class FromXmlWorker : public Nan::AsyncWorker {
    public:
        int type;
        char *buffer;
        size_t length;
        char* url;
        char* encoding;
        int flags;
        xmlDocPtr doc;
        WorkerParent parent;
        FromXmlWorker(Nan::Callback* callback,
                    int type,
                    SWIGV8_VALUE buffer,
                    int length,
                    SWIGV8_VALUE url,
                    SWIGV8_VALUE encoding,
                    int flags);
        void Execute();
        void WorkComplete();
        XmlSyntaxErrorsStore errors;
        xmlError* lastError;
    };

    FromXmlWorker::FromXmlWorker(Nan::Callback* callback,
                    int type,
                    SWIGV8_VALUE buffer,
                    int length,
                    SWIGV8_VALUE url,
                    SWIGV8_VALUE encoding,
                    int flags)
        : Nan::AsyncWorker(callback, "nan:FromXmlWorker"), lastError(NULL) {
        Nan::HandleScope scope;

        this->type = type;

        // if (buffer->IsString()) {
            SWIG_AsCharPtrAndSize(buffer, &this->buffer, NULL, NULL);
        // } else {
        //     this->buffer = node::Buffer::Data(buffer);
        // }

        this->length = length;
        
        SWIG_AsCharPtrAndSize(url, &this->url, NULL, NULL);
        SWIG_AsCharPtrAndSize(encoding, &this->encoding, NULL, NULL);

        this->flags = flags;

        // this->SaveToPersistent("buf", buf);
        // this->SaveToPersistent("opt", opt);
    }

    void FromXmlWorker::Execute() {
        WorkerSentinel workerSentinel(parent);
        XmlSyntaxErrorsAsync errorsSentinel(errors);

        // printf("Async Execute type: %i, buffer: %s, length: %i, url: %s, encoding: %s, flags: %i\n", this->type, this->buffer, this->length, this->url, this->encoding, this->flags);

        if (this->type < 1) {
            this->doc = xmlReadMemory(this->buffer, this->length, this->url, this->encoding, this->flags);
        } else {
            this->doc = htmlReadMemory(this->buffer, this->length, this->url, this->encoding, this->flags);
        }

        if (!doc)
            lastError = XmlSyntaxErrorsStore::CloneError(xmlGetLastError());
    }

    void FromXmlWorker::WorkComplete() {
        Nan::HandleScope scope;
        if (!doc) {
            v8::Local<v8::Value> argv[1];
            if (lastError) {
                v8::Local<v8::Value> error =
                    XmlSyntaxErrorsSync::BuildSyntaxError(lastError);
                XmlSyntaxErrorsStore::FreeError(lastError);
                argv[0] = error;
            } else {
                argv[0] = v8::Exception::Error(Nan::New<v8::String>
                                            ("Could not parse XML string")
                                            .ToLocalChecked());
            }
            callback->Call(1, argv);
        } else {
            auto doc_handle = getXmlNodeWrap((xmlNode*) doc);
            auto doc_object = SWIGV8_TO_OBJECT(doc_handle);

            Nan::Set(doc_object,
                    Nan::New<v8::String>("errors").ToLocalChecked(),
                    errors.ToArray());
            v8::Local<v8::Value> argv[2] = {
                Nan::Null(),
                doc_object
            };
            callback->Call(2, argv);
        }
    }

    NAN_METHOD(fromBufferAsync) {
        Nan::HandleScope scope;

        auto type =     Nan::To<int>(info[0]).FromJust();
        auto buffer =   info[1];
        auto length =   Nan::To<int>(info[2]).FromJust();
        auto url =      info[3];
        auto encoding = info[4];
        auto flags =    Nan::To<int>(info[5]).FromJust();
        Nan::Callback* callback = new Nan::Callback(Nan::To<v8::Function>(info[6]).ToLocalChecked());

        Nan::AsyncQueueWorker(new FromXmlWorker(callback, type, buffer, length, url, encoding, flags));
    }
%}

%init %{
    Nan::SetMethod(exports_obj, "fromBufferAsync", fromBufferAsync);
%}