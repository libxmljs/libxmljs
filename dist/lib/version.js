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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeCount = exports.memoryUsage = exports.libxml_debug_enabled = exports.libxml_parser_version = exports.libxml_version = exports.version = void 0;
var path = __importStar(require("path"));
function loadPackageVersion() {
    try {
        return require(path.join(__dirname, "..", "package.json")).version;
    }
    catch (_a) {
        return require(path.join(__dirname, "..", "..", "package.json")).version;
    }
}
var version = loadPackageVersion();
exports.version = version;
var functions_1 = require("./bindings/functions");
Object.defineProperty(exports, "memoryUsage", { enumerable: true, get: function () { return functions_1.getMemUsed; } });
Object.defineProperty(exports, "nodeCount", { enumerable: true, get: function () { return functions_1.getNodeCount; } });
var constants_1 = require("./bindings/constants");
var variables_1 = require("./bindings/variables");
var libxml_version = constants_1.VERSION;
exports.libxml_version = libxml_version;
var libxml_parser_version = (0, functions_1.__xmlParserVersion)();
exports.libxml_parser_version = libxml_parser_version;
var libxml_debug_enabled = !!variables_1.libxmljs_debug;
exports.libxml_debug_enabled = libxml_debug_enabled;
//# sourceMappingURL=version.js.map