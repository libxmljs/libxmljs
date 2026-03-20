import { it, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as libxml from "../index";

var VALIDATE_RSS_TOLERANCE = 1;

function rssAfterGarbageCollection(maxCycles?: any): number {
    maxCycles || (maxCycles = 10);

    var rss = libxml.memoryUsage();
    var freedMemory = 0;
    do {
        global.gc?.();

        var rssAfterGc = libxml.memoryUsage();
        freedMemory = rss - rssAfterGc;
        rss = rssAfterGc;

        maxCycles--;
    } while (freedMemory !== 0 && maxCycles > 0);

    return rss;
}

it('getDtd', () => {
    var doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>\n<root></root>');
    var dtd = doc.getDtd();
    assert.strictEqual(dtd, null);
    doc = libxml.parseXml('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<root></root>');
    assert.ok(doc);
    dtd = doc.getDtd();
    assert.strictEqual(dtd?.name, "html");
    assert.strictEqual(dtd?.externalId, null);
    assert.strictEqual(dtd?.systemId, null);
    doc = libxml.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html SYSTEM "http://www.w3.org/TR/html4/strict.dtd">\n<root></root>'
    );
    dtd = doc.getDtd();
    assert.strictEqual(dtd?.name, "html");
    assert.strictEqual(dtd?.externalId, null);
    assert.strictEqual(dtd?.systemId, "http://www.w3.org/TR/html4/strict.dtd");
    doc = libxml.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<root></root>'
    );
    dtd = doc.getDtd();
    assert.strictEqual(dtd?.name, "html");
    assert.strictEqual(dtd?.externalId, "-//W3C//DTD HTML 4.01//EN");
    assert.strictEqual(dtd?.systemId, "http://www.w3.org/TR/html4/strict.dtd");
});

it('setDtd', () => {
    var doc = libxml.Document();
    doc.setDtd("html");
    assert.ok(doc);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n');
    doc.setDtd("html", "bacon", "bacon");
    assert.ok(doc);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "bacon" "bacon">\n');
    doc.setDtd("html", null);
    assert.ok(doc);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n');
    assert.throws(() => {
        // @ts-ignore
        doc.setDtd(5);
    });
    assert.ok(doc);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n');
    assert.throws(() => {
        // @ts-ignore
        doc.setDtd();
    });
    assert.ok(doc);
    assert.strictEqual(doc.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n');
});

it('blank', () => {
    var doc = libxml.Document();
    assert.ok(doc);
    assert.strictEqual(doc.version(), "1.0");
    assert.strictEqual(doc.encoding(), "utf8");
});

it('version', () => {
    var doc = libxml.Document("2.0");
    assert.ok(doc);
    assert.strictEqual(doc.version(), "2.0");
    assert.strictEqual(doc.encoding(), "utf8");
});

it('type', () => {
    var doc = libxml.Document("2.0");
    assert.strictEqual(doc.type(), "document");
});

it('full', () => {
    var doc = libxml.Document("2.0", "UTF-8");
    assert.ok(doc);
    assert.strictEqual(doc.version(), "2.0");
    assert.strictEqual(doc.encoding(), "UTF-8");
});

it('null_root', () => {
    var doc = libxml.Document();
    assert.strictEqual(doc.root(), null);
});

it('new_root', () => {
    var doc = libxml.Document();
    var root = doc.node("root");
    assert.strictEqual(root.name(), "root");
    assert.strictEqual(doc.root(), root);

    root.node("child").parent()?.node("child");

    assert.strictEqual(doc.root()?.name(), (doc.get("/root") as any).name());
});

it('one_child', () => {
    var doc = libxml.Document();
    var parent = doc.node("root").node("child-one").parent();
    assert.notStrictEqual(parent, null);
    parent?.node("child-two");
    assert.strictEqual(doc.child(0)?.name(), "child-one");
    assert.strictEqual(doc.child(1)?.name(), "child-two");
});

it('root_children', () => {
    var doc = libxml.Document();
    doc.node("root").node("child-one").parent()?.node("child-two");
    assert.strictEqual(doc.childNodes()?.[0]?.name(), "child-one");
    assert.strictEqual(doc.childNodes()?.[1]?.name(), "child-two");
});

it('xpath', () => {
    var doc = libxml.Document();
    doc.node("root").node("child").parent()?.node("child");
    assert.strictEqual(doc.find("child")?.length, 2);
});

it('xpath_child', () => {
    var doc = libxml.Document();
    doc.node("root").node("child-one").parent()?.node("child-two");
    assert.strictEqual((doc.get("child-one") as any).name(), "child-one");
    assert.strictEqual((doc.get("child-two") as any).name(), "child-two");
});

it('toString', () => {
    var control = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<root>",
        '  <child to="wongfoo">',
        '    <grandchild from="julie numar">with love</grandchild>',
        "  </child>",
        "  <sibling>with content!</sibling>",
        "</root>",
        "",
    ].join("\n");

    var doc = libxml.Document();
    var root = doc.node("root");

    // @ts-ignore
    var child = root
        .node("child")
        .attr({ to: "wongfoo" })
        // @ts-ignore
        .node("grandchild", "with love")
        .attr({ from: "julie numar" });
    root.node("sibling", "with content!");
    assert.strictEqual(doc.toString(), control);
});

it('add_child_nodes', () => {
    var doc1_string = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<root><child to="wongfoo"><grandchild from="julie numar">with love</grandchild></child><sibling>with content!</sibling></root>',
    ].join("\n");

    var doc2_string = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<root><child to="wongfoo"></child><sibling>with content!</sibling></root>',
    ].join("\n");

    var doc1 = libxml.parseXml(doc1_string);
    var doc2 = libxml.parseXml(doc2_string);

    doc2.child(0)?.addChild(doc1.child(0)?.child(0)!);
    assert.strictEqual(doc2.toString(), doc1.toString());
});

it('add_cdata_nodes', () => {
    var doc1_string = ['<?xml version="1.0" encoding="UTF-8"?>', '<root><child to="wongfoo"/></root>'].join("\n");

    var expected_string = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<root>",
        '  <child to="wongfoo"><![CDATA[<p>Bacon</p>]]></child>',
        "</root>",
        "",
    ].join("\n");

    var doc1 = libxml.parseXml(doc1_string);
    doc1.child(0)?.cdata("<p>Bacon</p>");
    assert.strictEqual(doc1.toString(), expected_string);
});

it('cloned_node', () => {
    var rssBefore = rssAfterGarbageCollection();

    var gchild_string = '<grandchild from="julie numar">with love</grandchild>';
    var doc1_string = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<root><child to="wongfoo">' + gchild_string + "</child><sibling>with content!</sibling></root>",
        "",
    ].join("\n");

    var doc2_string = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<root><child to="wongfoo"/><sibling>with content!</sibling></root>',
        "",
    ].join("\n");

    var doc1 = libxml.parseXml(doc1_string);
    var doc2 = libxml.parseXml(doc2_string);

    var gchild = doc1.child(0)?.child(0);

    doc2.child(0)?.addChild(gchild!);

    assert.strictEqual(doc2.toString(), doc1.toString());

    assert.notStrictEqual(doc2.child(0)?.child(0), gchild);

    gchild?.remove();

    assert.strictEqual(doc1.toString(false), doc2_string);
    assert.strictEqual(doc2.toString(false), doc1_string);
});

it('validate', () => {
    var xsd =
        '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment" type="xs:string"/></xs:schema>';
    var xml_valid = '<?xml version="1.0"?><comment>A comment</comment>';
    var xml_invalid = '<?xml version="1.0"?><commentt>A comment</commentt>';

    var xsdDoc = libxml.parseXml(xsd);

    var xmlDocValid = libxml.parseXml(xml_valid);
    var xmlDocInvalid = libxml.parseXml(xml_invalid);

    assert.strictEqual(xmlDocValid.validate(xsdDoc), true);
    assert.strictEqual(xmlDocValid.validationErrors.length, 0);

    assert.strictEqual(xmlDocInvalid.validate(xsdDoc), false);
    assert.strictEqual(xmlDocInvalid.validationErrors.length, 1);
});

it('rngValidate', () => {
    var rng =
        '<element name="addressBook" xmlns="http://relaxng.org/ns/structure/1.0">' +
        "<zeroOrMore>" +
        '<element name="card">' +
        '<element name="name">' +
        "<text/>" +
        "</element>" +
        '<element name="email">' +
        "<text/>" +
        "</element>" +
        "</element>" +
        "</zeroOrMore>" +
        "</element>";

    var xml_valid =
        "<addressBook>" +
        "<card>" +
        "<name>John Smith</name>" +
        "<email>js@example.com</email>" +
        "</card>" +
        "<card>" +
        "<name>Fred Bloggs</name>" +
        "<email>fb@example.net</email>" +
        "</card>" +
        "</addressBook>";

    var xml_invalid =
        "<addressBook>" +
        "<card>" +
        "<Name>John Smith</Name>" +
        "<email>js@example.com</email>" +
        "</card>" +
        "<card>" +
        "<name>Fred Bloggs</name>" +
        "<email>fb@example.net</email>" +
        "</card>" +
        "</addressBook>";

    var rngDoc = libxml.parseXml(rng);
    var xmlDocValid = libxml.parseXml(xml_valid);
    var xmlDocInvalid = libxml.parseXml(xml_invalid);

    assert.strictEqual(xmlDocValid.rngValidate(rngDoc), true);
    assert.strictEqual(xmlDocValid.validationErrors.length, 0);

    assert.strictEqual(xmlDocInvalid.rngValidate(rngDoc), false);
    assert.strictEqual(xmlDocInvalid.validationErrors.length, 1);
});

describe('errors', () => {
    it('empty_html_doc', () => {
        var xml_only_comments = "<!-- empty -->";
        var doc = libxml.parseHtml(xml_only_comments);
        assert.strictEqual(doc.root(), null);

        assert.throws(() => {
            doc.get("*");
        }, /Document has no root element/);

        assert.throws(() => {
            doc.find("*");
        }, /Document has no root element/);

        assert.throws(() => {
            doc.child(1);
        }, /Document has no root element/);

        assert.throws(() => {
            doc.childNodes();
        }, /Document has no root element/);

        assert.throws(() => {
            doc.namespaces();
        }, /Document has no root element/);
    });
});

it('validate_memory_usage', () => {
    var xsd =
        '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment" type="xs:string"/></xs:schema>';
    var xml = '<?xml version="1.0"?><comment>A comment</comment>';

    var xsdDoc = libxml.parseXml(xsd);
    var xmlDoc = libxml.parseXml(xml);

    var rssBefore = rssAfterGarbageCollection();

    for (var i = 0; i < 10000; ++i) {
        xmlDoc.validate(xsdDoc);
    }
});

it('fromHtml', () => {
    var html = "<p>A paragraph with <span>inline tags</span></p>";
    var header =
        '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">\n<html><body>';
    var footer = "</body></html>\n";

    var parsedHtml = libxml.Document.fromHtml(html);

    assert.strictEqual(parsedHtml.toString(), header + html + footer);
});

it('fromHtmlFragment', () => {
    var html = "<p>A paragraph with <span>inline tags</span></p>";

    var parsedHtml = libxml.Document.fromHtmlFragment(html);

    assert.strictEqual(parsedHtml.toString(), html + "\n");
});

it('fromXml', () => {
    var xml =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<!DOCTYPE type [<!ENTITY ent "entity">]>' +
        '<root><node1>&ent;</node1><node2>node2</node2></root>';

    var parsedXml = libxml.Document.fromXml(xml);
    var node: any = parsedXml?.get('//node1');
    var text = node.text();
    assert.strictEqual(text, 'entity');
});

it('fromXmlAsync', async () => {
    var xml =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<!DOCTYPE type [<!ENTITY ent "entity">]>' +
        '<root><node1>&ent;</node1><node2>node2</node2></root>';

    var parsedXml = await libxml.Document.fromXmlAsync(xml, {flags: [libxml.XMLParseFlags.XML_PARSE_NOENT]});
    var node: any = parsedXml?.get('//node1');
    var text = node.text();
    assert.strictEqual(text, 'entity');
});

it('validate_rng_memory_usage', () => {
    var rng =
        '<element name="addressBook" xmlns="http://relaxng.org/ns/structure/1.0">' +
        "<zeroOrMore>" +
        '<element name="card">' +
        '<element name="name">' +
        "<text/>" +
        "</element>" +
        '<element name="email">' +
        "<text/>" +
        "</element>" +
        "</element>" +
        "</zeroOrMore>" +
        "</element>";

    var xml_valid =
        "<addressBook>" +
        "<card>" +
        "<name>John Smith</name>" +
        "<email>js@example.com</email>" +
        "</card>" +
        "<card>" +
        "<name>Fred Bloggs</name>" +
        "<email>fb@example.net</email>" +
        "</card>" +
        "</addressBook>";

    var rngDoc = libxml.parseXml(rng);
    var xmlDoc = libxml.parseXml(xml_valid);

    var rssBefore = rssAfterGarbageCollection();

    for (var i = 0; i < 10000; ++i) {
        xmlDoc.rngValidate(rngDoc);
    }

    assert.ok(rssAfterGarbageCollection() - rssBefore < VALIDATE_RSS_TOLERANCE);
});
