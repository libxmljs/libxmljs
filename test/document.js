var libxml = require('../index');

module.exports.getDtd = function(assert) {
    var doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\n<root></root>');
    var dtd = doc.getDtd();
    assert.equal(null, dtd);
    doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<root></root>');
    assert.ok(doc);
    dtd = doc.getDtd();
    assert.equal('html', dtd.name);
    assert.equal(null, dtd.externalId);
    assert.equal(null, dtd.systemId);
    doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html SYSTEM "http://www.w3.org/TR/html4/strict.dtd">\n<root></root>');
    dtd = doc.getDtd();
    assert.equal('html', dtd.name);
    assert.equal(null, dtd.externalId);
    assert.equal('http://www.w3.org/TR/html4/strict.dtd', dtd.systemId);
    doc = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<root></root>');
    dtd = doc.getDtd();
    assert.equal('html', dtd.name);
    assert.equal('-//W3C//DTD HTML 4.01//EN', dtd.externalId);
    assert.equal('http://www.w3.org/TR/html4/strict.dtd', dtd.systemId);
    assert.done();
};

module.exports.setDtd = function(assert) {
    var doc = libxml.Document();
    doc.setDtd("html");
    assert.ok(doc);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n', doc.toString());
    doc.setDtd("html", "bacon", "bacon");
    assert.ok(doc);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "bacon" "bacon">\n', doc.toString());
    doc.setDtd("html", null);
    assert.ok(doc);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n', doc.toString());
    assert.throws(function() {
      doc.setDtd(5);
    });
    assert.ok(doc);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n', doc.toString());
    assert.throws(function() {
      doc.setDtd();
    });
    assert.ok(doc);
    assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n', doc.toString());
    assert.done();
};

module.exports.blank = function(assert) {
    var doc = libxml.Document();
    assert.ok(doc);
    assert.equal('1.0', doc.version());
    assert.equal('utf8', doc.encoding());
    assert.done();
};

module.exports.version = function(assert) {
    var doc = libxml.Document('2.0');
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal('utf8', doc.encoding());
    assert.done();
};

module.exports.type = function(assert) {
    var doc = libxml.Document('2.0');
    assert.equal('document', doc.type());
    assert.done();
};

module.exports.full = function(assert) {
    var doc = libxml.Document('2.0', 'UTF-8');
    assert.ok(doc);
    assert.equal('2.0', doc.version());
    assert.equal('UTF-8', doc.encoding());
    assert.done();
};

module.exports.null_root = function(assert) {
    var doc = libxml.Document();
    assert.equal(null, doc.root());
    assert.done();
};

module.exports.new_root = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root');
    assert.equal('root', root.name());
    assert.equal(root, doc.root());

    root.node('child').parent().node('child');
    assert.equal(doc.root().name(), doc.get('/root').name());
    assert.done();
};

module.exports.one_child = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.child(0).name());
    assert.equal('child-two', doc.child(1).name());
    assert.done();
};

module.exports.root_children = function(assert) {
    var doc = libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.childNodes()[0].name());
    assert.equal('child-two', doc.childNodes()[1].name());
    assert.done();
};

module.exports.xpath = function(assert) {
    var doc = libxml.Document();
    doc.node('root').node('child').parent().node('child');
    assert.equal(2, doc.find('child').length);
    assert.done();
};

module.exports.xpath_child = function(assert) {
    var doc = libxml.Document();
    doc.node('root').node('child-one').parent().node('child-two');
    assert.equal('child-one', doc.get('child-one').name());
    assert.equal('child-two', doc.get('child-two').name());
    assert.done();
};

module.exports.toString = function(assert) {
    var control = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root>',
      '  <child to="wongfoo">',
      '    <grandchild from="julie numar">with love</grandchild>',
      '  </child>',
      '  <sibling>with content!</sibling>',
      '</root>',
      ''
    ].join("\n");

    var doc = libxml.Document();
    var root = doc.node('root');
    root.node('child').attr({to: 'wongfoo'})
        .node('grandchild', 'with love').attr({from: 'julie numar'})
    root.node('sibling', 'with content!');
    assert.equal(control, doc.toString());
    assert.done();
};

module.exports.add_child_nodes = function(assert) {
    var gchild = '';
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
    doc2.child(0).addChild(doc1.child(0).child(0));
    assert.equal(doc1.toString(), doc2.toString());
    assert.done();
};

module.exports.add_cdata_nodes = function(assert) {
    var gchild = '';
    var doc1_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"/></root>',
    ].join("\n");

    var expected_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root>',
      '  <child to="wongfoo"><![CDATA[<p>Bacon</p>]]></child>',
      '</root>',
      '' /* Why?!? */
    ].join("\n");

    var doc1 = libxml.parseXml(doc1_string);
    doc1.child(0).cdata('<p>Bacon</p>');
    assert.equal(doc1.toString(), expected_string);
    assert.done();
};

module.exports.cloned_node = function(assert) {
    var gchild_string  = '<grandchild from="julie numar">with love</grandchild>';
    var doc1_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo">'+gchild_string+'</child><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc2_string = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<root><child to="wongfoo"/><sibling>with content!</sibling></root>',
      ''
    ].join("\n");

    var doc1 = libxml.parseXml(doc1_string);
    var doc2 = libxml.parseXml(doc2_string);

	var gchild = doc1.child(0).child(0); //the element to operate on

    doc2.child(0).addChild(gchild); // add gchild clone to doc2, implicit clone

    assert.equal(doc1.toString(), doc2.toString()); // both documents should be the same

    assert. notEqual(gchild, doc2.child(0).child(0)); // these nodes should be different (cloned)

    gchild.remove();

    assert.equal(doc2_string, doc1.toString(false)); //doc1 should be the same as doc2 str (raw output)
    assert.equal(doc1_string, doc2.toString(false)); //doc2 should be the same as doc1 str (raw output)
    assert.done();
};

module.exports.validate = function(assert) {
    var xsd = '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment" type="xs:string"/></xs:schema>';
    var xml_valid = '<?xml version="1.0"?><comment>A comment</comment>';
    var xml_invalid = '<?xml version="1.0"?><commentt>A comment</commentt>';

    var xsdDoc = libxml.parseXml(xsd);
    var xmlDocValid = libxml.parseXml(xml_valid);
    var xmlDocInvalid = libxml.parseXml(xml_invalid);

    assert.equal(xmlDocValid.validate(xsdDoc), true);
    assert.equal(xmlDocValid.validationErrors.length, 0);

    assert.equal(xmlDocInvalid.validate(xsdDoc), false);
    assert.equal(xmlDocInvalid.validationErrors.length, 1);

    assert.done();
};

module.exports.rngValidate = function(assert) {
	// see http://relaxng.org/ for more infos about RELAX NG

	var rng =
		'<element name="addressBook" xmlns="http://relaxng.org/ns/structure/1.0">'+
			'<zeroOrMore>'+
				'<element name="card">'+
					'<element name="name">'+
						'<text/>'+
					'</element>'+
					'<element name="email">'+
						'<text/>'+
					'</element>'+
				'</element>'+
			'</zeroOrMore>'+
		'</element>';

	var xml_valid =
		'<addressBook>'+
			'<card>'+
				'<name>John Smith</name>'+
				'<email>js@example.com</email>'+
			'</card>'+
			'<card>'+
				'<name>Fred Bloggs</name>'+
				'<email>fb@example.net</email>'+
			'</card>'+
		'</addressBook>';

	var xml_invalid =
		'<addressBook>'+
			'<card>'+
				'<Name>John Smith</Name>'+
				'<email>js@example.com</email>'+
			'</card>'+
			'<card>'+
				'<name>Fred Bloggs</name>'+
				'<email>fb@example.net</email>'+
			'</card>'+
		'</addressBook>';

    var rngDoc = libxml.parseXml(rng);
    var xmlDocValid = libxml.parseXml(xml_valid);
    var xmlDocInvalid = libxml.parseXml(xml_invalid);

    assert.equal(xmlDocValid.rngValidate(rngDoc), true);
    assert.equal(xmlDocValid.validationErrors.length, 0);

    assert.equal(xmlDocInvalid.rngValidate(rngDoc), false);
    assert.equal(xmlDocInvalid.validationErrors.length, 1);

    assert.done();
};

module.exports.errors = {
    empty_html_doc: function(assert) {
        function assertDocRootError(func, msg) {
            assert.throws(func, /Document has no root element/, msg);
        }

        var xml_only_comments = '<!-- empty -->';
        var doc = libxml.parseHtmlString(xml_only_comments);
        assert.equal(null, doc.root());

        assertDocRootError(function() {
            doc.get('*');
        }, 'get method throws correct error on empty doc');

        assertDocRootError(function() {
            doc.find('*');
        }, 'find method throws correct error on empty doc');

        assertDocRootError(function() {
            doc.child(1);
        }, 'child method throws correct error on empty doc');

        assertDocRootError(function() {
            doc.childNodes();
        }, 'childNodes method throws correct error on empty doc');

        assertDocRootError(function() {
            doc.namespaces();
        }, 'namespaces method throws correct error on empty doc');

        assert.done();
    }
};

module.exports.validate_memory_usage = function(assert) {
    var xsd = '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment" type="xs:string"/></xs:schema>';
    var xml = '<?xml version="1.0"?><comment>A comment</comment>';

    var xsdDoc = libxml.parseXml(xsd);
    var xmlDoc = libxml.parseXml(xml);

    var rssBefore = rssAfterGarbageCollection();
    for (var i = 0; i < 10000; ++i) {
        xmlDoc.validate(xsdDoc);
    }
    assert.ok((rssAfterGarbageCollection() - rssBefore) < VALIDATE_RSS_TOLERANCE);
    assert.done();
};

module.exports.fromHtml = function(assert) {
    var html = "<p>A paragraph with <span>inline tags</span></p>";
    var header = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">\n<html><body>';
    var footer = "</body></html>\n";
    var parsedHtml = libxml.Document.fromHtml(html);
    assert.equal(header + html + footer, parsedHtml.toString());
    assert.done();
};

module.exports.fromHtmlFragment = function(assert) {
    var html = "<p>A paragraph with <span>inline tags</span></p>";
    var parsedHtml = libxml.Document.fromHtmlFragment(html);

    assert.equal(html + "\n", parsedHtml.toString());
    assert.done();

};

module.exports.validate_rng_memory_usage = function(assert) {
  var rng =
    '<element name="addressBook" xmlns="http://relaxng.org/ns/structure/1.0">'+
      '<zeroOrMore>'+
        '<element name="card">'+
          '<element name="name">'+
            '<text/>'+
          '</element>'+
          '<element name="email">'+
            '<text/>'+
          '</element>'+
        '</element>'+
      '</zeroOrMore>'+
    '</element>';

  var xml_valid =
    '<addressBook>'+
      '<card>'+
        '<name>John Smith</name>'+
        '<email>js@example.com</email>'+
      '</card>'+
      '<card>'+
        '<name>Fred Bloggs</name>'+
        '<email>fb@example.net</email>'+
      '</card>'+
    '</addressBook>';

    var rngDoc = libxml.parseXml(rng);
    var xmlDoc = libxml.parseXml(xml_valid);

    var rssBefore = rssAfterGarbageCollection();
    for (var i = 0; i < 10000; ++i) {
        xmlDoc.rngValidate(rngDoc);
    }
    assert.ok((rssAfterGarbageCollection() - rssBefore) < VALIDATE_RSS_TOLERANCE);
    assert.done();
};

var VALIDATE_RSS_TOLERANCE = 1;

function rssAfterGarbageCollection(maxCycles) {
    maxCycles || (maxCycles = 10);

    var rss = libxml.memoryUsage();
    var freedMemory = 0;
    do {
        global.gc();

        var rssAfterGc = libxml.memoryUsage();
        freedMemory = rss - rssAfterGc;
        rss = rssAfterGc;

        maxCycles--;
    }
    while ((freedMemory !== 0) && (maxCycles > 0));

    return rss;
}
