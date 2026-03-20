import { it } from 'node:test';
import assert from 'node:assert/strict';
const fs = require("fs");

import { SaxParser, SaxPushParser } from "../index";

function clone(obj: any) {
    if (obj == null || typeof obj != "object") return obj;

    const temp = new obj.constructor();
    for (const key in obj) temp[key] = clone(obj[key]);

    return temp;
}

const callbackTest = {
    startDocument: [],
    endDocument: [],

    startElementNS: [],
    endElementNS: [],

    characters: [],
    cdata: [],

    comment: [],

    warning: [],
    error: [],
};

const callbackControl = {
    startDocument: [[]],

    endDocument: [[]],

    startElementNS: [
        ["error", [], null, null, []],
        [
            "stream",
            [
                ["to", "", "", "example.com"],
                ["version", "", "", "1.0"],
            ],
            "stream",
            "http://etherx.jabber.org/streams",
            [
                [null, "jabber:client"],
                ["stream", "http://etherx.jabber.org/streams"],
            ],
        ],
        [
            "message",
            [
                ["type", "", "", "chat"],
                ["to", "", "", "n@d"],
                ["from", "", "", "n@d/r"],
                ["id", "", "", "id1"],
            ],
            null,
            "jabber:client",
            [],
        ],
        ["x", [["name", "", "", "abc & xyz"]], null, "jabber:client", []],
        ["body", [], null, "jabber:client", []],
        ["html", [], null, "http://jabber.org/protocol/xhtml-im", [[null, "http://jabber.org/protocol/xhtml-im"]]],
        ["body", [], null, "http://www.w3.org/1999/xhtml", [[null, "http://www.w3.org/1999/xhtml"]]],
        ["prefixed", [], "stream", "http://etherx.jabber.org/streams", []],
    ],

    endElementNS: [
        ["x", null, "jabber:client"],
        ["body", null, "jabber:client"],
        ["body", null, "http://www.w3.org/1999/xhtml"],
        ["html", null, "http://jabber.org/protocol/xhtml-im"],
        ["message", null, "jabber:client"],
        ["prefixed", "stream", "http://etherx.jabber.org/streams"],
        ["stream", "stream", "http://etherx.jabber.org/streams"],
    ],

    characters: [["ABC "], ["&"], ["&"], [" XYZ"], ["exit"], ["exit"]],

    cdata: [[" some cdata "]],

    comment: [[" comment "]],

    warning: [["xmlParsePITarget: invalid name prefix 'xml'\n"]],

    error: [["Premature end of data in tag error line 2\n"]],
};

function argsToArray(args: any) {
    return Array.prototype.slice.call(args);
}

function createParser(parser: any, callbacks: any) {
    const p = new parser({
        startDocument: function () {
            callbacks.startDocument.push(argsToArray(arguments));
        },
        endDocument: function () {
            callbacks.endDocument.push(argsToArray(arguments));
        },
        startElementNS: function (_elem: any, _attrs: any, _prefix: any, _uri: any, _namespaces: any) {
            callbacks.startElementNS.push(argsToArray(arguments));
        },
        endElementNS: function (_elem: any, _prefix: any, _uri: any) {
            callbacks.endElementNS.push(argsToArray(arguments));
        },
        characters: function (chars: any) {
            if (!chars.match(/^[\s\n\r]+$/)) {
                callbacks.characters.push(argsToArray(arguments));
            }
        },
        comment: function (_msg: any) {
            callbacks.comment.push(argsToArray(arguments));
        },
        warning: function (_msg: any) {
            callbacks.warning.push(argsToArray(arguments));
        },
        error: function (_msg: any) {
            callbacks.error.push(argsToArray(arguments));
        },
    });

    p.on("cdata", function (_cdata: any) {
        callbacks.cdata.push(argsToArray(arguments));
    });

    return p;
}

const filename = __dirname + "/../test/fixtures/sax_parser.xml";

it('sax', () => {
    const callbacks = clone(callbackTest);
    const str = fs.readFileSync(filename, "utf8");
    const parser = createParser(SaxParser, callbacks);
    parser.parseString(str);
    assert.deepStrictEqual(callbacks, callbackControl);
});

it('sax_push_chunked', () => {
    const callbacks = clone(callbackTest);
    const str_ary = fs.readFileSync(filename, "utf8").split("\n");
    const parser = createParser(SaxPushParser, callbacks);
    for (let i = 0; i < str_ary.length; ++i) {
        parser.push(str_ary[i], i + 1 == str_ary.length);
    }

    const control = clone(callbackControl);
    control.error = [["Extra content at the end of the document\n"]];
    assert.deepStrictEqual(callbacks, control);
});

it('string_parser', () => {
    const callbacks = clone(callbackTest);
    const str = fs.readFileSync(filename, "utf8");
    const parser = createParser(SaxParser, callbacks);

    for (let i = 0; i < 10; i++) {
        global.gc?.();
        parser.parseString(str);
    }

    assert.ok(true);
});
