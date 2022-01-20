"use strict";

const version = require("../package.json").version;

/**
 * packageDocumentation
 * @module libxmljs
 */

import { parseHtml, XMLParseOptions } from "./lib/parse";
export { parseHtml } from "./lib/parse";
export { parseHtml as parseHtmlString };

import { parseXml } from "./lib/parse";
export { parseXml } from "./lib/parse";
export { parseXml as parseXmlString };

import { HTMLParseOptions } from "./lib/parse";
import { XMLDocument } from "./lib/document";

import { createXMLReference } from "./lib/bindings";
import { xmlDocPtr, XMLReferenceType } from "./lib/bindings/types";
import {
    xmlNewDoc,
    xmlNewDocComment,
    xmlNewDocPI,
    xmlNewDocText,
    xmlNewNs,
    xmlPtrToXmlDoc,
} from "./lib/bindings/functions";

import { SaxParser, SaxPushParser } from "./lib/sax";
export { SaxParser, SaxPushParser };

function Document(_ref: XMLReferenceType | null | string | Buffer = null, encoding: string = "utf8"): XMLDocument {
    let _docRef: xmlDocPtr;

    if (_ref === null) {
        _docRef = xmlNewDoc("1.0");
    } else if (typeof _ref === "string" || _ref instanceof Buffer) {
        _docRef = xmlNewDoc(_ref);
    } else {
        _docRef = xmlPtrToXmlDoc(_ref);
    }

    if (_docRef && encoding) {
        _docRef.encoding = encoding;
    }

    return createXMLReference(XMLDocument, _docRef);
}

Document.fromXml = (buffer: string, options?: XMLParseOptions) => {
    return XMLDocument.fromXml(buffer, options);
};

Document.fromHtml = (buffer: string, options?: HTMLParseOptions) => {
    return XMLDocument.fromHtml(buffer, options);
};

Document.fromHtmlFragment = (buffer: string, options?: HTMLParseOptions) => {
    return XMLDocument.fromHtmlFragment(buffer, options);
};

export { Document };

import { XMLElement, XMLText, XMLNamespace, XMLNodeError } from "./lib/node";

function Element(_ref: XMLDocument, name?: string, content: string = ""): XMLElement {
    if (_ref instanceof XMLDocument) {
        if (!name) {
            throw new Error("name argument required");
        }

        return createXMLReference(
            XMLElement,
            _ref.createElement(name, content).getNativeReferenceOrThrow(XMLNodeError.NO_REF)
        );
    }

    return createXMLReference(XMLElement, _ref);
}

export { Element };

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

    return createXMLReference(
        XMLText,
        xmlNewDocText(document.getNativeReferenceOrThrow(XMLNodeError.NO_REF), document.encode(content || ""))
    );
}

export { Text };

function Comment(document: XMLDocument, content?: string): XMLText {
    if (!document) {
        throw new Error("document argument required");
    }

    if (!(document instanceof XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }

    return createXMLReference(
        XMLText,
        xmlNewDocComment(document.getNativeReferenceOrThrow(XMLNodeError.NO_REF), document.encode(content || ""))
    );
}

export { Comment };

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

    return createXMLReference(
        XMLText,
        xmlNewDocPI(document.getNativeReferenceOrThrow(XMLNodeError.NO_REF), name, document.encode(content || ""))
    );
}

export { ProcessingInstruction };

function Namespace(node: XMLElement, prefix: string, href: string): XMLNamespace {
    return createXMLReference(
        XMLNamespace,
        xmlNewNs(node.getNativeReferenceOrThrow(XMLNodeError.NO_REF), href, prefix)
    );
}

export { Namespace };

export { default as bindings } from "./lib/bindings";

import { default as bindings } from "./lib/bindings";

/**
 * Get the current version of libxml.js
 * @type {string}
 */
export { version };

const libxml_version = bindings.VERSION;

/**
 * Get the compiled version of libxml
 * @type {string}
 */
export { libxml_version };

const libxml_parser_version = bindings.__xmlParserVersion();

/**
 * Get the loaded version of libxml
 * @type {string}
 */
export { libxml_parser_version };

const libxml_debug_enabled = !!bindings.libxmljs_debug;

/**
 * Is debugging inabled
 * @type {boolean}
 */
export { libxml_debug_enabled };

const memoryUsage = bindings.getMemUsed;

/**
 * Get the amount of memory allocated by libxml
 * @returns {number} - number of bytes
 */
export { memoryUsage };

const nodeCount = bindings.getNodeCount;

/**
 * Get the number of nodes that haven't been freed
 * @returns {number} - number of nodes
 */

export { nodeCount };

export default {
    bindings,
    parseHtml,
    version,
    libxml_version,
    libxml_parser_version,
    libxml_debug_enabled,
    memoryUsage,
    nodeCount,
    Document,
    Element,
    Namespace,
    Text,
    Comment,
    SaxParser,
    SaxPushParser,
};
