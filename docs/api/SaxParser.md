# SaxParser

libxmljs provides a SAX2 parser interface that can take a string, file.

### Constructor


#### new libxml.SaxParser()

>Instantiate a new SaxParser

#### new libxml.SaxParser(callback)

>Instantiate a new SaxParser

>**args**  
*callback* - a function that accepts the new sax parser as an argument  


### Methods


#### parser.parseString(string)

>Parse an in memory stringreturn: boolean. true if no errors, false otherwise

>**args**  
*string* - a string representing the document to parse  


#### parser.parseFile(filename)

>Parse a filereturn: boolean. true if no errors, false otherwise

>**args**  
*filename* - a string representing the file to be parsed  


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


