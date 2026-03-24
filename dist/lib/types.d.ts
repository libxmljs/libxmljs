export type XMLStructuredErrorData = {
    domain: number;
    code: number;
    message: string;
    level: number;
    column: number;
    file: string;
    line: number;
    str1: string;
    str2: string;
    str3: string;
    int1?: number;
};
export declare class XMLStructuredError extends Error {
    domain: number;
    code: number;
    message: string;
    level: number;
    column: number;
    file: string;
    line: number;
    str1: string;
    str2: string;
    str3: string;
    int1?: number;
    constructor(error: XMLStructuredErrorData);
}
export type StructuredErrorCallback = (errors: XMLStructuredError[]) => any;
export type GenericErrorCallback = (errors: string[]) => any;
export declare enum FROM_BUFFER_ASYNC_TYPE {
    XML = 0,
    HTML = 1
}
export declare enum HTMLParseFlags {
    HTML_PARSE_RECOVER,
    HTML_PARSE_NODEFDTD,
    HTML_PARSE_NOERROR,
    HTML_PARSE_NOWARNING,
    HTML_PARSE_PEDANTIC,
    HTML_PARSE_NOBLANKS,
    HTML_PARSE_NONET,
    HTML_PARSE_NOIMPLIED,
    HTML_PARSE_COMPACT,
    HTML_PARSE_IGNORE_ENC
}
export declare enum XMLParseFlags {
    XML_PARSE_RECOVER,
    XML_PARSE_NOENT,
    XML_PARSE_DTDLOAD,
    XML_PARSE_DTDATTR,
    XML_PARSE_DTDVALID,
    XML_PARSE_NOERROR,
    XML_PARSE_NOWARNING,
    XML_PARSE_PEDANTIC,
    XML_PARSE_NOBLANKS,
    XML_PARSE_SAX1,
    XML_PARSE_XINCLUDE,
    XML_PARSE_NONET,
    XML_PARSE_NODICT,
    XML_PARSE_NSCLEAN,
    XML_PARSE_NOCDATA,
    XML_PARSE_NOXINCNODE,
    XML_PARSE_COMPACT,
    XML_PARSE_OLD10,
    XML_PARSE_NOBASEFIX,
    XML_PARSE_HUGE,
    XML_PARSE_OLDSAX,
    XML_PARSE_IGNORE_ENC,
    XML_PARSE_BIG_LINES
}
export declare const DEFAULT_XML_PARSE_OPTIONS: XMLParseOptions;
export declare const DEFAULT_HTML_PARSE_OPTIONS: HTMLParseOptions;
export type XMLParseOptions = {
    url?: string;
    encoding?: string;
    recover?: boolean;
    nonet?: boolean;
    baseUrl?: string;
    preserveCDATA?: boolean;
    preserveWhitespace?: boolean;
    replaceEntities?: boolean;
    validateEntities?: boolean;
    validateAttributes?: boolean;
    flags?: XMLParseFlags[];
} & {
    dtdattr?: boolean;
    dtdvalid?: boolean;
    blanks?: boolean;
    noblanks?: true;
    noent?: boolean;
    nocdata?: true;
    cdata?: boolean;
};
export type HTMLParseOptions = {
    url?: string;
    encoding?: string;
    doctype?: boolean;
    implied?: boolean;
    flags?: HTMLParseFlags[];
};
export declare enum XMLDocumentError {
    NO_REF = "Document has no native reference",
    NO_ROOT = "Document has no root element"
}
export declare enum XMLSaveFlags {
    XML_SAVE_FORMAT,
    XML_SAVE_NO_DECL,
    XML_SAVE_NO_EMPTY,
    XML_SAVE_NO_XHTML,
    XML_SAVE_XHTML,
    XML_SAVE_AS_XML,
    XML_SAVE_AS_HTML,
    XML_SAVE_WSNONSIG
}
export type XMLSaveOptions = {
    declaration?: boolean;
    formatting?: "none" | "pretty" | "full";
    selfCloseEmpty?: boolean;
    type?: "html" | "xml" | "xhtml";
    encoding?: "HTML" | "ASCII" | "UTF-8" | "UTF-16" | "ISO-Latin-1" | "ISO-8859-1";
    flags?: XMLSaveFlags[];
} & {
    whitespace?: boolean;
    format?: boolean;
};
export declare enum XMLElementType {
    XML_ELEMENT_NODE,
    XML_ATTRIBUTE_NODE,
    XML_TEXT_NODE,
    XML_CDATA_SECTION_NODE,
    XML_ENTITY_REF_NODE,
    XML_ENTITY_NODE,
    XML_PI_NODE,
    XML_COMMENT_NODE,
    XML_DOCUMENT_NODE,
    XML_DOCUMENT_TYPE_NODE,
    XML_DOCUMENT_FRAG_NODE,
    XML_NOTATION_NODE,
    XML_HTML_DOCUMENT_NODE,
    XML_DTD_NODE,
    XML_ELEMENT_DECL,
    XML_ATTRIBUTE_DECL,
    XML_ENTITY_DECL,
    XML_NAMESPACE_DECL,
    XML_XINCLUDE_START,
    XML_XINCLUDE_END,
    XML_DOCB_DOCUMENT_NODE
}
