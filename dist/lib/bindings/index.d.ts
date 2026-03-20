import { XMLReferenceType, NativeBindings } from "./types";
export declare function createXMLReference<T>(constructorFn: new (_ref: XMLReferenceType) => T, _ref: any): T | null;
export declare function createXMLReferenceOrThrow<T>(constructorFn: new (_ref: XMLReferenceType) => T, _ref: any, error: string): T;
export declare class XMLReference<T> {
    private _ref;
    constructor(_ref: T);
    protected getNativeReference(): T;
    protected setNativeReference(ref: T): void;
}
declare const _default: NativeBindings;
export default _default;
