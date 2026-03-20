import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from "fs";
import * as libxml from "../index";
import { XMLSaveOptions, XMLElement, XMLParseOptions, XMLStructuredError } from "../index";

it('parse', () => {
    const filename = __dirname + "/../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc = libxml.parseXml(str);
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "UTF-8");
    assert.strictEqual(doc.root()?.name(), "root");
    assert.strictEqual((doc.get("child") as XMLElement).name(), "child");
    assert.strictEqual(((doc.get("child") as XMLElement).get("grandchild") as XMLElement).name(), "grandchild");
    assert.strictEqual((doc.get("child/grandchild") as XMLElement).text(), "with love");
    assert.strictEqual((doc.get("sibling") as XMLElement).name(), "sibling");
    assert.strictEqual((doc.get("sibling") as XMLElement).line(), 6);
    assert.strictEqual((doc.get("child") as XMLElement).getAttribute("to")?.line(), 3);
    assert.strictEqual((doc.get("sibling") as XMLElement).text(), "with content!");
    assert.strictEqual(doc.toString(), str);
});

it('parseWithInvisibleCharacter', () => {
    const strWithInvisibleCharacter = "\uFEFF<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><child>with love</child><sibling>with content!</sibling></root>";

    const doc = libxml.parseXml(strWithInvisibleCharacter)
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "UTF-8");
    assert.strictEqual(doc.root()?.name(), "root");
    assert.strictEqual((doc.get("child") as XMLElement).name(), "child");
    assert.strictEqual((doc.get("child") as XMLElement).text(), "with love");
    assert.strictEqual((doc.get("sibling") as XMLElement).name(), "sibling");
    assert.strictEqual((doc.get("sibling") as XMLElement).text(), "with content!");
});

it('parse_with_flags', () => {
    const filename = __dirname + "/../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc = libxml.parseXml(str, {replaceEntities: true, validateEntities: true});
    assert.strictEqual(doc.getParseFlags(), 18);
});

it('parseAsync', async () => {
    const filename = __dirname + "/../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc = await libxml.parseXmlAsync(str);
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "UTF-8");
    assert.strictEqual(doc.root()?.name(), "root");
    assert.strictEqual((doc.get("child") as XMLElement).name(), "child");
    assert.strictEqual(((doc.get("child") as XMLElement).get("grandchild") as XMLElement).name(), "grandchild");
    assert.strictEqual((doc.get("child/grandchild") as XMLElement).text(), "with love");
    assert.strictEqual((doc.get("sibling") as XMLElement).name(), "sibling");
    assert.strictEqual((doc.get("sibling") as XMLElement).line(), 6);
    assert.strictEqual((doc.get("child") as XMLElement).getAttribute("to")?.line(), 3);
    assert.strictEqual((doc.get("sibling") as XMLElement).text(), "with content!");
    assert.strictEqual(doc.toString(), str);
});

it('parseAsyncWithInvisibleCharacter', async () => {
    const strWithInvisibleCharacter = "\uFEFF<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><child>with love</child><sibling>with content!</sibling></root>";

    const doc = await libxml.parseXmlAsync(strWithInvisibleCharacter);
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "UTF-8");
    assert.strictEqual(doc.root()?.name(), "root");
    assert.strictEqual((doc.get("child") as XMLElement).name(), "child");
    assert.strictEqual((doc.get("child") as XMLElement).text(), "with love");
    assert.strictEqual((doc.get("sibling") as XMLElement).name(), "sibling");
    assert.strictEqual((doc.get("sibling") as XMLElement).text(), "with content!");
});

it('parse_async_with_replace', async () => {
    const filename = __dirname + "/../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc = await libxml.parseXmlAsync(str, {replaceEntities: true, validateEntities: true});
    assert.strictEqual(doc.getParseFlags(), 18);
});

it('parse_buffer', () => {
    const filename = __dirname + "/../test/fixtures/parser-utf16.xml";
    const buf = fs.readFileSync(filename);

    const doc = libxml.parseXml(buf);
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "UTF-16");
    assert.strictEqual(doc.root()?.name(), "root");
});

it('recoverable_parse', () => {
    const filename = __dirname + "/../test/fixtures/warnings/ent9.xml";
    const str = fs.readFileSync(filename, "utf8");

    const doc = libxml.parseXml(str);

    assert.strictEqual(doc.errors.length, 1);
    const err = doc.errors.shift()!;
    assert.ok(err instanceof Error);
    assert.strictEqual(err.domain, 3);
    assert.strictEqual(err.column, 13);
    assert.strictEqual(err.line, 1);
    assert.strictEqual(err.code, 201);
    assert.strictEqual(err.str1, "prefix");
});

it('baseurl_xml', () => {
    if (/^win/.test(process.platform)) {
        return;
    }

    const str = '<!DOCTYPE example SYSTEM "baseurl.dtd">\n' + '<example msg="&happy;"/>\n';

    {
        const doc = libxml.Document.fromXml(str, {
            validateEntities: true,
            replaceEntities: true,
        });
        assert.ok(doc.errors.length > 0);
    }

    {
        const doc = libxml.Document.fromXml(str, {
            validateEntities: true,
            replaceEntities: true,
            baseUrl: __dirname + "/../test/fixtures/example.xml",
        });
        assert.strictEqual(doc.errors.length, 0);
    }
});

it('fatal_error', () => {
    const filename = __dirname + "/../test/fixtures/errors/comment.xml";
    const str = fs.readFileSync(filename, "utf8");
    let err: XMLStructuredError | null = null;

    try {
        libxml.parseXml(str);
    } catch (e) {
        if (e instanceof XMLStructuredError) {
            err = e;
        }
    }

    const errorControl = {
        domain: 1,
        code: 4,
        message: "Start tag expected, '<' not found\n",
        level: 3,
        file: null,
        line: 5,
        str1: null,
        str2: null,
        str3: null,
        int1: null,
        column: 10,
    };
    assert.ok(err instanceof Error);
    assert.strictEqual(err?.code, errorControl.code);
});

it('parse_options', () => {
    function test_parser_option(input: any, options: XMLParseOptions, expected: any, saveOptions?: XMLSaveOptions) {
        let output = libxml.parseXml(input, options).toString(saveOptions);
        output = output.replace(/^<\?xml version="1.0" encoding="UTF-8"\?>\n/, "");
        output = output.replace(/\n$/, "");
        assert.strictEqual(output, expected);
    }

    test_parser_option("<x>&</x>", { recover: true }, "<x/>");
    test_parser_option(
        "<!DOCTYPE x [ <!ENTITY foo 'bar'> ]> <x>&foo;</x>",
        { replaceEntities: true },
        '<!DOCTYPE x [\n<!ENTITY foo "bar">\n]>\n<x>bar</x>'
    );
    test_parser_option("<x> <a>123</a> </x>", {}, "<x> <a>123</a> </x>");
    test_parser_option("<x> <a>123</a> </x>", { preserveWhitespace: false }, "<x>\n  <a>123</a>\n</x>");
    test_parser_option("<x><![CDATA[hi]]></x>", {}, "<x><![CDATA[hi]]></x>");
    test_parser_option("<x><![CDATA[hi]]></x>", { preserveCDATA: false }, "<x>hi</x>");

    const TAB = "    ";
    const TEXT_CONTENT = `\n${TAB}${TAB}test test\n${TAB}`;
    const ORIGINAL = `<x attr="test">\n\n${TAB}<a>123</a>\n\n${TAB}<b>${TEXT_CONTENT}</b>\n\n</x>`,
        XML_FORMATTED = `<x attr="test">\n  <a>123</a>\n  <b>${TEXT_CONTENT}</b>\n</x>`,
        NO_WHITESPACE = `<x attr="test"><a>123</a><b>${TEXT_CONTENT}</b></x>`;

    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL);
    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL, { format: true, type: "html" });
    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL, { format: false });

    test_parser_option(NO_WHITESPACE, { preserveWhitespace: true }, NO_WHITESPACE, { format: false });
    test_parser_option(NO_WHITESPACE, { preserveWhitespace: true }, XML_FORMATTED, { format: true });

    test_parser_option(ORIGINAL, { preserveWhitespace: false }, XML_FORMATTED);
    test_parser_option(ORIGINAL, { preserveWhitespace: false }, XML_FORMATTED, { format: true });

    test_parser_option(ORIGINAL, { preserveWhitespace: false }, NO_WHITESPACE, { format: false });
});
