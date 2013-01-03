var libxml = require('../');

var doc = libxml.Document();
var elem = doc.node('name1');
var newChild = libxml.Element(doc, 'new-child');
elem.addChild(newChild);

var child1 = elem.node('child1');
var child2 = elem.node('child2', 'second');
var newChild = libxml.Element(doc, 'new-child');
var name2 = elem.node('name2');
name2.addChild(newChild);
child2.cdata('<h1>cdata test</h1>').cdata('<p>It\'s worked</p>').cdata('<hr/>All done');

console.log('Document with CDATA: %s', doc.toString());
