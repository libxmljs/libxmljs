import * as getBindings from "bindings";
import * as libxml from "../index";

const bindings = getBindings("xmljs");

function throwsTypeError(assert: any, fn: () => void, needle: string) {
    try {
        fn();
    } catch (e: any) {
        assert.ok(e instanceof TypeError, "expected a TypeError, got: " + e);
        assert.ok(
            String(e.message).indexOf(needle) !== -1,
            "message should mention '" + needle + "', got: " + e.message
        );
        return;
    }
    assert.ok(false, "expected a TypeError to be thrown");
}

function rejectsTypeError(assert: any, promise: Promise<any>, needle: string) {
    promise.then(
        () => {
            assert.ok(false, "expected the promise to reject");
            assert.done();
        },
        (e: any) => {
            assert.ok(e instanceof TypeError, "expected a TypeError, got: " + e);
            assert.ok(
                String(e.message).indexOf(needle) !== -1,
                "message should mention '" + needle + "', got: " + e.message
            );
            assert.done();
        }
    );
}

module.exports.parseXmlAsync_rejects_non_buffer = function (assert: any) {
    rejectsTypeError(assert, libxml.parseXmlAsync(42 as any), "buffer");
};

module.exports.parseHtmlAsync_rejects_non_buffer = function (assert: any) {
    rejectsTypeError(assert, libxml.parseHtmlAsync({} as any), "buffer");
};

module.exports.parseXmlAsync_rejects_non_string_url = function (assert: any) {
    rejectsTypeError(
        assert,
        libxml.parseXmlAsync(Buffer.from("<root/>"), { url: 42 as any }),
        "url"
    );
};

module.exports.parseXmlAsync_rejects_non_string_encoding = function (assert: any) {
    rejectsTypeError(
        assert,
        libxml.parseXmlAsync(Buffer.from("<root/>"), { encoding: 42 as any }),
        "encoding"
    );
};

module.exports.fromBufferAsync_rejects_non_function_callback = function (assert: any) {
    throwsTypeError(
        assert,
        () => bindings.fromBufferAsync(0, Buffer.from("<root/>"), 7, "", "UTF-8", 0, 0),
        "callback"
    );
    assert.done();
};

module.exports.saxPushParser_push_throws_when_emit_clobbered = function (assert: any) {
    const parser: any = libxml.SaxPushParser({});
    parser.emit = 42;
    throwsTypeError(assert, () => parser.push("<root/>", true), "emit");
    assert.done();
};

module.exports.saxParser_parseString_throws_when_emit_clobbered = function (assert: any) {
    const parser: any = libxml.SaxParser({});
    parser.emit = 42;
    throwsTypeError(assert, () => parser.parseString("<root></root>"), "emit");
    assert.done();
};

module.exports.saxParser_constructor_requires_new = function (assert: any) {
    throwsTypeError(assert, () => (bindings.SaxParser as any)(), "new");
    throwsTypeError(assert, () => (bindings.SaxPushParser as any)(), "new");
    assert.done();
};

module.exports.withStructuredErrors_requires_function = function (assert: any) {
    throwsTypeError(assert, () => bindings.withStructuredErrors(0), "function");
    assert.done();
};

module.exports.withGenericErrors_requires_function = function (assert: any) {
    throwsTypeError(assert, () => bindings.withGenericErrors(0), "function");
    assert.done();
};

module.exports.valid_parseXmlAsync_still_works = function (assert: any) {
    libxml.parseXmlAsync("<root><child>hi</child></root>").then((doc) => {
        assert.equal("root", doc.root()?.name());
        assert.done();
    });
};

module.exports.valid_saxPushParser_still_emits = function (assert: any) {
    let elements = 0;
    const parser = libxml.SaxPushParser({});
    parser.on("startElementNS", () => {
        elements++;
    });
    parser.push("<root><a/><b/></root>", true);
    assert.equal(3, elements);
    assert.done();
};

module.exports.withStructuredErrors_collects_errors = function (assert: any) {
    const errors = bindings.withStructuredErrors((errs: any) => {
        bindings.xmlReadMemory("<root><unclosed></root>", 23, "", "UTF-8", 0);
        return errs;
    });
    assert.ok(Array.isArray(errors));
    assert.ok(errors.length > 0);
    assert.done();
};
