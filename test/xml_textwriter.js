var libxml = require('../index');

module.exports['should write an XML preamble to memory'] = function (test) {
    var writer;
    var count;
    var output;

    writer = new libxml.TextWriter();
    count += writer.startDocument();
    count += writer.endDocument();
    output = writer.outputMemory();
    test.equal('<?xml version="1.0"?>\n\n', output);

    writer = new libxml.TextWriter();
    count += writer.startDocument('1.0');
    count += writer.endDocument();
    output = writer.outputMemory();
    test.equal('<?xml version="1.0"?>\n\n', output);

    writer = new libxml.TextWriter();
    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.endDocument();
    output = writer.outputMemory();
    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n\n', output);

    writer = new libxml.TextWriter();
    count += writer.startDocument('1.0', 'UTF-8', 'yes');
    count += writer.endDocument();
    output = writer.outputMemory();
    test.equal('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\n', output);

    test.done();
};

module.exports['should write elements without namespace'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'root');
    count += writer.startElementNS(undefined, 'child');
    count += writer.endElement();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root><child/></root>\n', output);

    test.done();
};

module.exports['should write elements with default namespace'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'html', 'http://www.w3.org/1999/xhtml');
    count += writer.startElementNS(undefined, 'head');
    count += writer.endElement();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml"><head/></html>\n', output);

    test.done();
};

module.exports['should write elements with namespace prefix'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS('html', 'html', 'http://www.w3.org/1999/xhtml');
    count += writer.startElementNS('html', 'head');
    count += writer.endElement();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<html:html xmlns:html="http://www.w3.org/1999/xhtml"><html:head/></html:html>\n', output);

    test.done();
};

module.exports['should write attributes with default namespace'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'root', 'http://example.com');
    count += writer.startAttributeNS(undefined, 'attr', 'http://example.com');
    count += writer.writeString('value');
    count += writer.endAttribute();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root attr="value" xmlns="http://example.com"/>\n', output);

    test.done();
};

module.exports['should write attributes with namespace prefix'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'root');
    count += writer.startAttributeNS('pfx', 'attr', 'http://example.com');
    count += writer.writeString('value');
    count += writer.endAttribute();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root pfx:attr="value" xmlns:pfx="http://example.com"/>\n', output);

    test.done();
};

module.exports['should write text node'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'root');
    count += writer.writeString('some text here');
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root>some text here</root>\n', output);

    test.done();
};

module.exports['should write cdata section'] = function (test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument('1.0', 'UTF-8');
    count += writer.startElementNS(undefined, 'root');
    count += writer.startCdata();
    count += writer.writeString('some text here');
    count += writer.endCdata();
    count += writer.endElement();
    count += writer.endDocument();
    output = writer.outputMemory();

    test.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root><![CDATA[some text here]]></root>\n', output);

    test.done();
};

module.exports['should return the contents of the output buffer when told so'] = function(test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument();
    count += writer.startElementNS(undefined, 'root');
    output = writer.outputMemory();

    test.equal('<?xml version="1.0"?>\n<root', output);

    output = writer.outputMemory();
    test.equal('', output);

    count += writer.endElement();
    count += writer.endDocument();

    output = writer.outputMemory();
    test.equal('/>\n', output);

    test.done();
};

module.exports['should not flush the output buffer when told so'] = function(test) {
    var writer = new libxml.TextWriter();
    var count;
    var output;

    count += writer.startDocument();
    count += writer.startElementNS(undefined, 'root');

    // flush buffer=false, ...
    output = writer.outputMemory(false);
    test.equal('<?xml version="1.0"?>\n<root', output);

    // content should be receivable here.
    output = writer.outputMemory(true);
    test.equal('<?xml version="1.0"?>\n<root', output);

    // but not here anymore because of recent flush.
    output = writer.outputMemory();
    test.equal('', output);

    test.done();
};
