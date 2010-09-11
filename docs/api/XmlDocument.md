# XmlDocument

The Document class represents an XML document. It can be created by
instantiating an object using the "new" keyword or by parsing a document.

### Constructor


#### new libxmljs.Document();

>Instantiate a new document object defaulting the version to 1.0 and the
encoding to UTF-8.

>**returns**  a new document object

#### new libxmljs.Document(callback);

>Instantiate a new document object defaulting the version to 1.0 and the
encoding to UTF-8.

>**args**  
*callback* - a function that accepts the new document object  


>**returns**  a new document object

#### new libxmljs.Document(version);

>Instantiate a new document setting the version to version and defaulting
the encoding to UTF-8.

>**args**  
*version* - a string representing the desired document version  


>**returns**  a new document object

#### new libxmljs.Document(version, callback);

>Instantiate a new document setting the version to version and defaulting
the encoding to UTF-8.

>**args**  
*version* - a string representing the desired document version  
*callback* - a function that accepts the new document object  


>**returns**  a new document object

#### new libxmljs.Document(version, encoding);

>Instantiate a new document setting the version to version and the encoding
to encoding.

>**args**  
*version* - a string representing the desired document version  
*encoding* - a string representing the desired document encoding  


>**returns**  a new document object

#### new libxmljs.Document(version, encoding, callback);

>Instantiate a new document setting the version to version and the encoding
to encoding.

>**args**  
*version* - a string representing the desired document version  
*encoding* - a string representing the desired document encoding  
*callback* - a function that accepts the new document as an argument  


>**returns**  a new document object

### Methods


#### doc.child(idx)

>A convenience method to get the idxth child of the root element
See Element#child for more information

>**args**  
*idx* - a zero indexed integer representing the child element to return  


>**returns**  a element object or null

#### doc.childNodes()

>Get all the children of the root node

>**returns**  an array of element objects

#### doc.document()

>A convenience method that 

>**returns**  the document object

#### doc.errors()

>An array of recoverable errors encountered while parsing the document

>**returns**  an array of SyntaxErrors

#### doc.encoding()

>Gets the document's encoding

>**returns**  a string representation of the document encoding

#### doc.encoding(enc)

>Sets the document's encoding

>**args**  
*enc* - must be a string representing the desired encoding  


>**returns**  the document object

#### doc.find(xpath)

>A convenience method to search the document starting at the root node
See Element#find for more information

>**args**  
*xpath* - must be a string representing the xpath to search  


>**returns**  an array of element objects

#### doc.get(xpath)

>A convenience method to search the document and get the first node in the
results
See Element#get for more information

>**returns**  a element object or null

#### doc.node([args])

>A convenience method for creating and setting the root node
See new libxmljs.Element for the full spec

#### doc.root()

>The root element of the document

>**returns**  an element object or null

#### doc.toString()

>Renders the document to a string

>**returns**  a string representation of the document

#### doc.version()

>Gets the document version.

>**returns**  a string representation of the document version

