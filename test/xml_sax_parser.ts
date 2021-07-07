var fs = require("fs");

import { SaxParser, SaxPushParser } from "../index";

function clone(obj: any) {
    if (obj == null || typeof obj != "object") return obj;

    var temp = new obj.constructor();
    for (var key in obj) temp[key] = clone(obj[key]);

    return temp;
}

var callbackTest = {
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

var callbackControl = {
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
    // can connect by passing in as arguments to constructor
    var parser = new parser({
        startDocument: function () {
            callbacks.startDocument.push(argsToArray(arguments));
        },
        endDocument: function () {
            callbacks.endDocument.push(argsToArray(arguments));
        },
        startElementNS: function (elem: any, attrs: any, prefix: any, uri: any, namespaces: any) {
            // p({e: elem, a: attrs, p: prefix, u: uri, n: namespaces});
            callbacks.startElementNS.push(argsToArray(arguments));
        },
        endElementNS: function (elem: any, prefix: any, uri: any) {
            callbacks.endElementNS.push(argsToArray(arguments));
        },
        characters: function (chars: any) {
            if (!chars.match(/^[\s\n\r]+$/)) {
                callbacks.characters.push(argsToArray(arguments));
            }
        },
        comment: function (msg: any) {
            callbacks.comment.push(argsToArray(arguments));
        },
        warning: function (msg: any) {
            callbacks.warning.push(argsToArray(arguments));
        },
        error: function (msg: any) {
            callbacks.error.push(argsToArray(arguments));
        },
    });

    // can also connect directly because it is an event emitter
    parser.on("cdata", function (cdata: any) {
        callbacks.cdata.push(argsToArray(arguments));
    });

    return parser;
}

var filename = __dirname + "/../../test/fixtures/sax_parser.xml";

module.exports.sax = function (assert: any) {
    var callbacks = clone(callbackTest);
    var str = fs.readFileSync(filename, "utf8");
    var parser = createParser(SaxParser, callbacks);
    parser.parseString(str);
    assert.deepEqual(callbackControl, callbacks);
    assert.done();
};

module.exports.sax_push_chunked = function (assert: any) {
    var callbacks = clone(callbackTest);
    var str_ary = fs.readFileSync(filename, "utf8").split("\n");
    var parser = createParser(SaxPushParser, callbacks);
    for (var i = 0; i < str_ary.length; ++i) {
        parser.push(str_ary[i], i + 1 == str_ary.length);
    }

    var control = clone(callbackControl);
    control.error = [["Extra content at the end of the document\n"]];
    assert.deepEqual(control, callbacks);
    assert.done();
};

module.exports.string_parser = function (assert: any) {
    var callbacks = clone(callbackTest);
    var str = fs.readFileSync(filename, "utf8");
    var parser = createParser(SaxParser, callbacks);

    // test that the parser can be reused after a gc run
    for (var i = 0; i < 10; i++) {
        global.gc();
        parser.parseString(str);
    }

    assert.ok(true);
    assert.done();
};
