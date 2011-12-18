with(require('./helpers')) {
  describe("XML Text Writer", function() {
    it('will write an XML preamble to memory', function () {
      var writer;
      var count;
      var output;

      writer = new libxml.TextWriter();
      writer.openMemory();
      count += writer.startDocument();
      count += writer.endDocument();
      output = writer.outputMemory();
      assert.equal('<?xml version="1.0"?>\n\n', output);

      writer = new libxml.TextWriter();
      writer.openMemory();
      count += writer.startDocument('1.0');
      count += writer.endDocument();
      output = writer.outputMemory();
      assert.equal('<?xml version="1.0"?>\n\n', output);

      writer = new libxml.TextWriter();
      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.endDocument();
      output = writer.outputMemory();
      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n\n', output);

      writer = new libxml.TextWriter();
      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8', 'yes');
      count += writer.endDocument();
      output = writer.outputMemory();
      assert.equal('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\n', output);
    });

    it('will fail if no output is set and document start function is called', function () {
      var writer = new libxml.TextWriter();
      var err;
      try {
        writer.startDocument('1.0', 'UTF-8');
      }
      catch(e) {
        err = e;
      }

      var expectError = {
        message: "No output method set. Call outputXXX once before trying to write."
      };

      assert.equal(expectError.message, err.message);
    });

    it('will fail if output is set more than once', function () {
      var writer = new libxml.TextWriter();
      var err;

      writer.openMemory();
      try {
        writer.openMemory();
      }
      catch(e) {
        err = e;
      }

      var expectError = {
        message: "openXXX may only be called once. Output already set."
      };

      assert.equal(expectError.message, err.message);
    });

    it('will write elements without namespace', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'root');
      count += writer.startElementNS(undefined, 'child');
      count += writer.endElement();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root><child/></root>\n', output);
    });

    it('will write elements with default namespace', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'html', 'http://www.w3.org/1999/xhtml');
      count += writer.startElementNS(undefined, 'head');
      count += writer.endElement();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml"><head/></html>\n', output);
    });

    it('will write elements with namespace prefix', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS('html', 'html', 'http://www.w3.org/1999/xhtml');
      count += writer.startElementNS('html', 'head');
      count += writer.endElement();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<html:html xmlns:html="http://www.w3.org/1999/xhtml"><html:head/></html:html>\n', output);
    });

    it('will write attributes with default namespace', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'root', 'http://example.com');
      count += writer.startAttributeNS(undefined, 'attr', 'http://example.com');
      count += writer.writeString('value');
      count += writer.endAttribute();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root attr="value" xmlns="http://example.com"/>\n', output);
    });

    it('will write attributes with namespace prefix', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'root');
      count += writer.startAttributeNS('pfx', 'attr', 'http://example.com');
      count += writer.writeString('value');
      count += writer.endAttribute();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root pfx:attr="value" xmlns:pfx="http://example.com"/>\n', output);
    });

    it('will write text node', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'root');
      count += writer.writeString('some text here');
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root>some text here</root>\n', output);
    });

    it('will write cdata section', function () {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.startElementNS(undefined, 'root');
      count += writer.startCdata();
      count += writer.writeString('some text here');
      count += writer.endCdata();
      count += writer.endElement();
      count += writer.endDocument();
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<root><![CDATA[some text here]]></root>\n', output);
    });

    it('will return the contents of the output buffer when told so', function() {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument();
      count += writer.startElementNS(undefined, 'root');
      output = writer.outputMemory();

      assert.equal('<?xml version="1.0"?>\n<root', output);

      output = writer.outputMemory();
      assert.equal('', output);

      count += writer.endElement();
      count += writer.endDocument();

      output = writer.outputMemory();
      assert.equal('/>\n', output);
    });

    it('will not flush the output buffer when told so', function() {
      var writer = new libxml.TextWriter();
      var count;
      var output;

      writer.openMemory();
      count += writer.startDocument();
      count += writer.startElementNS(undefined, 'root');

      // flush buffer=false, ...
      output = writer.outputMemory(false);
      assert.equal('<?xml version="1.0"?>\n<root', output);

      // content should be receivable here.
      output = writer.outputMemory(true);
      assert.equal('<?xml version="1.0"?>\n<root', output);

      // but not here anymore because of recent flush.
      output = writer.outputMemory();
      assert.equal('', output);
    });
  });
}
