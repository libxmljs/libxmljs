"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLSchema = exports.XMLNamespace = exports.XMLAttribute = exports.XMLElement = exports.XMLNode = exports.HTMLDocument = exports.XMLDocument = void 0;
var document_1 = require("./document");
Object.defineProperty(exports, "XMLDocument", { enumerable: true, get: function () { return document_1.XMLDocument; } });
Object.defineProperty(exports, "HTMLDocument", { enumerable: true, get: function () { return document_1.HTMLDocument; } });
var node_1 = require("./node");
Object.defineProperty(exports, "XMLNode", { enumerable: true, get: function () { return node_1.XMLNode; } });
Object.defineProperty(exports, "XMLElement", { enumerable: true, get: function () { return node_1.XMLElement; } });
Object.defineProperty(exports, "XMLAttribute", { enumerable: true, get: function () { return node_1.XMLAttribute; } });
Object.defineProperty(exports, "XMLNamespace", { enumerable: true, get: function () { return node_1.XMLNamespace; } });
var schema_1 = require("./schema");
Object.defineProperty(exports, "XMLSchema", { enumerable: true, get: function () { return schema_1.XMLSchema; } });
__exportStar(require("./api"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./version"), exports);
//# sourceMappingURL=index.js.map