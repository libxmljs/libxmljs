"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaxPushParser = exports.SaxParser = exports.parseSchema = exports.parseHtmlAsync = exports.parseHtml = exports.parseXmlAsync = exports.parseXml = void 0;
exports.Document = Document;
exports.Element = Element;
exports.Text = Text;
exports.Comment = Comment;
exports.ProcessingInstruction = ProcessingInstruction;
exports.Namespace = Namespace;
var document_1 = require("./document");
var parse_1 = require("./parse");
Object.defineProperty(exports, "parseHtml", { enumerable: true, get: function () { return parse_1.parseHtml; } });
Object.defineProperty(exports, "parseHtmlAsync", { enumerable: true, get: function () { return parse_1.parseHtmlAsync; } });
Object.defineProperty(exports, "parseXml", { enumerable: true, get: function () { return parse_1.parseXml; } });
Object.defineProperty(exports, "parseXmlAsync", { enumerable: true, get: function () { return parse_1.parseXmlAsync; } });
Object.defineProperty(exports, "parseSchema", { enumerable: true, get: function () { return parse_1.parseSchema; } });
var sax_1 = require("./sax");
Object.defineProperty(exports, "SaxParser", { enumerable: true, get: function () { return sax_1.SaxParser; } });
Object.defineProperty(exports, "SaxPushParser", { enumerable: true, get: function () { return sax_1.SaxPushParser; } });
function Document(_ref, encoding) {
    if (_ref === void 0) { _ref = null; }
    if (encoding === void 0) { encoding = "utf8"; }
    return document_1.XMLDocument.createDocument(_ref, encoding);
}
Document.fromXml = function (buffer, options) {
    return document_1.XMLDocument.fromXml(buffer, options);
};
Document.fromXmlAsync = function (buffer, options) {
    return document_1.XMLDocument.fromXmlAsync(buffer, options);
};
Document.fromHtml = function (buffer, options) {
    return document_1.XMLDocument.fromHtml(buffer, options);
};
Document.fromHtmlAsync = function (buffer, options) {
    return document_1.XMLDocument.fromHtmlAsync(buffer, options);
};
Document.fromHtmlFragment = function (buffer, options) {
    return document_1.XMLDocument.fromHtmlFragment(buffer, options);
};
function Element(_ref, name, content) {
    if (content === void 0) { content = ""; }
    return _ref.createElement(name, content);
}
function Text(document, content) {
    if (!document) {
        throw new Error("document argument required");
    }
    if (!(document instanceof document_1.XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }
    if (!content) {
        throw new Error("content argument required");
    }
    return document.createText(content);
}
function Comment(document, content) {
    if (!document) {
        throw new Error("document argument required");
    }
    if (!(document instanceof document_1.XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }
    return document.createComment(content);
}
function ProcessingInstruction(document, name, content) {
    if (!document) {
        throw new Error("document argument required");
    }
    if (!(document instanceof document_1.XMLDocument)) {
        throw new Error("document argument must be an instance of Document");
    }
    if (!name) {
        throw new Error("name argument required");
    }
    return document.createProcessingInstruction(name, content);
}
function Namespace(node, prefix, href) {
    return node.defineNamespace(prefix, href);
}
//# sourceMappingURL=api.js.map