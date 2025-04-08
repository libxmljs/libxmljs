import { XMLReference, createXMLReferenceOrThrow } from "./bindings";

import {
    withStructuredErrors,
    xmlResetLastError,
    xmlSchemaFreeParserCtxt,
    xmlSchemaFreeValidCtxt,
    xmlSchemaNewDocParserCtxt,
    xmlSchemaNewValidCtxt,
    xmlSchemaParse,
    xmlSchemaValidateDoc
} from "./bindings/functions";

import { xmlSchemaPtr } from "./bindings/types";

import { XMLDocument } from './document'

import { XMLDocumentError, XMLStructuredError } from "./types";

export class XMLSchema extends XMLReference<xmlSchemaPtr> {
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
     * @param schemaDoc
     */
    public static _parseSchema(schemaDoc: XMLDocument): XMLSchema {
        xmlResetLastError();

        return withStructuredErrors((errors) => {
            const _schemaDocRef = schemaDoc._getDocReference();

            const parser_ctxt = xmlSchemaNewDocParserCtxt(_schemaDocRef);
            if (parser_ctxt === null) {
                throw new Error("Could not create context for schema parser");
            }

            const _schemaRef = xmlSchemaParse(parser_ctxt);
            if (_schemaRef === null) {
                throw new Error("Invalid XSD schema");
            }

            xmlSchemaFreeParserCtxt(parser_ctxt);

            const schema = createXMLReferenceOrThrow(XMLSchema, _schemaRef, XMLDocumentError.NO_REF);
            schema.validationErrors = errors;

            return schema
        })
    }

    validateDocument(doc: XMLDocument) {
        xmlResetLastError();

        return withStructuredErrors((errors) => {
            const _docRef = doc._getDocReference();

            const valid_ctxt = xmlSchemaNewValidCtxt(this.getNativeReference());
            if (valid_ctxt === null) {
                throw new Error("Unable to create a validation context for the schema");
            }

            const valid = xmlSchemaValidateDoc(valid_ctxt, _docRef) == 0;

            xmlSchemaFreeValidCtxt(valid_ctxt);

            doc.validationErrors = errors;

            return valid
        })
    }
}
