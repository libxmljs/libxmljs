
%extend struct _xmlNode {
    ~_xmlNode() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlElement {
    ~_xmlElement() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlDoc {
    ~_xmlDoc() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlAttr {
    ~_xmlAttr() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlDtd {
    ~_xmlDtd() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlEntity {
    ~_xmlEntity() {
        destroyWrap((xmlNode*)self);
    }
}

%extend struct _xmlNs {
    ~_xmlNs() {
        // printf("destroyNs %i\n", self);
        SWIGV8_Proxy* wrap = (SWIGV8_Proxy*) self->_private;

        if (wrap != NULL) {
            resetWrap(wrap);
            if (wrap->doc != NULL && wrap->doc->_private != NULL) {
                getXmlNodePrivate((xmlNode*) wrap->doc)->Unref();
            }
        }
        
        self->_private = NULL;
    }
}

// %typemap(argout, noblock=1) xmlNode*, xmlAttr*, xmlDtd*, xmlElement*, xmlDoc*, xmlNs* {
//     checkParentChanged(((xmlNode*) $1));
// }

%typemap(in, noblock=1) _xmlNode* (int res, void* arg), xmlNode* (int res, void* arg) {
    res = SWIG_ConvertPtr($input, &arg, $1_descriptor, 0 | 0 );

    if (!SWIG_IsOK(res)) {
        if (SWIG_IsOK(SWIG_ConvertPtr($input, &arg, $descriptor(xmlDoc*), 0 | 0))) {
        } else if (SWIG_IsOK(SWIG_ConvertPtr($input, &arg, $descriptor(xmlAttr*), 0 | 0))) {
        } else if (SWIG_IsOK(SWIG_ConvertPtr($input, &arg, $descriptor(xmlDtd*), 0 | 0))) {
        } else if (SWIG_IsOK(SWIG_ConvertPtr($input, &arg, $descriptor(xmlElement*), 0 | 0))) {
        } else {
            SWIG_exception_fail(SWIG_ArgError(res), "in method '$symname', argument $argnum of type '$1_type'"); 
        }
    }

    $1 = (($1_ltype) arg);
}

// Avoid SWIG's reinterpret_cast calls
%typemap(in, noblock=1)
    _xmlAttr* (int res, void* arg),
    _xmlDoc* (int res, void* arg),
    _xmlDtd* (int res, void* arg),
    _xmlElement* (int res, void* arg),
    _xmlEntity* (int res, void* arg),
    _xmlNs* (int res, void* arg)
{
  res = SWIG_ConvertPtr($input, &arg, $1_descriptor, 0 |  0 );
  if (!SWIG_IsOK(res)) {
            SWIG_exception_fail(SWIG_ArgError(res), "in method '$symname', argument $argnum of type '$1_type'"); 
  }
  $1 = ($1_ltype) arg;
}

%typemap(out, noblock=1) _xmlNode*, _xmlAttr*, _xmlDtd*, _xmlElement*, _xmlDoc*, _xmlNs*, _xmlEntity* {
    $result = createWrap((xmlNode*) $1, $1_descriptor);
}

%typemap(out, noblock=1) _xmlNs* {
    $result = createWrapNs($1, $1_descriptor);
}

// %typemap(out, noblock=1) _xmlNs* {
//     if ($1 != NULL && $1->_private == NULL) {
//         xmlRegisterNodeCallback(((xmlNode*) $1));
//     }

//     $result = createWrap(((xmlNode*) $1));
// }

bool xmlDocHasRootElement(const xmlDoc *doc);

// override xmlUnlinkNode so we can automatically
// perform the necessary unlinking
%ignore _xmlUnlinkNode;
%rename _xmlUnlinkNode xmlUnlinkNode;
void _xmlUnlinkNode(xmlNodePtr cur);

%include "./refcounting-tree.i"
%header %{
    #include "assert.h"

    bool xmlDocHasRootElement(const xmlDoc *doc) {
        return xmlDocGetRootElement(doc) != NULL;
    }

    bool isDocumentNode(xmlNode* node) {
        return (node->type == XML_DOCUMENT_NODE || node->type == XML_HTML_DOCUMENT_NODE);
    }

    SWIGV8_Proxy* getXmlNodePrivate(xmlNode* node) {
        if (node == NULL) {
            return NULL;
        }

        if (node->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = ((xmlNs*) node);

            return (SWIGV8_Proxy*) ns->_private;
        }

        return (SWIGV8_Proxy*) node->_private;
    }

    void setXmlNodePrivate(xmlNode* node, SWIGV8_Proxy* value) {
        if (node == NULL) {
            return;
        }

        if (node->type == XML_NAMESPACE_DECL) {
            xmlNs* ns = ((xmlNs*) node);

            ns->_private = (void*) value;
        }

        node->_private = (void*) value;
    }
    
    void xmlRegisterNodeCallback(xmlNode* node)  {
        xml_node_count++;

        // printf("xmlRegisterNodeCallback type: %i, count: %i, mem: %i\n", node->type, xml_node_count, xml_memory_used);
    }

    void resetWrap(SWIGV8_Proxy* wrap) {
        // printf("resetWrap\n");
        if (wrap == NULL || (!wrap->swigCMemOwn && wrap->swigCObject == NULL)) {
            return; // null or already reset wrap
        }

        wrap->swigCObject = NULL;
        wrap->swigCMemOwn = false;
        // wrap->handle.Reset();
        wrap->handle.Reset(v8::Isolate::GetCurrent(), SWIGV8_OBJECT_NEW());
    }

    void deregisterNsList(xmlNs* ns) {
        while (ns != NULL) {
            if (ns->_private != NULL) {
                resetWrap((SWIGV8_Proxy*) ns->_private);
            }

            ns = ns->next;
        }
    }

    void deregisterNodeNamespaces(xmlNode* xml_obj) {
        xmlNs* ns = NULL;
        if ((xml_obj->type == XML_DOCUMENT_NODE) ||
    #ifdef LIBXML_DOCB_ENABLED
            (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
    #endif
            (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
            ns = ((xmlDoc*) xml_obj)->oldNs;
        }
        else if ((xml_obj->type == XML_ELEMENT_NODE) ||
                (xml_obj->type == XML_XINCLUDE_START) ||
                (xml_obj->type == XML_XINCLUDE_END)) {
            ns = xml_obj->nsDef;
        }
        if (ns != NULL) {
            deregisterNsList(ns);
        }
    }

    void xmlDeregisterNodeCallback(xmlNode* xml_obj)  {
        xml_node_count--;

        deregisterNodeNamespaces(xml_obj);

        SWIGV8_Proxy* wrap = getXmlNodePrivate(xml_obj);

        if (wrap != NULL) {
            // Node is being deleted before its wrap was destroyed
            resetWrap(wrap);
            // printf("xmlDeregisterNodeCallback freeing wrapped node %i\n", xml_obj->type);
        }

        // printf("xmlDeregisterNodeCallback type: %i, count: %i, mem: %i\n", xml_obj->type, xml_node_count, xml_memory_used);
    }

    void SWIGV8_Proxy::Ref() {
        // printf("ref %i, %i\n", this->swigCObject, refCount + 1);
        refCount++;
        handle.ClearWeak();
    };

    void SWIGV8_Proxy::Unref() {
        // printf("unref %i, %i\n", this->swigCObject, refCount - 1);
        if (--refCount < 1) {
            handle.SetWeak(this, ((SWIGV8_ClientData*)info->clientdata)->dtor, v8::WeakCallbackType::kParameter);
        }
    }

    void wrapDestructor(SWIGV8_Proxy* wrap, xmlNode* xml_obj) {
        SWIGV8_Proxy* docWrap = getXmlNodePrivate((xmlNode*) wrap->doc);

        if (docWrap != NULL) {
            docWrap->Unref();
        }

        unref_wrapped_ancestor(wrap);

        if (xml_obj != NULL) {
            // printf("wrapDestructor %i type: %i, count: %i, mem: %i\n", xml_obj, xml_obj->type, xml_wrap_count - 1, xml_memory_used);

            if (isDocumentNode(xml_obj)) {
                // printf("xmlFreeDoc %i - %i\n", xml_obj->type, xml_memory_used);
                xmlFreeDoc((xmlDoc*) xml_obj);
            } else {
                if (xml_obj->parent == NULL) {
                    // printf("PARENT NULL %i %i\n", xml_obj, get_wrapped_descendant(xml_obj));
                    if (get_wrapped_descendant(xml_obj) == NULL) {
                        // printf("xmlFreeNode %i - %i\n", xml_obj->type, xml_memory_used);
                        xmlFreeNode(xml_obj);
                    }
                } else {
                    // printf("PARENT NOT NULL %i %i\n", xml_obj, get_wrapped_ancestor_or_root(xml_obj));

                    xmlNode *ancestor = get_wrapped_ancestor_or_root(xml_obj);
                    if ((ancestor->_private == NULL) &&
                        (ancestor->parent == NULL) &&
                        (get_wrapped_descendant(ancestor, xml_obj) == NULL)) {
                        // printf("xmlFreeNode ancestor %i - %i\n", ancestor->type, xml_memory_used);
                        xmlFreeNode(ancestor);
                    }
                }
            }
        } else {
            // printf("wrapDestructor count: %i, mem: %i\n", xml_wrap_count - 1, xml_memory_used);
        }

        xml_wrap_count--;

    }
    
    void wrapConstructor(SWIGV8_Proxy* wrap, xmlNode* xml_obj) {
        wrap->ancestor = NULL;

        if (!isDocumentNode(xml_obj)) {
            wrap->doc = xml_obj->doc;

            SWIGV8_Proxy* docWrap = getXmlNodePrivate((xmlNode*) wrap->doc);

            if (docWrap != NULL) {
                docWrap->Ref();
            }

            ref_wrapped_ancestor(wrap, xml_obj);
        }

        xml_wrap_count++;

        // printf("wrapConstructor %i type: %i, count: %i, mem: %i\n", xml_obj, xml_obj->type, xml_wrap_count, xml_memory_used);
    }

    SWIGV8_VALUE createWrap(xmlNode* node, swig_type_info* info) {
        Nan::EscapableHandleScope scope;

        if (node == NULL) {
            v8::Local<v8::Primitive> result = SWIGV8_NULL();
            return scope.Escape(result);
        }

        // libxml won't call xmlRegisterNodeCallback on XML_HTML_DOCUMENT_NODE
        // if (node->type == XML_HTML_DOCUMENT_NODE && node->_private == NULL) {
            // xmlRegisterNodeCallback(node);
        // }

        SWIGV8_Proxy* wrap = getXmlNodePrivate(node);

        if (wrap == NULL || wrap->handle.IsEmpty()) {
            SWIGV8_VALUE value = SWIG_NewPointerObj((void*) node, info, SWIG_POINTER_OWN);

            SWIGV8_OBJECT object = SWIGV8_TO_OBJECT(value);

            wrap = getSwigProxy(object);

            wrapConstructor(wrap, node);

            setXmlNodePrivate(node, wrap);
        }

        assert(!wrap->handle.IsEmpty());

        return scope.Escape(Nan::New(wrap->handle));
    }

    SWIGV8_VALUE createWrapNs(xmlNs* ns, swig_type_info* info) {
        // printf("createWrapNs %i, mem: %i\n", ns, xml_memory_used);

        Nan::EscapableHandleScope scope;

        if (ns == NULL) {
            v8::Local<v8::Primitive> result = SWIGV8_NULL();
            return scope.Escape(result);
        }

        SWIGV8_Proxy* wrap = (SWIGV8_Proxy*) ns->_private;

        if (wrap == NULL || wrap->handle.IsEmpty()) {
            SWIGV8_VALUE value = SWIG_NewPointerObj((void*) ns, info, SWIG_POINTER_OWN);

            SWIGV8_OBJECT object = SWIGV8_TO_OBJECT(value);

            wrap = getSwigProxy(object);
            
            if ((ns->context) && (ns->context->_private != NULL)) {
                wrap->doc = ns->context;
                getXmlNodePrivate((xmlNode*) wrap->doc)->Ref();
            }

            ns->_private = wrap;
        }

        assert(!wrap->handle.IsEmpty());

        return scope.Escape(Nan::New(wrap->handle));
    }

    void destroyWrap(xmlNode* node) {
        SWIGV8_Proxy* wrap = getXmlNodePrivate(node);

        setXmlNodePrivate(node, NULL);

        wrapDestructor(wrap, node);
    }

    void _xmlUnlinkNode(xmlNodePtr cur) {
        // printf("unlink %i\n", cur);
        unref_wrapped_ancestor(getXmlNodePrivate(cur));
        xmlUnlinkNode(cur);
    }
%}


%init %{
    xmlRegisterNodeDefault(xmlRegisterNodeCallback);

    xmlDeregisterNodeDefault(xmlDeregisterNodeCallback);

    LIBXML_TEST_VERSION;
%}