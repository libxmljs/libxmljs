import { XMLReferenceType, NativeBindings } from "./types";
import * as getBindings from "bindings";

const bindings = getBindings("xmljs");

const refMap = new WeakMap();

export function createXMLReference<T>(constructorFn: new (_ref: XMLReferenceType) => T, _ref: any): T | null {
    if (_ref === null) {
        return null;
    }

    let instance = refMap.get(_ref);

    if (!instance) {
        instance = new constructorFn(_ref);

        refMap.set(_ref, instance);
    }

    return instance;
}

export function createXMLReferenceOrThrow<T>(constructorFn: new (_ref: XMLReferenceType) => T, _ref: any, error: string): T {
    const ref = createXMLReference(constructorFn, _ref);

    if (ref === null) {
        throw new Error(error);
    }

    return ref;
}


export class XMLReference<T> {
    /**
     * @private
     */
    private _ref: T;

    /**
     * @private
     * @param _ref 
     */
    constructor(_ref: T) {
        this._ref = _ref;
    }

    // public getSelfOrThrow(error: string) {
    //     if (this._ref === null) {
    //         throw new Error(error);
    //     }

    //     return this;
    // }

    // public getSelfOrNull() {
    //     if (this._ref === null) {
    //         return null;
    //     }

    //     return this;
    // }

    // public isNull(): boolean {
    //     return this._ref === null;
    // }

    /**
     * @private
     * @returns 
     */
    protected getNativeReference(): T {
        if (this._ref === null) {
            throw new Error("Unexpected null reference");
        }

        return this._ref;
    }

    // protected getNativeReference()OrReturnNull<returnType>(callback: (_ref: T) => returnType): returnType | null {
    //     if (this._ref !== null) {
    //         return callback(this._ref);
    //     }

    //     return null;
    // }

    // protected getNativeReference(): T {
    //     if (this._ref === null) {
    //         throw new Error(error);
    //     }

    //     return this._ref;
    // }

    /**
     * @private
     * @param ref 
     */
    protected setNativeReference(ref: T): void {
        if (ref === null) {
            throw new Error("Unexpected null reference");
        }

        this._ref = ref;

        refMap.set(ref as Object, this);
    }
}

export default bindings as NativeBindings;
