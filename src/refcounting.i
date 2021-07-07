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


#define GUARD_REFERENCE_PROPERTY_ACCESS_FUNC(CLASS_NAME, RET_TYPE, PROP_NAME, GET_FUNC, SET_FUNC) \
%header %{ \
    RET_TYPE CLASS_NAME##_##PROP_NAME##_get(CLASS_NAME* self) { \
        if (self == NULL) { \
            return (RET_TYPE) 0; \
        } \
        \
        return GET_FUNC(self);\
    } \
%} \
%extend struct CLASS_NAME { \
    RET_TYPE PROP_NAME { \
        if (self != NULL) { \
            SET_FUNC(self, (RET_TYPE) PROP_NAME); \
        } \
    } \
}

#define GUARD_REFERENCE_PROPERTY_ACCESS_STRING(CLASS_NAME, RET_TYPE, PROP_NAME) \
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
            if (self->PROP_NAME != NULL) { \
                xmlFree((void*)self->PROP_NAME); \
            } \
            \
            self->PROP_NAME = xmlStrdup((RET_TYPE) PROP_NAME); \
        } \
    } \
}

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNode, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS_FUNC(_xmlNode, xmlNs *, ns, getNodeNamespace, xmlSetNs)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNode, xmlChar *, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, _xmlAttr *, properties)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlNs *, nsDef)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, void *, psvi)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, line)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, extra)

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlElement, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementTypeVal, etype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementContentPtr, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlAttributePtr, attributes)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlElement, const xmlChar *, prefix)
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
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDoc, const xmlChar *, version)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDoc, const xmlChar *, encoding)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, ids)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, refs)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDoc, const xmlChar *, URL)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, charset)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, _xmlDict *, dict)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, void *, psvi)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, parseFlags)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, properties)

GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlAttr, const xmlChar *, name)
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
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, name)
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
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, ExternalID)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, SystemID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, pentities)


GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, _xmlNs *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, xmlNsType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNs, const xmlChar *, href)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNs, const xmlChar *, prefix)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, _xmlDoc *, context)


GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, xmlChar *, orig)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, xmlChar *, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, length)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlEntityType, etype)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, const xmlChar *, ExternalID)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, const xmlChar *, SystemID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, _xmlEntity *, nexte)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, const xmlChar *, URI)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, owner)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, int, checked)


%extend struct _xmlNode {
    ~_xmlNode() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlElement {
    ~_xmlElement() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlDoc {
    ~_xmlDoc() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlAttr {
    ~_xmlAttr() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlDtd {
    ~_xmlDtd() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlEntity {
    ~_xmlEntity() {
        xmlNodeDtor((xmlNode*)self);
    }
}

%extend struct _xmlNs {
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
    // libxml won't call xmlRegisterNodeCallback on XML_HTML_DOCUMENT_NODE
    if ($1 != NULL && $1->type == XML_HTML_DOCUMENT_NODE && $1->_private == NULL) {
        xmlRegisterNodeCallback(reinterpret_cast<xmlNode*>($1));
    }

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
    xmlNs** ns;
    xmlNode* parent;
    SWIGV8_Proxy* wrap;
} xmljsRef;

%header %{
    #include "assert.h"

    // some exposed libxml API functions (like xmlAddChild) will free the provided node,
    // resulting in the proceeding checkParentRef() to process a freed node
    // record the previously freed node so that we can avoid running checkParentRef()
    // in those instances
    xmlNode* lastFreedNode = NULL;

    typedef struct xmljsRef {
        int id;
        int count;
        int children;
        xmlNs** ns;
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

    void checkNamespaceRef(xmlNode* node, xmljsRef* ref) {
        if (node == NULL || node->type == XML_NAMESPACE_DECL) {
            return;
        }

        xmlNs* ns = getNodeNamespaceDef(node);
        xmlNs** refNs = ref->ns;
        xmlNs** newRefNs = NULL;
        int nsCount = countNamespaces(ns);
        
        if (nsCount > 0) {
            newRefNs = (xmlNs**) xmlMalloc(sizeof(xmlNs*) * (nsCount + 1));

            for (int i = 0; i < (nsCount + 1); i++) {
                newRefNs[i] = NULL;
            }
        }

        for (int i = 0; refNs != NULL && refNs[i] != NULL; i++) {
            bool removedNamespace = true;
            xmlNs* tmpNs = ns;

            while (tmpNs != NULL) {
                if (tmpNs == refNs[i]) {
                    removedNamespace = false;
                    break;
                }

                tmpNs = tmpNs->next;
            }

            if (removedNamespace) {
                // printf("removedNamespace %i - %p %p %p\n", getXmlNodeRefID(node), ns, ns->_private, refNs);
                xmljsRef* nsRef = (xmljsRef*) refNs[i]->_private;

                if (nsRef != NULL) {
                    nsRef->count--;
                }
            }
        }

        while (ns != NULL) {
            bool addedNamespace = true;

            for (int i = 0; refNs != NULL && refNs[i] != NULL; i++) {
                if (refNs[i] == ns) {
                    addedNamespace = false;
                    break;
                }
            }

            if (addedNamespace) {
                // printf("addedNamespace %i - %p %p %p\n", getXmlNodeRefID(node), ns, ns->_private, refNs);
                xmljsRef* nsRef = (xmljsRef*) ns->_private;

                if (nsRef != NULL) {
                    nsRef->count++;
                }
            }

            ns = ns->next;
        }

        xmlFree(ref->ns);

        ref->ns = newRefNs;
    }

    void checkParentRef(xmlNode* node, xmlNode* parent, int increment = 0) {
        xmlNode* freeNode = node;

        if (lastFreedNode == node) {
            return;
        }

        xmljsRef* ref = getXmlNodePrivate(node);

        if (ref == NULL) {
            if (node != NULL && node->type != XML_NAMESPACE_DECL) {
                // xmlNs nodes can exist without having _private,
                // since libxml2 doesn't initialize them with xmlRegisterNodeCallback
                // printf("node has no private %i\n", node->type);
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

                // if (currentRef == NULL)  {
                //     printf("currentRef == NULL\n");
                //     currentNode = xmlNodeGetParent(currentNode);
                //     continue;
                // }

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

        if (freeNode != NULL && getXmlNodeRefCount(freeNode) < 1 && xmlNodeGetParent(freeNode) == NULL && freeNode->type != XML_NAMESPACE_DECL) {
            // printf("xmlFreeNode(%2i - %04X)\n", freeNode->type, getXmlNodeRefID(freeNode));
            if ((freeNode->type == XML_DOCUMENT_NODE) ||
        #ifdef LIBXML_DOCB_ENABLED
            (freeNode->type == XML_DOCB_DOCUMENT_NODE) ||
        #endif
            (freeNode->type == XML_HTML_DOCUMENT_NODE)) {
	            xmlFreeDoc((xmlDocPtr) freeNode);
            } else {
                xmlFreeNode(freeNode);
            }
        }
    }

    void xmlRegisterNodeCallback(xmlNode* xml_obj)  {
        xml_node_count++;

        xmlNs* ns = getNodeNamespaceDef(xml_obj);

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
    
    void deregisterNodeNamespaces(xmlNode* xml_obj);

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
            wrap->handle.Reset();
        }

        ref->ns = NULL;
        ref->parent = NULL;
        ref->wrap = NULL;

        setXmlNodePrivate(xml_obj, NULL);

        lastFreedNode = xml_obj;

        xmlFree(ref);
    }

    void deregisterNodeNamespaces(xmlNode* xml_obj) {
        if (xml_obj == NULL) {
            return;
        }

        xmlNode* prev = xml_obj;
        xmlNs* ns = getNodeNamespaceDef(xml_obj);

        setNodeNamespaceDef(xml_obj, NULL);
        // while (ns != NULL) {
        //     // printf("deregister\n");
        //     xmljsRef* nsRef = (xmljsRef*) ns->_private;
            
        //     if (nsRef == NULL) {
        //         setNodeNamespaceDef(prev, ns);
        //         prev = (xmlNode*) ns;
        //         ns = ns->next;
        //     } else {
        //         nsRef->count--;

        //         if ((xmlNode*)ns->context == xml_obj) {
        //             ns->context = NULL;
        //         }

        //         xmlNs* nextNs = ns->next;
        //         setNodeNamespaceDef(prev, nextNs);

        //         if (nsRef->count < 1) {
        //             // xmlDeregisterNodeCallback(reinterpret_cast<xmlNode*>(ns));
        //         }

        //         ns = nextNs;
        //     }
        // }
    }

    SWIGV8_VALUE getXmlNodeWrap(xmlNode* node) {
        Nan::EscapableHandleScope scope;
        xmljsRef* ref = getXmlNodePrivate(node);

        swig_type_info* info = xmlNodeGetSwigPtrInfo(node);

        if (ref == NULL) {
            // return SWIGV8_NULL();
            if (node != NULL) {
                printf("NO REF FOR NODE %i\n", node->type);
            }
            
            return SWIG_NewPointerObj(SWIG_as_voidptr(node), SWIGTYPE_p__xmlNode, 0);
        }

        xmlNode* parent = xmlNodeGetParent(node);

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