%header %{
/*
 * Return the (non-document) root, or a wrapped ancestor: whichever is closest
 */
xmlNode*
get_wrapped_ancestor_or_root(xmlNode *xml_obj) {
    while ((xml_obj->parent != NULL) &&
           (((void*) xml_obj->doc) != ((void*) xml_obj->parent))  &&
           (xml_obj->parent->_private == NULL)) {
        xml_obj = xml_obj->parent;
    }
    return ((xml_obj->parent != NULL) &&
            (((void*) xml_obj->doc) != ((void*) xml_obj->parent))) ?
        xml_obj->parent : xml_obj;
}


/*
 * Search linked list for javascript wrapper, ignoring given node.
 */
xmlAttr*
get_wrapped_attr_in_list(xmlAttr *xml_obj, void *skip_xml_obj) {
    xmlAttr *wrapped_attr = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_attr = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return wrapped_attr;
}

xmlNs*
get_wrapped_ns_in_list(xmlNs *xml_obj, void *skip_xml_obj) {
    xmlNs *wrapped_ns = NULL;
    while (xml_obj != NULL) {
        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_ns = xml_obj;
            xml_obj = NULL;
        }
        else {
            xml_obj = xml_obj->next;
        }
    }
    return wrapped_ns;
}

xmlNode* get_wrapped_node_in_children(xmlNode *xml_obj, xmlNode *skip_xml_obj);

/*
 * Search document for javascript wrapper, ignoring given node.
 * Based on xmlFreeDoc.
 */
xmlNode*
get_wrapped_node_in_document(xmlDoc *xml_obj, xmlNode *skip_xml_obj) {
    xmlNode *wrapped_node = NULL;
    if ((xml_obj->extSubset != NULL) &&
        (xml_obj->extSubset->_private != NULL) &&
        (((void*) xml_obj->extSubset) != skip_xml_obj)) {
        wrapped_node = ((xmlNode*) xml_obj->extSubset);
    }
    if ((wrapped_node == NULL) &&
        (xml_obj->intSubset != NULL) &&
        (xml_obj->intSubset->_private != NULL) &&
        (((void*) xml_obj->intSubset) != skip_xml_obj)) {
        wrapped_node = ((xmlNode*) xml_obj->intSubset);
    }
    if ((wrapped_node == NULL) && (xml_obj->children != NULL)) {
        wrapped_node =
            get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }
    if ((wrapped_node == NULL) && (xml_obj->oldNs != NULL)) {
        wrapped_node =
            ((xmlNode*) get_wrapped_ns_in_list(xml_obj->oldNs, skip_xml_obj));

    }
    return wrapped_node;
}

/*
 * Search children of node for javascript wrapper, ignoring given node.
 * Based on xmlFreeNodeList.
 */
xmlNode*
get_wrapped_node_in_children(xmlNode *xml_obj, xmlNode *skip_xml_obj) {

    xmlNode* wrapped_node = NULL;

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return ((xmlNode*) 
            get_wrapped_ns_in_list(((xmlNs*) xml_obj), skip_xml_obj)
        );
    }

    if ((xml_obj->type == XML_DOCUMENT_NODE) ||
#ifdef LIBXML_DOCB_ENABLED
        (xml_obj->type == XML_DOCB_DOCUMENT_NODE) ||
#endif
        (xml_obj->type == XML_HTML_DOCUMENT_NODE)) {
        return get_wrapped_node_in_document(((xmlDoc*) xml_obj), skip_xml_obj);
    }

    xmlNode *next;
    while (xml_obj != NULL) {
        next = xml_obj->next;

        if ((xml_obj != skip_xml_obj) && (xml_obj->_private != NULL)) {
            wrapped_node = xml_obj;
        }
        else {

            if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
                wrapped_node = get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
            }

            if ((wrapped_node == NULL) &&
                ((xml_obj->type == XML_ELEMENT_NODE) ||
                 (xml_obj->type == XML_XINCLUDE_START) ||
                 (xml_obj->type == XML_XINCLUDE_END))) {

                if ((wrapped_node == NULL) && (xml_obj->properties != NULL)) {
                    wrapped_node =
                        ((xmlNode*) get_wrapped_attr_in_list(xml_obj->properties, skip_xml_obj));
                }

                if ((wrapped_node == NULL) && (xml_obj->nsDef != NULL)) {
                    wrapped_node =
                        ((xmlNode*) get_wrapped_ns_in_list(xml_obj->nsDef, skip_xml_obj));
                }
            }

        }

        if (wrapped_node != NULL) {
            break;
        }

        xml_obj = next;
    }

    return wrapped_node;
}

/*
 * Search descendants of node to find javascript wrapper,
 * optionally ignoring given node. Based on xmlFreeNode.
 */
xmlNode*
get_wrapped_descendant(xmlNode *xml_obj, xmlNode *skip_xml_obj=NULL) {

    xmlNode* wrapped_descendant = NULL;

    if (xml_obj->type == XML_DTD_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if (xml_obj->type == XML_NAMESPACE_DECL) {
        return NULL;
    }

    if (xml_obj->type == XML_ATTRIBUTE_NODE) {
        return (xml_obj->children == NULL) ?
            NULL : get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->children != NULL) && (xml_obj->type != XML_ENTITY_REF_NODE)) {
        wrapped_descendant =
            get_wrapped_node_in_children(xml_obj->children, skip_xml_obj);
    }

    if ((xml_obj->type == XML_ELEMENT_NODE) ||
        (xml_obj->type == XML_XINCLUDE_START) ||
        (xml_obj->type == XML_XINCLUDE_END)) {

        if ((wrapped_descendant == NULL) && (xml_obj->properties != NULL)) {
            wrapped_descendant =
                ((xmlNode*) get_wrapped_attr_in_list(xml_obj->properties, skip_xml_obj));
        }

        if ((wrapped_descendant == NULL) && (xml_obj->nsDef != NULL)) {
            wrapped_descendant =
                ((xmlNode*) get_wrapped_ns_in_list(xml_obj->nsDef, skip_xml_obj));
        }
    }

    return wrapped_descendant;
}

xmlNode* get_wrapped_ancestor(SWIGV8_Proxy* wrap, xmlNode* xml_obj) {
    xmlNode* ancestor = get_wrapped_ancestor_or_root(xml_obj);
    return ((xml_obj == ancestor) || (ancestor->_private == NULL)) ? NULL : ancestor;
}

void unref_wrapped_ancestor(SWIGV8_Proxy* wrap) {
    if ((wrap->ancestor != NULL) && (wrap->ancestor->_private != NULL)) {
        (((SWIGV8_Proxy*) wrap->ancestor->_private))->Unref();
    }
    wrap->ancestor = NULL;
}

void ref_wrapped_ancestor(SWIGV8_Proxy* wrap, xmlNode* xml_obj) {
    xmlNode* ancestor = get_wrapped_ancestor(wrap, xml_obj);

    // if our closest wrapped ancestor has changed then we either
    // got removed, added, or a closer ancestor was wrapped
    if (ancestor != wrap->ancestor) {
        unref_wrapped_ancestor(wrap);
        wrap->ancestor = ancestor;
    }

    if (wrap->ancestor != NULL) {
        SWIGV8_Proxy* node = ((SWIGV8_Proxy*) wrap->ancestor->_private);
        node->Ref();
    }
}

    // int nodeHasWrap(xmlNode* node);
    // int nodeHasChildWrap(xmlNode* node);

    // int nodeHasPropertyWrap(xmlNode* node) {
    //     if (node == NULL) {
    //         return 0;
    //     }
    //     if (node->type != XML_ELEMENT_NODE) {
    //         return 0;
    //     }

    //     xmlAttr* prop = node->properties;

    //     while (prop != NULL) {
    //         if (nodeHasWrap((xmlNode*) prop) || nodeHasChildWrap(prop->children)) {
    //             return 1;
    //         }

    //         prop = prop->next;
    //     }

    //     return 0;
    // }

    // int nodeHasWrap(xmlNode* node) {
    //     if (node == NULL) {
    //         return 0;
    //     }

    //     if (getXmlNodePrivate(node) != NULL) {
    //         return 1;
    //     } else if (nodeHasPropertyWrap(node)) {
    //         return 1;
    //     }

    //     return 0;
    // }

    // int nodeHasParentWrap(xmlNode* node) {
    //     if (node == NULL || node->type == XML_NAMESPACE_DECL) {
    //         return 0;
    //     }

    //     return nodeHasWrap(node->parent) || nodeHasParentWrap(node->parent);
    // }

    // int nodeHasChildWrap(xmlNode* node) {
    //     if (node == NULL || node->type == XML_NAMESPACE_DECL) {
    //         return 0;
    //     }

    //     xmlNode* child = node->children;

    //     while (child != NULL) {
    //         if (nodeHasWrap(child)) {
    //             return 1;
    //         }

    //         child = child->next;
    //     }

    //     child = node->children;

    //     while (child != NULL) {
    //         if (nodeHasChildWrap(child)) {
    //             return 1;
    //         }

    //         child = child->next;
    //     }

    //     return 0;
    // }

    // void freeNodeOrDoc(xmlNode* node) {
    //     if (node == NULL) {
    //         return;
    //     }

    //     while (node != NULL && node->parent != NULL) {
    //         node = node->parent;
    //     }
        
    //     if ((node->type == XML_DOCUMENT_NODE) ||
    //     #ifdef LIBXML_DOCB_ENABLED
    //     (node->type == XML_DOCB_DOCUMENT_NODE) ||
    //     #endif
    //     (node->type == XML_HTML_DOCUMENT_NODE)) {
    //         printf("freeing doc %i %i %i\n", node->type, xml_memory_used, xml_node_count);

    //         // xmlNode* root = xmlDocGetRootElement((xmlDocPtr) node);

    //         // if (root != NULL) {
    //         //     printf("xmlReconciliateNs\n");
    //         //     xmlReconciliateNs((xmlDocPtr) node, root);
    //         // }

    //         xmlFreeDoc((xmlDocPtr) node);
    //         printf("freed  doc %i %i %i\n", node->type, xml_memory_used, xml_node_count);
    //     } else if (node->type == XML_NAMESPACE_DECL) {
    //         xmlNs* ns = (xmlNs*) node;
    //         printf("freeing namespace %s %s %i\n", ns->href, ns->prefix, ns->context);

    //         // xmlFreeNs(ns);
    //     } else {
    //         printf("freeing node %i %i %i\n", node->type, xml_memory_used, xml_node_count);
            
    //         // if (node->type == XML_ELEMENT_NODE && node->doc) {
    //         //     printf("xmlReconciliateNs\n");
    //         //     xmlReconciliateNs(node->doc, node);
    //         // }

    //         xmlFreeNode(node);

    //         printf("freed  node %i %i %i\n", node->type, xml_memory_used, xml_node_count);
    //     }
    // }
%}