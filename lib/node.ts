import {
    xmlDocPtr,
    xmlNodePtr,
    XMLReference,
    xmlXPathNewContext,
    xmlXPathNodeEval,
    xmlUnlinkNode,
    xmlHasProp,
    xmlGetProp,
    xmlAttrPtr,
    xmlSetProp,
    xmlAddChild,
    xmlDtdPtr,
    xmlElementPtr,
    xmlPtrToXmlNode,
    xmlPtrToXmlDtd,
    xmlPtrToXmlDoc,
    xmlPtrToXmlNs,
    createXMLReference,
    XMLReferenceType,
    xmlDocCopyNode,
    xmlNewCDataBlock,
    xmlGetLastError,
    getChildAtIndex,
    xmlNodeGetContent,
    xmlNodeSetContent,
    xmlNodeSetName,
    xmlGetNodePath,
    xmlCopyNode,
    xmlAddNextSibling,
    xmlAddPrevSibling,
    xmlNsPtr,
    xmlNewDocText,
    xmlReplaceNode,
    xmlNewNs,
    xmlSetNs,
    xmlSearchNs,
    xmlEncodeEntitiesReentrant,
    xmlStringGetNodeList,
} from "./bindings";

import bindings from "./bindings"

export enum XMLNodeError {
    NO_REF = 'Node has no native reference',
};

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
};

export type XMLAttributeMap = {
    [key: string]: string | number
};

import { XMLDocument, XMLSaveOptions } from "./document";

export const DEFAULT_XML_SAVE_OPTIONS: XMLSaveOptions = {
    type: 'XML',
    format: false,
};

export type XMLXPathResult = XMLNode | XMLAttribute | XMLElement | XMLDocument | null;

function refToNodeType(node: xmlNodePtr | xmlDocPtr | null): XMLNode | XMLAttribute | XMLElement | XMLDocument | null {
    if (node === null) {
        return null;
    }

    if (node.type === XMLElementType.XML_DOCUMENT_NODE ||
        node.type === XMLElementType.XML_DOCB_DOCUMENT_NODE ||
        node.type === XMLElementType.XML_HTML_DOCUMENT_NODE) {
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

    public parent() {
        return this.getNativeReferenceOrReturnNull(_ref => {
            if (_ref.parent === null) {
                return refToNodeType(_ref.doc);
            }

            return refToNodeType(_ref.parent);
        });
    }

    public name(): string {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.type === XMLElementType.XML_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_DOCB_DOCUMENT_NODE ||
            _ref.type === XMLElementType.XML_HTML_DOCUMENT_NODE) {
            return xmlPtrToXmlDoc(_ref).URL;
        }
    
        if (_ref.type === XMLElementType.XML_ATTRIBUTE_NODE) {
            return _ref.name;
        }
    
        if (_ref.type === XMLElementType.XML_NAMESPACE_DECL) {
            return xmlPtrToXmlNs(_ref).prefix;
        }
        
        return this.type();
    }

    public type() {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.type === XMLElementType.XML_COMMENT_NODE) {
            return 'comment';
        }

        if (_ref.type === XMLElementType.XML_ELEMENT_NODE) {
            return 'element';
        }

        return 'node';
    }

    public node(name: string, content?: string): XMLElement {
        return this.addChild(this.createElement(name, content));
    }

    public createElement(name: string, content?: string): XMLElement {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (_ref.doc === null) {
            throw new Error('No document for node');
        }

        return (createXMLReference(XMLDocument, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).doc)).createElement(name, content);
    }

    private importNode(node: xmlNodePtr) {
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

        return ((_nodeRef.type === XMLElementType.XML_TEXT_NODE) &&
                (_selfRef.last !== null) &&
                (_selfRef.last.type === XMLElementType.XML_TEXT_NODE) &&
                (_selfRef.last.name === _nodeRef.name) &&
                (_selfRef.last !== _nodeRef));
    }

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

        return ((_nodeRef.type === XMLElementType.XML_TEXT_NODE) &&
            ((_selfRef.type === XMLElementType.XML_TEXT_NODE) ||
            ((_selfRef.next !== null) &&
            (_selfRef.next.type === XMLElementType.XML_TEXT_NODE) &&
            (_selfRef.name === _selfRef.next.name)))); // libxml2 bug?
    }

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

        return ((_nodeRef.type === XMLElementType.XML_TEXT_NODE) &&
            ((_selfRef.type === XMLElementType.XML_TEXT_NODE) ||
            ((_selfRef.prev !== null) &&
            (_selfRef.prev.type === XMLElementType.XML_TEXT_NODE) &&
            (_selfRef.name === _selfRef.prev.name))));
    }

    public addPrevSibling(node: XMLElement) {
        const _parentRef = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        const _childRef = node.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        let childNode = this.importNode(_childRef);
        
        if (childNode === _childRef && this.prevSiblingWillMerge(node)) {
            childNode = xmlCopyNode(childNode, 0);
        }

        return createXMLReference(XMLElement, xmlAddPrevSibling(_parentRef, childNode));
    }

    public childNodes() {
        return this.getNativeReferenceOrReturnNull(_ref => {
            const children = [];

            let child = _ref.children;

            while (child !== null) {
                children.push(createXMLReference(XMLElement, child));
                child = child.next;
            }

            return children;
        }) || [];
    }

    public prevSibling(): XMLNode {
        return createXMLReference(XMLNode, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).prev);
    }

    public nextSibling(): XMLNode {
        return createXMLReference(XMLNode, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).next);
    }

    public find(xpath: string): XMLXPathResult[] {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        // console.log(_ref.doc);
        const xpathContext = xmlXPathNewContext(_ref.doc);

        return xmlXPathNodeEval(_ref, xpath, xpathContext)
                .nodesetval
                .map(node => {
                    return refToNodeType(node);
                });
    }

    public get(xpath: string): XMLXPathResult | null {
        return this.find(xpath)[0] || null;
    }

    public child(index: number) {
        return createXMLReference(XMLElement, getChildAtIndex(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF), index) || null);
    }

    public remove() {
        xmlUnlinkNode(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
    }

    public doc(): XMLDocument {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        
        return createXMLReference(XMLDocument, _ref.doc);
    }

    public toString(options: XMLSaveOptions | false = DEFAULT_XML_SAVE_OPTIONS): string {
        return this.getNativeReferenceOrReturnNull(_ref => {
            return XMLDocument.toString(_ref, options);
        }) || '';
    }

    // TODO(refactor): overloaded return value
    public namespace(prefix?: string | XMLNamespace, href?: string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (prefix instanceof XMLNamespace || typeof prefix === 'string') {
            let namespace: xmlNsPtr | null = (prefix instanceof XMLNamespace) ? prefix.getNativeReferenceOrThrow(XMLNodeError.NO_REF) : this.doc().getNativeReferenceOrReturnNull(_docRef => {
                const namespace = xmlSearchNs(_docRef, _ref, prefix);

                if (!namespace && typeof href === 'string') {
                    return xmlSearchNs(_docRef, _ref, href);
                }

                return namespace;
            });

            return (createXMLReference(XMLNamespace,
                (namespace === null && typeof href === 'string' && typeof prefix === 'string') ? xmlNewNs(_ref, prefix, href) : namespace)
            ).getNativeReferenceOrReturnNull(_nsRef => {
                xmlSetNs(_ref, _nsRef);
                
                return this;
            }) || this;
        }

        return (createXMLReference(XMLNamespace, this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).ns)).getSelfOrNull();
    }

    public clone() {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        return refToNodeType(xmlDocCopyNode(_ref, _ref.doc, 1));
    }
};

export class XMLElement extends XMLNode {
    public name(value?: string): string {
        if (value !== undefined) {
            xmlNodeSetName(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF), value);
        }

        return this.getNativeReferenceOrReturnNull(_ref => {
            return _ref.name;
        }) || '';
    }

    public attr(key: string | XMLAttributeMap, value?: string | number): XMLAttribute | null {
        if (typeof key === 'string') {
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

    public cdata(content: string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        const cdata = xmlNewCDataBlock(_ref.doc, content, content.length);

        this.addChild(createXMLReference(XMLElement, cdata));

        return this;
    }

    public text(content?: string) {
        if (content === undefined) {
            return xmlNodeGetContent(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
        }

        xmlNodeSetContent(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF), this.doc().encode(content));

        return content;
    }

    public path() {
        return xmlGetNodePath(this.getNativeReferenceOrThrow(XMLNodeError.NO_REF));
    }

    public attrs(): XMLAttribute[] {
        const attrs: XMLAttribute[] = [];
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        let attr = _ref.properties;

        while (attr !== null) {
            attrs.push(new XMLAttribute(attr));
            
            attr = attr.next;
        }

        return attrs;
    }

    public replace(value: XMLElement | string) {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        let _newRef;

        if (typeof value === 'string') {
            _newRef = xmlNewDocText(this.doc().getNativeReferenceOrThrow(XMLNodeError.NO_REF), value);
        } else {
            _newRef = value.getNativeReferenceOrThrow(XMLNodeError.NO_REF);
        }

        this.setNativeReference(xmlReplaceNode(_ref, _newRef));
    }
};

export class XMLNamespace extends XMLReference<xmlNsPtr> {
    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlNs(_ref));
    }

    public prefix(): string {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).prefix;
    }

    public href(): string {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).href;
    }
};

export class XMLAttribute extends XMLNode {
    public name(): string {
        return this.getNativeReferenceOrThrow(XMLNodeError.NO_REF).name;
    }

    public value(value?: string): string {
        const _ref = this.getNativeReferenceOrThrow(XMLNodeError.NO_REF);

        if (typeof value === 'string') {
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
};

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
        return xmlPtrToXmlDtd(this.getNativeReference())?.name || '';
    }

    public getExternalID(): string | null {
        return xmlPtrToXmlDtd(this.getNativeReference())?.ExternalID || null;
    }

    public getSystemID(): string | null {
        return xmlPtrToXmlDtd(this.getNativeReference())?.SystemID || null;
    }
};

export class XMLText extends XMLElement {
};