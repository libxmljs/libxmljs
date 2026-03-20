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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLElementType = exports.XMLSaveFlags = exports.XMLDocumentError = exports.DEFAULT_HTML_PARSE_OPTIONS = exports.DEFAULT_XML_PARSE_OPTIONS = exports.XMLParseFlags = exports.HTMLParseFlags = exports.FROM_BUFFER_ASYNC_TYPE = exports.XMLStructuredError = void 0;
var bindings_1 = __importDefault(require("./bindings"));
var XMLStructuredError = (function (_super) {
    __extends(XMLStructuredError, _super);
    function XMLStructuredError(error) {
        var _this = _super.call(this) || this;
        _this.domain = error.domain;
        _this.code = error.code;
        _this.message = error.message;
        _this.level = error.level;
        _this.column = error.column;
        _this.file = error.file;
        _this.line = error.line;
        _this.str1 = error.str1;
        _this.str2 = error.str2;
        _this.str3 = error.str3;
        _this.int1 = error.int1;
        Object.setPrototypeOf(_this, XMLStructuredError.prototype);
        return _this;
    }
    return XMLStructuredError;
}(Error));
exports.XMLStructuredError = XMLStructuredError;
;
var FROM_BUFFER_ASYNC_TYPE;
(function (FROM_BUFFER_ASYNC_TYPE) {
    FROM_BUFFER_ASYNC_TYPE[FROM_BUFFER_ASYNC_TYPE["XML"] = 0] = "XML";
    FROM_BUFFER_ASYNC_TYPE[FROM_BUFFER_ASYNC_TYPE["HTML"] = 1] = "HTML";
})(FROM_BUFFER_ASYNC_TYPE || (exports.FROM_BUFFER_ASYNC_TYPE = FROM_BUFFER_ASYNC_TYPE = {}));
;
var HTMLParseFlags;
(function (HTMLParseFlags) {
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_RECOVER"] = bindings_1.default.HTML_PARSE_RECOVER] = "HTML_PARSE_RECOVER";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NODEFDTD"] = bindings_1.default.HTML_PARSE_NODEFDTD] = "HTML_PARSE_NODEFDTD";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NOERROR"] = bindings_1.default.HTML_PARSE_NOERROR] = "HTML_PARSE_NOERROR";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NOWARNING"] = bindings_1.default.HTML_PARSE_NOWARNING] = "HTML_PARSE_NOWARNING";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_PEDANTIC"] = bindings_1.default.HTML_PARSE_PEDANTIC] = "HTML_PARSE_PEDANTIC";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NOBLANKS"] = bindings_1.default.HTML_PARSE_NOBLANKS] = "HTML_PARSE_NOBLANKS";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NONET"] = bindings_1.default.HTML_PARSE_NONET] = "HTML_PARSE_NONET";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_NOIMPLIED"] = bindings_1.default.HTML_PARSE_NOIMPLIED] = "HTML_PARSE_NOIMPLIED";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_COMPACT"] = bindings_1.default.HTML_PARSE_COMPACT] = "HTML_PARSE_COMPACT";
    HTMLParseFlags[HTMLParseFlags["HTML_PARSE_IGNORE_ENC"] = bindings_1.default.HTML_PARSE_IGNORE_ENC] = "HTML_PARSE_IGNORE_ENC";
})(HTMLParseFlags || (exports.HTMLParseFlags = HTMLParseFlags = {}));
var XMLParseFlags;
(function (XMLParseFlags) {
    XMLParseFlags[XMLParseFlags["XML_PARSE_RECOVER"] = bindings_1.default.XML_PARSE_RECOVER] = "XML_PARSE_RECOVER";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOENT"] = bindings_1.default.XML_PARSE_NOENT] = "XML_PARSE_NOENT";
    XMLParseFlags[XMLParseFlags["XML_PARSE_DTDLOAD"] = bindings_1.default.XML_PARSE_DTDLOAD] = "XML_PARSE_DTDLOAD";
    XMLParseFlags[XMLParseFlags["XML_PARSE_DTDATTR"] = bindings_1.default.XML_PARSE_DTDATTR] = "XML_PARSE_DTDATTR";
    XMLParseFlags[XMLParseFlags["XML_PARSE_DTDVALID"] = bindings_1.default.XML_PARSE_DTDVALID] = "XML_PARSE_DTDVALID";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOERROR"] = bindings_1.default.XML_PARSE_NOERROR] = "XML_PARSE_NOERROR";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOWARNING"] = bindings_1.default.XML_PARSE_NOWARNING] = "XML_PARSE_NOWARNING";
    XMLParseFlags[XMLParseFlags["XML_PARSE_PEDANTIC"] = bindings_1.default.XML_PARSE_PEDANTIC] = "XML_PARSE_PEDANTIC";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOBLANKS"] = bindings_1.default.XML_PARSE_NOBLANKS] = "XML_PARSE_NOBLANKS";
    XMLParseFlags[XMLParseFlags["XML_PARSE_SAX1"] = bindings_1.default.XML_PARSE_SAX1] = "XML_PARSE_SAX1";
    XMLParseFlags[XMLParseFlags["XML_PARSE_XINCLUDE"] = bindings_1.default.XML_PARSE_XINCLUDE] = "XML_PARSE_XINCLUDE";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NONET"] = bindings_1.default.XML_PARSE_NONET] = "XML_PARSE_NONET";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NODICT"] = bindings_1.default.XML_PARSE_NODICT] = "XML_PARSE_NODICT";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NSCLEAN"] = bindings_1.default.XML_PARSE_NSCLEAN] = "XML_PARSE_NSCLEAN";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOCDATA"] = bindings_1.default.XML_PARSE_NOCDATA] = "XML_PARSE_NOCDATA";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOXINCNODE"] = bindings_1.default.XML_PARSE_NOXINCNODE] = "XML_PARSE_NOXINCNODE";
    XMLParseFlags[XMLParseFlags["XML_PARSE_COMPACT"] = bindings_1.default.XML_PARSE_COMPACT] = "XML_PARSE_COMPACT";
    XMLParseFlags[XMLParseFlags["XML_PARSE_OLD10"] = bindings_1.default.XML_PARSE_OLD10] = "XML_PARSE_OLD10";
    XMLParseFlags[XMLParseFlags["XML_PARSE_NOBASEFIX"] = bindings_1.default.XML_PARSE_NOBASEFIX] = "XML_PARSE_NOBASEFIX";
    XMLParseFlags[XMLParseFlags["XML_PARSE_HUGE"] = bindings_1.default.XML_PARSE_HUGE] = "XML_PARSE_HUGE";
    XMLParseFlags[XMLParseFlags["XML_PARSE_OLDSAX"] = bindings_1.default.XML_PARSE_OLDSAX] = "XML_PARSE_OLDSAX";
    XMLParseFlags[XMLParseFlags["XML_PARSE_IGNORE_ENC"] = bindings_1.default.XML_PARSE_IGNORE_ENC] = "XML_PARSE_IGNORE_ENC";
    XMLParseFlags[XMLParseFlags["XML_PARSE_BIG_LINES"] = bindings_1.default.XML_PARSE_BIG_LINES] = "XML_PARSE_BIG_LINES";
})(XMLParseFlags || (exports.XMLParseFlags = XMLParseFlags = {}));
exports.DEFAULT_XML_PARSE_OPTIONS = {
    baseUrl: "",
    flags: [],
};
exports.DEFAULT_HTML_PARSE_OPTIONS = {
    url: "",
    flags: [HTMLParseFlags.HTML_PARSE_COMPACT],
};
var XMLDocumentError;
(function (XMLDocumentError) {
    XMLDocumentError["NO_REF"] = "Document has no native reference";
    XMLDocumentError["NO_ROOT"] = "Document has no root element";
})(XMLDocumentError || (exports.XMLDocumentError = XMLDocumentError = {}));
var XMLSaveFlags;
(function (XMLSaveFlags) {
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_FORMAT"] = bindings_1.default.XML_SAVE_FORMAT] = "XML_SAVE_FORMAT";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_NO_DECL"] = bindings_1.default.XML_SAVE_NO_DECL] = "XML_SAVE_NO_DECL";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_NO_EMPTY"] = bindings_1.default.XML_SAVE_NO_EMPTY] = "XML_SAVE_NO_EMPTY";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_NO_XHTML"] = bindings_1.default.XML_SAVE_NO_XHTML] = "XML_SAVE_NO_XHTML";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_XHTML"] = bindings_1.default.XML_SAVE_XHTML] = "XML_SAVE_XHTML";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_AS_XML"] = bindings_1.default.XML_SAVE_AS_XML] = "XML_SAVE_AS_XML";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_AS_HTML"] = bindings_1.default.XML_SAVE_AS_HTML] = "XML_SAVE_AS_HTML";
    XMLSaveFlags[XMLSaveFlags["XML_SAVE_WSNONSIG"] = bindings_1.default.XML_SAVE_WSNONSIG] = "XML_SAVE_WSNONSIG";
})(XMLSaveFlags || (exports.XMLSaveFlags = XMLSaveFlags = {}));
var XMLElementType;
(function (XMLElementType) {
    XMLElementType[XMLElementType["XML_ELEMENT_NODE"] = bindings_1.default.XML_ELEMENT_NODE] = "XML_ELEMENT_NODE";
    XMLElementType[XMLElementType["XML_ATTRIBUTE_NODE"] = bindings_1.default.XML_ATTRIBUTE_NODE] = "XML_ATTRIBUTE_NODE";
    XMLElementType[XMLElementType["XML_TEXT_NODE"] = bindings_1.default.XML_TEXT_NODE] = "XML_TEXT_NODE";
    XMLElementType[XMLElementType["XML_CDATA_SECTION_NODE"] = bindings_1.default.XML_CDATA_SECTION_NODE] = "XML_CDATA_SECTION_NODE";
    XMLElementType[XMLElementType["XML_ENTITY_REF_NODE"] = bindings_1.default.XML_ENTITY_REF_NODE] = "XML_ENTITY_REF_NODE";
    XMLElementType[XMLElementType["XML_ENTITY_NODE"] = bindings_1.default.XML_ENTITY_NODE] = "XML_ENTITY_NODE";
    XMLElementType[XMLElementType["XML_PI_NODE"] = bindings_1.default.XML_PI_NODE] = "XML_PI_NODE";
    XMLElementType[XMLElementType["XML_COMMENT_NODE"] = bindings_1.default.XML_COMMENT_NODE] = "XML_COMMENT_NODE";
    XMLElementType[XMLElementType["XML_DOCUMENT_NODE"] = bindings_1.default.XML_DOCUMENT_NODE] = "XML_DOCUMENT_NODE";
    XMLElementType[XMLElementType["XML_DOCUMENT_TYPE_NODE"] = bindings_1.default.XML_DOCUMENT_TYPE_NODE] = "XML_DOCUMENT_TYPE_NODE";
    XMLElementType[XMLElementType["XML_DOCUMENT_FRAG_NODE"] = bindings_1.default.XML_DOCUMENT_FRAG_NODE] = "XML_DOCUMENT_FRAG_NODE";
    XMLElementType[XMLElementType["XML_NOTATION_NODE"] = bindings_1.default.XML_NOTATION_NODE] = "XML_NOTATION_NODE";
    XMLElementType[XMLElementType["XML_HTML_DOCUMENT_NODE"] = bindings_1.default.XML_HTML_DOCUMENT_NODE] = "XML_HTML_DOCUMENT_NODE";
    XMLElementType[XMLElementType["XML_DTD_NODE"] = bindings_1.default.XML_DTD_NODE] = "XML_DTD_NODE";
    XMLElementType[XMLElementType["XML_ELEMENT_DECL"] = bindings_1.default.XML_ELEMENT_DECL] = "XML_ELEMENT_DECL";
    XMLElementType[XMLElementType["XML_ATTRIBUTE_DECL"] = bindings_1.default.XML_ATTRIBUTE_DECL] = "XML_ATTRIBUTE_DECL";
    XMLElementType[XMLElementType["XML_ENTITY_DECL"] = bindings_1.default.XML_ENTITY_DECL] = "XML_ENTITY_DECL";
    XMLElementType[XMLElementType["XML_NAMESPACE_DECL"] = bindings_1.default.XML_NAMESPACE_DECL] = "XML_NAMESPACE_DECL";
    XMLElementType[XMLElementType["XML_XINCLUDE_START"] = bindings_1.default.XML_XINCLUDE_START] = "XML_XINCLUDE_START";
    XMLElementType[XMLElementType["XML_XINCLUDE_END"] = bindings_1.default.XML_XINCLUDE_END] = "XML_XINCLUDE_END";
    XMLElementType[XMLElementType["XML_DOCB_DOCUMENT_NODE"] = bindings_1.default.XML_DOCB_DOCUMENT_NODE] = "XML_DOCB_DOCUMENT_NODE";
})(XMLElementType || (exports.XMLElementType = XMLElementType = {}));
//# sourceMappingURL=types.js.map