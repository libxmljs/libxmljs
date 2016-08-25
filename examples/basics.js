const libxml = require('libxmljs')
, parser = new libxml.SaxParser()

const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
              '<root>' +
                '<child foo="bar" other="attr">' +
                  '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
                '</child>' +
              '<sibling>with content!</sibling>' +
            '</root>';

let xmlDoc = libxml.parseXmlString(xml)

let children = xmlDoc.root().childNodes()
let child = children[0]
let attributes = child.attrs()

for (key in attributes) {
  console.log(attributes[key].value())
}
//output
//bar
//other
