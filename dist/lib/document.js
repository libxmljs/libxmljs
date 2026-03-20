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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLDocument = exports.XMLDocument = exports.DEFAULT_XML_SAVE_OPTIONS = void 0;
var node_1 = require("./node");
var parse_1 = require("./parse");
var types_1 = require("./types");
var bindings_1 = require("./bindings");
var functions_1 = require("./bindings/functions");
var schema_1 = require("./schema");
exports.DEFAULT_XML_SAVE_OPTIONS = {
    format: true,
};
var flagsToOptions = function (array) {
    var options = 0;
    array.forEach(function (v) {
        options += v;
    });
    return options;
};
var XMLDocument = (function (_super) {
    __extends(XMLDocument, _super);
    function XMLDocument(_ref) {
        var _this = _super.call(this, _ref) || this;
        _this.errors = [];
        _this.validationErrors = [];
        return _this;
    }
    XMLDocument.createDocument = function (_ref, encoding) {
        if (_ref === void 0) { _ref = null; }
        if (encoding === void 0) { encoding = "utf8"; }
        var _docRef;
        if (_ref === null) {
            _docRef = (0, functions_1.xmlNewDoc)("1.0");
        }
        else if (typeof _ref === "string" || _ref instanceof Buffer) {
            _docRef = (0, functions_1.xmlNewDoc)(_ref);
        }
        else {
            throw new Error(types_1.XMLDocumentError.NO_REF);
        }
        if (_docRef && encoding) {
            _docRef.encoding = encoding;
        }
        return (0, bindings_1.createXMLReferenceOrThrow)(XMLDocument, _docRef, types_1.XMLDocumentError.NO_REF);
    };
    XMLDocument.prototype.createText = function (content, encode) {
        if (encode === void 0) { encode = true; }
        return (0, bindings_1.createXMLReferenceOrThrow)(node_1.XMLText, (0, functions_1.xmlNewDocText)(this.getNativeReference(), encode ? this.encode(content || "") : content || ""), types_1.XMLDocumentError.NO_REF);
    };
    XMLDocument.prototype.createComment = function (content) {
        return (0, bindings_1.createXMLReferenceOrThrow)(node_1.XMLText, (0, functions_1.xmlNewDocComment)(this.getNativeReference(), this.encode(content || "")), types_1.XMLDocumentError.NO_REF);
    };
    XMLDocument.prototype.createProcessingInstruction = function (name, content) {
        return (0, bindings_1.createXMLReferenceOrThrow)(node_1.XMLText, (0, functions_1.xmlNewDocPI)(this.getNativeReference(), name, this.encode(content || "")), types_1.XMLDocumentError.NO_REF);
    };
    XMLDocument.prototype._findNamespace = function (_nodeRef, prefix, href) {
        var _docRef = this.doc().getNativeReference();
        var _nsRef = null;
        if (typeof prefix === "string") {
            _nsRef = (0, functions_1.xmlSearchNs)(_docRef, _nodeRef, prefix);
        }
        if (!_nsRef && typeof href === "string") {
            _nsRef = (0, functions_1.xmlSearchNsByHref)(_docRef, _nodeRef, href);
        }
        return (0, bindings_1.createXMLReference)(node_1.XMLNamespace, _nsRef);
    };
    XMLDocument.prototype._getDocReference = function () {
        return this.getNativeReference();
    };
    XMLDocument.prototype.root = function (node) {
        var _docRef = this.getNativeReference();
        if (node !== undefined) {
            node.setDocumentRoot(_docRef);
        }
        return (0, bindings_1.createXMLReference)(node_1.XMLElement, (0, functions_1.xmlDocGetRootElement)(_docRef));
    };
    XMLDocument.prototype.doc = function () {
        return this;
    };
    XMLDocument.prototype.childNodes = function () {
        var root = this.root();
        if (root === null) {
            throw new Error(types_1.XMLDocumentError.NO_ROOT);
        }
        return root.childNodes();
    };
    XMLDocument.prototype.find = function (xpath, namespace) {
        var root = this.root();
        if (root === null) {
            throw new Error(types_1.XMLDocumentError.NO_ROOT);
        }
        return root.find(xpath, namespace);
    };
    XMLDocument.prototype.get = function (xpath, namespace) {
        var root = this.root();
        if (root === null) {
            throw new Error(types_1.XMLDocumentError.NO_ROOT);
        }
        return root.get(xpath, namespace);
    };
    XMLDocument.prototype.child = function (index) {
        var root = this.root();
        if (root === null) {
            throw new Error(types_1.XMLDocumentError.NO_ROOT);
        }
        return root.child(index) || null;
    };
    XMLDocument.prototype.namespaces = function () {
        var root = this.root();
        if (root === null) {
            throw new Error(types_1.XMLDocumentError.NO_ROOT);
        }
        return root.namespaces();
    };
    XMLDocument.prototype.validate = function (schemaDoc) {
        var schema = schema_1.XMLSchema._parseSchema(schemaDoc);
        return schema.validateDocument(this);
    };
    XMLDocument.prototype.rngValidate = function (schemaDoc) {
        var _this = this;
        (0, functions_1.xmlResetLastError)();
        return (0, functions_1.withStructuredErrors)(function (errors) {
            var parser_ctxt = (0, functions_1.xmlRelaxNGNewDocParserCtxt)(schemaDoc.getNativeReference());
            if (parser_ctxt === null) {
                throw new Error("Could not create context for schema parser");
            }
            var schema = (0, functions_1.xmlRelaxNGParse)(parser_ctxt);
            if (schema === null) {
                throw new Error("Invalid XSD schema");
            }
            var valid_ctxt = (0, functions_1.xmlRelaxNGNewValidCtxt)(schema);
            if (valid_ctxt === null) {
                throw new Error("Unable to create a validation context for the schema");
            }
            var valid = (0, functions_1.xmlRelaxNGValidateDoc)(valid_ctxt, _this.getNativeReference()) == 0;
            (0, functions_1.xmlRelaxNGFree)(schema);
            (0, functions_1.xmlRelaxNGFreeValidCtxt)(valid_ctxt);
            (0, functions_1.xmlRelaxNGFreeParserCtxt)(parser_ctxt);
            _this.validationErrors = errors;
            return valid;
        });
    };
    XMLDocument.prototype.name = function () {
        return "document";
    };
    XMLDocument.prototype.node = function (name, content) {
        var node = this.root(this.createElement(name, content));
        if (node === null) {
            throw new Error("Couldn't create root node");
        }
        return node;
    };
    XMLDocument.prototype.encode = function (data) {
        var _ref = this.getNativeReference(), content = (0, functions_1.xmlEncodeSpecialChars)(_ref, data);
        if (content === null) {
            throw new Error("Couldn't encode, document is NULL");
        }
        return content;
    };
    XMLDocument.prototype.createElement = function (name, content) {
        if (content === void 0) { content = ""; }
        var encodedContent = this.encode(content);
        var node = (0, bindings_1.createXMLReferenceOrThrow)(node_1.XMLElement, (0, functions_1.xmlNewDocNode)(this.getNativeReference(), null, name, encodedContent), types_1.XMLDocumentError.NO_REF);
        return node;
    };
    XMLDocument.prototype.getDtd = function () {
        var _ref = this.getNativeReference();
        return (0, bindings_1.createXMLReference)(node_1.XMLDTD, (0, functions_1.xmlGetIntSubset)(_ref));
    };
    XMLDocument.prototype.setDtd = function (name, externalId, systemId) {
        if (externalId === void 0) { externalId = null; }
        if (systemId === void 0) { systemId = null; }
        var dtd = this.getDtd();
        if (typeof name !== "string") {
            throw new Error("Invalid DTD name, must be a string");
        }
        var _ref = this.getNativeReference();
        dtd === null || dtd === void 0 ? void 0 : dtd.unlink();
        var _newDtdRef = (0, functions_1.xmlCreateIntSubset)(_ref, name, externalId, systemId);
        return (0, bindings_1.createXMLReference)(node_1.XMLDTD, _newDtdRef);
    };
    XMLDocument.prototype.fromHtml = function (buffer, options) {
        if (options === void 0) { options = types_1.DEFAULT_HTML_PARSE_OPTIONS; }
        var _ref = (0, parse_1.parseHtml)(buffer, options).getNativeReference();
        this.setNativeReference(_ref);
        return this;
    };
    XMLDocument.prototype.fromXml = function (buffer, options) {
        if (options === void 0) { options = types_1.DEFAULT_XML_PARSE_OPTIONS; }
        var _ref = (0, parse_1.parseXml)(buffer, options).getNativeReference();
        this.setNativeReference(_ref);
        return this;
    };
    XMLDocument.prototype.version = function () {
        var _ref = this.getNativeReference();
        return _ref.version || "";
    };
    XMLDocument.prototype.encoding = function (value) {
        var _ref = this.getNativeReference();
        if (value) {
            _ref.encoding = value;
        }
        return _ref.encoding || "";
    };
    XMLDocument.prototype.getParseFlags = function () {
        return this.getNativeReference().parseFlags;
    };
    XMLDocument.prototype.type = function () {
        return "document";
    };
    XMLDocument.prototype.toString = function (options) {
        if (options === void 0) { options = exports.DEFAULT_XML_SAVE_OPTIONS; }
        if (typeof options === "boolean") {
            return this.toString(__assign(__assign({}, exports.DEFAULT_XML_SAVE_OPTIONS), { format: options }));
        }
        return XMLDocument.toString(this, __assign(__assign({}, exports.DEFAULT_XML_SAVE_OPTIONS), options)) || "";
    };
    XMLDocument.toString = function (node, options) {
        if (options === void 0) { options = {}; }
        if (typeof options === "boolean") {
            return this.toString(node, {
                format: options,
            });
        }
        var flags = options.flags || [];
        if (options.declaration === false && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_NO_DECL) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_NO_DECL);
        }
        if (options.format === true && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_FORMAT) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_FORMAT);
        }
        if (options.selfCloseEmpty === false && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_NO_EMPTY) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_NO_EMPTY);
        }
        if (options.whitespace === true && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_WSNONSIG) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_WSNONSIG);
        }
        if (/^html$/i.test(options.type || "") && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_AS_HTML) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_AS_HTML);
            if (flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_FORMAT) > -1 && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_XHTML) === -1) {
                flags.push(types_1.XMLSaveFlags.XML_SAVE_XHTML);
            }
        }
        else if (/^xhtml$/i.test(options.type || "") && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_XHTML) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_XHTML);
        }
        else if (/^xml$/i.test(options.type || "") && flags.indexOf(types_1.XMLSaveFlags.XML_SAVE_AS_XML) === -1) {
            flags.push(types_1.XMLSaveFlags.XML_SAVE_AS_XML);
        }
        var encoding = options.encoding || "UTF-8";
        var buffer = (0, functions_1.xmlBufferCreate)();
        var context = (0, functions_1.xmlSaveToBuffer)(buffer, encoding, flagsToOptions(flags));
        node._xmlSaveTree(context);
        (0, functions_1.xmlSaveFlush)(context);
        var content = (0, functions_1.xmlBufferContent)(buffer);
        (0, functions_1.xmlSaveClose)(context);
        (0, functions_1.xmlBufferFree)(buffer);
        return content || "";
    };
    XMLDocument.prototype._xmlSaveTree = function (context) {
        (0, functions_1.xmlSaveTree)(context, this.getNativeReference());
    };
    XMLDocument.fromXml = function (buffer, options) {
        return (0, parse_1.parseXml)(buffer, options);
    };
    XMLDocument.fromXmlAsync = function (buffer_1) {
        return __awaiter(this, arguments, void 0, function (buffer, options) {
            if (options === void 0) { options = types_1.DEFAULT_XML_PARSE_OPTIONS; }
            return __generator(this, function (_a) {
                return [2, (0, parse_1.parseXmlAsync)(buffer, options)];
            });
        });
    };
    XMLDocument.fromHtml = function (buffer, options) {
        return (0, parse_1.parseHtml)(buffer, options);
    };
    XMLDocument.fromHtmlAsync = function (buffer_1) {
        return __awaiter(this, arguments, void 0, function (buffer, options) {
            if (options === void 0) { options = types_1.DEFAULT_HTML_PARSE_OPTIONS; }
            return __generator(this, function (_a) {
                return [2, (0, parse_1.parseHtmlAsync)(buffer, options)];
            });
        });
    };
    XMLDocument.fromHtmlFragment = function (buffer, options) {
        if (options === undefined) {
            return HTMLDocument.fromHtmlFragment(buffer, {});
        }
        options.doctype = false;
        options.implied = false;
        return (0, parse_1.parseHtml)(buffer, options);
    };
    return XMLDocument;
}(bindings_1.XMLReference));
exports.XMLDocument = XMLDocument;
var HTMLDocument = (function (_super) {
    __extends(HTMLDocument, _super);
    function HTMLDocument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLDocument.prototype.toString = function (options) {
        if (options === void 0) { options = {}; }
        if (typeof options === "boolean") {
            return this.toString({
                format: options,
            });
        }
        if (!(options === null || options === void 0 ? void 0 : options.type)) {
            options.type = "html";
        }
        return _super.prototype.toString.call(this, options);
    };
    return HTMLDocument;
}(XMLDocument));
exports.HTMLDocument = HTMLDocument;
//# sourceMappingURL=document.js.map