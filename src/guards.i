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

#define GUARD_REFERENCE_PROPERTY_ACCESS_REF(CLASS_NAME, RET_TYPE, PROP_NAME) \
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

#define GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(CLASS_NAME, RET_TYPE, PROP_NAME) \
%header %{ \
    int CLASS_NAME##_##PROP_NAME##_get(CLASS_NAME* self) { \
        return 0;\
    } \
    int CLASS_NAME##_##PROP_NAME##_set(CLASS_NAME* self, int value) { \
        return 0; \
    } \
%} \
%extend struct CLASS_NAME { \
    int _private; \
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

GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlNode, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNode, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS_FUNC(_xmlNode, xmlNs *, ns, getNodeNamespace, xmlSetNs)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNode, xmlChar *, content)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, _xmlAttr *, properties)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNode, xmlNs *, nsDef)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, void *, psvi)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, line)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNode, unsigned short, extra)

GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlElement, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlElement, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlElement, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementTypeVal, etype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlElementContentPtr, content)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlAttributePtr, attributes)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlElement, const xmlChar *, prefix)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, xmlRegexpPtr, contModel)
// GUARD_REFERENCE_PROPERTY_ACCESS(_xmlElement, void *, contModel)

GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlDoc, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, char *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, compression)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDoc, int, standalone)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlDtd *, intSubset)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlDtd *, extSubset)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDoc, _xmlNs *, oldNs)
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

GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlAttr, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlAttr, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlNode *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlAttr *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlAttr *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlAttr, xmlNs *, ns)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, xmlAttributeType, atype)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlAttr, void *, psvi)


GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlDtd, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlDoc *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, _xmlDoc *, doc)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, void *, notations)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, void *, elements)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, void *, attributes)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlDtd, void *, entities)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, ExternalID)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlDtd, const xmlChar *, SystemID)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlDtd, void *, pentities)


GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNs, _xmlNs *, next)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlNs, xmlNsType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNs, const xmlChar *, href)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlNs, const xmlChar *, prefix)
GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlNs, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlNs, _xmlDoc *, context)


GUARD_REFERENCE_PROPERTY_ACCESS_PRIVATE(_xmlEntity, void *, _private)
GUARD_REFERENCE_PROPERTY_ACCESS(_xmlEntity, xmlElementType, type)
GUARD_REFERENCE_PROPERTY_ACCESS_STRING(_xmlEntity, const xmlChar *, name)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlNode *, children)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlNode *, last)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlDtd *, parent)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlNode *, next)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlNode *, prev)
GUARD_REFERENCE_PROPERTY_ACCESS_REF(_xmlEntity, _xmlDoc *, doc)
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