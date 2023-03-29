
// these are dangerous and shouldn't be used
// %header %{
//     static SwigV8ReturnValue xmlPtrToXmlNode(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlNode) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlNode, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         refNode(node);

//         return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlNode, SWIG_POINTER_OWN));
//     }

//     static SwigV8ReturnValue xmlPtrToXmlDoc(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlDoc) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlDoc, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         switch (node->type) {
//             case XML_DOCUMENT_NODE:
//             case XML_DOCB_DOCUMENT_NODE:
//             case XML_HTML_DOCUMENT_NODE: {
//                 refNode(node);

//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlDoc, SWIG_POINTER_OWN));
//             }
//             default: {
//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlDoc, 0));
//             }
//         }
//     }

//     static SwigV8ReturnValue xmlPtrToXmlAttr(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlAttr) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlAttr, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         switch (node->type) {
//             case XML_ATTRIBUTE_NODE: {
//                 refNode(node);

//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlAttr, SWIG_POINTER_OWN));
//             }
//             default: {
//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlAttr, 0));
//             }
//         }
//     }

//     static SwigV8ReturnValue xmlPtrToXmlElement(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlElement) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlElement, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         switch (node->type) {
//             case XML_ELEMENT_DECL: {
//                 refNode(node);

//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlElement, SWIG_POINTER_OWN));
//             }
//             default: {
//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlElement, 0));
//             }
//         }
//     }

//     static SwigV8ReturnValue xmlPtrToXmlDtd(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlDtd) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlDtd, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         switch (node->type) {
//             case XML_DTD_NODE: {
//                 refNode(node);

//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlDtd, SWIG_POINTER_OWN));
//             }
//             default: {
//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlDtd, 0));
//             }
//         }
//     }

//     static SwigV8ReturnValue xmlPtrToXmlNs(const SwigV8Arguments &args) {
//         SWIGV8_HANDLESCOPE();

//         if (getSwigCObjectPtrInfo(args[0]) == SWIGTYPE_p__xmlNs) {
//             return SWIGV8_RETURN(args[0]);
//         }

//         void* value = getSwigCObjectPtr(args[0]);

//         if (value == NULL) {
//             return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlNs, 0));
//         }

//         xmlNode* node = (xmlNode*) value;

//         switch (node->type) {
//             case XML_NAMESPACE_DECL: {
//                 refNode(node);

//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(value), SWIGTYPE_p__xmlNs, SWIG_POINTER_OWN));
//             }
//             default: {
//                 return SWIGV8_RETURN(SWIG_NewPointerObj(SWIG_as_voidptr(NULL), SWIGTYPE_p__xmlNs, 0));
//             }
//         }
//     }
// %}


// %init %{
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlNode", xmlPtrToXmlNode, context);
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlDoc", xmlPtrToXmlDoc, context);
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlAttr", xmlPtrToXmlAttr, context);
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlElement", xmlPtrToXmlElement, context);
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlDtd", xmlPtrToXmlDtd, context);
//     SWIGV8_AddStaticFunction(exports_obj, "xmlPtrToXmlNs", xmlPtrToXmlNs, context);
// %}