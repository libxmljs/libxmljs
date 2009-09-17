include('helpers.js');

describe('A new document', function() {
  it('can be instantiated with nothing', function() {
    var doc = new libxml.Document();
    assert(doc);
    assertEqual('1.0', doc.version);
    assertEqual('', doc.encoding);
  });

  it('can be instantiated with a version', function() {
    var doc = new libxml.Document('2.0');
    assert(doc);
    assertEqual('2.0', doc.version);
    assertEqual('', doc.encoding);
  });

  it('can be instantiated with a version and encoding', function() {
    var doc = new libxml.Document('2.0', 'UTF-8');
    assert(doc);
    assertEqual('2.0', doc.version);
    assertEqual('UTF-8', doc.encoding);
  });

  it('can be instantiated with a callback', function() {
    var doc = null;
    new libxml.Document(function(d) { doc = d; });
    assert(doc);
    assertEqual('1.0', doc.version);
    assertEqual('', doc.encoding);
  });
  
  it('can be instantiated with a version and a callback', function() {
    var doc = null;
    new libxml.Document('2.0', function(d) { doc = d; });
    assert(doc);
    assertEqual('2.0', doc.version);
    assertEqual('', doc.encoding);
  });
  
  it('can be instantiated with a version, encoding and callback', function() {
    var doc = null;
    new libxml.Document('2.0', 'UTF-8', function(d) { doc = d; });
    assert(doc);
    assertEqual('2.0', doc.version);
    assertEqual('UTF-8', doc.encoding);
  });

  it('returns itself when asked', function() {
    var doc = new libxml.Document();
    assertEqual(doc, doc.document);
  });
});


// var document = libxml.Document(function(doc) {                                        //  <?xml version="1.0" encoding="UTF-8"?>
//   doc.root('stream', {to: 'example.com', version: '1.0'}, function(n) {                   //  <stream:stream to="example.com" version="1.0"
//     n.ns(null, 'jabber:client');                                                          //  xmlns="jabber:client"
//     n.setNS(n.ns('stream', 'http://etherx.jabber.org/streams'));                          //  xmlns:stream="http://etherx.jabber.org/streams">
//     n.comment(' comment ');                                                               //    <!-- comment -->
//     n.node('message', {type: 'chat', to: 'n2@d', from: 'n@d/r', id: 'id1'}, function(n) { //    <message type="chat" to="n@d" from="n@d/r" id="id1">
//       n.cdata(' some data ');                                                             //      <![CDATA[ some cdata ]]>
//       n.node('body', function(n) { n.text('exit'); });                                    //      <body>exit</body>
//       n.node('html', function(n) {                                                        //      <html
//         n.ns(null, 'http://jabber.org/protocol/xhtml-im');                                //      xmlns="http://jabber.org/protocol/xhtml-im">
//         n.node('body', function(n) {                                                      //        <body
//           n.ns(null, 'http://www.w3.org/1999/xhtml');                                     //        xmlns="http://www.w3.org/1999/xhtml">
//           n.text('exit');                                                                 //          exit
//         });                                                                               //        </body>
//       });                                                                                 //      </html>
//     });                                                                                   //    </message>
//   });                                                                                     //  </stream:stream>
// });
// 
// /* Document Manipulation */
// libxml.Document();                                  // create using non-builder syntax
// libxml.Document(function(doc) {});                  // create using builder syntax
// libxml.Document('1.0');                             // create with a version
// libxml.Document('1.0', function(doc) {});           // create with a version using builder syntax
// libxml.Document('1.0', 'UTF-8');                    // create with a version and encoding
// libxml.Document('1.0', 'UTF-8', function(doc) {});  // create with a version and encoding using builder syntax
// doc.encoding();         // get encoding
// doc.encoding('UTF-8');  // set encoding
// 
// 
// /* Attribute Manipulation */
// node.attr('name');          // get
// node.attr('name', 'tom');   // set
// node.attr('name', null);    // remove
// 
// /* Namespace Manipulation */
// node.ns(null, 'uri');               // define and set default namespace
// var ns = node.ns('prefix', 'uri');  // define namespace (do not set)
// node.setNS(ns);                     // set pre-defined namespace
// 
// /* Node Manipulation */
// node.node('name');                // create (no attrs)
// node.node('name', {foo: 'bar'});  // create with attributes
// node.node('name', function(n) {   // create using builder syntax
//   n.attr('foo', 'bar');           // *
// });                               // *
// node = doc.root('name');          // create non-builder syntax
// node.attr('foo', 'bar');          // *
// node.remove();                    // remove
// n = libxml.Node('name');       // create standalone node
// node.node(n);                     //   then add it to the doc
// 
// /* Text Manipulation */
// node.text('some text'); // add
// node.text(null);        // clear
// 
