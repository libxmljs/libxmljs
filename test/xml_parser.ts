import * as fs from "fs";
import * as libxml from "../index";
import { XMLSaveOptions, XMLElement, XMLParseOptions, XMLStructuredError } from "../index";

module.exports.parse = function (assert: any) {
    var filename = __dirname + "/../../test/fixtures/parser.xml";
    var str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    var doc = libxml.parseXml(str);
    assert.equal("1.0", doc.version());
    assert.equal("UTF-8", doc.encoding());
    assert.equal("root", doc.root()?.name());
    assert.equal("child", (doc.get("child") as XMLElement).name());
    assert.equal("grandchild", ((doc.get("child") as XMLElement).get("grandchild") as XMLElement).name());
    assert.equal("with love", (doc.get("child/grandchild") as XMLElement).text());
    assert.equal("sibling", (doc.get("sibling") as XMLElement).name());
    assert.equal(6, (doc.get("sibling") as XMLElement).line());
    assert.equal(3, (doc.get("child") as XMLElement).getAttribute("to")?.line());
    assert.equal("with content!", (doc.get("sibling") as XMLElement).text());
    assert.equal(str, doc.toString());
    assert.done();
};

module.exports.parse_with_flags = function (assert: any) {
    const filename = __dirname + "/../../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc = libxml.parseXml(str, {replaceEntities: true, validateEntities: true});
    assert.equal(18, doc.getParseFlags());
    assert.done();
}

module.exports.parseAsync = function (assert: any) {
    var filename = __dirname + "/../../test/fixtures/parser.xml";
    var str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    let x = 0;

    libxml.parseXmlAsync(str).then((doc) => {
        assert.equal(++x, 2);
        assert.equal("1.0", doc.version());
        assert.equal("UTF-8", doc.encoding());
        assert.equal("root", doc.root()?.name());
        assert.equal("child", (doc.get("child") as XMLElement).name());
        assert.equal("grandchild", ((doc.get("child") as XMLElement).get("grandchild") as XMLElement).name());
        assert.equal("with love", (doc.get("child/grandchild") as XMLElement).text());
        assert.equal("sibling", (doc.get("sibling") as XMLElement).name());
        assert.equal(6, (doc.get("sibling") as XMLElement).line());
        assert.equal(3, (doc.get("child") as XMLElement).getAttribute("to")?.line());
        assert.equal("with content!", (doc.get("sibling") as XMLElement).text());
        assert.equal(str, doc.toString());
        assert.done();
    });

    assert.equal(++x, 1);
};

module.exports.parse_async_with_replace = function (assert: any) {
    const filename = __dirname + "/../../test/fixtures/parser.xml";
    const str = fs.readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    let x = 0;

    libxml.parseXmlAsync(str, {replaceEntities: true, validateEntities: true}).then((doc) => {
        assert.equal(18, doc.getParseFlags());
        assert.done();
    });
    assert.equal(++x, 1);
}

module.exports.parse_buffer = function (assert: any) {
    var filename = __dirname + "/../../test/fixtures/parser-utf16.xml";
    var buf = fs.readFileSync(filename);

    var doc = libxml.parseXml(buf);
    assert.equal("1.0", doc.version());
    assert.equal("UTF-16", doc.encoding());
    assert.equal("root", doc.root()?.name());
    assert.done();
};

module.exports.recoverable_parse = function (assert: any) {
    var filename = __dirname + "/../../test/fixtures/warnings/ent9.xml";
    var str = fs.readFileSync(filename, "utf8");

    var doc = libxml.parseXml(str);

    assert.equal(1, doc.errors.length);
    var err = doc.errors.shift()!;
    assert.ok(err instanceof Error);
    assert.equal(err.domain, 3);
    assert.equal(err.column, 13);
    assert.equal(err.line, 1);
    assert.equal(err.code, 201);
    assert.equal(err.str1, "prefix");

    assert.done();
};

module.exports.baseurl_xml = function (assert: any) {
    if (/^win/.test(process.platform)) {
        // libxml won't resolve the path on Windows
        assert.done();
        return;
    }

    var str = '<!DOCTYPE example SYSTEM "baseurl.dtd">\n' + '<example msg="&happy;"/>\n';

    // First verify it fails when we don't give baseUrl
    var doc = libxml.Document.fromXml(str, {
        validateEntities: true,
        replaceEntities: true,
    });
    assert.ok(doc.errors.length > 0);

    // Now it should work
    var doc = libxml.Document.fromXml(str, {
        validateEntities: true,
        replaceEntities: true,
        baseUrl: __dirname + "/../../test/fixtures/example.xml",
    });
    assert.equal(doc.errors.length, 0);

    assert.done();
};

module.exports.fatal_error = function (assert: any) {
    var filename = __dirname + "/../../test/fixtures/errors/comment.xml";
    var str = fs.readFileSync(filename, "utf8");
    var err: XMLStructuredError | null = null;

    try {
        libxml.parseXml(str);
    } catch (e) {
        if (e instanceof XMLStructuredError) {
            err = e;
        }
    }

    var errorControl = {
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
    assert.equal(errorControl.code, err?.code);
    assert.done();
};

module.exports.parse_options = function (assert: any) {
    function test_parser_option(input: any, options: XMLParseOptions, expected: any, saveOptions?: XMLSaveOptions) {
        var output = libxml.parseXml(input, options).toString(saveOptions);
        output = output.replace(/^<\?xml version="1.0" encoding="UTF-8"\?>\n/, "");
        output = output.replace(/\n$/, "");
        assert.equal(output, expected);
    }

    test_parser_option("<x>&</x>", { recover: true }, "<x/>"); // without this option, this document would raise an exception during parsing
    test_parser_option(
        "<!DOCTYPE x [ <!ENTITY foo 'bar'> ]> <x>&foo;</x>",
        { replaceEntities: true },
        '<!DOCTYPE x [\n<!ENTITY foo "bar">\n]>\n<x>bar</x>'
    ); // foo => bar
    test_parser_option("<x> <a>123</a> </x>", {}, "<x> <a>123</a> </x>"); // no indentation even though the toString() default called for formatting
    test_parser_option("<x> <a>123</a> </x>", { preserveWhitespace: false }, "<x>\n  <a>123</a>\n</x>"); // ah, now we have indentation!
    test_parser_option("<x><![CDATA[hi]]></x>", {}, "<x><![CDATA[hi]]></x>"); // normally CDATA stays as CDATA
    test_parser_option("<x><![CDATA[hi]]></x>", { preserveCDATA: false }, "<x>hi</x>"); // but here CDATA is removed!

    const TAB = "    ";
    const TEXT_CONTENT = `\n${TAB}${TAB}test test\n${TAB}`;
    const ORIGINAL = `<x attr="test">\n\n${TAB}<a>123</a>\n\n${TAB}<b>${TEXT_CONTENT}</b>\n\n</x>`,
        XML_FORMATTED = `<x attr="test">\n  <a>123</a>\n  <b>${TEXT_CONTENT}</b>\n</x>`,
        NO_WHITESPACE = `<x attr="test"><a>123</a><b>${TEXT_CONTENT}</b></x>`;

    // When `preserveWhitespace: true`, input whitespace should be preserved regardless of toString({ format }) option
    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL);
    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL, { format: true, type: "html" });
    test_parser_option(ORIGINAL, { preserveWhitespace: true }, ORIGINAL, { format: false });

    // Input can be formatted when it contains no whitespace
    test_parser_option(NO_WHITESPACE, { preserveWhitespace: true }, NO_WHITESPACE, { format: false });
    test_parser_option(NO_WHITESPACE, { preserveWhitespace: true }, XML_FORMATTED, { format: true });

    // When `preserveWhitespace: false` and toString({ format: true }),
    // output should have default libxml formatting applied regardless of input format
    test_parser_option(ORIGINAL, { preserveWhitespace: false }, XML_FORMATTED);
    test_parser_option(ORIGINAL, { preserveWhitespace: false }, XML_FORMATTED, { format: true });

    // When `preserveWhitespace: false` and toString({ format: false }),
    // output should have all possible whitespace stripped
    test_parser_option(ORIGINAL, { preserveWhitespace: false }, NO_WHITESPACE, { format: false });

    assert.done();
};
