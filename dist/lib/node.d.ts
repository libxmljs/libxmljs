import { xmlDocPtr, xmlNodePtr, xmlDtdPtr, xmlNsPtr, xmlXPathObjectPtr } from "./bindings/types";
import { XMLReference } from "./bindings";
import { xmlSaveCtxtPtr } from "./bindings/types";
export declare enum XMLNodeError {
    NO_REF = "Node has no native reference",
    NO_DOC = "Node has no document"
}
export type XPathNamespace = string | XMLNamespace | {
    [key: string]: string;
};
export type XMLAttributeMap = {
    [key: string]: string | number;
};
import { XMLDocument } from "./document";
import { XMLSaveOptions } from "./types";
export type XMLXPathNode = XMLNode | XMLAttribute | XMLElement;
export declare class XMLNode extends XMLReference<xmlNodePtr> {
    constructor(_ref: any);
    parent(): XMLNode | XMLAttribute | XMLElement | XMLDocument | null;
    name(): string;
    line(): number;
    type(): "document" | "text" | "node" | "element" | "attribute" | "cdata" | "entity_ref" | "entity" | "pi" | "comment" | "document_type" | "document_frag" | "notation" | "html_document" | "dtd" | "element_decl" | "attribute_decl" | "entity_decl" | "namespace_decl" | "xinclude_start" | "xinclude_end" | "docb_document";
    node(name: string, content?: string): XMLElement;
    createElement(name: string, content?: string): XMLElement;
    defineNamespace(prefix: string | null, href?: string | null): XMLNamespace;
    setDocumentRoot(_docRef: xmlDocPtr): void;
    prevElement(): XMLNode | null;
    nextElement(): XMLNode | null;
    protected importNode(node: xmlNodePtr): XMLNode;
    private childWillMerge;
    addChild(node: XMLElement): XMLElement;
    private nextSiblingWillMerge;
    addNextSibling(node: XMLElement): XMLElement | null;
    private prevSiblingWillMerge;
    addPrevSibling(node: XMLElement): XMLElement;
    childNodes(): XMLElement[];
    prevSibling(): XMLNode | null;
    nextSibling(): XMLNode | null;
    evaluateXPath(xpath: string, namespace?: XPathNamespace): xmlXPathObjectPtr;
    find(xpath: string, namespace?: XPathNamespace): XMLXPathNode[];
    get(xpath: string, namespace?: XPathNamespace): XMLXPathNode | boolean | number | string | null;
    child(index: number): XMLElement | null;
    remove(): void;
    doc(): XMLDocument | null;
    toString(options?: XMLSaveOptions | boolean): string;
    namespace(prefix?: string | XMLNamespace | null, href?: string | null): XMLNamespace | null;
    namespaces(onlyLocal?: boolean): XMLNamespace[];
    clone(): XMLNode | XMLAttribute | XMLElement | XMLDocument | null;
    _xmlSaveTree(context: xmlSaveCtxtPtr): void;
}
export declare class XMLElement extends XMLNode {
    name(value?: string): string;
    getAttribute(key: string): XMLAttribute | null;
    setAttribute(key: string, value: string | number): XMLAttribute | null;
    attr(attributes: XMLAttributeMap): XMLElement;
    attrs(): XMLAttribute[];
    cdata(content: string): this;
    text(content?: string): string;
    path(): string;
    replace(value: XMLElement | string): void;
}
export declare class XMLNamespace extends XMLReference<xmlNsPtr> {
    constructor(_ref: any);
    name(): string;
    prefix(): string | null;
    href(): string;
    _applyToNode(_nodeRef: xmlNodePtr): void;
}
export declare class XMLAttribute extends XMLNode {
    constructor(_ref: any);
    name(): string;
    defineNamespace(prefix: string | null, href?: string | null): XMLNamespace;
    value(value?: string): string;
    node(): XMLElement;
}
export declare class XMLDTD extends XMLReference<xmlDtdPtr> {
    name: string;
    externalId: string | null;
    systemId: string | null;
    constructor(_ref: any);
    getName(): string;
    getExternalID(): string | null;
    getSystemID(): string | null;
    unlink(): void;
}
export declare class XMLText extends XMLElement {
    constructor(_ref: any);
}
