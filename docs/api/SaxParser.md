# SaxParser

libxmljs provides a SAX2 parser interface that can take a string, file. A SaxParser inherits from EventEmitter to emit parsing events.

### Constructor

#### new libxml.SaxParser()

>Instantiate a new SaxParser

### Methods

#### parser.parseString(string)

>Parse an in memory string
>return: boolean. true if no errors, false otherwise

>**args**
*string* - a string representing the document to parse

### Parse Events

#### startDocument

>Emitted at the start of a document

#### endDocument

>Emitted at the end of the document parse

#### startElementNS(elem, attrs, prefix, uri, namespace)

>Emitted on an open element tag

>**args**
*elem* - a string representing the element name
*attrs* - an array of arrays: `[[key, prefix, uri, value]]`
*prefix* - a string representing the namespace prefix of the element
*uri* - the namespace URI of the element
*namespaces* - an array of arrays: `[[prefix, uri]]`

#### endElementNS(elem, prefix, uri)

>Emitted at the close of an element

>**args**
*elem* - a string representing the element name
*prefix* - a string representing the namespace prefix of the element
*uri* - the namespace URI of the element

#### characters(chars)

>Emitted when a set of content characters is encountered

>**args**
*chars* - a string of characters

#### cdata(cdata)

>Emitted when a CDATA is encountered

>**args**
*cdata* - a string representing the CDATA

#### comment(msg)

>Emitted when a comment is encountered

>**args**
*msg* - a string representing the comment

#### warning(msg)

>Emitted when a warning is encountered

>**args**
*msg* - a string representing the warning message

#### error(msg)

>Emitted when an error is encountered

>**args**
*msg* - a string representing the error message

