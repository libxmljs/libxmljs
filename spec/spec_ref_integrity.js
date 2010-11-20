with(require('./helpers')) {

describe('Referential Integrity', function() {

    it("doesn't crash", function() {
        var doc = new libxml.Document();
        doc.node('root').node('child').node('grandchild').parent().node('child2');
        gc();
        assert.ok(doc, "doc");
        gc();
        assert.ok(doc.root(), "root");
        gc();
        assert.equal("child", doc.root().childNodes()[0].name(), "child name");
    });

    it("Keeps references", function() {
        var nodes = libxml.parseXmlString('<root>  <child>  <grandchildren/>  </child>  <child2/>  </root>').childNodes();

        gc();

        assert.ok(nodes[0].doc());
        assert.equal("child", nodes[1].name(), "child name");
    });

});

}
