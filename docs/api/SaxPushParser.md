# SaxPushParser

libxmljs provides a SAX2 push parser interface that accepts chunks of data.

### Constructor


#### new libxmljs.SaxPushParser()

>Instantiate a new SaxParser

#### new libxmljs.SaxPushParser(callback)

>Instantiate a new SaxParser

>**args**  
*callback* - a function that accepts the new sax parser as an argument  


### Methods


#### parser.push(string)

>Push a chunk of data into the parserreturn: boolean. true if no errors, false otherwise

>**args**  
*string* - a string representing the document to parse  


#### parser.onStartDocument(function() {})

>Called at the start of a document

#### parse.onEndDocument(function() {})

>Called at the end of the document parse

#### parser.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {})

>Called on an open element tag

>**args**  
*elem* - a string representing the element name  
*attrs* - an array of arrays: `[[key, prefix, uri, value]]`  
*prefix* - a string representing the namespace prefix of the element  
*uri* - the namespace URI of the element  
*namespaces* - an array of arrays: `[[prefix, uri]]`  


#### parser.onEndElementNS(function(elem, prefix, uri) {})

>Called at the close of an element

>**args**  
*elem* - a string representing the element name  
*prefix* - a string representing the namespace prefix of the element  
*uri* - the namespace URI of the element  


#### parser.onCharacters(function(chars) {})

>Called when a set of content characters is encountered

>**args**  
*chars* - a string of characters  


#### parser.onCdata(function(cdata) {})

>Called when a CDATA is encountered

>**args**  
*cdata* - a string representing the CDATA  


#### parser.onComment(function(msg) {})

>Called when a comment is encountered

>**args**  
*msg* - a string representing the comment  


#### parser.onWarning(function(msg) {})

>Called when a warning is encountered

>**args**  
*msg* - a string representing the warning message  


#### parser.onError(function(msg) {})

>Called when an error is encountered

>**args**  
*msg* - a string representing the error message  


### Examples

Here's an extended example of using the sax push parser to recreate an xml document.

[http://gist.github.com/484083](http://gist.github.com/484083)
