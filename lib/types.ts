import bindings from "./bindings";

export type XMLStructuredErrorData = {
    domain: number; // What part of the library raised this er
    code: number; // The error code, e.g. an xmlParserError
    message: string; // human-readable informative error messag
    level: number; // how consequent is the error (xmlErrorLevel)
    column: number; // error column # or 0 if N/A (previously int2)
    file: string; // the filename
    line: number; // the line number if available
    str1: string; // extra string information
    str2: string; // extra string information
    str3: string; // extra string information
    int1?: number; // extra number information
};

export class XMLStructuredError extends Error {
    domain: number; // What part of the library raised this er
    code: number; // The error code, e.g. an xmlParserError
    message: string; // human-readable informative error messag
    level: number; // how consequent is the error (xmlErrorLevel)
    column: number; // error column # or 0 if N/A (previously int2)
    file: string; // the filename
    line: number; // the line number if available
    str1: string; // extra string information
    str2: string; // extra string information
    str3: string; // extra string information
    int1?: number; // extra number information

    constructor(error: XMLStructuredErrorData) {
        super();

        this.domain = error.domain;
        this.code = error.code;
        this.message = error.message;
        this.level = error.level;
        this.column = error.column;
        this.file = error.file;
        this.line = error.line;
        this.str1 = error.str1;
        this.str2 = error.str2;
        this.str3 = error.str3;
        this.int1 = error.int1;

        Object.setPrototypeOf(this, XMLStructuredError.prototype);
    }
};

export type StructuredErrorCallback = (errors: XMLStructuredError[]) => any;
export type GenericErrorCallback = (errors: string[]) => any;

export enum FROM_BUFFER_ASYNC_TYPE {
    XML = 0,
    HTML = 1,
};

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

export const DEFAULT_XML_PARSE_OPTIONS: XMLParseOptions = {
    baseUrl: "",
    flags: [],
};

export const DEFAULT_HTML_PARSE_OPTIONS: HTMLParseOptions = {
    url: "",
    flags: [HTMLParseFlags.HTML_PARSE_COMPACT],
};

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

export type HTMLParseOptions = {
    url?: string;
    encoding?: string;
    doctype?: boolean;
    implied?: boolean;
    flags?: HTMLParseFlags[];
};


export enum XMLDocumentError {
    NO_REF = "Document has no native reference",
    NO_ROOT = "Document has no root element",
}

export enum XMLSaveFlags {
    // XML_SAVE_FORMAT = 1 : format save output
    XML_SAVE_FORMAT = bindings.XML_SAVE_FORMAT,

    // XML_SAVE_NO_DECL = 2 : drop the xml declaration
    XML_SAVE_NO_DECL = bindings.XML_SAVE_NO_DECL,

    // XML_SAVE_NO_EMPTY = 4 : no empty tags
    XML_SAVE_NO_EMPTY = bindings.XML_SAVE_NO_EMPTY,

    // XML_SAVE_NO_XHTML = 8 : disable XHTML1 specific rules
    XML_SAVE_NO_XHTML = bindings.XML_SAVE_NO_XHTML,

    // XML_SAVE_XHTML = 16 : force XHTML1 specific rules
    XML_SAVE_XHTML = bindings.XML_SAVE_XHTML,

    // XML_SAVE_AS_XML = 32 : force XML serialization on HTML doc
    XML_SAVE_AS_XML = bindings.XML_SAVE_AS_XML,

    // XML_SAVE_AS_HTML = 64 : force HTML serialization on XML doc
    XML_SAVE_AS_HTML = bindings.XML_SAVE_AS_HTML,

    // XML_SAVE_WSNONSIG = 128 : format with non-significant whitespace
    XML_SAVE_WSNONSIG = bindings.XML_SAVE_WSNONSIG,
}

export type XMLSaveOptions = {
    // drop the xml declaration
    declaration?: boolean;

    /**
     * @param {"none" | "pretty" | "full"} format - Inject additional whitespace
     * @description none - output no additional whitespace
     * @description pretty - output minimum additional whitespace for pretty formatting (XML_SAVE_FORMAT)
     * @description full - output all additional whitespace for verbose formatting (XML_SAVE_WSNONSIG)
     * @description Note: this option does not remove or format whitespace that has been explicitly preserved with `preserveWhitespace: true`
     * @see {XMLParseOptions.preserveWhitespace}
     * @default "pretty"
     */
    formatting?: "none" | "pretty" | "full";

    // no empty tags (only works with XML) ex: <title></title> becomes <title/>
    selfCloseEmpty?: boolean;

    type?: "html" | "xml" | "xhtml";

    /** @default "UTF-8" */
    encoding?: "HTML" | "ASCII" | "UTF-8" | "UTF-16" | "ISO-Latin-1" | "ISO-8859-1";

    // override flags
    flags?: XMLSaveFlags[];
} & {
    /**
     * @deprecated Use `formatting` instead
     */
    whitespace?: boolean;

    /**
     * @deprecated Use `formatting` instead
     */
    format?: boolean;
};



export enum XMLElementType {
    // XML_ELEMENT_NODE = 1
    XML_ELEMENT_NODE = bindings.XML_ELEMENT_NODE,

    // XML_ATTRIBUTE_NODE = 2
    XML_ATTRIBUTE_NODE = bindings.XML_ATTRIBUTE_NODE,

    // XML_TEXT_NODE = 3
    XML_TEXT_NODE = bindings.XML_TEXT_NODE,

    // XML_CDATA_SECTION_NODE = 4
    XML_CDATA_SECTION_NODE = bindings.XML_CDATA_SECTION_NODE,

    // XML_ENTITY_REF_NODE = 5
    XML_ENTITY_REF_NODE = bindings.XML_ENTITY_REF_NODE,

    // XML_ENTITY_NODE = 6
    XML_ENTITY_NODE = bindings.XML_ENTITY_NODE,

    // XML_PI_NODE = 7
    XML_PI_NODE = bindings.XML_PI_NODE,

    // XML_COMMENT_NODE = 8
    XML_COMMENT_NODE = bindings.XML_COMMENT_NODE,

    // XML_DOCUMENT_NODE = 9
    XML_DOCUMENT_NODE = bindings.XML_DOCUMENT_NODE,

    // XML_DOCUMENT_TYPE_NODE = 10
    XML_DOCUMENT_TYPE_NODE = bindings.XML_DOCUMENT_TYPE_NODE,

    // XML_DOCUMENT_FRAG_NODE = 11
    XML_DOCUMENT_FRAG_NODE = bindings.XML_DOCUMENT_FRAG_NODE,

    // XML_NOTATION_NODE = 12
    XML_NOTATION_NODE = bindings.XML_NOTATION_NODE,

    // XML_HTML_DOCUMENT_NODE = 13
    XML_HTML_DOCUMENT_NODE = bindings.XML_HTML_DOCUMENT_NODE,

    // XML_DTD_NODE = 14
    XML_DTD_NODE = bindings.XML_DTD_NODE,

    // XML_ELEMENT_DECL = 15
    XML_ELEMENT_DECL = bindings.XML_ELEMENT_DECL,

    // XML_ATTRIBUTE_DECL = 16
    XML_ATTRIBUTE_DECL = bindings.XML_ATTRIBUTE_DECL,

    // XML_ENTITY_DECL = 17
    XML_ENTITY_DECL = bindings.XML_ENTITY_DECL,

    // XML_NAMESPACE_DECL = 18
    XML_NAMESPACE_DECL = bindings.XML_NAMESPACE_DECL,

    // XML_XINCLUDE_START = 19
    XML_XINCLUDE_START = bindings.XML_XINCLUDE_START,

    // XML_XINCLUDE_END = 20
    XML_XINCLUDE_END = bindings.XML_XINCLUDE_END,

    // XML_DOCB_DOCUMENT_NODE = 21
    XML_DOCB_DOCUMENT_NODE = bindings.XML_DOCB_DOCUMENT_NODE,
}
