import { HTMLDocument, XMLDocument } from "./document";
import { XMLElement, XMLText, XMLNamespace } from "./node";
import { parseHtml, parseHtmlAsync, parseXml, parseXmlAsync, parseSchema } from "./parse";
import { SaxParser, SaxPushParser } from "./sax";
import { HTMLParseOptions, XMLParseOptions } from "./types";
declare function Document(_ref?: null | string | Buffer, encoding?: string): XMLDocument;
declare namespace Document {
    var fromXml: (buffer: string | Buffer, options?: XMLParseOptions) => XMLDocument;
    var fromXmlAsync: (buffer: string | Buffer, options: XMLParseOptions) => Promise<XMLDocument>;
    var fromHtml: (buffer: string | Buffer, options?: HTMLParseOptions) => HTMLDocument;
    var fromHtmlAsync: (buffer: string | Buffer, options: HTMLParseOptions) => Promise<HTMLDocument>;
    var fromHtmlFragment: (buffer: string, options?: HTMLParseOptions) => HTMLDocument;
}
declare function Element(_ref: XMLDocument, name: string, content?: string): XMLElement;
declare function Text(document: XMLDocument, content?: string): XMLText;
declare function Comment(document: XMLDocument, content?: string): XMLText;
declare function ProcessingInstruction(document: XMLDocument, name: string, content?: string): XMLText;
declare function Namespace(node: XMLElement, prefix: string, href: string): XMLNamespace;
export { Document, Element, Text, Comment, ProcessingInstruction, Namespace, parseXml, parseXmlAsync, parseHtml, parseHtmlAsync, parseSchema, SaxParser, SaxPushParser };
