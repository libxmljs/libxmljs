import bindings from "./bindings";

import { XMLElement, XMLDTD } from "./node";

import {
    XMLParseOptions,
    HTMLParseOptions,
    parseHtml,
    parseXml,
    DEFAULT_HTML_PARSE_OPTIONS,
    DEFAULT_XML_PARSE_OPTIONS,
} from "./parse";

import { XMLReference, createXMLReference } from "./bindings";

import { xmlDocPtr, XMLReferenceType } from "./bindings/types";

import {
    xmlRelaxNGFree,
    xmlRelaxNGFreeParserCtxt,
    xmlRelaxNGFreeValidCtxt,
    xmlRelaxNGNewDocParserCtxt,
    xmlRelaxNGNewValidCtxt,
    xmlRelaxNGParse,
    xmlRelaxNGValidateDoc,
    xmlResetLastError,
    xmlDocGetRootElement,
    xmlGetIntSubset,
    xmlUnlinkNode,
    xmlCreateIntSubset,
    xmlBufferCreate,
    xmlSaveToBuffer,
    xmlSaveTree,
    xmlSaveFlush,
    xmlSaveClose,
    xmlBufferContent,
    xmlBufferFree,
    xmlPtrToXmlNode,
    xmlEncodeSpecialChars,
    xmlNewDocNode,
    xmlDocSetRootElement,
    xmlPtrToXmlDoc,
    xmlSchemaNewDocParserCtxt,
    xmlSchemaParse,
    xmlSchemaNewValidCtxt,
    xmlSchemaValidateDoc,
    xmlSchemaFreeValidCtxt,
    xmlSchemaFree,
    xmlSchemaFreeParserCtxt,
    xmlGetLastError,
} from "./bindings/functions";

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

    // format save output
    format?: boolean;

    // no empty tags (only works with XML) ex: <title></title> becomes <title/>
    selfCloseEmpty?: boolean;

    // format with non-significant whitespace
    whitespace?: boolean;

    // "XML" or "HTML"
    type?: string;

    // override flags
    flags?: XMLSaveFlags[];
};

export const DEFAULT_XML_SAVE_OPTIONS: XMLSaveOptions = {
    type: "XML",
    format: true,
};

const flagsToOptions = (array: XMLSaveFlags[]): number => {
    let options = 0;

    array.forEach((v: XMLSaveFlags) => {
        options += v;
    });

    return options;
};

export class XMLDocument extends XMLReference<xmlDocPtr> {
    public validationErrors: any[];

    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlDoc(_ref));

        this.validationErrors = [];
    }

    public root(node?: XMLElement): XMLElement | null {
        return this.getNativeReferenceOrReturnNull((_docRef) => {
            if (node !== undefined) {
                xmlDocSetRootElement(_docRef, node.getNativeReferenceOrThrow(XMLDocumentError.NO_ROOT));
            }

            return createXMLReference(XMLElement, xmlDocGetRootElement(_docRef)).getSelfOrNull();
        });
    }

    public childNodes() {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.childNodes();
    }

    public find(xpath: string) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.find(xpath);
    }

    public get(xpath: string) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.get(xpath);
    }

    public child(index: number) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.child(index) || null;
    }

    public namespaces() {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        // return root.namespaces();
    }

    public validate(schemaDoc: XMLDocument) {
        this.validationErrors = [];

        const parser_ctxt = xmlSchemaNewDocParserCtxt(schemaDoc.getNativeReferenceOrThrow(XMLDocumentError.NO_REF));

        if (parser_ctxt === null) {
            throw new Error("Could not create context for schema parser");
        }

        const schema = xmlSchemaParse(parser_ctxt);

        if (schema === null) {
            throw new Error("Invalid XSD schema");
        }

        const valid_ctxt = xmlSchemaNewValidCtxt(schema);

        if (valid_ctxt === null) {
            throw new Error("Unable to create a validation context for the schema");
        }

        xmlResetLastError();

        const valid = xmlSchemaValidateDoc(valid_ctxt, this.getNativeReferenceOrThrow(XMLDocumentError.NO_REF)) == 0;

        const error = xmlGetLastError();

        if (error !== null) {
            this.validationErrors.push(error);
            xmlResetLastError();
        }

        xmlSchemaFree(schema);
        xmlSchemaFreeValidCtxt(valid_ctxt);
        xmlSchemaFreeParserCtxt(parser_ctxt);

        return valid;
    }

    public rngValidate(schemaDoc: XMLDocument) {
        // this.validationErrors = [];

        const parser_ctxt = xmlRelaxNGNewDocParserCtxt(schemaDoc.getNativeReferenceOrThrow(XMLDocumentError.NO_REF));

        if (parser_ctxt === null) {
            throw new Error("Could not create context for schema parser");
        }
        const schema = xmlRelaxNGParse(parser_ctxt);

        if (schema === null) {
            throw new Error("Invalid XSD schema");
        }

        const valid_ctxt = xmlRelaxNGNewValidCtxt(schema);

        if (valid_ctxt === null) {
            throw new Error("Unable to create a validation context for the schema");
        }

        xmlResetLastError();

        const valid = xmlRelaxNGValidateDoc(valid_ctxt, this.getNativeReferenceOrThrow(XMLDocumentError.NO_REF)) == 0;

        const error = xmlGetLastError();

        if (error !== null) {
            this.validationErrors.push(error);
            xmlResetLastError();
        }

        xmlRelaxNGFree(schema);
        xmlRelaxNGFreeValidCtxt(valid_ctxt);
        xmlRelaxNGFreeParserCtxt(parser_ctxt);

        return valid;
    }

    public name(): string {
        return "document";
    }

    public node(name: string, content?: string): XMLElement {
        const node = this.root(this.createElement(name, content));

        if (node === null) {
            throw new Error("Couldn't create root node");
        }

        return node;
    }

    public encode(data: string): string {
        const content = this.getNativeReferenceOrReturnNull((_ref) => {
            return xmlEncodeSpecialChars(_ref, data);
        });

        if (content === null) {
            throw new Error("Couldn't encode, document is NULL");
        }

        return content;
    }

    public createElement(name: string, content: string = ""): XMLElement {
        const encodedContent = this.encode(content);

        const node = createXMLReference(
            XMLElement,
            xmlNewDocNode(this.getNativeReferenceOrThrow(XMLDocumentError.NO_REF), null, name, encodedContent)
        );

        // TODO: enable
        // xmlFree(encodedContent);

        return node;
    }

    public getDtd(): XMLDTD | null {
        return this.getNativeReferenceOrReturnNull((_ref) => {
            return createXMLReference(XMLDTD, xmlGetIntSubset(_ref)).getSelfOrNull();
        });
    }

    public setDtd(name: string, externalId: string | null = null, systemId: string | null = null): XMLDTD | null {
        const dtd = this.getDtd();

        if (typeof name !== "string") {
            throw new Error("Invalid DTD name, must be a string");
        }

        return this.getNativeReferenceOrReturnNull((_ref) => {
            dtd?.getNativeReferenceOrReturnNull((_dtdRef) => {
                xmlUnlinkNode(xmlPtrToXmlNode(_dtdRef));
                // xmlFreeNode(xmlPtrToXmlNode(_dtdRef));
            });

            const _newDtdRef = xmlCreateIntSubset(_ref, name, externalId, systemId);

            return createXMLReference(XMLDTD, _newDtdRef);
        });
    }

    public fromHtml(buffer: string, options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS): HTMLDocument {
        parseHtml(buffer, options).getNativeReferenceOrReturnNull((_ref) => {
            this.setNativeReference(_ref);
        });

        return this;
    }

    public fromXml(buffer: string, options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS): HTMLDocument {
        parseXml(buffer, options).getNativeReferenceOrReturnNull((_ref) => {
            this.setNativeReference(_ref);
        });

        return this;
    }

    public version(): string | null {
        return this.getNativeReferenceOrReturnNull((_ref) => {
            return _ref.version || "";
        });
    }

    public encoding(value?: string): string {
        return (
            this.getNativeReferenceOrReturnNull((_ref) => {
                if (value) {
                    _ref.encoding = value;
                }

                return _ref.encoding;
            }) || ""
        );
    }

    public type(): string {
        return "document";
    }

    public toString(options: XMLSaveOptions | false = DEFAULT_XML_SAVE_OPTIONS): string {
        return (
            this.getNativeReferenceOrReturnNull((_ref) => {
                return XMLDocument.toString(_ref, options);
            }) || ""
        );
    }

    public static toString(node: XMLReferenceType, options: XMLSaveOptions | false = DEFAULT_XML_SAVE_OPTIONS): string {
        if (typeof options === "boolean") {
            return this.toString(node, {
                format: options,
            });
        }

        const flags: XMLSaveFlags[] = options.flags || DEFAULT_XML_SAVE_OPTIONS.flags || [];

        if (
            (options.type === "html" || options.type === "HTML") &&
            flags.indexOf(XMLSaveFlags.XML_SAVE_AS_HTML) === -1
        ) {
            flags.push(XMLSaveFlags.XML_SAVE_AS_HTML);
        }

        if (options.declaration === false && flags.indexOf(XMLSaveFlags.XML_SAVE_NO_DECL) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_NO_DECL);
        }

        if (options.format === true && flags.indexOf(XMLSaveFlags.XML_SAVE_FORMAT) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_FORMAT);
        }

        if (options.selfCloseEmpty === false && flags.indexOf(XMLSaveFlags.XML_SAVE_NO_EMPTY) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_NO_EMPTY);
        }

        if (options.whitespace === true && flags.indexOf(XMLSaveFlags.XML_SAVE_WSNONSIG) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_WSNONSIG);
        }

        const buffer = xmlBufferCreate();
        const context = xmlSaveToBuffer(buffer, "UTF-8", flagsToOptions(flags));

        xmlSaveTree(context, xmlPtrToXmlNode(node));
        xmlSaveFlush(context);
        xmlSaveClose(context);

        const content = xmlBufferContent(buffer);

        xmlBufferFree(buffer);

        return content || "";
    }

    public static fromHtml(buffer: string, options?: HTMLParseOptions): XMLDocument {
        return parseHtml(buffer, options);
    }

    public static fromHtmlFragment(buffer: string, options?: HTMLParseOptions): XMLDocument {
        if (options === undefined) {
            return XMLDocument.fromHtmlFragment(buffer, {});
        }

        options.doctype = false;
        options.implied = false;

        return parseHtml(buffer, options);
    }
}

export class HTMLDocument extends XMLDocument {
    public toString(options: XMLSaveOptions = {}): string {
        if (!options?.type) {
            options.type = "HTML";
        }

        return super.toString(options);
    }
}
