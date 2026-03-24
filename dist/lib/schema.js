"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLSchema = void 0;
var bindings_1 = require("./bindings");
var functions_1 = require("./bindings/functions");
var types_1 = require("./types");
var XMLSchema = (function (_super) {
    __extends(XMLSchema, _super);
    function XMLSchema(_ref) {
        var _this = _super.call(this, _ref) || this;
        _this.errors = [];
        _this.validationErrors = [];
        return _this;
    }
    XMLSchema._parseSchema = function (schemaDoc) {
        (0, functions_1.xmlResetLastError)();
        return (0, functions_1.withStructuredErrors)(function (errors) {
            var _schemaDocRef = schemaDoc._getDocReference();
            var parser_ctxt = (0, functions_1.xmlSchemaNewDocParserCtxt)(_schemaDocRef);
            if (parser_ctxt === null) {
                throw new Error("Could not create context for schema parser");
            }
            var _schemaRef = (0, functions_1.xmlSchemaParse)(parser_ctxt);
            if (_schemaRef === null) {
                throw new Error("Invalid XSD schema");
            }
            (0, functions_1.xmlSchemaFreeParserCtxt)(parser_ctxt);
            var schema = (0, bindings_1.createXMLReferenceOrThrow)(XMLSchema, _schemaRef, types_1.XMLDocumentError.NO_REF);
            schema.validationErrors = errors;
            return schema;
        });
    };
    XMLSchema.prototype.validateDocument = function (doc) {
        var _this = this;
        (0, functions_1.xmlResetLastError)();
        return (0, functions_1.withStructuredErrors)(function (errors) {
            var _docRef = doc._getDocReference();
            var valid_ctxt = (0, functions_1.xmlSchemaNewValidCtxt)(_this.getNativeReference());
            if (valid_ctxt === null) {
                throw new Error("Unable to create a validation context for the schema");
            }
            var valid = (0, functions_1.xmlSchemaValidateDoc)(valid_ctxt, _docRef) == 0;
            (0, functions_1.xmlSchemaFreeValidCtxt)(valid_ctxt);
            doc.validationErrors = errors;
            return valid;
        });
    };
    return XMLSchema;
}(bindings_1.XMLReference));
exports.XMLSchema = XMLSchema;
//# sourceMappingURL=schema.js.map