"use strict";

const version = require("../package.json").version;

/**
 * packageDocumentation
 * @module libxmljs
 */

import { parseHtml } from "./lib/parse";
export { parseHtml } from "./lib/parse";
export { parseHtml as parseHtmlString };

import { parseXml } from "./lib/parse";
export { parseXml } from "./lib/parse";
export { parseXml as parseXmlString };

import { HTMLParseOptions } from "./lib/parse";
import { XMLDocument } from "./lib/document";

import { createXMLReference } from "./lib/bindings";
import { xmlDocPtr, XMLReferenceType } from "./lib/bindings/types";
import { xmlNewDoc, xmlNewDocText, xmlNewNs, xmlPtrToXmlDoc } from "./lib/bindings/functions";

function Document(_ref: XMLReferenceType | null | string = null, encoding: string = "utf8"): XMLDocument {
    let _docRef: xmlDocPtr;

    if (_ref === null || typeof _ref === "string") {
        _docRef = xmlNewDoc(_ref || "1.0");
    } else {
        _docRef = xmlPtrToXmlDoc(_ref);
    }

    if (_docRef && encoding) {
        _docRef.encoding = encoding;
    }

    return createXMLReference(XMLDocument, _docRef);
}

Document.fromHtml = (buffer: string, options?: HTMLParseOptions): XMLDocument => {
    return XMLDocument.fromHtml(buffer, options);
};

Document.fromHtmlFragment = (buffer: string, options?: HTMLParseOptions): XMLDocument => {
    return XMLDocument.fromHtmlFragment(buffer, options);
};

export { Document };

import { XMLElement, XMLText, XMLNamespace, XMLNodeError } from "./lib/node";

function Element(_ref: XMLReferenceType, name?: string, content: string = ""): XMLElement {
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
    return createXMLReference(
        XMLText,
        xmlNewDocText(document.getNativeReferenceOrThrow(XMLNodeError.NO_REF), document.encoding(content))
    );
}

export { Text };

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
};
