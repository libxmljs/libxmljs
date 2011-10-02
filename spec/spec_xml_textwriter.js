with(require('./helpers')) {
  describe("XML Text Writer", function() {
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
