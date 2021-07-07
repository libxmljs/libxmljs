import bindings from "./bindings";

import { XMLElement, XMLDTD, XPathNamespace, XMLNode } from "./node";

import {
    XMLParseOptions,
    HTMLParseOptions,
    parseHtml,
    parseXml,
    DEFAULT_HTML_PARSE_OPTIONS,
    DEFAULT_XML_PARSE_OPTIONS,
} from "./parse";

import { XMLReference, createXMLReference } from "./bindings";

import { xmlDocPtr, XMLReferenceType, XMLStructuredError } from "./bindings/types";

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
    withStructuredErrors,
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

export const DEFAULT_XML_SAVE_OPTIONS: XMLSaveOptions = {
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
    public errors: XMLStructuredError[];
    public validationErrors: any[];

    constructor(_ref: XMLReferenceType) {
        super(xmlPtrToXmlDoc(_ref));

        this.errors = [];
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

    public doc() {
        return this;
    }

    public childNodes() {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.childNodes();
    }

    public find(xpath: string, namespace?: XPathNamespace) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.find(xpath, namespace);
    }

    public get(xpath: string, namespace?: XPathNamespace) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.get(xpath, namespace);
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
        xmlResetLastError();

        return withStructuredErrors((errors) => {
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

            const valid =
                xmlSchemaValidateDoc(valid_ctxt, this.getNativeReferenceOrThrow(XMLDocumentError.NO_REF)) == 0;

            xmlSchemaFree(schema);
            xmlSchemaFreeValidCtxt(valid_ctxt);
            xmlSchemaFreeParserCtxt(parser_ctxt);

            this.validationErrors = errors;

            return valid;
        });
    }

    public rngValidate(schemaDoc: XMLDocument) {
        xmlResetLastError();

        return withStructuredErrors((errors) => {
            const parser_ctxt = xmlRelaxNGNewDocParserCtxt(
                schemaDoc.getNativeReferenceOrThrow(XMLDocumentError.NO_REF)
            );

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

            const valid =
                xmlRelaxNGValidateDoc(valid_ctxt, this.getNativeReferenceOrThrow(XMLDocumentError.NO_REF)) == 0;

            xmlRelaxNGFree(schema);
            xmlRelaxNGFreeValidCtxt(valid_ctxt);
            xmlRelaxNGFreeParserCtxt(parser_ctxt);

            this.validationErrors = errors;

            return valid;
        });
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

    public toString(options: XMLSaveOptions | boolean = DEFAULT_XML_SAVE_OPTIONS): string {
        if (typeof options === "boolean") {
            return this.toString({
                ...DEFAULT_XML_SAVE_OPTIONS,
                format: options,
            });
        }

        return (
            this.getNativeReferenceOrReturnNull((_ref) => {
                return XMLDocument.toString(_ref, {
                    ...DEFAULT_XML_SAVE_OPTIONS,
                    ...options,
                });
            }) || ""
        );
    }

    public static toString(node: XMLReferenceType, options: XMLSaveOptions | boolean = {}): string {
        if (typeof options === "boolean") {
            return this.toString(node, {
                format: options,
            });
        }

        const flags: XMLSaveFlags[] = options.flags || [];

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

        if (/^html$/i.test(options.type || "") && flags.indexOf(XMLSaveFlags.XML_SAVE_AS_HTML) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_AS_HTML);

            // if the document is XML and we want formatted HTML output
            // we must use the XHTML serializer because the default HTML
            // serializer only formats node->type = HTML_NODE and not XML_NODEs
            if (flags.indexOf(XMLSaveFlags.XML_SAVE_FORMAT) > -1 && flags.indexOf(XMLSaveFlags.XML_SAVE_XHTML) === -1) {
                flags.push(XMLSaveFlags.XML_SAVE_XHTML);
            }
        } else if (/^xhtml$/i.test(options.type || "") && flags.indexOf(XMLSaveFlags.XML_SAVE_XHTML) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_XHTML);
        } else if (/^xml$/i.test(options.type || "") && flags.indexOf(XMLSaveFlags.XML_SAVE_AS_XML) === -1) {
            flags.push(XMLSaveFlags.XML_SAVE_AS_XML);
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

    public static fromXml(buffer: string, options?: XMLParseOptions): XMLDocument {
        return parseXml(buffer, options);
    }

    public static fromHtml(buffer: string, options?: HTMLParseOptions): HTMLDocument {
        return parseHtml(buffer, options);
    }

    public static fromHtmlFragment(buffer: string, options?: HTMLParseOptions): HTMLDocument {
        if (options === undefined) {
            return HTMLDocument.fromHtmlFragment(buffer, {});
        }

        options.doctype = false;
        options.implied = false;

        return parseHtml(buffer, options);
    }
}

export class HTMLDocument extends XMLDocument {
    public toString(options: XMLSaveOptions | boolean = {}): string {
        if (typeof options === "boolean") {
            return this.toString({
                format: options,
            });
        }

        if (!options?.type) {
            options.type = "html";
        }

        return super.toString(options);
    }
}
