"use strict";

import { HTMLDocument, XMLDocument } from "./document";
import { XMLElement, XMLText, XMLNamespace, XMLNodeError, XMLNode } from "./node";
import { parseHtml, parseHtmlAsync, parseXml, parseXmlAsync } from "./parse";
import { SaxParser, SaxPushParser } from "./sax";
import { HTMLParseOptions, XMLParseOptions } from "./types";

function Document(_ref: null | string | Buffer = null, encoding: string = "utf8"): XMLDocument {
    return XMLDocument.createDocument(_ref, encoding);
}

Document.fromXml = (buffer: string | Buffer, options?: XMLParseOptions) => {
    return XMLDocument.fromXml(buffer, options);
};

Document.fromXmlAsync = (buffer: string | Buffer, options: XMLParseOptions) => {
    return XMLDocument.fromXmlAsync(buffer, options);
};

Document.fromHtml = (buffer: string | Buffer, options?: HTMLParseOptions): HTMLDocument => {
    return XMLDocument.fromHtml(buffer, options);
};

Document.fromHtmlAsync = (buffer: string | Buffer, options: HTMLParseOptions): Promise<HTMLDocument> => {
    return XMLDocument.fromHtmlAsync(buffer, options);
};

Document.fromHtmlFragment = (buffer: string, options?: HTMLParseOptions) => {
    return XMLDocument.fromHtmlFragment(buffer, options);
};

function Element(_ref: XMLDocument, name: string, content: string = ""): XMLElement {
    return _ref.createElement(name, content);
}

function Text(document: XMLDocument, content?: string): XMLText {
    if (!document) {
        throw new Error("document argument required");
    }

    if (!(document instanceof XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }

    if (!content) {
        throw new Error("content argument required");
    }

    return document.createText(content);
}

function Comment(document: XMLDocument, content?: string): XMLText {
    if (!document) {
        throw new Error("document argument required");
    }

    if (!(document instanceof XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }

    return document.createComment(content)
}

function ProcessingInstruction(document: XMLDocument, name: string, content?: string): XMLText {
    if (!document) {
        throw new Error("document argument required");
    }

    if (!(document instanceof XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }

    if (!name) {
        throw new Error("name argument required");
    }

    return document.createProcessingInstruction(name, content);
}

function Namespace(node: XMLElement, prefix: string, href: string): XMLNamespace {
    return node.defineNamespace(prefix, href);
}

export {
    Document,
    Element,
    Text,
    Comment,
    ProcessingInstruction,
    Namespace,
    parseXml,
    parseXmlAsync,
    parseHtml,
    parseHtmlAsync,
    SaxParser,
    SaxPushParser
};