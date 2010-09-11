# Element

The Element class represents an element node in the XML tree.

### Constructor


#### new libxmljs.Element(doc, name)

>Creates a new element object called name

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, content)

>Creates a new element object called name with content as its content

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*content* - a string representing the content to add to the node  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, attrs)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a hash of {name: value} pairs to set as attributes  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, callback)

>Creates a new element object called name then calls callback passing the
            new object as an argument.

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*callback* - a function that will accept the new object as an argument  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, attrs, content)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a has of {name: value} pairs to set as attributes  
*content* - a string representing the content to add to the node  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, attrs, callback)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a has of {name: value} pairs to set as attributes  
*callback* - a function that will accept the new object as an argument  


>**returns**  a new element object

#### new libxmljs.Element(doc, name, attrs, content, callback)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a has of {name: value} pairs to set as attributes  
*content* - a string representing the content to add to the node  
*callback* - a function that will accept the new object as an argument  


>**returns**  a new element object

### Methods


#### element.addChild(child)

>Add a child node to the node

>**args**  
*child* - a node object to be added as a child  


>**returns**  the current element object

#### element.attr(name)

>Get the attribute called name

>**args**  
*name* - a string representing the name of the attribute  


>**returns**  an attribute node or null

#### element.attr([attr hash])

>Create a set of attributes from a hash

>**args**  
*attr hash* - a has of {name: value} pairs  


>**returns**  the element object

#### element.attr(attr)

>Add an attribute object to the node

>**args**  
*attr* - an attribute object  


>**returns**  the element object

#### element.attrs()

>Get the list of attributes attached to the node

>**returns**  an array of attribute objects

#### element.child(idx)

>Get the idxth child of the root element

>**args**  
*idx* - a zero indexed integer representing the child element to return  


>**returns**  a element object or null

#### element.childNodes()

>Get all the node's children

>**returns**  an array of element objects

#### element.defineNamespace(href)

>Define a new namespace on the node using href for the URI.
This will only define the namespace but wont add it to the node

>**args**  
*href* - a string representing the URI for the new namespace  


>**returns**  the new namespace

#### element.defineNamespace(prefix, href)

>Define a new namespace on the node using href for the URI and prefix 
as the prefix. This will only define the namespace but wont add it to the node

>**args**  
*prefix* - a string representing the prefix for the new namespace  
*href* - a string representing the URI for the new namespace  


>**returns**  the new namespace

#### element.doc()

>Get the document object containing the element

>**returns**  the document object

#### element.find(xpath)

>Search the element's children by xpath

>**args**  
*xpath* - must be a string representing the xpath to search  


>**returns**  an array of element objects

#### element.find(xpath, ns_uri)

>Search the element's children by xpath within the uri namespace

>**args**  
*xpath* - must be a string representing the xpath to search  
*ns_uri* - must be a string representing the namespace uriExample


>**returns**  an array of element objects

>**example**
    element.find("xmlns:child-name", "http://www.example.com/xmlns")

#### element.get(xpath, ns_uri)

>This this is syntactic sugar for find(xpath, ns_uri)[0]

>**returns**  a element object or null

#### element.find(xpath, namespaces)

>Search the element's children by xpath within the uri namespace

>**args**  
*xpath* - must be a string representing the xpath to search  
*namespaces* - must be a hash representing the namespacesExample

>**returns**  an array of element objects

>**example**
    doc.find("ns-1:child-name", {"ns-1":"http://www.example.com/xmlns"});
    doc.find("ns-1:child1/ns-2:child2", {"ns-1": "http://www.example.com/xmlns/1"
                                         ,"ns-2": "http://www.example.com/xmlns/2"});  

#### element.get(xpath, ns_uri)

>This this is syntactic sugar for find(xpath, namespaces)[0]

>**returns**  a element object or null

#### element.name()

>Get the name of the element

>**returns**  a string representing the name of the element

#### name(new_name)

>Set the name of the element

>**args**  
*new_name* - a string representing the new name of the element  


>**returns**  the element object

#### element.namespace()

>Get the node's namespace

>**returns**  a namespace object or null

#### element.namespace(ns)

>Set the node's namespace to ns

>**args**  
*ns* - a namespace object  


>**returns**  the element object

#### element.namespace(href)

>Add namespace with href as the URI to the node. 
This will search up the tree to find a namespace 
with the given href and, if found will use it. 
Otherwise it will create a new namespace.

>**args**  
*href* - a string representing the namespace URI  


>**returns**  the namespace object

#### element.namespace(prefix, href)

>Add namespace with href as the URI and prefix as the prefix to the node
            This will search up the tree to find a namespace with the given href and, if
            found will use it. Otherwise it will create a new namespace.

>**args**  
*prefix* - a string representing the namespace prefix  
*href* - a string representing the namespace URI  


>**returns**  the namespace object

#### element.nextSibling()

>Get the next sibling

>**returns**  a node object or null

#### element.nextElement()

>Get the next element sibling

>**returns**  an element object or null

#### element.parent()

>Get the parent node

>**returns**  an element object or the document if the node is root node

#### element.path()

>Get the xPath of the element

>**returns**  a string representing the xPath of the element

#### element.prevSibling()

>Get the previous sibling

>**returns**  a node object or null

#### element.prevSibling()

>Get the previous element sibling

>**returns**  an element object or null

#### element.remove()

>Remove the node from the context

>**returns**  the node

#### element.text()

>Get the text content of the element

>**returns**  a string representing the content of the element

