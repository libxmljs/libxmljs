import { XMLElement, XMLDTD, XPathNamespace, XMLNode, XMLText, XMLNodeError, XMLNamespace } from "./node";

import {
    parseHtml,
    parseXml,
    parseXmlAsync,
    parseHtmlAsync,
} from "./parse";

import {
    XMLParseOptions,
    HTMLParseOptions,
    XMLStructuredError,
    XMLSaveOptions,
    XMLSaveFlags,
    XMLDocumentError,
    DEFAULT_XML_PARSE_OPTIONS,
    DEFAULT_HTML_PARSE_OPTIONS,
} from "./types";

import { XMLReference, createXMLReference, createXMLReferenceOrThrow } from "./bindings";

import { xmlDocPtr, xmlNodePtr, xmlNsPtr, XMLReferenceType, xmlSaveCtxtPtr } from "./bindings/types";

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
    xmlEncodeSpecialChars,
    xmlNewDocNode,
    xmlDocSetRootElement,
    xmlSchemaNewDocParserCtxt,
    xmlSchemaParse,
    xmlSchemaNewValidCtxt,
    xmlSchemaValidateDoc,
    xmlSchemaFreeValidCtxt,
    xmlSchemaFree,
    xmlSchemaFreeParserCtxt,
    xmlGetLastError,
    withStructuredErrors,
    xmlNewDoc,
    xmlNewDocText,
    xmlNewDocComment,
    xmlNewDocPI,
    xmlSearchNs,
    xmlSearchNsByHref,
    xmlNewNs,
    xmlSetNs,
} from "./bindings/functions";

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

    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: any) {
        super(_ref);

        this.errors = [];
        this.validationErrors = [];
    }

    /**
     * @private
     * @param _ref 
     * @param encoding 
     * @returns 
     */
    public static createDocument(_ref: null | string | Buffer = null, encoding: string = "utf8"): XMLDocument {
        let _docRef: xmlDocPtr | null;

        if (_ref === null) {
            _docRef = xmlNewDoc("1.0");
        } else if (typeof _ref === "string" || _ref instanceof Buffer) {
            _docRef = xmlNewDoc(_ref);
        } else {
            throw new Error(XMLDocumentError.NO_REF);
        }

        if (_docRef && encoding) {
            _docRef.encoding = encoding;
        }

        return createXMLReferenceOrThrow(XMLDocument, _docRef, XMLDocumentError.NO_REF);
    }

    public createText(content?: string, encode: boolean = true): XMLText {
        return createXMLReferenceOrThrow(
            XMLText,
            xmlNewDocText(this.getNativeReference(), encode ? this.encode(content || "") : content || ""),
            XMLDocumentError.NO_REF
        );
    }

    public createComment(content?: string): XMLText {
        return createXMLReferenceOrThrow(
            XMLText,
            xmlNewDocComment(this.getNativeReference(), this.encode(content || "")),
            XMLDocumentError.NO_REF
        );
    }

    public createProcessingInstruction( name: string, content?: string): XMLText {
        return createXMLReferenceOrThrow(
            XMLText,
            xmlNewDocPI(this.getNativeReference(), name, this.encode(content || "")),
            XMLDocumentError.NO_REF
        );
    }

    /**
     * @private
     * @param _nodeRef 
     * @param prefix 
     * @param href 
     */
    public _findNamespace(_nodeRef: xmlNodePtr, prefix?: string | null, href?: string | null) {
        const _docRef = this.doc().getNativeReference();

        let _nsRef: xmlNsPtr | null = null;

        if (typeof prefix === "string") {
            _nsRef = xmlSearchNs(_docRef, _nodeRef, prefix);
        }

        if (!_nsRef && typeof href === "string") {
            _nsRef = xmlSearchNsByHref(_docRef, _nodeRef, href);
        }

        return createXMLReference(XMLNamespace, _nsRef)
    }

    /**
     * Get or set the document root
     *
     * @param node the node to set as the document root
     * @returns the root node for the document
     */
    public root(node?: XMLElement): XMLElement | null {
        const _docRef = this.getNativeReference();

        if (node !== undefined) {
            node.setDocumentRoot(_docRef);
        }

        return createXMLReference(XMLElement, xmlDocGetRootElement(_docRef));
    }

    /**
     * @see XMLNode.doc
     */
    public doc() {
        return this;
    }

    /**
     * @see XMLNode.childNodes
     */
    public childNodes() {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.childNodes();
    }

    /**
     * @see XMLNode.find
     */
    public find(xpath: string, namespace?: XPathNamespace) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.find(xpath, namespace);
    }

    /**
     * see XMLNode.get
     */
    public get(xpath: string, namespace?: XPathNamespace) {
        const root = this.root();

        if (root === null) {
            throw new Error(XMLDocumentError.NO_ROOT);
        }

        return root.get(xpath, namespace);
    }

    /**
     * @see XMLNode.child
     */
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

        return root.namespaces();
    }

    /**
     * Validate the current document against the given schema
     *
     * @param schemaDoc document to validate against
     * @returns {boolean} valid
     */
    public validate(schemaDoc: XMLDocument) {
        xmlResetLastError();

        return withStructuredErrors((errors) => {
            const parser_ctxt = xmlSchemaNewDocParserCtxt(schemaDoc.getNativeReference());

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
                xmlSchemaValidateDoc(valid_ctxt, this.getNativeReference()) == 0;

            xmlSchemaFree(schema);
            xmlSchemaFreeValidCtxt(valid_ctxt);
            xmlSchemaFreeParserCtxt(parser_ctxt);

            this.validationErrors = errors;

            return valid;
        });
    }

    public rngValidate(schemaDoc: XMLDocument): boolean {
        xmlResetLastError();

        return withStructuredErrors((errors) => {
            const parser_ctxt = xmlRelaxNGNewDocParserCtxt(
                schemaDoc.getNativeReference()
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
                xmlRelaxNGValidateDoc(valid_ctxt, this.getNativeReference()) == 0;

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
       const _ref = this.getNativeReference(),
            content = xmlEncodeSpecialChars(_ref, data);

        if (content === null) {
            throw new Error("Couldn't encode, document is NULL");
        }

        return content;
    }

    public createElement(name: string, content: string = ""): XMLElement {
        const encodedContent = this.encode(content);

        const node = createXMLReferenceOrThrow(
            XMLElement,
            xmlNewDocNode(this.getNativeReference(), null, name, encodedContent),
            XMLDocumentError.NO_REF
        );

        // TODO: enable
        // xmlFree(encodedContent);

        return node;
    }

    public getDtd(): XMLDTD | null {
        const _ref = this.getNativeReference();

        return createXMLReference(XMLDTD, xmlGetIntSubset(_ref));
    }

    public setDtd(name: string, externalId: string | null = null, systemId: string | null = null): XMLDTD | null {
        const dtd = this.getDtd();

        if (typeof name !== "string") {
            throw new Error("Invalid DTD name, must be a string");
        }

        const _ref = this.getNativeReference();

        dtd?.unlink();

        const _newDtdRef = xmlCreateIntSubset(_ref, name, externalId, systemId);

        return createXMLReference(XMLDTD, _newDtdRef);
    }

    public fromHtml(buffer: string, options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS): HTMLDocument {
        const _ref = parseHtml(buffer, options).getNativeReference();
        
        this.setNativeReference(_ref);

        return this;
    }

    public fromXml(buffer: string, options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS): HTMLDocument {
        const _ref = parseXml(buffer, options).getNativeReference();

        this.setNativeReference(_ref);

        return this;
    }

    public version(): string | null {
        const _ref = this.getNativeReference();

        return _ref.version || "";
    }

    public encoding(value?: string): string {
        const _ref = this.getNativeReference();
        
        if (value) {
            _ref.encoding = value;
        }

        return _ref.encoding || "";
    }

    public getParseFlags(): number {
        return this.getNativeReference().parseFlags;
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

        return XMLDocument.toString(this, {
                    ...DEFAULT_XML_SAVE_OPTIONS,
                    ...options,
                }) || "";
    }

    public static toString(node: XMLNode | XMLDocument, options: XMLSaveOptions | boolean = {}): string {
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

        const encoding = options.encoding || "UTF-8";

        const buffer = xmlBufferCreate();
        const context = xmlSaveToBuffer(buffer, encoding, flagsToOptions(flags));

        node._xmlSaveTree(context);
        xmlSaveFlush(context);

        const content = xmlBufferContent(buffer);

        xmlSaveClose(context);

        xmlBufferFree(buffer);

        return content || "";
    }

    /**
     * @private
     * @param context 
     */
    public _xmlSaveTree(context: xmlSaveCtxtPtr) {
        xmlSaveTree(context, this.getNativeReference() as any);
    }

    public static fromXml(buffer: string | Buffer, options?: XMLParseOptions): XMLDocument {
        return parseXml(buffer, options);
    }

    public static async fromXmlAsync(
        buffer: string | Buffer,
        options: XMLParseOptions = DEFAULT_XML_PARSE_OPTIONS
    ) {
        return parseXmlAsync(buffer, options)
    }

    public static fromHtml(buffer: string | Buffer, options?: HTMLParseOptions): HTMLDocument {
        return parseHtml(buffer, options);
    }

    public static async fromHtmlAsync(
        buffer: string | Buffer,
        options: HTMLParseOptions = DEFAULT_HTML_PARSE_OPTIONS
    ) {
        return parseHtmlAsync(buffer, options)
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
