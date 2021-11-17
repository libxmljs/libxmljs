import { xmlDocPtr, xmlNodePtr, xmlDtdPtr, xmlNsPtr, XMLReferenceType } from "./bindings/types";

import { XMLReference, createXMLReference } from "./bindings";

import {
    xmlXPathNewContext,
    xmlXPathNodeEval,
    xmlUnlinkNode,
    xmlHasProp,
    xmlGetProp,
    xmlSetProp,
    xmlAddChild,
    xmlPtrToXmlNode,
    xmlPtrToXmlDtd,
    xmlPtrToXmlDoc,
    xmlPtrToXmlNs,
    xmlDocCopyNode,
    xmlNewCDataBlock,
    xmlGetLastError,
    xmlNodeGetContent,
    xmlNodeSetContent,
    xmlNodeSetName,
    xmlGetNodePath,
    xmlCopyNode,
    xmlAddNextSibling,
    xmlAddPrevSibling,
    xmlNewDocText,
    xmlReplaceNode,
    xmlNewNs,
    xmlSetNs,
    xmlSearchNs,
    xmlEncodeEntitiesReentrant,
    xmlStringGetNodeList,
    xmlGetNsList,
    xmlXPathRegisterNs,
    xmlGetLineNo,
    xmlSearchNsByHref,
} from "./bindings/functions";

import { DEFAULT_XML_SAVE_OPTIONS } from "./document";

import bindings from "./bindings";

export enum XMLNodeError {
    NO_REF = "Node has no native reference",
    NO_DOC = "Node has no document",
}

export enum XMLElementType {
    // XML_ELEMENT_NODE = 1
    XML_ELEMENT_NODE = bindings.XML_ELEMENT_NODE,

    // XML_ATTRIBUTE_NODE = 2
    XML_ATTRIBUTE_NODE = bindings.XML_ATTRIBUTE_NODE,

    // XML_TEXT_NODE = 3
    XML_TEXT_NODE = bindings.XML_TEXT_NODE,

    // XML_CDATA_SECTION_NODE = 4
    XML_CDATA_SECTION_NODE = bindings.XML_CDATA_SECTION_NODE,

    // XML_ENTITY_REF_NODE = 5
    XML_ENTITY_REF_NODE = bindings.XML_ENTITY_REF_NODE,

    // XML_ENTITY_NODE = 6
    XML_ENTITY_NODE = bindings.XML_ENTITY_NODE,

    // XML_PI_NODE = 7
    XML_PI_NODE = bindings.XML_PI_NODE,

    // XML_COMMENT_NODE = 8
    XML_COMMENT_NODE = bindings.XML_COMMENT_NODE,

    // XML_DOCUMENT_NODE = 9
    XML_DOCUMENT_NODE = bindings.XML_DOCUMENT_NODE,

    // XML_DOCUMENT_TYPE_NODE = 10
    XML_DOCUMENT_TYPE_NODE = bindings.XML_DOCUMENT_TYPE_NODE,

    // XML_DOCUMENT_FRAG_NODE = 11
    XML_DOCUMENT_FRAG_NODE = bindings.XML_DOCUMENT_FRAG_NODE,

    // XML_NOTATION_NODE = 12
    XML_NOTATION_NODE = bindings.XML_NOTATION_NODE,

    // XML_HTML_DOCUMENT_NODE = 13
    XML_HTML_DOCUMENT_NODE = bindings.XML_HTML_DOCUMENT_NODE,

    // XML_DTD_NODE = 14
    XML_DTD_NODE = bindings.XML_DTD_NODE,

    // XML_ELEMENT_DECL = 15
    XML_ELEMENT_DECL = bindings.XML_ELEMENT_DECL,

    // XML_ATTRIBUTE_DECL = 16
    XML_ATTRIBUTE_DECL = bindings.XML_ATTRIBUTE_DECL,

    // XML_ENTITY_DECL = 17
    XML_ENTITY_DECL = bindings.XML_ENTITY_DECL,

    // XML_NAMESPACE_DECL = 18
    XML_NAMESPACE_DECL = bindings.XML_NAMESPACE_DECL,

    // XML_XINCLUDE_START = 19
    XML_XINCLUDE_START = bindings.XML_XINCLUDE_START,

    // XML_XINCLUDE_END = 20
    XML_XINCLUDE_END = bindings.XML_XINCLUDE_END,

    // XML_DOCB_DOCUMENT_NODE = 21
    XML_DOCB_DOCUMENT_NODE = bindings.XML_DOCB_DOCUMENT_NODE,
}

export type XPathNamespace = string | XMLNamespace | { [key: string]: string };

export type XMLAttributeMap = {
    [key: string]: string | number;
};

import { XMLDocument, XMLSaveOptions } from "./document";

export type XMLXPathResult = XMLNode | XMLAttribute | XMLElement | XMLDocument | boolean | number | string | null;

enum xmlXPathObjectType {
    XPATH_UNDEFINED = bindings.XPATH_UNDEFINED, // 0
    XPATH_NODESET = bindings.XPATH_NODESET, // 1
    XPATH_BOOLEAN = bindings.XPATH_BOOLEAN, // 2
    XPATH_NUMBER = bindings.XPATH_NUMBER, // 3
    XPATH_STRING = bindings.XPATH_STRING, // 4
    XPATH_POINT = bindings.XPATH_POINT, // 5
    XPATH_RANGE = bindings.XPATH_RANGE, // 6
    XPATH_LOCATIONSET = bindings.XPATH_LOCATIONSET, // 7
    XPATH_USERS = bindings.XPATH_USERS, // 8
    XPATH_XSLT_TREE = bindings.XPATH_XSLT_TREE, // 9 : An XSLT value tree, non modifiable
}

function refToNodeType(node: xmlNodePtr | xmlDocPtr | null): XMLNode | XMLAttribute | XMLElement | XMLDocument | null {
    if (node === null) {
        return null;
    }

    if (
        node.type === XMLElementType.XML_DOCUMENT_NODE ||
        node.type === XMLElementType.XML_DOCB_DOCUMENT_NODE ||
        node.type === XMLElementType.XML_HTML_DOCUMENT_NODE
    ) {
        return createXMLReference(XMLDocument, xmlPtrToXmlDoc(node));
    }

    if (node.type === XMLElementType.XML_ATTRIBUTE_NODE) {
        return createXMLReference(XMLAttribute, node);
    }

    if (node.type === XMLElementType.XML_ELEMENT_NODE) {
        return createXMLReference(XMLElement, node);
    }

    return createXMLReference(XMLNode, node);
}

export class XMLNode extends XMLReference<xmlNodePtr> {
    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlNode(_ref));
    }

    /**
     * Get the parent node for the current
     *
     * @returns {XMLElement} parent node
     */
    public parent() {
        return this.getNativeReferenceOrReturnNull((_ref) => {
            if (_ref.parent === null) {
                return refToNodeType(_ref.doc);
            }

            return refToNodeType(_ref.parent);
        });
    }

    /**
     * Get the tag name of current node
     *
     * @returns {string} name
     */
    public name(): string {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (
            _ref.type === XMLElementType.XML_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_DOCB_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_HTML_DOCUMENT_NODE
        ) {
            return xmlPtrToXmlDoc(_ref).URL;
        }

        if (
            _ref.type === XMLElementType.XML_ATTRIBUTE_NODE ||
            _ref.type === XMLElementType.XML_ELEMENT_NODE ||
            _ref.type === XMLElementType.XML_PI_NODE
        ) {
            return _ref.name;
        }

        if (_ref.type === XMLElementType.XML_NAMESPACE_DECL) {
            return xmlPtrToXmlNs(_ref).prefix;
        }

        return this.type();
    }

    /**
     * Get the line number that this node starts on in the original parsed document
     *
     * @returns {number} line number
     */
    public line() {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        return xmlGetLineNo(_ref);
    }

    /**
     * Get the type of element (XMLElementType)
     *
     * "text" | "cdata" | "comment" | "element" | "node"
     *
     * @returns {string} the node type
     */
    public type() {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.type === XMLElementType.XML_TEXT_NODE) {
            return "text";
        }

        if (_ref.type === XMLElementType.XML_CDATA_SECTION_NODE) {
            return "cdata";
        }

        if (_ref.type === XMLElementType.XML_COMMENT_NODE) {
            return "comment";
        }

        if (_ref.type === XMLElementType.XML_ELEMENT_NODE) {
            return "element";
        }

        return "node";
    }

    /**
     * Create a new element with the given name and content,
     * then append it as a child of the current node
     *
     * @see XMLNode.createElement
     * @param name
     * @param content
     * @returns the appended element
     */
    public node(name: string, content?: string): XMLElement {
        return this.addChild(this.createElement(name, content));
    }

    /**
     * Create a new element with the given name and content
     *
     * @param name
     * @param content
     * @returns the created element
     */
    public createElement(name: string, content?: string): XMLElement {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.doc === null) {
            throw new Error(XMLNodeError.NO_DOC);
        }

        return createXMLReference(XMLDocument, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).doc).createElement(
            name,
            content
        );
    }

    /**
     * Get the previous sibling relative to the current node
     *
     * @returns {XMLElement | null} previous element
     */
    public prevElement() {
        let node = this.prevSibling();

        while (node !== null && node.type() !== "element") {
            node = node.prevSibling();
        }

        return node;
    }

    /**
     * Get the next sibling relative to the current node
     *
     * @returns {XMLElement | null} next element
     */
    public nextElement() {
        let node = this.nextSibling();

        while (node !== null && node.type() !== "element") {
            node = node.nextSibling();
        }

        return node;
    }

    protected importNode(node: xmlNodePtr) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.doc === node.doc) {
            if (node.parent !== null) {
                xmlUnlinkNode(node);
            }

            return node;
        }

        return xmlDocCopyNode(node, _ref.doc, 1);
    }

    private childWillMerge(_nodeRef: xmlNodePtr) {
        const _selfRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        return (
            _nodeRef.type === XMLElementType.XML_TEXT_NODE &&
            _selfRef.last !== null &&
            _selfRef.last.type === XMLElementType.XML_TEXT_NODE &&
            _selfRef.last.name === _nodeRef.name &&
            _selfRef.last !== _nodeRef
        );
    }

    /**
     * Append node after the last node child
     *
     * @param node the XMLElement to append
     * @returns the appended child
     */
    public addChild(node: XMLElement): XMLElement {
        const _parentRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _childRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        let childNode = this.importNode(_childRef);

        if (childNode === _childRef && this.childWillMerge(childNode)) {
            childNode = xmlAddChild(_parentRef, xmlCopyNode(childNode, 0));
        } else {
            childNode = xmlAddChild(_parentRef, childNode);
        }

        return createXMLReference(XMLElement, childNode);
    }

    private nextSiblingWillMerge(node: XMLElement) {
        const _selfRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _nodeRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        return (
            _nodeRef.type === XMLElementType.XML_TEXT_NODE &&
            (_selfRef.type === XMLElementType.XML_TEXT_NODE ||
                (_selfRef.next !== null &&
                    _selfRef.next.type === XMLElementType.XML_TEXT_NODE &&
                    _selfRef.name === _selfRef.next.name))
        ); // libxml2 bug?
    }

    /**
     * Insert a node directly after the current node
     *
     * @param node the node to be inserted
     * @returns the inserted sibling
     */
    public addNextSibling(node: XMLElement) {
        const _parentRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _childRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        let childNode = this.importNode(_childRef);

        if (childNode === _childRef && this.nextSiblingWillMerge(node)) {
            childNode = xmlCopyNode(childNode, 0);
        }

        return createXMLReference(XMLElement, xmlAddNextSibling(_parentRef, childNode));
    }

    private prevSiblingWillMerge(node: XMLElement) {
        const _selfRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _nodeRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        return (
            _nodeRef.type === XMLElementType.XML_TEXT_NODE &&
            (_selfRef.type === XMLElementType.XML_TEXT_NODE ||
                (_selfRef.prev !== null &&
                    _selfRef.prev.type === XMLElementType.XML_TEXT_NODE &&
                    _selfRef.name === _selfRef.prev.name))
        );
    }

    /**
     * Insert a node directly before the current node
     *
     * @param node the node to be inserted
     * @returns the inserted sibling
     */
    public addPrevSibling(node: XMLElement) {
        const _parentRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _childRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        let childNode = this.importNode(_childRef);

        if (childNode === _childRef && this.prevSiblingWillMerge(node)) {
            childNode = xmlCopyNode(childNode, 0);
        }

        return createXMLReference(XMLElement, xmlAddPrevSibling(_parentRef, childNode));
    }

    /**
     * Get an array of child nodes
     *
     * @returns {XMLElement[]} array of child nodes
     */
    public childNodes() {
        return (
            this.getNativeReferenceOrReturnNull((_ref) => {
                const children = [];

                let child = _ref.children;

                while (child !== null) {
                    children.push(createXMLReference(XMLElement, child));
                    child = child.next;
                }

                return children;
            }) || []
        );
    }

    public prevSibling() {
        return createXMLReference(XMLNode, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).prev).getSelfOrNull();
    }

    public nextSibling() {
        return createXMLReference(XMLNode, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).next).getSelfOrNull();
    }

    /**
     * Find decendant nodes matching the given xpath selector
     *
     * @param xpath XPath selector
     * @param namespace optional namespace
     * @returns {XMLElement[]} array of matching decendant nodes
     */
    public find(xpath: string, namespace?: XPathNamespace): XMLXPathResult[] {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        const xpathContext = xmlXPathNewContext(_ref.doc);

        if (namespace) {
            if (namespace instanceof XMLNamespace) {
                xmlXPathRegisterNs(xpathContext, namespace.prefix(), namespace.href());
            } else if (typeof namespace === "string") {
                xmlXPathRegisterNs(xpathContext, "xmlns", namespace);
            } else {
                Object.keys(namespace).forEach((prefix) => {
                    const href = namespace[prefix];

                    xmlXPathRegisterNs(xpathContext, prefix, href);
                });
            }
        }

        const result = xmlXPathNodeEval(_ref, xpath, xpathContext);

        if (result.type === xmlXPathObjectType.XPATH_BOOLEAN) {
            return [!!result.boolval];
        } else if (result.type === xmlXPathObjectType.XPATH_NUMBER) {
            return [result.floatval];
        } else if (result.type === xmlXPathObjectType.XPATH_STRING) {
            return [result.stringval];
        } else if (result.type === xmlXPathObjectType.XPATH_NODESET) {
            return result.nodesetval.map((node) => {
                return refToNodeType(node);
            });
        }

        return [null];
    }

    /**
     * Find the first decendant node matching the given xpath selector
     *
     * @param xpath XPath selector
     * @param namespace optional namespace
     * @returns {XMLElement} first matching decendant node
     */
    public get(xpath: string, namespace?: XPathNamespace): XMLXPathResult {
        return this.find(xpath, namespace)[0];
    }

    /**
     * Return the child at the given index
     * @param index the index of the child
     * @returns {XMLElement | null} the child to return
     */
    public child(index: number) {
        let currIndex = 0;
        let _childRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).children;

        while (_childRef != null) {
            if (currIndex >= index) {
                break;
            }

            currIndex++;

            _childRef = _childRef.next;
        }

        return createXMLReference(XMLElement, _childRef).getSelfOrNull();
    }

    public remove() {
        xmlUnlinkNode(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
    }

    /**
     * Get the associated XMLDocument for the current node
     *
     * @returns {XMLDocument}
     */
    public doc(): XMLDocument {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        return createXMLReference(XMLDocument, _ref.doc);
    }

    public toString(options: XMLSaveOptions | boolean = {}): string {
        return (
            this.getNativeReferenceOrReturnNull((_ref) => {
                return XMLDocument.toString(_ref, options);
            }) || ""
        );
    }

    /**
     * Get or set the namespace for the current node
     *
     * @param prefix namespace prefix
     * @param href namespace URL
     * @returns {XMLNamespace} the current namespace
     */
    public namespace(prefix?: string | XMLNamespace | null, href?: string | null) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        // TODO(refactor): legacy overloaded return value

        if (prefix === null) {
            _ref.ns = xmlPtrToXmlNs(null);
        } else if (prefix instanceof XMLNamespace) {
            const _nsRef = prefix.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

            xmlSetNs(_ref, _nsRef);

            return this;
        } else if (typeof prefix === "string") {
            if (!href) {
                href = prefix;
                prefix = null;
            }

            const _nsRef = this.doc().getNativeReferenceOrReturnNull((_docRef) => {
                let namespace = null;

                if (typeof prefix === "string") {
                    namespace = xmlSearchNs(_docRef, _ref, prefix);
                }

                if (!namespace && typeof href === "string") {
                    namespace = xmlSearchNsByHref(_docRef, _ref, href);
                }

                return namespace;
            });

            xmlSetNs(_ref, _nsRef || xmlNewNs(_ref, href, prefix));

            return this;
        }

        return createXMLReference(XMLNamespace, _ref.ns).getSelfOrNull();
    }

    /**
     * Get an array of namespaces that appy to the current node
     *
     * @param onlyLocal whether to include inherited namespaces
     * @returns {XMLNamespace[]} an array of namespaces for the current node
     */
    public namespaces(onlyLocal: boolean = false) {
        const namespaces = [];

        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (onlyLocal === true) {
            let namespace = _ref.nsDef;

            while (namespace !== null) {
                namespaces.push(createXMLReference(XMLNamespace, namespace));

                namespace = namespace.next;
            }
        } else {
            xmlGetNsList(_ref.doc, _ref).forEach((namespace) => {
                namespaces.push(createXMLReference(XMLNamespace, namespace));
            });
        }

        return namespaces;
    }

    public defineNamespace(prefix: string | null, href?: string | null) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (!href) {
            href = prefix;
            prefix = null;
        }

        return createXMLReference(XMLNamespace, xmlNewNs(_ref, href, prefix));
    }

    public clone() {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        return refToNodeType(xmlDocCopyNode(_ref, _ref.doc, 1));
    }
}

export class XMLElement extends XMLNode {
    public name(value?: string): string {
        if (value !== undefined) {
            xmlNodeSetName(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF), value);
        }

        return super.name();
    }

    public attr(key: string | XMLAttributeMap, value?: string | number): XMLAttribute | null {
        if (typeof key === "string") {
            const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

            if (value === undefined) {
                return createXMLReference(XMLAttribute, xmlHasProp(_ref, key)).getSelfOrNull();
            }

            return createXMLReference(XMLAttribute, xmlSetProp(_ref, key, value.toString())).getSelfOrNull();
        } else {
            Object.keys(key).forEach((k) => {
                this.attr(k, key[k]);
            });
        }

        // @ts-ignore
        return this;
    }

    public attrs(): XMLAttribute[] {
        const attrs: XMLAttribute[] = [];
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        let attr = _ref.properties;

        while (attr !== null) {
            attrs.push(createXMLReference(XMLAttribute, attr));

            attr = attr.next;
        }

        return attrs;
    }

    public cdata(content: string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        const cdata = xmlNewCDataBlock(_ref.doc, content, content.length);

        this.addChild(createXMLReference(XMLElement, cdata));

        return this;
    }

    public text(content?: string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (content === undefined) {
            return xmlNodeGetContent(_ref);
        }

        if (this.type() !== "comment") {
            content = this.doc().encode(content);
        }

        this.childNodes().forEach((child) => {
            xmlUnlinkNode(child.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
        });

        xmlNodeSetContent(_ref, content);

        return content;
    }

    public path() {
        return xmlGetNodePath(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
    }

    public replace(value: XMLElement | string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        let _newRef;

        if (typeof value === "string") {
            _newRef = xmlNewDocText(this.doc().getNativeReferenceOrThrow(XMLNodeError.NO_REF), value);
        } else {
            _newRef = this.importNode(value.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
        }

        this.setNativeReference(xmlReplaceNode(_ref, _newRef));
    }
}

export class XMLNamespace extends XMLReference<xmlNsPtr> {
    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlNs(_ref));
    }

    public prefix() {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).prefix || null;
    }

    public href(): string {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).href;
    }
}

export class XMLAttribute extends XMLNode {
    public name(): string {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).name;
    }

    public value(value?: string): string {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (typeof value === "string") {
            const content = xmlEncodeEntitiesReentrant(_ref.doc, value);

            _ref.children = xmlStringGetNodeList(_ref.doc, content);
            _ref.last = xmlPtrToXmlNode(null);

            let child = _ref.children;

            while (child !== null) {
                child.parent = _ref;
                child.doc = _ref.doc;

                if (child.next === null) {
                    _ref.last = child;
                }

                child = child.next;
            }
        }

        return _ref.children.content;
    }

    public node(): XMLElement {
        return createXMLReference(XMLElement, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).parent);
    }
}

export class XMLDTD extends XMLReference<xmlDtdPtr> {
    public name: string;

    public externalId: string | null;

    public systemId: string | null;

    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlDtd(_ref));

        this.name = this.getName();
        this.externalId = this.getExternalID();
        this.systemId = this.getSystemID();
    }

    public getName(): string {
        return xmlPtrToXmlDtd(this.getNativeReference())?.name || "";
    }

    public getExternalID(): string | null {
        return xmlPtrToXmlDtd(this.getNativeReference())?.ExternalID || null;
    }

    public getSystemID(): string | null {
        return xmlPtrToXmlDtd(this.getNativeReference())?.SystemID || null;
    }
}

export class XMLText extends XMLElement {}
