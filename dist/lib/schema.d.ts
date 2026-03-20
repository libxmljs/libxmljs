import { XMLReference } from "./bindings";
import { xmlSchemaPtr } from "./bindings/types";
import { XMLDocument } from './document';
import { XMLStructuredError } from "./types";
export declare class XMLSchema extends XMLReference<xmlSchemaPtr> {
    errors: XMLStructuredError[];
    validationErrors: any[];
    constructor(_ref: any);
    static _parseSchema(schemaDoc: XMLDocument): XMLSchema;
    validateDocument(doc: XMLDocument): unknown;
}
