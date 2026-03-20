import { it } from 'node:test';
import assert from 'node:assert/strict';
var fs = require("fs");
import libxml from "../index";
import { XMLAttribute, HTMLParseOptions, parseHtml } from "../index";

const TEST_DIR = __dirname + "/../test";

function make_error(object: any) {
    var err = new Error(object.message) as any;
    err.domain = object.domain;
    err.code = object.code;
    err.level = object.level;
    err.line = object.line;
    err.column = object.column;
    return err;
}

it('parse', () => {
    var filename = TEST_DIR + "/fixtures/parser.html";

    function attempt_parse(encoding: any) {
        var str = fs.readFileSync(filename, encoding);

        var doc = parseHtml(str);

        assert.strictEqual(doc.root()?.name(), "html");
        assert.strictEqual((doc.get("head/title") as any).text(), "Test HTML document");
        assert.strictEqual((doc.get("body/span") as any).text(), "HTML content!");
    }

    // Parse via a string
    attempt_parse("utf-8");

    // Parse via a Buffer
    attempt_parse(null);
});

it('parseAsync', async () => {
    var filename = TEST_DIR + "/fixtures/parser.html";
    var str = fs.readFileSync(filename, "utf-8");

    var doc = await libxml.parseHtmlAsync(str);
    assert.strictEqual(doc.root()?.name(), "html");
    assert.strictEqual((doc.get("head/title") as any).text(), "Test HTML document");
    assert.strictEqual((doc.get("body/span") as any).text(), "HTML content!");
});

it('parse_force_encoding', () => {
    var filename = TEST_DIR + "/fixtures/parser.euc_jp.html";

    function attempt_parse(encoding: any, opts: HTMLParseOptions) {
        var str = fs.readFileSync(filename, encoding);

        var doc = libxml.parseHtml(str, opts);
        assert.strictEqual(doc.errors.length, 0);
        assert.strictEqual(doc.root()?.name(), "html");

        doc.root()?.toString();

        let result = doc.find("/html/head/meta/@content")[0];
        var fixedCharset = (result as XMLAttribute).value();
        assert.ok(fixedCharset.indexOf(opts.encoding!.toUpperCase()) !== -1);

        assert.strictEqual((doc.get("head/title") as any).text(), "\u30c6\u30b9\u30c8");
        assert.strictEqual((doc.get("body/div") as any).text(), "\u30c6\u30b9\u30c8");
    }

    // Parse via a string
    attempt_parse("utf-8", { encoding: "utf-8" });

    // Parse via a Buffer
    attempt_parse(null, { encoding: "utf-8" });
});

it('recoverable_parse', () => {
    var recoverableFile = TEST_DIR + "/fixtures/warnings/amp.html";
    var str = fs.readFileSync(recoverableFile, "utf8");
    var recoverableErrors = [
        make_error({
            domain: 5,
            code: 23,
            message: "htmlParseEntityRef: expecting ';'\n",
            level: 2,
            line: 12,
            column: 27,
        }),
        make_error({ domain: 5, code: 68, message: "htmlParseEntityRef: no name\n", level: 2, line: 12, column: 38 }),
        make_error({
            domain: 5,
            code: 23,
            message: "htmlParseEntityRef: expecting ';'\n",
            level: 2,
            line: 14,
            column: 4,
        }),
        make_error({ domain: 5, code: 68, message: "htmlParseEntityRef: no name\n", level: 2, line: 15, column: 4 }),
    ];

    var doc = libxml.parseHtml(str);
    assert.strictEqual(doc.errors.length, 4);
    for (var i = 0; i < recoverableErrors.length; i++) {
        assert.strictEqual(doc.errors[i]?.domain, recoverableErrors[i].domain);
        assert.strictEqual(doc.errors[i]?.code, recoverableErrors[i].code);
        assert.strictEqual(doc.errors[i]?.message, recoverableErrors[i].message);
        assert.strictEqual(doc.errors[i]?.level, recoverableErrors[i].level);
        assert.strictEqual(doc.errors[i]?.line, recoverableErrors[i].line);
    }
});

it('parseOptions', () => {
    var doc = libxml.parseHtml("<a/>", { doctype: false, implied: false }).toString()!;
    assert.ok(doc.indexOf("DOCTYPE") === -1);
    assert.ok(doc.indexOf("body") === -1);
    assert.ok(doc.indexOf("<html>") === -1);

    doc = libxml.parseHtml("<a/>", { doctype: false, implied: true }).toString()!;
    assert.ok(doc.indexOf("DOCTYPE") === -1);
    assert.ok(doc.indexOf("body") > -1);
    assert.ok(doc.indexOf("<html>") > -1);

    doc = libxml.parseHtml("<a/>", { implied: false }).toString()!;
    assert.ok(doc.indexOf("DOCTYPE") > -1);
    assert.ok(doc.indexOf("body") === -1);
    assert.ok(doc.indexOf("<html>") === -1);
});

it('toString', () => {
    var doc = libxml.Document();
    assert.strictEqual(doc.toString({ declaration: false }), "");
    assert.strictEqual(doc.toString({ declaration: false, type: "html" }), "\n");

    doc = libxml.parseHtml("<a></a>");
    assert.ok(doc.toString().indexOf("<?xml") === -1);
    assert.ok(doc.toString({ type: "xml" }).indexOf("<?xml") > -1);
    assert.ok(doc.toString({ type: "xhtml" }).indexOf("<?xml") > -1);
    assert.ok(doc.toString({ type: "xml", selfCloseEmpty: true })!.indexOf("<a/>") > -1);
});
