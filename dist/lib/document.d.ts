import { XMLElement, XMLDTD, XPathNamespace, XMLNode, XMLText, XMLNamespace } from "./node";
import { XMLParseOptions, HTMLParseOptions, XMLStructuredError, XMLSaveOptions } from "./types";
import { XMLReference } from "./bindings";
import { xmlDocPtr, xmlNodePtr, xmlSaveCtxtPtr } from "./bindings/types";
export declare const DEFAULT_XML_SAVE_OPTIONS: XMLSaveOptions;
export declare class XMLDocument extends XMLReference<xmlDocPtr> {
    errors: XMLStructuredError[];
    validationErrors: any[];
    constructor(_ref: any);
    static createDocument(_ref?: null | string | Buffer, encoding?: string): XMLDocument;
    createText(content?: string, encode?: boolean): XMLText;
    createComment(content?: string): XMLText;
    createProcessingInstruction(name: string, content?: string): XMLText;
    _findNamespace(_nodeRef: xmlNodePtr, prefix?: string | null, href?: string | null): XMLNamespace | null;
    _getDocReference(): xmlDocPtr;
    root(node?: XMLElement): XMLElement | null;
    doc(): this;
    childNodes(): XMLElement[];
    find(xpath: string, namespace?: XPathNamespace): import("./node").XMLXPathNode[];
    get(xpath: string, namespace?: XPathNamespace): string | number | boolean | import("./node").XMLXPathNode | null;
    child(index: number): XMLElement | null;
    namespaces(): XMLNamespace[];
    validate(schemaDoc: XMLDocument): unknown;
    rngValidate(schemaDoc: XMLDocument): boolean;
    name(): string;
    node(name: string, content?: string): XMLElement;
    encode(data: string): string;
    createElement(name: string, content?: string): XMLElement;
    getDtd(): XMLDTD | null;
    setDtd(name: string, externalId?: string | null, systemId?: string | null): XMLDTD | null;
    fromHtml(buffer: string, options?: HTMLParseOptions): HTMLDocument;
    fromXml(buffer: string, options?: XMLParseOptions): HTMLDocument;
    version(): string | null;
    encoding(value?: string): string;
    getParseFlags(): number;
    type(): string;
    toString(options?: XMLSaveOptions | boolean): string;
    static toString(node: XMLNode | XMLDocument, options?: XMLSaveOptions | boolean): string;
    _xmlSaveTree(context: xmlSaveCtxtPtr): void;
    static fromXml(buffer: string | Buffer, options?: XMLParseOptions): XMLDocument;
    static fromXmlAsync(buffer: string | Buffer, options?: XMLParseOptions): Promise<XMLDocument>;
    static fromHtml(buffer: string | Buffer, options?: HTMLParseOptions): HTMLDocument;
    static fromHtmlAsync(buffer: string | Buffer, options?: HTMLParseOptions): Promise<HTMLDocument>;
    static fromHtmlFragment(buffer: string, options?: HTMLParseOptions): HTMLDocument;
}
export declare class HTMLDocument extends XMLDocument {
    toString(options?: XMLSaveOptions | boolean): string;
}
