"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLReference = void 0;
exports.createXMLReference = createXMLReference;
exports.createXMLReferenceOrThrow = createXMLReferenceOrThrow;
var bindings_1 = __importDefault(require("bindings"));
var bindings = (0, bindings_1.default)("xmljs");
var refMap = new WeakMap();
function createXMLReference(constructorFn, _ref) {
    if (_ref === null) {
        return null;
    }
    var instance = refMap.get(_ref);
    if (!instance) {
        instance = new constructorFn(_ref);
        refMap.set(_ref, instance);
    }
    return instance;
}
function createXMLReferenceOrThrow(constructorFn, _ref, error) {
    var ref = createXMLReference(constructorFn, _ref);
    if (ref === null) {
        throw new Error(error);
    }
    return ref;
}
var XMLReference = (function () {
    function XMLReference(_ref) {
        this._ref = _ref;
    }
    XMLReference.prototype.getNativeReference = function () {
        if (this._ref === null) {
            throw new Error("Unexpected null reference");
        }
        return this._ref;
    };
    XMLReference.prototype.setNativeReference = function (ref) {
        if (ref === null) {
            throw new Error("Unexpected null reference");
        }
        this._ref = ref;
        refMap.set(ref, this);
    };
    return XMLReference;
}());
exports.XMLReference = XMLReference;
exports.default = bindings;
//# sourceMappingURL=index.js.map