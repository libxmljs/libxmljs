import * as libxmljs from "../index";

module.exports.cve_2024_34391 = function(assert: any) {
    assert.expect(5);

    var d = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE note
    [
        <!ENTITY writer "JFrog Security">
    ]>
    <from>&writer;</from>
    `;

    var t = libxmljs.parseXml(d)
    assert.ok(t !== null, "parsed to non null");

    var from = t.get('//from')
    assert.ok(from.name() === 'from', "xpath finds 'from' node");

    var c = from.childNodes()[0];
    assert.ok(c.name() === 'entity_ref', "first child of 'from' is entity_ref");

    var c2 = c.childNodes()[0];
    assert.ok(c2.name() === 'entity_decl', "child of 'from' entity_ref is entity_decl");

    assert.throws(function() {
        c2.attrs()
    }, Error, "entity_decl object can't call attrs and segfault");

    assert.done();
};

module.exports.cve_2024_34392 = function(assert: any) {
    assert.expect(2);

    const d = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE note
    [
        <!ENTITY writer PUBLIC "` + "A".repeat(8) + "B".repeat(8) + "C".repeat(8) + "D".repeat(8) + "P".repeat(8) + `" "JFrog Security">
    ]>
    <from>&writer;</from>
    `;

    const t = libxmljs.parseXml(d);
    const from = t.get('//from');
    const c = from.childNodes()[0];
    const c2 = c.childNodes()[0];
    assert.ok(c2.name() === 'entity_decl', "child of 'from' entity_ref is entity_decl");

    assert.throws(function() {
        c2.namespaces(true);
    }, /^Node has no namespaces/, "entity_decl can't call namespaces and segfault");

    assert.done();
};
