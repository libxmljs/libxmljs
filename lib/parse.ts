"use strict";

import { createXMLReference } from "./bindings";
import { xmlDocPtr, FROM_BUFFER_ASYNC_TYPE } from "./bindings/types";
import { xmlReadMemory, htmlReadMemory, fromBufferAsync } from "./bindings/functions";

import bindings from "./bindings";

import { XMLDocument, HTMLDocument } from "./document";

export enum HTMLParseFlags {
    HTML_PARSE_COMPACT = bindings.HTML_PARSE_COMPACT,
    HTML_PARSE_IGNORE_ENC = bindings.HTML_PARSE_IGNORE_ENC,
    HTML_PARSE_NOBLANKS = bindings.HTML_PARSE_NOBLANKS,
    HTML_PARSE_NODEFDTD = bindings.HTML_PARSE_NODEFDTD,
    HTML_PARSE_NOERROR = bindings.HTML_PARSE_NOERROR,
    HTML_PARSE_NOIMPLIED = bindings.HTML_PARSE_NOIMPLIED,
    HTML_PARSE_NONET = bindings.HTML_PARSE_NONET,
    HTML_PARSE_NOWARNING = bindings.HTML_PARSE_NOWARNING,
    HTML_PARSE_PEDANTIC = bindings.HTML_PARSE_PEDANTIC,
    HTML_PARSE_RECOVER = bindings.HTML_PARSE_RECOVER,
}

export enum XMLParseFlags {
    // XML_PARSE_RECOVER = 1 : recover on errors
    XML_PARSE_RECOVER = bindings.XML_PARSE_RECOVER,
    // XML_PARSE_NOENT = 2 : substitute entities
    // XML_PARSE_DTDLOAD = 4 : load the external subset
    // XML_PARSE_DTDATTR = 8 : default DTD attributes
    // XML_PARSE_DTDVALID = 16 : validate with the DTD
    // XML_PARSE_NOERROR = 32 : suppress error reports
    // XML_PARSE_NOWARNING = 64 : suppress warning reports
    // XML_PARSE_PEDANTIC = 128 : pedantic error reporting
    // XML_PARSE_NOBLANKS = 256 : remove blank nodes
    // XML_PARSE_SAX1 = 512 : use the SAX1 interface internally
    // XML_PARSE_XINCLUDE = 1024 : Implement XInclude substitition
    // XML_PARSE_NONET = 2048 : Forbid network access
    // XML_PARSE_NODICT = 4096 : Do not reuse the context dictionary
    // XML_PARSE_NSCLEAN = 8192 : remove redundant namespaces declarations
    // XML_PARSE_NOCDATA = 16384 : merge CDATA as text nodes
    // XML_PARSE_NOXINCNODE = 32768 : do not generate XINCLUDE START/END nodes
    // XML_PARSE_COMPACT = 65536 : compact small text nodes; no modification of the tree allowed afterwards (will possibly crash if you try to modify the tree)
    // XML_PARSE_OLD10 = 131072 : parse using XML-1.0 before update 5
    // XML_PARSE_NOBASEFIX = 262144 : do not fixup XINCLUDE xml:base uris
    // XML_PARSE_HUGE = 524288 : relax any hardcoded limit from the parser
    // XML_PARSE_OLDSAX = 1048576 : parse using SAX2 interface before 2.7.0
    // XML_PARSE_IGNORE_ENC = 2097152 : ignore internal document encoding hint
    // XML_PARSE_BIG_LINES = 4194304 : Store big lines numbers in text PSVI field
}

export type XMLParseOptions = {
    url?: string;
    encoding?: string;
    flags?: XMLParseFlags[];
};

export const DEFAULT_XML_PARSE_OPTIONS: XMLParseOptions = {
    url: "",
    encoding: "UTF-8",
    flags: [XMLParseFlags.XML_PARSE_RECOVER],
};

export type HTMLParseOptions = {
    url?: string;
    encoding?: string;
    doctype?: boolean;
    implied?: boolean;
    flags?: HTMLParseFlags[];
};

export const DEFAULT_HTML_PARSE_OPTIONS: HTMLParseOptions = {
    url: "",
    encoding: "UTF-8",
    flags: [HTMLParseFlags.HTML_PARSE_COMPACT],
};

const htmlOptionsToFlags = (options: HTMLParseOptions) => {
    const flags: HTMLParseFlags[] = [];

    if (DEFAULT_HTML_PARSE_OPTIONS.flags) {
        DEFAULT_HTML_PARSE_OPTIONS.flags.forEach((flag) => {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }

    if (options.flags) {
        options.flags.forEach((flag) => {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }

    if (options.implied === false && flags.indexOf(HTMLParseFlags.HTML_PARSE_NOIMPLIED) === -1) {
        flags.push(HTMLParseFlags.HTML_PARSE_NOIMPLIED);
    }

    if (options.doctype === false && flags.indexOf(HTMLParseFlags.HTML_PARSE_NODEFDTD) === -1) {
        flags.push(HTMLParseFlags.HTML_PARSE_NODEFDTD);
    }

    return flagsToInt(flags);
};

const flagsToInt = (array: HTMLParseFlags[] | XMLParseFlags[]): number => {
    let options = 0;

    array.forEach((v: HTMLParseFlags | XMLParseFlags) => {
        options += v;
    });

    return options;
};

export function parseXml(buffer: string, options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS): XMLDocument {
    const document = xmlReadMemory(
        buffer.toString(),
        buffer.length,
        options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_HTML_PARSE_OPTIONS.encoding || "",
        flagsToInt(options.flags || DEFAULT_HTML_PARSE_OPTIONS.flags || [])
    );

    return createXMLReference(XMLDocument, document);
}

export function parseHtml(buffer: string, options: HTMLParseOptions = {}): HTMLDocument {
    const document = htmlReadMemory(
        buffer.toString(),
        buffer.length,
        options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_HTML_PARSE_OPTIONS.encoding || "",
        htmlOptionsToFlags(options)
    );

    return createXMLReference(HTMLDocument, document);
}

export function parseBufferAsync(
    type: FROM_BUFFER_ASYNC_TYPE,
    buffer: string,
    options: HTMLParseOptions | XMLParseOptions,
    callback: Function = Function.prototype
) {
    fromBufferAsync(
        type,
        buffer.toString(),
        buffer.length,
        options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_HTML_PARSE_OPTIONS.encoding || "",
        flagsToInt(options.flags || DEFAULT_HTML_PARSE_OPTIONS.flags || []),
        (err: any, document: xmlDocPtr) => {
            console.log(err, document);

            callback(err, createXMLReference(HTMLDocument, document));
        }
    );
}

export function parseHtmlAsync(
    buffer: string,
    options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS,
    callback: Function = Function.prototype
) {
    return parseBufferAsync(FROM_BUFFER_ASYNC_TYPE.HTML, buffer, options, callback);
}

export function parseXmlAsync(
    buffer: string,
    options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS,
    callback: Function = Function.prototype
) {
    return parseBufferAsync(FROM_BUFFER_ASYNC_TYPE.XML, buffer, options, callback);
}
