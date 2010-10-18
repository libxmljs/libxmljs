with(require('./helpers')) {

describe('Referential Integrity', function() {

    it("doesn't crash", function() {
        var doc = new libxml.Document();
        console.error(0);
        doc.node('root').node('child').node('grandchild').parent().node('child2');
        gc();
        console.error(1);
        assert(doc, "doc");
        gc();
        console.error(2);
        assert(doc.root(), "root");
        gc();
        console.error(3);
        assertEqual("child", doc.root().childNodes()[0].name(), "child name");
    });

    it("Keeps references", function() {
        var nodes = libxml.parseXmlString('<root>  <child>  <grandchildren/>  </child>  <child2/>  </root>').childNodes();

        gc();

        assert(nodes[0].doc());
        assertEqual("child", nodes[1].name(), "child name");
    });

});

}