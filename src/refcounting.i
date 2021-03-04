#define GUARD_REFERENCE_PROPERTY_ACCESS(CLASS_NAME, RET_TYPE, PROP_NAME) \
%header %{ \
    RET_TYPE CLASS_NAME##_##PROP_NAME##_get(CLASS_NAME* self) { \
        if (self == NULL) { \
            return (RET_TYPE) 0; \
        } \
        \
        return self->PROP_NAME;\
    } \
%} \
%extend struct CLASS_NAME { \
    RET_TYPE PROP_NAME { \
        if (self != NULL) { \
            self->PROP_NAME = (RET_TYPE) PROP_NAME; \
        } \
    } \
}

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlNs *, ns)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlChar *, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlAttr *, properties)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlNs *, nsDef)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, void *, psvi)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, line)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, extra)

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementTypeVal, etype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementContentPtr, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlAttributePtr, attributes)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, const xmlChar *, prefix)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlRegexpPtr, contModel)
// GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, void *, contModel)

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, char *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, compression)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, standalone)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlDtd *, intSubset)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlDtd *, extSubset)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlNs *, oldNs)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, const xmlChar *, version)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, const xmlChar *, encoding)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, ids)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, refs)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, const xmlChar *, URL)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, charset)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlDict *, dict)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, psvi)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, parseFlags)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, properties)

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlAttr *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlAttr *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlNs *, ns)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlAttributeType, atype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, void *, psvi)


GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlDoc *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, notations)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, elements)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, attributes)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, entities)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, const xmlChar *, ExternalID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, const xmlChar *, SystemID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, pentities)


GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, _xmlNs *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, xmlNsType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, const xmlChar *, href)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, const xmlChar *, prefix)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, _xmlDoc *, context)


GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlChar *, orig)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlChar *, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, length)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlEntityType, etype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, const xmlChar *, ExternalID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, const xmlChar *, SystemID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlEntity *, nexte)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, const xmlChar *, URI)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, owner)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, checked)


%extend struct _xmlNode {
    // xmljsRef* _private;
    ~_xmlNode() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlElement {
    // xmljsRef* _private;
    ~_xmlElement() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlDoc {
    // xmljsRef* _private;
    ~_xmlDoc() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlAttr {
    // xmljsRef* _private;
    ~_xmlAttr() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlDtd {
    // xmljsRef* _private;
    ~_xmlDtd() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlEntity {
    // xmljsRef* _private;
    ~_xmlEntity() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlNs {
    // xmljsRef* _private;
    ~_xmlNs() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%typemap(in, noblock=1) void* {
    // res = SWIG_ConvertPtr($input, &$1);

    $1 = getSwigCObjectPtr($input);
}

%typemap(argout, noblock=1) xmlNode*, xmlAttr*, xmlDtd*, xmlElement*, xmlDoc*, xmlNs* {
    checkParentRef(reinterpret_cast<xmlNode*>($1), xmlNodeGetParent(reinterpret_cast<xmlNode*>($1)));
}

%typemap(out, noblock=1) _xmlNode*, _xmlAttr*, _xmlDtd*, _xmlElement*, _xmlDoc* {
    $result = getXmlNodeWrap(reinterpret_cast<xmlNode*>($1));
}

%typemap(out, noblock=1) _xmlNs* {
    if ($1 != NULL && $1->_private == NULL) {
        xmlRegisterNodeCallback(reinterpret_cast<xmlNode*>($1));
    }

    $result = getXmlNodeWrap(reinterpret_cast<xmlNode*>($1));
}

int getMemUsed();
int getNodeCount();

typedef struct xmljsRef {
    int id;
    int count;
    int children;
    xmlNs* ns;
    xmlNode* parent;
    SWIGV8_Proxy* wrap;
} xmljsRef;

%header %{
    #include "assert.h"

    typedef struct xmljsRef {
        int id;
        int count;
        int children;
        xmlNs* ns;
        xmlNode* parent;
        SWIGV8_Proxy* wrap;
    } xmljsRef;

    xmljsRef* getXmlNodePrivate(xmlNode* node) {
        if (node == NULL) {
            return NULL;
        }

        if (node->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = reinterpret_cast<xmlNs*>(node);

            return (xmljsRef*) ns->_private;
        }

        return (xmljsRef*) node->_private;
    }

    void setXmlNodePrivate(xmlNode* node, xmljsRef* value) {
        if (node == NULL) {
            return;
        }

        if (node->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = reinterpret_cast<xmlNs*>(node);

            ns->_private = (void*) value;
        } else {
            node->_private = (void*) value;
        }
    }

    int refGetTotalCount(xmljsRef* ref) {
        return (ref->count + ref->children);
    }

    int getXmlNodeRefCount(xmlNode* node) {
        xmljsRef* ref = getXmlNodePrivate(node);

        if (ref == NULL) {
            return 0;
        }

        return refGetTotalCount(ref);
    }

    int getXmlNodeRefID(xmlNode* node) {
        xmljsRef* ref = getXmlNodePrivate(node);

        if (ref == NULL) {
            return 0;
        }

        return ref->id;
    }

    xmlNs* getNodeNamespace(xmlNode* xml_obj) {
        if ((xml_obj->type == XML_DOCUMENT_NODE) ||
    #ifdef LIBXML_DOCB_ENABLED
            (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
    #endif
            (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
            return reinterpret_cast<xmlDoc*>(xml_obj)->oldNs;
        } else if ((xml_obj->type == XML_ELEMENT_NODE) ||
                (xml_obj->type == XML_XINCLUDE_START) ||
                (xml_obj->type == XML_XINCLUDE_END)) {
            return xml_obj->nsDef;
        } else {
            return NULL;
        }
    }
    
    void setNodeNamespace(xmlNode* xml_obj, xmlNs* ns) {
        if (xml_obj == NULL) {
            return;
        }

        if (xml_obj->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = (xmlNs*) xml_obj;

            while (ns->next != NULL) {
                ns = ns->next;
            }

            ns->next = ns;
        } else if ((xml_obj->type == XML_DOCUMENT_NODE) ||
    #ifdef LIBXML_DOCB_ENABLED
            (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
    #endif
            (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
            reinterpret_cast<xmlDoc*>(xml_obj)->oldNs = ns;
        } else if ((xml_obj->type == XML_ELEMENT_NODE) ||
                (xml_obj->type == XML_XINCLUDE_START) ||
                (xml_obj->type == XML_XINCLUDE_END)) {
            xml_obj->nsDef = ns;
        }
    }

    void checkNamespaceRef(xmlNode* node, xmljsRef* ref) {
        if (node == NULL) {
            return;
        }

        xmlNs* ns = getNodeNamespace(node);
        xmlNs* origRefNs = ref->ns;

        ref->ns = ns;

        while (ns != NULL) {
            xmlNs* refNs = origRefNs;

            while (refNs != NULL && refNs != ns) {
                refNs = refNs->next;
            }

            bool addedNamespace = (refNs != ns);

            if (addedNamespace) {
                // printf("addedNamespace %i - %p %p %p\n", getXmlNodeRefID(node), ns, ns->_private, refNs);
                xmljsRef* nsRef = (xmljsRef*) ns->_private;

                if (nsRef != NULL) {
                    nsRef->count++;
                }
            }

            ns = ns->next;
        }
    }

    void checkParentRef(xmlNode* node, xmlNode* parent, int increment = 0) {
        xmlNode* freeNode = node;

        xmljsRef* ref = getXmlNodePrivate(node);

        if (ref == NULL) {
            if (node != NULL && node->type != XML_NAMESPACE_DECL) {
                // xmlNs nodes can exist without having _private,
                // since libxml2 doesn't initialize them with xmlRegisterNodeCallback
                printf("node has no private %i\n", node->type);
            }
            return;
        }

        checkNamespaceRef(node, ref);

        const int totalCount = refGetTotalCount(ref);
        const int parentChanged = (ref->parent != parent);
        const int parentIncrement = (parentChanged ? totalCount + increment : increment);
        const int parentDecrement = (ref->children > 0 ? ref->count : totalCount);

        xmlNode* currentNode = NULL;
        xmljsRef* currentRef = NULL;

        if (parentChanged) {
            // printf("checkParentRef(%2i - %04X): ref(%2i): %3i, children: %3i, parent: %p => %p\n", node->type, ref->id, increment, ref->count + increment, ref->children, ref->parent, parent);
        } else {
            // printf("checkParentRef(%2i - %04X): ref(%2i): %3i, children: %3i\n", node->type, ref->id, increment, ref->count + increment, ref->children);
        }

        assert(ref->count >= 0);

        if (parentChanged) {
            xmljsRef initialRef;
            initialRef.id = 0;
            initialRef.count = 0;
            initialRef.children = 0;
            initialRef.parent = NULL;
            initialRef.wrap = NULL;

            currentRef = &initialRef;
            currentNode = ref->parent;
            assert(currentNode == NULL || initialRef.count >= 0);

            while (currentNode != NULL && currentNode != node) {
                currentRef = getXmlNodePrivate(currentNode);

                assert(currentRef != NULL);

                currentRef->children -= parentDecrement;
                // printf(" - checkParent(%2i - %04X): ref(%2i): %3i, children: %3i\n", currentNode->type, currentRef->id, parentDecrement * -1, currentRef->count, currentRef->children);

                assert(currentRef->children >= 0);
                
                if (refGetTotalCount(currentRef) < 1 && currentNode->parent == NULL) {
                    freeNode = currentNode;
                }

                currentNode = xmlNodeGetParent(currentNode);
            }
        }

        currentNode = parent;

        while (currentNode != NULL && currentNode != node) {
            currentRef = getXmlNodePrivate(currentNode);

            if (currentRef != NULL) {
                currentRef->children += parentIncrement;
                // printf(" + checkParent(%2i - %04X): ref(%2i): %3i, children: %3i\n", currentNode->type, currentRef->id, parentIncrement, currentRef->count, currentRef->children);
            }

            currentNode = xmlNodeGetParent(currentNode);

            // todo: check again for parent recursion?
        }

        ref->parent = parent;
        ref->count += increment;

        if (increment < 0) {
            ref->wrap = NULL;
        }

        if (freeNode != NULL && getXmlNodeRefCount(freeNode) < 1 && xmlNodeGetParent(freeNode) == NULL) {
            // printf("xmlFreeNode(%2i - %04X)\n", freeNode->type, getXmlNodeRefID(freeNode));
            xmlFreeNode(freeNode);
        }
    }

    void xmlDeregisterNodeCallback(xmlNode* xml_obj);

    void deregisterNodeNamespaces(xmlNode* xml_obj) {
        if (xml_obj == NULL) {
            return;
        }

        xmlNode* prev = xml_obj;
        xmlNs* ns = getNodeNamespace(xml_obj);

        while (ns != NULL) {
            xmljsRef* nsRef = (xmljsRef*) ns->_private;
            
            if (nsRef == NULL) {
                setNodeNamespace(prev, ns);
                prev = (xmlNode*) ns;
            } else {
                nsRef->count--;
                ns->context = NULL;
                setNodeNamespace(prev, ns->next);
            }

            ns = ns->next;
        }
    }

    void xmlRegisterNodeCallback(xmlNode* xml_obj)  {
        xml_node_count++;

        xmlNs* ns = getNodeNamespace(xml_obj);

        if (ns != NULL) {
            setXmlNodePrivate((xmlNode*) ns, NULL);
        }

        xmljsRef* ref = (xmljsRef*) xmlMalloc(sizeof(xmljsRef));

        ref->id = xml_node_count;
        ref->count = 0;
        ref->children = 0;
        ref->ns = NULL;
        ref->parent = NULL;
        ref->wrap = NULL;

        // printf("xmlRegisterNodeCallback(%2i - %04X): %p - %p\n", xml_obj->type, ref->id, xml_obj, ref);

        setXmlNodePrivate(xml_obj, ref);
    }
    
    void xmlDeregisterNodeCallback(xmlNode* xml_obj)  {
        xml_node_count--;

        deregisterNodeNamespaces(xml_obj);

        xmljsRef* ref = getXmlNodePrivate(xml_obj);

        if (ref == NULL) {
            return;
        }

        if (ref->wrap != NULL) {
            SWIGV8_Proxy* wrap = ref->wrap;

            wrap->swigCObject = NULL;
            wrap->swigCMemOwn = false;
        }

        ref->ns = NULL;
        ref->parent = NULL;
        ref->wrap = NULL;

        setXmlNodePrivate(xml_obj, NULL);

        xmlFree(ref);
    }

    SWIGV8_VALUE getXmlNodeWrap(xmlNode* node) {
        Nan::EscapableHandleScope scope;
        xmljsRef* ref = getXmlNodePrivate(node);

        if (ref == NULL) {
            // return SWIGV8_NULL();
            return SWIG_NewPointerObj(SWIG_as_voidptr(node), SWIGTYPE_p__xmlNode, 0);
        }

        xmlNode* parent = xmlNodeGetParent(node);
        swig_type_info* info = xmlNodeGetSwigPtrInfo(node);

        if (ref->wrap == NULL || ref->wrap->handle.IsEmpty()) {
            SWIGV8_VALUE value = SWIG_NewPointerObj(SWIG_as_voidptr(node), info, SWIG_POINTER_OWN);

            SWIGV8_OBJECT object = SWIGV8_TO_OBJECT(value);

            ref->wrap = getSwigProxy(object);

            checkParentRef(node, parent, 1);
        } else {
            checkParentRef(node, parent, 0);
        }

        if (ref->wrap->handle.IsEmpty()) {
            return SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlNode, 0);
        }

        return scope.Escape(Nan::New(ref->wrap->handle));
    }

    void xmlNodeDtor(xmlNode* node) {
        checkParentRef(node, NULL, -1);
    }
    
    // xmljsRef* _xmlNode__private_get(xmlNode* node) {
    //     return (xmljsRef*) node->_private;
    // }
    
    // void _xmlNode__private_set(xmlNode* node, xmljsRef* ref) {
    //     node->_private = (void*) ref;
    // }
%}


%init %{
    xmlRegisterNodeDefault(xmlRegisterNodeCallback);

    xmlDeregisterNodeDefault(xmlDeregisterNodeCallback);

    LIBXML_TEST_VERSION;
%}