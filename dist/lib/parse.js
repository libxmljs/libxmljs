"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXmlAsync = exports.parseHtmlAsync = exports.parseHtml = exports.parseSchema = exports.parseXml = void 0;
var bindings_1 = require("./bindings");
var types_1 = require("./types");
var functions_1 = require("./bindings/functions");
var document_1 = require("./document");
var schema_1 = require("./schema");
var node_1 = require("./node");
var htmlOptionsToFlags = function (options) {
    var flags = [];
    if (types_1.DEFAULT_HTML_PARSE_OPTIONS.flags) {
        types_1.DEFAULT_HTML_PARSE_OPTIONS.flags.forEach(function (flag) {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }
    if (options.flags) {
        options.flags.forEach(function (flag) {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }
    if (options.implied === false && flags.indexOf(types_1.HTMLParseFlags.HTML_PARSE_NOIMPLIED) === -1) {
        flags.push(types_1.HTMLParseFlags.HTML_PARSE_NOIMPLIED);
    }
    if (options.doctype === false && flags.indexOf(types_1.HTMLParseFlags.HTML_PARSE_NODEFDTD) === -1) {
        flags.push(types_1.HTMLParseFlags.HTML_PARSE_NODEFDTD);
    }
    return flagsToInt(flags);
};
var xmlProcessDeprecatedOpts = function (flags, targetFlag, option, deprecatedOptions) {
    var deprecatedOption = deprecatedOptions.filter(function (deprecatedOption) { return deprecatedOption.value !== undefined; })[0];
    if (deprecatedOption) {
        console.error("XMLParseOption `".concat(deprecatedOption.name, "` is deprecated. Please use `").concat(option.name, "` instead."));
        if (deprecatedOption.value === deprecatedOption.includeFlagIfValueEquals) {
            flags.push(targetFlag);
        }
        else if (flags.indexOf(targetFlag) !== -1) {
            return flags.filter(function (sourceFlag) { return sourceFlag !== targetFlag; });
        }
    }
    else if (option.value !== undefined) {
        if (option.value === option.includeFlagIfValueEquals) {
            flags.push(targetFlag);
        }
        else if (flags.indexOf(targetFlag) !== -1) {
            return flags.filter(function (sourceFlag) { return sourceFlag !== targetFlag; });
        }
    }
    return flags;
};
var xmlOptionsToFlags = function (options) {
    var flags = [];
    if (types_1.DEFAULT_XML_PARSE_OPTIONS.flags) {
        types_1.DEFAULT_XML_PARSE_OPTIONS.flags.forEach(function (flag) {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }
    if (options.flags) {
        options.flags.forEach(function (flag) {
            if (flags.indexOf(flag) === -1) {
                flags.push(flag);
            }
        });
    }
    if (options.recover === true && flags.indexOf(types_1.XMLParseFlags.XML_PARSE_RECOVER) === -1) {
        flags.push(types_1.XMLParseFlags.XML_PARSE_RECOVER);
    }
    flags = xmlProcessDeprecatedOpts(flags, types_1.XMLParseFlags.XML_PARSE_NOCDATA, {
        name: "preserveCDATA",
        value: options.preserveCDATA,
        includeFlagIfValueEquals: false,
    }, [
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
    ]);
    flags = xmlProcessDeprecatedOpts(flags, types_1.XMLParseFlags.XML_PARSE_NOENT, {
        name: "replaceEntities",
        value: options.replaceEntities,
        includeFlagIfValueEquals: true,
    }, [
        {
            name: "noent",
            value: options.noent,
            includeFlagIfValueEquals: true,
        },
    ]);
    flags = xmlProcessDeprecatedOpts(flags, types_1.XMLParseFlags.XML_PARSE_NOBLANKS, {
        name: "preserveWhitespace",
        value: options.preserveWhitespace,
        includeFlagIfValueEquals: false,
    }, [
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
    ]);
    flags = xmlProcessDeprecatedOpts(flags, types_1.XMLParseFlags.XML_PARSE_DTDVALID, {
        name: "validateEntities",
        value: options.validateEntities,
        includeFlagIfValueEquals: true,
    }, [
        {
            name: "dtdvalid",
            value: options.dtdvalid,
            includeFlagIfValueEquals: true,
        },
    ]);
    flags = xmlProcessDeprecatedOpts(flags, types_1.XMLParseFlags.XML_PARSE_DTDATTR, {
        name: "validateAttributes",
        value: options.preserveWhitespace,
        includeFlagIfValueEquals: true,
    }, [
        {
            name: "dtdattr",
            value: options.dtdattr,
            includeFlagIfValueEquals: true,
        },
    ]);
    return flagsToInt(flags);
};
var flagsToInt = function (array) {
    var options = 0;
    array.forEach(function (v) {
        options += v;
    });
    return options;
};
var parseXml = function (buffer, options) {
    if (options === void 0) { options = types_1.DEFAULT_XML_PARSE_OPTIONS; }
    return (0, functions_1.withStructuredErrors)(function (structuredErrors) {
        var _docRef = (0, functions_1.xmlReadMemory)(buffer, typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length, options.baseUrl || types_1.DEFAULT_XML_PARSE_OPTIONS.baseUrl || "", options.encoding || types_1.DEFAULT_XML_PARSE_OPTIONS.encoding || (typeof buffer === "string" ? "UTF-8" : null), xmlOptionsToFlags(options));
        if (!_docRef) {
            var error = (0, functions_1.xmlGetLastError)();
            if (error) {
                throw new types_1.XMLStructuredError({
                    domain: error.domain,
                    code: error.code,
                    message: "".concat(error.message.trim(), " (Line: ").concat(error.line, ", Column: ").concat(error.int2, ")"),
                    level: error.level,
                    column: error.int2,
                    file: error.file,
                    line: error.line,
                    str1: error.str1,
                    str2: error.str2,
                    str3: error.str3,
                    int1: error.int1,
                });
            }
            throw new Error("Could not parse XML string");
        }
        if (!(0, functions_1.xmlDocHasRootElement)(_docRef)) {
            throw new Error("parsed document has no root element");
        }
        var document = (0, bindings_1.createXMLReferenceOrThrow)(document_1.XMLDocument, _docRef, node_1.XMLNodeError.NO_REF);
        document.errors = structuredErrors;
        return document;
    });
};
exports.parseXml = parseXml;
var parseSchema = function (buffer, options) {
    if (options === void 0) { options = types_1.DEFAULT_XML_PARSE_OPTIONS; }
    var document = (0, exports.parseXml)(buffer, options);
    var schema = schema_1.XMLSchema._parseSchema(document);
    return schema;
};
exports.parseSchema = parseSchema;
var parseHtml = function (buffer, options) {
    if (options === void 0) { options = {}; }
    return (0, functions_1.withStructuredErrors)(function (structuredErrors) {
        var document = (0, bindings_1.createXMLReferenceOrThrow)(document_1.HTMLDocument, (0, functions_1.htmlReadMemory)(buffer, typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length, options.url || types_1.DEFAULT_HTML_PARSE_OPTIONS.url || "", options.encoding || (typeof buffer === "string" ? "UTF-8" : null), htmlOptionsToFlags(options)), node_1.XMLNodeError.NO_REF);
        document.errors = structuredErrors;
        return document;
    });
};
exports.parseHtml = parseHtml;
var parseHtmlAsync = function (buffer_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([buffer_1], args_1, true), void 0, function (buffer, options) {
        if (options === void 0) { options = types_1.DEFAULT_HTML_PARSE_OPTIONS; }
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    (0, functions_1.fromBufferAsync)(types_1.FROM_BUFFER_ASYNC_TYPE.HTML, buffer, typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length, options.url || types_1.DEFAULT_HTML_PARSE_OPTIONS.url || "", options.encoding || types_1.DEFAULT_HTML_PARSE_OPTIONS.encoding || "", htmlOptionsToFlags(options), function (error, document) {
                        if (error) {
                            reject(error);
                        }
                        else if (document === null) {
                            reject(new Error(types_1.XMLDocumentError.NO_REF));
                        }
                        else {
                            resolve((0, bindings_1.createXMLReferenceOrThrow)(document_1.HTMLDocument, document, types_1.XMLDocumentError.NO_REF));
                        }
                    });
                })];
        });
    });
};
exports.parseHtmlAsync = parseHtmlAsync;
var parseXmlAsync = function (buffer_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([buffer_1], args_1, true), void 0, function (buffer, options) {
        if (options === void 0) { options = types_1.DEFAULT_XML_PARSE_OPTIONS; }
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    (0, functions_1.fromBufferAsync)(types_1.FROM_BUFFER_ASYNC_TYPE.XML, buffer, typeof buffer === "string" ? Buffer.byteLength(buffer) : buffer.length, options.url || types_1.DEFAULT_XML_PARSE_OPTIONS.url || "", options.encoding || types_1.DEFAULT_XML_PARSE_OPTIONS.encoding || (typeof buffer === "string" ? "UTF-8" : ""), xmlOptionsToFlags(options), function (error, document) {
                        if (error) {
                            reject(error);
                        }
                        else if (document === null) {
                            reject(new Error(types_1.XMLDocumentError.NO_REF));
                        }
                        else {
                            resolve((0, bindings_1.createXMLReferenceOrThrow)(document_1.XMLDocument, document, types_1.XMLDocumentError.NO_REF));
                        }
                    });
                })];
        });
    });
};
exports.parseXmlAsync = parseXmlAsync;
//# sourceMappingURL=parse.js.map