with(require('./helpers')) {
  describe("XML Text Writer", function() {
    it('will write an XML preamble to memory', function () {
      var writer = new libxml.TextWriter();
      var count;

      writer.openMemory();
      count += writer.startDocument('1.0', 'UTF-8');
      count += writer.endDocument();

      var output = writer.outputMemory(true);

      assertEqual('<?xml version="1.0" encoding="UTF-8"?>\n\n', output);
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

      assertEqual(expectError.message, err.message);
    });
  });
}
