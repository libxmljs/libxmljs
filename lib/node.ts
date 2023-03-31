import { xmlDocPtr, xmlNodePtr, xmlDtdPtr, xmlNsPtr, XMLReferenceType, xmlXPathObjectPtr } from "./bindings/types";

import { XMLReference, createXMLReference, createXMLReferenceOrThrow } from "./bindings";

import {
    xmlXPathNewContext,
    xmlXPathNodeEval,
    xmlUnlinkNode,
    xmlHasProp,
    xmlSetProp,
    xmlAddChild,
    xmlDocCopyNode,
    xmlNewCDataBlock,
    xmlNodeGetContent,
    xmlNodeSetContent,
    xmlNodeSetName,
    xmlGetNodePath,
    xmlCopyNode,
    xmlAddNextSibling,
    xmlAddPrevSibling,
    xmlReplaceNode,
    xmlNewNs,
    xmlSetNs,
    xmlEncodeEntitiesReentrant,
    xmlStringGetNodeList,
    xmlGetNsList,
    xmlXPathRegisterNs,
    xmlGetLineNo,
    xmlDocSetRootElement,
    xmlSaveTree,
    xmlReconciliateNs,
    xmlSetTreeDoc,
    xmlXPathFreeObject,
    xmlXPathFreeContext,
} from "./bindings/functions";

import { xmlSaveCtxtPtr }from "./bindings/types"

import bindings from "./bindings";

export enum XMLNodeError {
    NO_REF = "Node has no native reference",
    NO_DOC = "Node has no document",
}
export type XPathNamespace = string | XMLNamespace | { [key: string]: string };

export type XMLAttributeMap = {
    [key: string]: string | number;
};

import { XMLDocument } from "./document";
import { XMLElementType, XMLSaveOptions } from "./types";

export type XMLXPathNode = XMLNode | XMLAttribute | XMLElement;

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
        return createXMLReference(XMLDocument, node);
    }

    if (node.type === XMLElementType.XML_ATTRIBUTE_NODE) {
        return createXMLReference(XMLAttribute, node);
    }

    if (node.type === XMLElementType.XML_ELEMENT_NODE) {
        return createXMLReference(XMLElement, node);
    }

    if (node.type === XMLElementType.XML_TEXT_NODE) {
        return createXMLReference(XMLText, node);
    }

    return createXMLReference(XMLNode, node);
}

export class XMLNode extends XMLReference<xmlNodePtr> {
    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);
    }

    /**
     * Get the parent node for the current
     *
     * @returns {XMLElement} parent node
     */
    public parent() {
        const _ref = this.getNativeReference();

        if (_ref.parent === null) {
            return refToNodeType(_ref.doc);
        }

        return refToNodeType(_ref.parent);
    }

    /**
     * Get the tag name of current node
     *
     * @returns {string} name
     */
    public name(): string {
        const _ref = this.getNativeReference();

        if (
            _ref.type === XMLElementType.XML_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_DOCB_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_HTML_DOCUMENT_NODE
        ) {
            return createXMLReferenceOrThrow(XMLDocument, _ref, XMLNodeError.NO_REF).name();
        }

        if (
            _ref.type === XMLElementType.XML_ATTRIBUTE_NODE ||
            _ref.type === XMLElementType.XML_ELEMENT_NODE ||
            _ref.type === XMLElementType.XML_PI_NODE
        ) {
            return _ref.name;
        }

        if (_ref.type === XMLElementType.XML_NAMESPACE_DECL) {
            return createXMLReferenceOrThrow(XMLNamespace, _ref, XMLNodeError.NO_REF).name();
        }

        return this.type();
    }

    /**
     * Get the line number that this node starts on in the original parsed document
     *
     * @returns {number} line number
     */
    public line() {
        const _ref = this.getNativeReference();

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
        const _ref = this.getNativeReference();

        switch (_ref.type) {
            case XMLElementType.XML_ELEMENT_NODE:
                return "element";
            case XMLElementType.XML_ATTRIBUTE_NODE:
                return "attribute";
            case XMLElementType.XML_TEXT_NODE:
                return "text";
            case XMLElementType.XML_CDATA_SECTION_NODE:
                return "cdata";
            case XMLElementType.XML_ENTITY_REF_NODE:
                return "entity_ref";
            case XMLElementType.XML_ENTITY_NODE:
                return "entity";
            case XMLElementType.XML_PI_NODE:
                return "pi";
            case XMLElementType.XML_COMMENT_NODE:
                return "comment";
            case XMLElementType.XML_DOCUMENT_NODE:
                return "document";
            case XMLElementType.XML_DOCUMENT_TYPE_NODE:
                return "document_type";
            case XMLElementType.XML_DOCUMENT_FRAG_NODE:
                return "document_frag";
            case XMLElementType.XML_NOTATION_NODE:
                return "notation";
            case XMLElementType.XML_HTML_DOCUMENT_NODE:
                return "html_document";
            case XMLElementType.XML_DTD_NODE:
                return "dtd";
            case XMLElementType.XML_ELEMENT_DECL:
                return "element_decl";
            case XMLElementType.XML_ATTRIBUTE_DECL:
                return "attribute_decl";
            case XMLElementType.XML_ENTITY_DECL:
                return "entity_decl";
            case XMLElementType.XML_NAMESPACE_DECL:
                return "namespace_decl";
            case XMLElementType.XML_XINCLUDE_START:
                return "xinclude_start";
            case XMLElementType.XML_XINCLUDE_END:
                return "xinclude_end";
            case XMLElementType.XML_DOCB_DOCUMENT_NODE:
                return "docb_document";
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
        const _ref = this.getNativeReference();

        if (_ref.doc === null) {
            throw new Error(XMLNodeError.NO_DOC);
        }

        return createXMLReferenceOrThrow(XMLDocument, this.getNativeReference().doc, XMLNodeError.NO_REF).createElement(
            name,
            content
        );
    }

    public defineNamespace(prefix: string | null, href?: string | null): XMLNamespace {
        if (!href) {
            href = prefix;
            prefix = null;
        }

        return createXMLReferenceOrThrow(
            XMLNamespace,
            xmlNewNs(this.getNativeReference(), href, prefix),
            XMLNodeError.NO_REF
        );
    }

    /**
     * @private
     * @param _docRef 
     */
    public setDocumentRoot(_docRef: xmlDocPtr) {
        xmlDocSetRootElement(_docRef, this.getNativeReference());
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

    protected importNode(node: xmlNodePtr): XMLNode {
        const _ref = this.getNativeReference();

        if (_ref.doc === node.doc) {
            if (node.parent !== null) {
                xmlUnlinkNode(node);
            }

            return createXMLReferenceOrThrow(XMLNode, node, XMLNodeError.NO_REF);
        }

        return createXMLReferenceOrThrow(XMLNode, xmlDocCopyNode(node, _ref.doc, 1), XMLNodeError.NO_REF);
    }

    private childWillMerge(_nodeRef: xmlNodePtr) {
        const _selfRef = this.getNativeReference();

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
        const _parentRef = this.getNativeReference();
        const _childRef = node.getNativeReference();
        let childNode: xmlNodePtr | null = this.importNode(_childRef).getNativeReference();

        if (childNode === _childRef && this.childWillMerge(childNode)) {
            childNode = xmlAddChild(_parentRef, xmlCopyNode(childNode, 0));
        } else {
            childNode = xmlAddChild(_parentRef, childNode);
        }

        return createXMLReferenceOrThrow(XMLElement, childNode, XMLNodeError.NO_REF);
    }

    private nextSiblingWillMerge(node: XMLElement) {
        const _selfRef = this.getNativeReference();
        const _nodeRef = node.getNativeReference();

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
        const _parentRef = this.getNativeReference();
        const _childRef = node.getNativeReference();
        let childNode: xmlNodePtr | null = this.importNode(_childRef).getNativeReference();

        if (childNode === _childRef && this.nextSiblingWillMerge(node)) {
            childNode = xmlCopyNode(childNode, 0);
        }

        return createXMLReference(XMLElement, xmlAddNextSibling(_parentRef, childNode));
    }

    private prevSiblingWillMerge(node: XMLElement) {
        const _selfRef = this.getNativeReference();
        const _nodeRef = node.getNativeReference();

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
        const _parentRef = this.getNativeReference();
        const _childRef = node.getNativeReference();
        let childNode: xmlNodePtr | null = this.importNode(_childRef).getNativeReference();

        if (childNode === _childRef && this.prevSiblingWillMerge(node)) {
            childNode = xmlCopyNode(childNode, 0);
        }

        return createXMLReferenceOrThrow(XMLElement, xmlAddPrevSibling(_parentRef, childNode), XMLNodeError.NO_REF);
    }

    /**
     * Get an array of child nodes
     *
     * @returns {XMLElement[]} array of child nodes
     */
    public childNodes() {
        const _ref = this.getNativeReference()
        const children: XMLElement[] = [];

        let child = _ref.children;

        while (child !== null) {
            children.push(createXMLReferenceOrThrow(XMLElement, child, XMLNodeError.NO_REF));
            child = child.next;
        }

        return children;
    }

    public prevSibling() {
        return createXMLReference(XMLNode, this.getNativeReference().prev);
    }

    public nextSibling() {
        return createXMLReference(XMLNode, this.getNativeReference().next);
    }

    public evaluateXPath(xpath: string, namespace?: XPathNamespace): xmlXPathObjectPtr {
        const _ref = this.getNativeReference();

        const xpathContext = xmlXPathNewContext(_ref.doc);

        if (namespace) {
            if (namespace instanceof XMLNamespace) {
                xmlXPathRegisterNs(xpathContext, namespace.prefix(), namespace.href());
            } else if (typeof namespace === "string") {
                xmlXPathRegisterNs(xpathContext, "xmlns", namespace);
            } else {
                Object.keys(namespace).forEach((prefix) => {
                    const href = namespace[prefix];

                    xmlXPathRegisterNs(xpathContext, prefix, href || null);
                });
            }
        }

        const ret = xmlXPathNodeEval(_ref, xpath, xpathContext);

        xmlXPathFreeContext(xpathContext);

        return ret;
    }

    /**
     * Find decendant nodes matching the given xpath selector
     *
     * @param xpath XPath selector
     * @param namespace optional namespace
     * @returns {XMLXPathNodeSet} array of matching decendant nodes
     */
    public find(xpath: string, namespace?: XPathNamespace): XMLXPathNode[] {
        const result = this.evaluateXPath(xpath, namespace);

        const nodeSet: XMLXPathNode[] = [];

        result.nodesetval.forEach((node) => {
            const instance = refToNodeType(node);
            
            if (instance !== null && !(instance instanceof XMLDocument)) {
                nodeSet.push(instance);
            }
        });

        xmlXPathFreeObject(result);

        return nodeSet;
    }

    /**
     * Find the first decendant node matching the given xpath selector
     *
     * @param xpath XPath selector
     * @param namespace optional namespace
     * @returns {XMLElement} first matching decendant node
     */
    public get(xpath: string, namespace?: XPathNamespace): XMLXPathNode | boolean | number | string | null {
        const result = this.evaluateXPath(xpath, namespace);

        let ret: ReturnType<typeof XMLNode.prototype.get> = null;

        if (result.type === xmlXPathObjectType.XPATH_BOOLEAN) {
            ret = !!result.boolval;
        } else if (result.type === xmlXPathObjectType.XPATH_NUMBER) {
            ret = result.floatval;
        } else if (result.type === xmlXPathObjectType.XPATH_STRING) {
            ret = result.stringval;
        } else if (result.type === xmlXPathObjectType.XPATH_NODESET) {
            const _ref = result.nodesetval[0];

            if (_ref) {
                const node = refToNodeType(_ref);
                
                if (node !== null && !(node instanceof XMLDocument)) {
                    ret = node;
                }
            }
        }

        xmlXPathFreeObject(result);

        return ret;
    }

    /**
     * Return the child at the given index
     * @param index the index of the child
     * @returns {XMLElement | null} the child to return
     */
    public child(index: number) {
        let currIndex = 0;
        let _childRef = this.getNativeReference().children;

        while (_childRef != null) {
            if (currIndex >= index) {
                break;
            }

            currIndex++;

            _childRef = _childRef.next;
        }

        return createXMLReference(XMLElement, _childRef);
    }

    public remove() {
        xmlUnlinkNode(this.getNativeReference());
    }

    /**
     * Get the associated XMLDocument for the current node
     *
     * @returns {XMLDocument | null}
     */
    public doc() {
        const _ref = this.getNativeReference();

        return createXMLReference(XMLDocument, _ref.doc);
    }

    public toString(options: XMLSaveOptions | boolean = {}): string {
        return XMLDocument.toString(this, options) || "";
    }

    /**
     * Get or set the namespace for the current node
     *
     * @param prefix namespace prefix
     * @param href namespace URL
     * @returns {XMLNamespace} the current namespace
     */
    public namespace(prefix?: string | XMLNamespace | null, href?: string | null): XMLNamespace | null {
        const _ref = this.getNativeReference();

        if (prefix === null) {
            _ref.ns = null;
        } else if (prefix instanceof XMLNamespace) {
            prefix._applyToNode(_ref);
        } else if (typeof prefix === "string") {
            if (!href) {
                href = prefix;
                prefix = null;
            }

            const namespace = this.doc()?._findNamespace(_ref, prefix, href) || this.defineNamespace(prefix, href);

            if (namespace) {
                namespace._applyToNode(_ref);
            }
        }

        return createXMLReference(XMLNamespace, _ref.ns);
    }

    /**
     * Get an array of namespaces that appy to the current node
     *
     * @param onlyLocal whether to include inherited namespaces
     * @returns {XMLNamespace[]} an array of namespaces for the current node
     */
    public namespaces(onlyLocal: boolean = false) {
        const namespaces: XMLNamespace[] = [];

        const _ref = this.getNativeReference();

        if (onlyLocal === true) {
            let namespace = _ref.nsDef;

            while (namespace !== null) {
                namespaces.push(createXMLReferenceOrThrow(XMLNamespace, namespace, XMLNodeError.NO_REF));

                namespace = namespace.next;
            }
        } else {
            xmlGetNsList(_ref.doc, _ref).forEach((namespace) => {
                namespaces.push(createXMLReferenceOrThrow(XMLNamespace, namespace, XMLNodeError.NO_REF));
            });
        }

        return namespaces;
    }

    public clone() {
        const _ref = this.getNativeReference();
        return refToNodeType(xmlDocCopyNode(_ref, _ref.doc, 1));
    }

    /**
     * @private
     * @param context 
     */
    public _xmlSaveTree(context: xmlSaveCtxtPtr) {
        xmlSaveTree(context, this.getNativeReference());
    }
}

export class XMLElement extends XMLNode {
    public name(value?: string): string {
        if (value !== undefined) {
            xmlNodeSetName(this.getNativeReference(), value);
        }

        return super.name();
    }

    public getAttribute(key: string): XMLAttribute | null {
        const _ref = this.getNativeReference();

        return createXMLReference(XMLAttribute, xmlHasProp(_ref, key));
    }

    public setAttribute(key: string, value: string | number): XMLAttribute | null {
        const _ref = this.getNativeReference();

        return createXMLReference(XMLAttribute, xmlSetProp(_ref, key, value.toString()));
    }

    /**
     * set multiple attributes
     * BREAKING CHANGE: no longer overloaded for setting single attr
     * @param attributes 
     * @returns 
     */
    public attr(attributes: XMLAttributeMap): XMLElement {
        if (typeof attributes === "string") {
            console.error("Use XMLElement.setAttribute instead");
            return this;
        }
        Object.keys(attributes).forEach((k) => {
            this.setAttribute(k, attributes[k] || "");
        });

        return this;
    }

    public attrs(): XMLAttribute[] {
        const attrs: XMLAttribute[] = [];
        const _ref = this.getNativeReference();

        let attr = _ref.properties;

        while (attr !== null) {
            attrs.push(createXMLReferenceOrThrow(XMLAttribute, attr, XMLNodeError.NO_REF));

            attr = attr.next;
        }

        return attrs;
    }

    public cdata(content: string) {
        const _ref = this.getNativeReference();

        const cdata = xmlNewCDataBlock(_ref.doc, content, content.length);

        this.addChild(createXMLReferenceOrThrow(XMLElement, cdata, XMLNodeError.NO_REF));

        return this;
    }

    public text(content?: string) {
        const _ref = this.getNativeReference();

        if (content === undefined) {
            return xmlNodeGetContent(_ref);
        }

        const doc = this.doc();

        if (doc && this.type() !== "comment") {
            content = doc.encode(content);
        }

        this.childNodes().forEach((child) => {
            xmlUnlinkNode(child.getNativeReference());
        });

        xmlNodeSetContent(_ref, content);

        return content;
    }

    public path() {
        return xmlGetNodePath(this.getNativeReference());
    }

    public replace(value: XMLElement | string) {
        const _ref = this.getNativeReference();

        let element: XMLNode | null = null;

        const doc =  this.doc();

        if (doc && typeof value === "string") {
            element = doc.createText(value, false);
        } else if (value instanceof XMLNode) {
            element = this.importNode(value.getNativeReference());
        }

        const _newRef = xmlReplaceNode(_ref, (element as XMLElement).getNativeReference());

        if (_newRef !== null) {
            this.setNativeReference(_newRef);
        }
    }
}

export class XMLNamespace extends XMLReference<xmlNsPtr> {
    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);
    }

    public name() {
        return this.prefix() || "";
    }

    public prefix() {
        return this.getNativeReference().prefix || null;
    }

    public href(): string {
        return this.getNativeReference().href;
    }

    /**
     * @private
     * @param _nodeRef
     */
    public _applyToNode(_nodeRef: xmlNodePtr) {
        xmlSetNs(_nodeRef, this.getNativeReference());
    }
}

export class XMLAttribute extends XMLNode {
    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);
    }

    public name(): string {
        return this.getNativeReference().name;
    }

    public defineNamespace(prefix: string | null, href?: string | null): XMLNamespace {
        // should probably do xmlSetNsProp
        return this.node().defineNamespace(prefix, href);
    }

    public value(value?: string): string {
        const _ref = this.getNativeReference();

        if (typeof value === "string") {
            const content = xmlEncodeEntitiesReentrant(_ref.doc, value);

            _ref.children = xmlStringGetNodeList(_ref.doc, content);
            _ref.last = null;

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

        return _ref.children?.content || "";
    }

    public node(): XMLElement {
        return createXMLReferenceOrThrow(XMLElement, this.getNativeReference().parent, XMLNodeError.NO_REF);
    }
}

export class XMLDTD extends XMLReference<xmlDtdPtr> {
    public name: string;

    public externalId: string | null;

    public systemId: string | null;

    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);

        this.name = this.getName();
        this.externalId = this.getExternalID();
        this.systemId = this.getSystemID();
    }

    public getName(): string {
        return this.getNativeReference()?.name || "";
    }

    public getExternalID(): string | null {
        return this.getNativeReference()?.ExternalID || null;
    }

    public getSystemID(): string | null {
        return this.getNativeReference()?.SystemID || null;
    }

    public unlink() {
        xmlUnlinkNode(this.getNativeReference() as any);
    }
}

export class XMLText extends XMLElement {
    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);
    }
}
