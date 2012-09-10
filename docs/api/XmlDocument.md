# XmlDocument

The Document class represents an XML document. It can be created by
instantiating an object using the "new" keyword or by parsing a document.

## Constructor

### new libxmljs.Document(version, encoding);

>Instantiate a new document setting the version to version and the encoding
to encoding.

>**args**  
*version* - a string representing the desired document version (default '1.0')
*encoding* - a string representing the desired document encoding (default 'utf8') 


>**returns**  a new document object

## Methods


### doc.child(idx)

>A convenience method to get the idxth child of the root element
See Element#child for more information

>**args**  
*idx* - a zero indexed integer representing the child element to return  


>**returns**  a element object or null

### doc.childNodes()

>Get all the children of the root node

>**returns**  an array of element objects

### doc.errors()

>An array of recoverable errors encountered while parsing the document

>**returns**  an array of SyntaxErrors

### doc.encoding()

>Gets the document's encoding

>**returns**  a string representation of the document encoding

### doc.encoding(enc)

>Sets the document's encoding

>**args**  
*enc* - must be a string representing the desired encoding  


>**returns**  the document object

### doc.find(xpath)

>A convenience method to search the document starting at the root node
See Element#find for more information

>**args**  
*xpath* - must be a string representing the xpath to search  


>**returns**  an array of element objects

### doc.get(xpath)

>A convenience method to search the document and get the first node in the
results
See Element#get for more information

>**returns**  a element object or null

### doc.node(name, content)

>A convenience method for creating and setting the root node

>**args**
*name* - the tag name
*content* - text content of the node (a string)

>**returns** the newly created node

### doc.root()

>The root element of the document

>**returns**  an element object or null

### doc.toString()

>Renders the document to a string

>**returns**  a string representation of the document

### doc.version()

>Gets the document version.

>**returns**  a string representation of the document version

