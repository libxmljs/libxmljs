void setDebugEnable();
void setDebugDisable();
xmlNode* getChildAtIndex(xmlNode* node, int index);

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

    SWIGV8_Proxy* getSwigProxy(SWIGV8_OBJECT objRef) {
        #if (V8_MAJOR_VERSION-0) < 4 && (SWIG_V8_VERSION < 0x031511)
            v8::Handle<v8::Value> cdataRef = objRef->GetInternalField(0);
            return static_cast<SWIGV8_Proxy *>(v8::External::Unwrap(cdataRef));
        #else
            return static_cast<SWIGV8_Proxy *>(objRef->GetAlignedPointerFromInternalField(0));
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
                xmlEntityPtr castedNode = reinterpret_cast<xmlEntityPtr>(node);
                return (xmlNode*) castedNode->parent;
            }

            case XML_NAMESPACE_DECL: {
                // xmlNsPtr castedNode = reinterpret_cast<xmlNsPtr>(node);
                // return (xmlNode*) castedNode->context;
                return NULL;
            }

            case XML_DOCUMENT_NODE:
            case XML_DOCB_DOCUMENT_NODE:
            case XML_HTML_DOCUMENT_NODE: {
                return NULL;
            }

            case XML_ATTRIBUTE_NODE: {
                xmlAttrPtr castedNode = reinterpret_cast<xmlAttrPtr>(node);
                return (xmlNode*) castedNode->parent;
            }

            case XML_DTD_NODE: {
                xmlDtdPtr castedNode = reinterpret_cast<xmlDtdPtr>(node);

                if (castedNode->parent == NULL) {
                    return (xmlNode*) castedNode->doc;
                }

                return (xmlNode*) castedNode->parent;
            }

            case XML_ELEMENT_DECL: {
                xmlElementPtr castedNode = reinterpret_cast<xmlElementPtr>(node);
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
            //     result = getXmlNodeWrap(node, NULL, SWIGTYPE_p__xmlNode);
            // }
            case XML_ENTITY_DECL: {
                return SWIGTYPE_p__xmlEntity;
            }
            case XML_NAMESPACE_DECL:{
                return SWIGTYPE_p__xmlNs;
            }
            case XML_DOCUMENT_NODE:
            case XML_DOCB_DOCUMENT_NODE:
            case XML_HTML_DOCUMENT_NODE:{
                return SWIGTYPE_p__xmlDoc;
            }
            case XML_ATTRIBUTE_NODE:{
                return SWIGTYPE_p__xmlAttr;
            }
            case XML_DTD_NODE:{
                return SWIGTYPE_p__xmlDtd;
            }
            case XML_ELEMENT_DECL:{
                return SWIGTYPE_p__xmlElement;
            }
            default: {
                return SWIGTYPE_p__xmlNode;
            }
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