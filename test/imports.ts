import { readFileSync } from "fs";
import libxml from "../index";
import * as libxml2 from "../index";
import { parseXml } from "../index";

module.exports.imports = function (assert: any) {
    const filename = __dirname + "/../../test/fixtures/parser.xml";
    const str = readFileSync(filename, "utf8").replace(/[\r]+/g, '');

    const doc1 = parseXml(str),
        doc2 = libxml2.parseXml(str),
        doc3 = libxml.parseXml(str);

    assert.equal(doc1.toString(), doc2.toString());
    assert.equal(doc2.toString(), doc3.toString());
    assert.equal(doc1.toString(), doc3.toString());

    assert.done();
}