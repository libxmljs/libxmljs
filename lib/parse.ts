"use strict";

import { createXMLReferenceOrThrow } from "./bindings";
import { xmlDocPtr } from "./bindings/types";
import {
    DEFAULT_HTML_PARSE_OPTIONS,
    DEFAULT_XML_PARSE_OPTIONS,
    FROM_BUFFER_ASYNC_TYPE,
    HTMLParseFlags,
    HTMLParseOptions,
    XMLDocumentError,
    XMLParseFlags,
    XMLParseOptions,
    XMLStructuredError,
} from "./types";
import {
    fromBufferAsync,
    htmlReadMemory,
    withStructuredErrors,
    xmlDocHasRootElement,
    xmlGetLastError,
    xmlReadMemory,
} from "./bindings/functions";

import { HTMLDocument, XMLDocument } from "./document";
import { XMLNodeError } from "./node";

const htmlOptionsToFlags = (options: HTMLParseOptions): number => {
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

const xmlOptionsToFlags = (options: XMLParseOptions): number => {
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

        if (!xmlDocHasRootElement(_docRef)) {
            throw new Error("parsed document has no root element");
        }

        const document = createXMLReferenceOrThrow(XMLDocument, _docRef, XMLNodeError.NO_REF);

        document.errors = structuredErrors;

        return document;
    });

export const parseHtml = (buffer: string | Buffer, options: HTMLParseOptions = {}): HTMLDocument =>
    withStructuredErrors((structuredErrors) => {
        const document = createXMLReferenceOrThrow(
            HTMLDocument,
            htmlReadMemory(
                buffer,
                typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
                options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
                options.encoding || (typeof buffer === "string" ? "UTF-8" : null),
                htmlOptionsToFlags(options)
            ),
            XMLNodeError.NO_REF
        );

        document.errors = structuredErrors;

        return document;
    });

export const parseHtmlAsync = async (
    buffer: string | Buffer,
    options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS
): Promise<HTMLDocument> => new Promise<HTMLDocument>((resolve, reject) => {
    fromBufferAsync(
        FROM_BUFFER_ASYNC_TYPE.HTML,
        buffer,
        typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
        options.url || DEFAULT_HTML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_HTML_PARSE_OPTIONS.encoding || "",
        htmlOptionsToFlags(options),
        (error: Error | null, document: xmlDocPtr | null) => {
            if (error) {
                reject(error);
            } else if (document === null) {
                reject(new Error(XMLDocumentError.NO_REF));
            } else {
                resolve(createXMLReferenceOrThrow(HTMLDocument, document, XMLDocumentError.NO_REF));
            }
        }
    );
});

export const parseXmlAsync = async (
    buffer: string | Buffer,
    options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS
): Promise<XMLDocument> => new Promise<HTMLDocument>((resolve, reject) => {
    fromBufferAsync(
        FROM_BUFFER_ASYNC_TYPE.XML,
        buffer,
        typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length,
        options.url || DEFAULT_XML_PARSE_OPTIONS.url || "",
        options.encoding || DEFAULT_XML_PARSE_OPTIONS.encoding || "",
        xmlOptionsToFlags(options),
        (error: Error | null, document: xmlDocPtr | null) => {
            if (error) {
                reject(error);
            } else if (document === null) {
                reject(new Error(XMLDocumentError.NO_REF));
            } else {
                resolve(createXMLReferenceOrThrow(XMLDocument, document, XMLDocumentError.NO_REF));
            }
        }
    );
});
