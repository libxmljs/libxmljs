"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLText = exports.XMLDTD = exports.XMLAttribute = exports.XMLNamespace = exports.XMLElement = exports.XMLNode = exports.XMLNodeError = void 0;
var bindings_1 = require("./bindings");
var functions_1 = require("./bindings/functions");
var bindings_2 = __importDefault(require("./bindings"));
var XMLNodeError;
(function (XMLNodeError) {
    XMLNodeError["NO_REF"] = "Node has no native reference";
    XMLNodeError["NO_DOC"] = "Node has no document";
})(XMLNodeError || (exports.XMLNodeError = XMLNodeError = {}));
var document_1 = require("./document");
var types_1 = require("./types");
var xmlXPathObjectType;
(function (xmlXPathObjectType) {
    xmlXPathObjectType[xmlXPathObjectType["XPATH_UNDEFINED"] = bindings_2.default.XPATH_UNDEFINED] = "XPATH_UNDEFINED";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_NODESET"] = bindings_2.default.XPATH_NODESET] = "XPATH_NODESET";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_BOOLEAN"] = bindings_2.default.XPATH_BOOLEAN] = "XPATH_BOOLEAN";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_NUMBER"] = bindings_2.default.XPATH_NUMBER] = "XPATH_NUMBER";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_STRING"] = bindings_2.default.XPATH_STRING] = "XPATH_STRING";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_POINT"] = bindings_2.default.XPATH_POINT] = "XPATH_POINT";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_RANGE"] = bindings_2.default.XPATH_RANGE] = "XPATH_RANGE";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_LOCATIONSET"] = bindings_2.default.XPATH_LOCATIONSET] = "XPATH_LOCATIONSET";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_USERS"] = bindings_2.default.XPATH_USERS] = "XPATH_USERS";
    xmlXPathObjectType[xmlXPathObjectType["XPATH_XSLT_TREE"] = bindings_2.default.XPATH_XSLT_TREE] = "XPATH_XSLT_TREE";
})(xmlXPathObjectType || (xmlXPathObjectType = {}));
function refToNodeType(node) {
    if (node === null) {
        return null;
    }
    if (node.type === types_1.XMLElementType.XML_DOCUMENT_NODE ||
        node.type === types_1.XMLElementType.XML_DOCB_DOCUMENT_NODE ||
        node.type === types_1.XMLElementType.XML_HTML_DOCUMENT_NODE) {
        return (0, bindings_1.createXMLReference)(document_1.XMLDocument, node);
    }
    if (node.type === types_1.XMLElementType.XML_ATTRIBUTE_NODE) {
        return (0, bindings_1.createXMLReference)(XMLAttribute, node);
    }
    if (node.type === types_1.XMLElementType.XML_ELEMENT_NODE) {
        return (0, bindings_1.createXMLReference)(XMLElement, node);
    }
    if (node.type === types_1.XMLElementType.XML_TEXT_NODE) {
        return (0, bindings_1.createXMLReference)(XMLText, node);
    }
    return (0, bindings_1.createXMLReference)(XMLNode, node);
}
var XMLNode = (function (_super) {
    __extends(XMLNode, _super);
    function XMLNode(_ref) {
        return _super.call(this, _ref) || this;
    }
    XMLNode.prototype.parent = function () {
        var _ref = this.getNativeReference();
        if (_ref.parent === null) {
            return refToNodeType(_ref.doc);
        }
        return refToNodeType(_ref.parent);
    };
    XMLNode.prototype.name = function () {
        var _ref = this.getNativeReference();
        if (_ref.type === types_1.XMLElementType.XML_DOCUMENT_NODE ||
            _ref.type === types_1.XMLElementType.XML_DOCB_DOCUMENT_NODE ||
            _ref.type === types_1.XMLElementType.XML_HTML_DOCUMENT_NODE) {
            return (0, bindings_1.createXMLReferenceOrThrow)(document_1.XMLDocument, _ref, XMLNodeError.NO_REF).name();
        }
        if (_ref.type === types_1.XMLElementType.XML_ATTRIBUTE_NODE ||
            _ref.type === types_1.XMLElementType.XML_ELEMENT_NODE ||
            _ref.type === types_1.XMLElementType.XML_PI_NODE) {
            return _ref.name;
        }
        if (_ref.type === types_1.XMLElementType.XML_NAMESPACE_DECL) {
            return (0, bindings_1.createXMLReferenceOrThrow)(XMLNamespace, _ref, XMLNodeError.NO_REF).name();
        }
        return this.type();
    };
    XMLNode.prototype.line = function () {
        var _ref = this.getNativeReference();
        return (0, functions_1.xmlGetLineNo)(_ref);
    };
    XMLNode.prototype.type = function () {
        var _ref = this.getNativeReference();
        switch (_ref.type) {
            case types_1.XMLElementType.XML_ELEMENT_NODE:
                return "element";
            case types_1.XMLElementType.XML_ATTRIBUTE_NODE:
                return "attribute";
            case types_1.XMLElementType.XML_TEXT_NODE:
                return "text";
            case types_1.XMLElementType.XML_CDATA_SECTION_NODE:
                return "cdata";
            case types_1.XMLElementType.XML_ENTITY_REF_NODE:
                return "entity_ref";
            case types_1.XMLElementType.XML_ENTITY_NODE:
                return "entity";
            case types_1.XMLElementType.XML_PI_NODE:
                return "pi";
            case types_1.XMLElementType.XML_COMMENT_NODE:
                return "comment";
            case types_1.XMLElementType.XML_DOCUMENT_NODE:
                return "document";
            case types_1.XMLElementType.XML_DOCUMENT_TYPE_NODE:
                return "document_type";
            case types_1.XMLElementType.XML_DOCUMENT_FRAG_NODE:
                return "document_frag";
            case types_1.XMLElementType.XML_NOTATION_NODE:
                return "notation";
            case types_1.XMLElementType.XML_HTML_DOCUMENT_NODE:
                return "html_document";
            case types_1.XMLElementType.XML_DTD_NODE:
                return "dtd";
            case types_1.XMLElementType.XML_ELEMENT_DECL:
                return "element_decl";
            case types_1.XMLElementType.XML_ATTRIBUTE_DECL:
                return "attribute_decl";
            case types_1.XMLElementType.XML_ENTITY_DECL:
                return "entity_decl";
            case types_1.XMLElementType.XML_NAMESPACE_DECL:
                return "namespace_decl";
            case types_1.XMLElementType.XML_XINCLUDE_START:
                return "xinclude_start";
            case types_1.XMLElementType.XML_XINCLUDE_END:
                return "xinclude_end";
            case types_1.XMLElementType.XML_DOCB_DOCUMENT_NODE:
                return "docb_document";
        }
        return "node";
    };
    XMLNode.prototype.node = function (name, content) {
        return this.addChild(this.createElement(name, content));
    };
    XMLNode.prototype.createElement = function (name, content) {
        var _ref = this.getNativeReference();
        if (_ref.doc === null) {
            throw new Error(XMLNodeError.NO_DOC);
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(document_1.XMLDocument, this.getNativeReference().doc, XMLNodeError.NO_REF).createElement(name, content);
    };
    XMLNode.prototype.defineNamespace = function (prefix, href) {
        if (!href) {
            href = prefix;
            prefix = null;
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLNamespace, (0, functions_1.xmlNewNs)(this.getNativeReference(), href, prefix), XMLNodeError.NO_REF);
    };
    XMLNode.prototype.setDocumentRoot = function (_docRef) {
        (0, functions_1.xmlDocSetRootElement)(_docRef, this.getNativeReference());
    };
    XMLNode.prototype.prevElement = function () {
        var node = this.prevSibling();
        while (node !== null && node.type() !== "element") {
            node = node.prevSibling();
        }
        return node;
    };
    XMLNode.prototype.nextElement = function () {
        var node = this.nextSibling();
        while (node !== null && node.type() !== "element") {
            node = node.nextSibling();
        }
        return node;
    };
    XMLNode.prototype.importNode = function (node) {
        var _ref = this.getNativeReference();
        if (_ref.doc === node.doc) {
            if (node.parent !== null) {
                (0, functions_1.xmlUnlinkNode)(node);
            }
            return (0, bindings_1.createXMLReferenceOrThrow)(XMLNode, node, XMLNodeError.NO_REF);
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLNode, (0, functions_1.xmlDocCopyNode)(node, _ref.doc, 1), XMLNodeError.NO_REF);
    };
    XMLNode.prototype.childWillMerge = function (_nodeRef) {
        var _selfRef = this.getNativeReference();
        return (_nodeRef.type === types_1.XMLElementType.XML_TEXT_NODE &&
            _selfRef.last !== null &&
            _selfRef.last.type === types_1.XMLElementType.XML_TEXT_NODE &&
            _selfRef.last.name === _nodeRef.name &&
            _selfRef.last !== _nodeRef);
    };
    XMLNode.prototype.addChild = function (node) {
        var _parentRef = this.getNativeReference();
        var _childRef = node.getNativeReference();
        var childNode = this.importNode(_childRef).getNativeReference();
        if (childNode === _childRef && this.childWillMerge(childNode)) {
            childNode = (0, functions_1.xmlAddChild)(_parentRef, (0, functions_1.xmlCopyNode)(childNode, 0));
        }
        else {
            childNode = (0, functions_1.xmlAddChild)(_parentRef, childNode);
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLElement, childNode, XMLNodeError.NO_REF);
    };
    XMLNode.prototype.nextSiblingWillMerge = function (node) {
        var _selfRef = this.getNativeReference();
        var _nodeRef = node.getNativeReference();
        return (_nodeRef.type === types_1.XMLElementType.XML_TEXT_NODE &&
            (_selfRef.type === types_1.XMLElementType.XML_TEXT_NODE ||
                (_selfRef.next !== null &&
                    _selfRef.next.type === types_1.XMLElementType.XML_TEXT_NODE &&
                    _selfRef.name === _selfRef.next.name)));
    };
    XMLNode.prototype.addNextSibling = function (node) {
        var _parentRef = this.getNativeReference();
        var _childRef = node.getNativeReference();
        var childNode = this.importNode(_childRef).getNativeReference();
        if (childNode === _childRef && this.nextSiblingWillMerge(node)) {
            childNode = (0, functions_1.xmlCopyNode)(childNode, 0);
        }
        return (0, bindings_1.createXMLReference)(XMLElement, (0, functions_1.xmlAddNextSibling)(_parentRef, childNode));
    };
    XMLNode.prototype.prevSiblingWillMerge = function (node) {
        var _selfRef = this.getNativeReference();
        var _nodeRef = node.getNativeReference();
        return (_nodeRef.type === types_1.XMLElementType.XML_TEXT_NODE &&
            (_selfRef.type === types_1.XMLElementType.XML_TEXT_NODE ||
                (_selfRef.prev !== null &&
                    _selfRef.prev.type === types_1.XMLElementType.XML_TEXT_NODE &&
                    _selfRef.name === _selfRef.prev.name)));
    };
    XMLNode.prototype.addPrevSibling = function (node) {
        var _parentRef = this.getNativeReference();
        var _childRef = node.getNativeReference();
        var childNode = this.importNode(_childRef).getNativeReference();
        if (childNode === _childRef && this.prevSiblingWillMerge(node)) {
            childNode = (0, functions_1.xmlCopyNode)(childNode, 0);
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLElement, (0, functions_1.xmlAddPrevSibling)(_parentRef, childNode), XMLNodeError.NO_REF);
    };
    XMLNode.prototype.childNodes = function () {
        var _ref = this.getNativeReference();
        var children = [];
        var child = _ref.children;
        while (child !== null) {
            children.push((0, bindings_1.createXMLReferenceOrThrow)(XMLElement, child, XMLNodeError.NO_REF));
            child = child.next;
        }
        return children;
    };
    XMLNode.prototype.prevSibling = function () {
        return (0, bindings_1.createXMLReference)(XMLNode, this.getNativeReference().prev);
    };
    XMLNode.prototype.nextSibling = function () {
        return (0, bindings_1.createXMLReference)(XMLNode, this.getNativeReference().next);
    };
    XMLNode.prototype.evaluateXPath = function (xpath, namespace) {
        var _ref = this.getNativeReference();
        var xpathContext = (0, functions_1.xmlXPathNewContext)(_ref.doc);
        if (namespace) {
            if (namespace instanceof XMLNamespace) {
                (0, functions_1.xmlXPathRegisterNs)(xpathContext, namespace.prefix(), namespace.href());
            }
            else if (typeof namespace === "string") {
                (0, functions_1.xmlXPathRegisterNs)(xpathContext, "xmlns", namespace);
            }
            else {
                Object.keys(namespace).forEach(function (prefix) {
                    var href = namespace[prefix];
                    (0, functions_1.xmlXPathRegisterNs)(xpathContext, prefix, href || null);
                });
            }
        }
        var ret = (0, functions_1.xmlXPathNodeEval)(_ref, xpath, xpathContext);
        (0, functions_1.xmlXPathFreeContext)(xpathContext);
        return ret;
    };
    XMLNode.prototype.find = function (xpath, namespace) {
        var result = this.evaluateXPath(xpath, namespace);
        var nodeSet = [];
        result.nodesetval.forEach(function (node) {
            var instance = refToNodeType(node);
            if (instance !== null && !(instance instanceof document_1.XMLDocument)) {
                nodeSet.push(instance);
            }
        });
        (0, functions_1.xmlXPathFreeObject)(result);
        return nodeSet;
    };
    XMLNode.prototype.get = function (xpath, namespace) {
        var result = this.evaluateXPath(xpath, namespace);
        var ret = null;
        if (result.type === xmlXPathObjectType.XPATH_BOOLEAN) {
            ret = !!result.boolval;
        }
        else if (result.type === xmlXPathObjectType.XPATH_NUMBER) {
            ret = result.floatval;
        }
        else if (result.type === xmlXPathObjectType.XPATH_STRING) {
            ret = result.stringval;
        }
        else if (result.type === xmlXPathObjectType.XPATH_NODESET) {
            var _ref = result.nodesetval[0];
            if (_ref) {
                var node = refToNodeType(_ref);
                if (node !== null && !(node instanceof document_1.XMLDocument)) {
                    ret = node;
                }
            }
        }
        (0, functions_1.xmlXPathFreeObject)(result);
        return ret;
    };
    XMLNode.prototype.child = function (index) {
        var currIndex = 0;
        var _childRef = this.getNativeReference().children;
        while (_childRef != null) {
            if (currIndex >= index) {
                break;
            }
            currIndex++;
            _childRef = _childRef.next;
        }
        return (0, bindings_1.createXMLReference)(XMLElement, _childRef);
    };
    XMLNode.prototype.remove = function () {
        (0, functions_1.xmlUnlinkNode)(this.getNativeReference());
    };
    XMLNode.prototype.doc = function () {
        var _ref = this.getNativeReference();
        return (0, bindings_1.createXMLReference)(document_1.XMLDocument, _ref.doc);
    };
    XMLNode.prototype.toString = function (options) {
        if (options === void 0) { options = {}; }
        return document_1.XMLDocument.toString(this, options) || "";
    };
    XMLNode.prototype.namespace = function (prefix, href) {
        var _a;
        var _ref = this.getNativeReference();
        if (prefix === null) {
            _ref.ns = null;
        }
        else if (prefix instanceof XMLNamespace) {
            prefix._applyToNode(_ref);
        }
        else if (typeof prefix === "string") {
            if (!href) {
                href = prefix;
                prefix = null;
            }
            var namespace = ((_a = this.doc()) === null || _a === void 0 ? void 0 : _a._findNamespace(_ref, prefix, href)) || this.defineNamespace(prefix, href);
            if (namespace) {
                namespace._applyToNode(_ref);
            }
        }
        return (0, bindings_1.createXMLReference)(XMLNamespace, _ref.ns);
    };
    XMLNode.prototype.namespaces = function (onlyLocal) {
        if (onlyLocal === void 0) { onlyLocal = false; }
        var namespaces = [];
        var _ref = this.getNativeReference();
        if (onlyLocal === true) {
            var namespace = _ref.nsDef;
            while (namespace !== null) {
                namespaces.push((0, bindings_1.createXMLReferenceOrThrow)(XMLNamespace, namespace, XMLNodeError.NO_REF));
                namespace = namespace.next;
            }
        }
        else {
            (0, functions_1.xmlGetNsList)(_ref.doc, _ref).forEach(function (namespace) {
                namespaces.push((0, bindings_1.createXMLReferenceOrThrow)(XMLNamespace, namespace, XMLNodeError.NO_REF));
            });
        }
        return namespaces;
    };
    XMLNode.prototype.clone = function () {
        var _ref = this.getNativeReference();
        return refToNodeType((0, functions_1.xmlDocCopyNode)(_ref, _ref.doc, 1));
    };
    XMLNode.prototype._xmlSaveTree = function (context) {
        (0, functions_1.xmlSaveTree)(context, this.getNativeReference());
    };
    return XMLNode;
}(bindings_1.XMLReference));
exports.XMLNode = XMLNode;
var XMLElement = (function (_super) {
    __extends(XMLElement, _super);
    function XMLElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XMLElement.prototype.name = function (value) {
        if (value !== undefined) {
            (0, functions_1.xmlNodeSetName)(this.getNativeReference(), value);
        }
        return _super.prototype.name.call(this);
    };
    XMLElement.prototype.getAttribute = function (key) {
        var _ref = this.getNativeReference();
        return (0, bindings_1.createXMLReference)(XMLAttribute, (0, functions_1.xmlHasProp)(_ref, key));
    };
    XMLElement.prototype.setAttribute = function (key, value) {
        var _ref = this.getNativeReference();
        return (0, bindings_1.createXMLReference)(XMLAttribute, (0, functions_1.xmlSetProp)(_ref, key, value.toString()));
    };
    XMLElement.prototype.attr = function (attributes) {
        var _this = this;
        if (typeof attributes === "string") {
            console.error("Use XMLElement.setAttribute instead");
            return this;
        }
        Object.keys(attributes).forEach(function (k) {
            _this.setAttribute(k, attributes[k] || "");
        });
        return this;
    };
    XMLElement.prototype.attrs = function () {
        var attrs = [];
        var _ref = this.getNativeReference();
        var attr = _ref.properties;
        while (attr !== null) {
            attrs.push((0, bindings_1.createXMLReferenceOrThrow)(XMLAttribute, attr, XMLNodeError.NO_REF));
            attr = attr.next;
        }
        return attrs;
    };
    XMLElement.prototype.cdata = function (content) {
        var _ref = this.getNativeReference();
        var cdata = (0, functions_1.xmlNewCDataBlock)(_ref.doc, content, content.length);
        this.addChild((0, bindings_1.createXMLReferenceOrThrow)(XMLElement, cdata, XMLNodeError.NO_REF));
        return this;
    };
    XMLElement.prototype.text = function (content) {
        var _ref = this.getNativeReference();
        if (content === undefined) {
            return (0, functions_1.xmlNodeGetContent)(_ref);
        }
        var doc = this.doc();
        if (doc && this.type() !== "comment") {
            content = doc.encode(content);
        }
        this.childNodes().forEach(function (child) {
            (0, functions_1.xmlUnlinkNode)(child.getNativeReference());
        });
        (0, functions_1.xmlNodeSetContent)(_ref, content);
        return content;
    };
    XMLElement.prototype.path = function () {
        return (0, functions_1.xmlGetNodePath)(this.getNativeReference());
    };
    XMLElement.prototype.replace = function (value) {
        var _ref = this.getNativeReference();
        var element = null;
        var doc = this.doc();
        if (doc && typeof value === "string") {
            element = doc.createText(value, false);
        }
        else if (value instanceof XMLNode) {
            element = this.importNode(value.getNativeReference());
        }
        var _newRef = (0, functions_1.xmlReplaceNode)(_ref, element.getNativeReference());
        if (_newRef !== null) {
            this.setNativeReference(_newRef);
        }
    };
    return XMLElement;
}(XMLNode));
exports.XMLElement = XMLElement;
var XMLNamespace = (function (_super) {
    __extends(XMLNamespace, _super);
    function XMLNamespace(_ref) {
        return _super.call(this, _ref) || this;
    }
    XMLNamespace.prototype.name = function () {
        return this.prefix() || "";
    };
    XMLNamespace.prototype.prefix = function () {
        return this.getNativeReference().prefix || null;
    };
    XMLNamespace.prototype.href = function () {
        return this.getNativeReference().href;
    };
    XMLNamespace.prototype._applyToNode = function (_nodeRef) {
        (0, functions_1.xmlSetNs)(_nodeRef, this.getNativeReference());
    };
    return XMLNamespace;
}(bindings_1.XMLReference));
exports.XMLNamespace = XMLNamespace;
var XMLAttribute = (function (_super) {
    __extends(XMLAttribute, _super);
    function XMLAttribute(_ref) {
        return _super.call(this, _ref) || this;
    }
    XMLAttribute.prototype.name = function () {
        return this.getNativeReference().name;
    };
    XMLAttribute.prototype.defineNamespace = function (prefix, href) {
        return this.node().defineNamespace(prefix, href);
    };
    XMLAttribute.prototype.value = function (value) {
        var _a;
        var _ref = this.getNativeReference();
        if (typeof value === "string") {
            var content = (0, functions_1.xmlEncodeEntitiesReentrant)(_ref.doc, value);
            _ref.children = (0, functions_1.xmlStringGetNodeList)(_ref.doc, content);
            _ref.last = null;
            var child = _ref.children;
            while (child !== null) {
                child.parent = _ref;
                child.doc = _ref.doc;
                if (child.next === null) {
                    _ref.last = child;
                }
                child = child.next;
            }
        }
        return ((_a = _ref.children) === null || _a === void 0 ? void 0 : _a.content) || "";
    };
    XMLAttribute.prototype.node = function () {
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLElement, this.getNativeReference().parent, XMLNodeError.NO_REF);
    };
    return XMLAttribute;
}(XMLNode));
exports.XMLAttribute = XMLAttribute;
var XMLDTD = (function (_super) {
    __extends(XMLDTD, _super);
    function XMLDTD(_ref) {
        var _this = _super.call(this, _ref) || this;
        _this.name = _this.getName();
        _this.externalId = _this.getExternalID();
        _this.systemId = _this.getSystemID();
        return _this;
    }
    XMLDTD.prototype.getName = function () {
        var _a;
        return ((_a = this.getNativeReference()) === null || _a === void 0 ? void 0 : _a.name) || "";
    };
    XMLDTD.prototype.getExternalID = function () {
        var _a;
        return ((_a = this.getNativeReference()) === null || _a === void 0 ? void 0 : _a.ExternalID) || null;
    };
    XMLDTD.prototype.getSystemID = function () {
        var _a;
        return ((_a = this.getNativeReference()) === null || _a === void 0 ? void 0 : _a.SystemID) || null;
    };
    XMLDTD.prototype.unlink = function () {
        (0, functions_1.xmlUnlinkNode)(this.getNativeReference());
    };
    return XMLDTD;
}(bindings_1.XMLReference));
exports.XMLDTD = XMLDTD;
var XMLText = (function (_super) {
    __extends(XMLText, _super);
    function XMLText(_ref) {
        return _super.call(this, _ref) || this;
    }
    return XMLText;
}(XMLElement));
exports.XMLText = XMLText;
//# sourceMappingURL=node.js.map