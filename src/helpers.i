void setDebugEnable();
void setDebugDisable();
// xmlNode* getChildAtIndex(xmlNode* node, int index);

int libxmljs_debug;

%header %{
    #if defined(_WIN32) && defined(_MSC_VER)
    #if defined(IN_LIBXMLJS)
        #define LIBXMLJS_API __declspec(dllexport)
    #else
        #define LIBXMLJS_API __declspec(dllimport)
    #endif
    #else
    #define LIBXMLJS_API
    #endif

    int libxmljs_debug = 0;

    void setDebugEnable() {
        libxmljs_debug = 1;
    }

    void setDebugDisable() {
        libxmljs_debug = 0;
    }

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

    SWIGV8_Proxy* getSwigProxy(SWIGV8_OBJECT objRef) {
        #if (V8_MAJOR_VERSION-0) < 4 && (SWIG_V8_VERSION < 0x031511)
            v8::Handle<v8::Value> cdataRef = objRef->GetInternalField(0);
            return ((SWIGV8_Proxy *) v8::External::Unwrap(cdataRef));
        #else
            return ((SWIGV8_Proxy *) objRef->GetAlignedPointerFromInternalField(0));
        #endif
    }

    void* getSwigCObjectPtr(SWIGV8_VALUE value) {
        SWIGV8_Proxy *cdata;

        if (value->IsNull()) {
            return NULL;
        }

        if (!value->IsObject()) {
            // SWIG_exception_fail(0, "!$input->IsObject()");
            return NULL;
        }

        SWIGV8_OBJECT objRef = SWIGV8_TO_OBJECT(value);

        if (objRef->InternalFieldCount() < 1) {
            // SWIG_exception_fail(0, "InternalFieldCount < 1");
            return NULL;
        }

        cdata = getSwigProxy(objRef);

        if (cdata == NULL) {
            return NULL;
        }

        return (void*) cdata->swigCObject;
    }

    swig_type_info* getSwigCObjectPtrInfo(SWIGV8_VALUE value) {
        SWIGV8_Proxy *cdata;

        if (value->IsNull()) {
            return NULL;
        }

        if (!value->IsObject()) {
            // SWIG_exception_fail(0, "!$input->IsObject()");
            return NULL;
        }

        SWIGV8_OBJECT objRef = SWIGV8_TO_OBJECT(value);

        if (objRef->InternalFieldCount() < 1) {
            // SWIG_exception_fail(0, "InternalFieldCount < 1");
            return NULL;
        }

        cdata = getSwigProxy(objRef);

        if (cdata == NULL) {
            return NULL;
        }

        return cdata->info;
    }

    xmlNode* xmlNodeGetParent(xmlNode* node) {
        if (node == NULL) {
            return NULL;
        }
        
        switch (node->type) {
            case XML_ENTITY_DECL: {
                xmlEntityPtr castedNode = (xmlEntityPtr) node;
                return (xmlNode*) castedNode->parent;
            }

            case XML_NAMESPACE_DECL: {
                // xmlNsPtr castedNode = (xmlNsPtr)(node);
                // return (xmlNode*) castedNode->context;
                return NULL;
            }

            case XML_DOCUMENT_NODE:
            case XML_DOCB_DOCUMENT_NODE:
            case XML_HTML_DOCUMENT_NODE: {
                return NULL;
            }

            case XML_ATTRIBUTE_NODE: {
                xmlAttrPtr castedNode = (xmlAttrPtr) node;
                return (xmlNode*) castedNode->parent;
            }

            case XML_DTD_NODE: {
                xmlDtdPtr castedNode = (xmlDtdPtr) node;

                if (castedNode->parent == NULL) {
                    return (xmlNode*) castedNode->doc;
                }

                return (xmlNode*) castedNode->parent;
            }

            case XML_ELEMENT_DECL: {
                xmlElementPtr castedNode = (xmlElementPtr) node;
                return (xmlNode*) castedNode->parent;
            }

            default: {
                // if (node->parent == NULL) {
                //     return (xmlNode*) node->doc;
                // }

                return (xmlNode*) node->parent;
            }
        }
    }

    swig_type_info* xmlNodeGetSwigPtrInfo(xmlNode* node) {
        if (node == NULL) {
            return SWIGTYPE_p__xmlNode;
        }

        switch (node->type) {
            // case XML_XINCLUDE_START:
            // case XML_XINCLUDE_END: {
            //     result = createWrap(node, NULL, SWIGTYPE_p__xmlNode);
            // }
            case XML_ENTITY_DECL: 
                return SWIGTYPE_p__xmlEntity;

            case XML_NAMESPACE_DECL:
                return SWIGTYPE_p__xmlNs;

            case XML_DOCUMENT_NODE:
                return SWIGTYPE_p__xmlDoc;

            case XML_HTML_DOCUMENT_NODE:
                return SWIGTYPE_p__xmlDoc;

            case XML_DOCB_DOCUMENT_NODE: 
                return SWIGTYPE_p__xmlDoc;

            case XML_ATTRIBUTE_NODE:
                return SWIGTYPE_p__xmlAttr;

            case XML_DTD_NODE:
                return SWIGTYPE_p__xmlDtd;

            case XML_ELEMENT_DECL:
                return SWIGTYPE_p__xmlElement;

            default:
                return SWIGTYPE_p__xmlNode;
        }
    }

    int countNamespaces(xmlNs* ns) {
        int count = 0;
        
        while (ns != NULL) {
            count++;

            ns = ns->next;
        }

        return count;
    }

    xmlNs* getNodeNamespace(xmlNode* node) {
        if ((node->type == XML_ELEMENT_NODE) ||
            (node->type == XML_ATTRIBUTE_NODE)) {
            return node->ns;
        }

        return NULL;
    }

    xmlNs* getNodeNamespaceDef(xmlNode* xml_obj) {
        if ((xml_obj->type == XML_DOCUMENT_NODE) ||
    #ifdef LIBXML_DOCB_ENABLED
            (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
    #endif
            (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
            return ((xmlDoc*) xml_obj)->oldNs;
        } else if ((xml_obj->type == XML_ELEMENT_NODE) ||
                (xml_obj->type == XML_XINCLUDE_START) ||
                (xml_obj->type == XML_XINCLUDE_END)) {
            return xml_obj->nsDef;
        } else {
            return NULL;
        }
    }
    
    void setNodeNamespaceDef(xmlNode* xml_obj, xmlNs* newNs) {
        if (xml_obj == NULL) {
            return;
        }

        if (xml_obj->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = (xmlNs*) xml_obj;

            while (ns->next != NULL) {
                ns = ns->next;
            }

            ns->next = newNs;
        } else if ((xml_obj->type == XML_DOCUMENT_NODE) ||
    #ifdef LIBXML_DOCB_ENABLED
            (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
    #endif
            (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
            ((xmlDoc*) xml_obj)->oldNs = newNs;
        } else if ((xml_obj->type == XML_ELEMENT_NODE) ||
                (xml_obj->type == XML_XINCLUDE_START) ||
                (xml_obj->type == XML_XINCLUDE_END)) {
            xml_obj->nsDef = newNs;
        }
    }

    xmlNode* getChildAtIndex(xmlNode* node, int index) {
        if (node == NULL) {
            return NULL;
        }

        int currIndex = 0;
        xmlNode* child = node->children;

        while (child != NULL) {
            if (currIndex >= index) {
                break;
            }

            currIndex++;
            child = child->next;
        }

        return child;
    }
%}