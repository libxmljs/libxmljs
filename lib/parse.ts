"use strict";

import { createXMLReference } from "./bindings";
import { xmlDocPtr, FROM_BUFFER_ASYNC_TYPE, XMLStructuredError } from "./bindings/types";
import {
    xmlReadMemory,
    htmlReadMemory,
    fromBufferAsync,
    xmlPtrToXmlDoc,
    xmlPtrToXmlNode,
    withStructuredErrors,
    withGenericErrors,
    xmlGetLastError,
    xmlDocGetRootElement,
} from "./bindings/functions";

import bindings from "./bindings";

import { XMLDocument, HTMLDocument } from "./document";

export enum HTMLParseFlags {
    HTML_PARSE_RECOVER = bindings.HTML_PARSE_RECOVER, // 1 : Relaxed parsing
    HTML_PARSE_NODEFDTD = bindings.HTML_PARSE_NODEFDTD, // 4 : do not default a doctype if not found
    HTML_PARSE_NOERROR = bindings.HTML_PARSE_NOERROR, // 32 : suppress error reports
    HTML_PARSE_NOWARNING = bindings.HTML_PARSE_NOWARNING, // 64 : suppress warning reports
    HTML_PARSE_PEDANTIC = bindings.HTML_PARSE_PEDANTIC, // 128 : pedantic error reporting
    HTML_PARSE_NOBLANKS = bindings.HTML_PARSE_NOBLANKS, // 256 : remove blank nodes
    HTML_PARSE_NONET = bindings.HTML_PARSE_NONET, // 2048 : Forbid network access
    HTML_PARSE_NOIMPLIED = bindings.HTML_PARSE_NOIMPLIED, // 8192 : Do not add implied html/body... elements
    HTML_PARSE_COMPACT = bindings.HTML_PARSE_COMPACT, // 65536 : compact small text nodes
    HTML_PARSE_IGNORE_ENC = bindings.HTML_PARSE_IGNORE_ENC, // 2097152 : ignore internal document encoding hint
}

export enum XMLParseFlags {
    XML_PARSE_RECOVER = bindings.XML_PARSE_RECOVER, // 1 : recover on errors
    XML_PARSE_NOENT = bindings.XML_PARSE_NOENT, // 2 : substitute entities
    XML_PARSE_DTDLOAD = bindings.XML_PARSE_DTDLOAD, // 4 : load the external subset
    XML_PARSE_DTDATTR = bindings.XML_PARSE_DTDATTR, // 8 : default DTD attributes
    XML_PARSE_DTDVALID = bindings.XML_PARSE_DTDVALID, // 16 : validate with the DTD
    XML_PARSE_NOERROR = bindings.XML_PARSE_NOERROR, // 32 : suppress error reports
    XML_PARSE_NOWARNING = bindings.XML_PARSE_NOWARNING, // 64 : suppress warning reports
    XML_PARSE_PEDANTIC = bindings.XML_PARSE_PEDANTIC, // 128 : pedantic error reporting
    XML_PARSE_NOBLANKS = bindings.XML_PARSE_NOBLANKS, // 256 : remove blank nodes
    XML_PARSE_SAX1 = bindings.XML_PARSE_SAX1, // 512 : use the SAX1 interface internally
    XML_PARSE_XINCLUDE = bindings.XML_PARSE_XINCLUDE, // 1024 : Implement XInclude substitition
    XML_PARSE_NONET = bindings.XML_PARSE_NONET, // 2048 : Forbid network access
    XML_PARSE_NODICT = bindings.XML_PARSE_NODICT, // 4096 : Do not reuse the context dictionary
    XML_PARSE_NSCLEAN = bindings.XML_PARSE_NSCLEAN, // 8192 : remove redundant namespaces declarations
    XML_PARSE_NOCDATA = bindings.XML_PARSE_NOCDATA, // 16384 : merge CDATA as text nodes
    XML_PARSE_NOXINCNODE = bindings.XML_PARSE_NOXINCNODE, // 32768 : do not generate XINCLUDE START/END nodes
    XML_PARSE_COMPACT = bindings.XML_PARSE_COMPACT, // 65536 : compact small text nodes; no modification of the tree allowed afterwards (will possibly crash if you try to modify the tree)
    XML_PARSE_OLD10 = bindings.XML_PARSE_OLD10, // 131072 : parse using XML-1.0 before update 5
    XML_PARSE_NOBASEFIX = bindings.XML_PARSE_NOBASEFIX, // 262144 : do not fixup XINCLUDE xml:base uris
    XML_PARSE_HUGE = bindings.XML_PARSE_HUGE, // 524288 : relax any hardcoded limit from the parser
    XML_PARSE_OLDSAX = bindings.XML_PARSE_OLDSAX, // 1048576 : parse using SAX2 interface before 2.7.0
    XML_PARSE_IGNORE_ENC = bindings.XML_PARSE_IGNORE_ENC, // 2097152 : ignore internal document encoding hint
    XML_PARSE_BIG_LINES = bindings.XML_PARSE_BIG_LINES, // 4194304 : Store big lines numbers in text PSVI field
}

export type XMLParseOptions = {
    url?: string;
    encoding?: string;
    recover?: boolean;

    nonet?: boolean;
    baseUrl?: string;

    /**
     * @param {boolean} preserveCDATA - Preserve CDATA tags `<![CDATA[ ... ]]>` surrounding text content
     * @default true
     */
    preserveCDATA?: boolean;

    /**
     * @param {boolean} preserveWhitespace - Preserve empty text nodes and original spacing
     * @default true
     */
    preserveWhitespace?: boolean;

    /**
     * @param {boolean} replaceEntities - Replace each XML character entity reference with its corresponding value (see http://www.xmlsoft.org/entities.html)
     * @description Any DTDs will be automatically loaded in order to resolve externally defined entities
     * @default false
     */
    replaceEntities?: boolean;

    /**
     * @param {boolean} validateEntities - Validate that all entitiy references can be resolved
     * @description Any DTDs will be automatically loaded in order to resolve externally defined entities
     * @default false
     */
    validateEntities?: boolean;

    /**
     * @param {boolean} validateEntities - Validate that all elements have a complete and valid set of attributes
     * @description Any DTDs will be automatically loaded in order to resolve externally defined element definitions
     * @default false
     */
    validateAttributes?: boolean;

    flags?: XMLParseFlags[];
} & {
    /**
     * @deprecated Use `validateAttributes` instead
     */
    dtdattr?: boolean;

    /**
     * @deprecated Use `validateEntities` instead
     */
    dtdvalid?: boolean;

    /**
     * @deprecated Use `preserveWhitespace` instead
     */
    blanks?: boolean;

    /**
     * @deprecated Use `preserveWhitespace` instead
     */
    noblanks?: true;

    /**
     * @deprecated Use `replaceEntities` instead
     */
    noent?: boolean;

    /**
     * @deprecated Use `preserveCDATA` instead
     */
    nocdata?: true;

    /**
     * @deprecated Use `preserveCDATA` instead
     */
    cdata?: boolean;
};

export const DEFAULT_XML_PARSE_OPTIONS: XMLParseOptions = {
    baseUrl: "",
    flags: [],
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

const xmlProcessDeprecatedOpts = (
    flags: XMLParseFlags[],
    targetFlag: XMLParseFlags,
    option: {
        name: string;
        value: boolean | undefined;
        includeFlagIfValueEquals: boolean;
    },
    deprecatedOptions: {
        name: string;
        value: boolean | undefined;
        includeFlagIfValueEquals: boolean;
    }[]
) => {
    const deprecatedOption = deprecatedOptions.filter((deprecatedOption) => deprecatedOption.value !== undefined)[0];

    if (deprecatedOption) {
        console.error(
            `XMLParseOption \`${deprecatedOption.name}\` is deprecated. Please use \`${option.name}\` instead.`
        );

        if (deprecatedOption.value === deprecatedOption.includeFlagIfValueEquals) {
            flags.push(targetFlag);
        } else if (flags.indexOf(targetFlag) !== -1) {
            return flags.filter((sourceFlag) => sourceFlag !== targetFlag);
        }
    } else if (option.value !== undefined) {
        if (option.value === option.includeFlagIfValueEquals) {
            flags.push(targetFlag);
        } else if (flags.indexOf(targetFlag) !== -1) {
            return flags.filter((sourceFlag) => sourceFlag !== targetFlag);
        }
    }

    return flags;
};

const xmlOptionsToFlags = (options: XMLParseOptions) => {
    let flags: XMLParseFlags[] = [];

    if (DEFAULT_XML_PARSE_OPTIONS.flags) {
        DEFAULT_XML_PARSE_OPTIONS.flags.forEach((flag) => {
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

    if (options.recover === true && flags.indexOf(XMLParseFlags.XML_PARSE_RECOVER) === -1) {
        flags.push(XMLParseFlags.XML_PARSE_RECOVER);
    }

    flags = xmlProcessDeprecatedOpts(
        flags,
        XMLParseFlags.XML_PARSE_NOCDATA,
        {
            name: "preserveCDATA",
            value: options.preserveCDATA,
            includeFlagIfValueEquals: false,
        },
        [
            {
                name: "cdata",
                value: options.cdata,
                includeFlagIfValueEquals: false,
            },
            {
                name: "nocdata",
                value: options.nocdata,
                includeFlagIfValueEquals: true,
            },
        ]
    );

    flags = xmlProcessDeprecatedOpts(
        flags,
        XMLParseFlags.XML_PARSE_NOENT,
        {
            name: "replaceEntities",
            value: options.replaceEntities,
            includeFlagIfValueEquals: true,
        },
        [
            {
                name: "noent",
                value: options.noent,
                includeFlagIfValueEquals: true,
            },
        ]
    );

    flags = xmlProcessDeprecatedOpts(
        flags,
        XMLParseFlags.XML_PARSE_NOBLANKS,
        {
            name: "preserveWhitespace",
            value: options.preserveWhitespace,
            includeFlagIfValueEquals: false,
        },
        [
            {
                name: "blanks",
                value: options.blanks,
                includeFlagIfValueEquals: false,
            },
            {
                name: "noblanks",
                value: options.noblanks,
                includeFlagIfValueEquals: true,
            },
        ]
    );

    flags = xmlProcessDeprecatedOpts(
        flags,
        XMLParseFlags.XML_PARSE_DTDVALID,
        {
            name: "validateEntities",
            value: options.validateEntities,
            includeFlagIfValueEquals: true,
        },
        [
            {
                name: "dtdvalid",
                value: options.dtdvalid,
                includeFlagIfValueEquals: true,
            },
        ]
    );

    flags = xmlProcessDeprecatedOpts(
        flags,
        XMLParseFlags.XML_PARSE_DTDATTR,
        {
            name: "validateAttributes",
            value: options.preserveWhitespace,
            includeFlagIfValueEquals: true,
        },
        [
            {
                name: "dtdattr",
                value: options.dtdattr,
                includeFlagIfValueEquals: true,
            },
        ]
    );

    return flagsToInt(flags);
};

const flagsToInt = (array: HTMLParseFlags[] | XMLParseFlags[]): number => {
    let options = 0;

    array.forEach((v: HTMLParseFlags | XMLParseFlags) => {
        options += v;
    });

    return options;
};

export const parseXml = (buffer: string | Buffer, options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS): XMLDocument =>
    withStructuredErrors((structuredErrors) => {
        const _docRef = xmlReadMemory(
            buffer,
            typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
            options.baseUrl || DEFAULT_XML_PARSE_OPTIONS.baseUrl || "",
            options.encoding || (typeof buffer === "string" ? "UTF-8" : null),
            xmlOptionsToFlags(options)
        );

        if (!_docRef) {
            const error = xmlGetLastError();

            if (error) {
                throw new XMLStructuredError({
                    domain: error.domain,
                    code: error.code,
                    message: `${error.message.trim()} (Line: ${error.line}, Column: ${error.int2})`,
                    level: error.level as number,
                    column: error.int2,
                    file: error.file as string,
                    line: error.line,
                    str1: error.str1,
                    str2: error.str2,
                    str3: error.str3,
                    int1: error.int1,
                });
            }

            throw new Error("Could not parse XML string");
        }

        if (xmlDocGetRootElement(_docRef) === null) {
            throw new Error("parsed document has no root element");
        }

        const document = createXMLReference(XMLDocument, _docRef);

        document.errors = structuredErrors;

        return document;
    });

export const parseHtml = (buffer: string | Buffer, options: HTMLParseOptions = {}): HTMLDocument =>
    withStructuredErrors((structuredErrors) => {
        const document = createXMLReference(
            HTMLDocument,
            htmlReadMemory(
                buffer,
                typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
                options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
                options.encoding || (typeof buffer === "string" ? "UTF-8" : null),
                htmlOptionsToFlags(options)
            )
        );

        document.errors = structuredErrors;

        return document;
    });

export const parseBufferAsync = (
    type: FROM_BUFFER_ASYNC_TYPE,
    buffer: string | Buffer,
    options: HTMLParseOptions | XMLParseOptions,
    callback: Function = Function.prototype
) =>
    fromBufferAsync(
        type,
        buffer,
        typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
        options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_HTML_PARSE_OPTIONS.encoding || "",
        flagsToInt(options.flags || DEFAULT_HTML_PARSE_OPTIONS.flags || []),
        (err: any, document: xmlDocPtr) => {
            callback(err, createXMLReference(HTMLDocument, document));
        }
    );

export const parseHtmlAsync = (
    buffer: string,
    options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS,
    callback: Function = Function.prototype
) => parseBufferAsync(FROM_BUFFER_ASYNC_TYPE.HTML, buffer, options, callback);

export const parseXmlAsync = (
    buffer: string,
    options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS,
    callback: Function = Function.prototype
) => parseBufferAsync(FROM_BUFFER_ASYNC_TYPE.XML, buffer, options, callback);
