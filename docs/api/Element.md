# Element

The Element class represents an element node in the XML tree.
*Inherits from Node*

### Constructor


#### new libxml.Element(doc, name)  
> Creates a new element object called name

> **args**  
*doc* - a Document object to provide context for the node  
*name* - a string representing the name of the element  

#### new libxml.Element(doc, name, attrs)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a hash of {name: value} pairs to set as attributes  

#### new libxml.Element(doc, name, attrs, content)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a hash of {name: value} pairs to set as attributes  
*content* - a string representing the content to add to the node  
*callback* - a function that will accept the new object as an argument

#### new libxml.Element(doc, name, attrs, content, callback)

>Creates a new element object called name with attrs as its attributes

>**args**  
*doc* - a document object to provide context for the node  
*name* - a string representing the name of the element  
*attrs* - a hash of {name: value} pairs to set as attributes  
*content* - a string representing the content to add to the node  
*callback* - a function that will accept the new object as an argument

### Methods

#### element.name()

>Get the name of the element

>**returns** - a string representing the name of the element


#### element.name(new_name)

>Set the name of the element

>**args**  
*new_name* - a string representing the new name of the element

>**returns** - the Element object


#### element.text()

>Get the text content of the element

>**returns** - a string representing the content of the Element
  including the text() of all child Nodes


#### element.attr(name)

>Get the Attribute called name

>**args**  
*name* - a string representing the name of the attribute  

>**returns** - an Attribute node or null


#### element.attr(attr)

>Add an Attribute object to the element

>**args**  
*attr* - an Attribute node  

>**returns** - the element node (not the attribute)


#### element.attr(attrObject)

>Create a set of attributes from a hash and add them to the element

>**args**  
*attr* - an object of {name: value} pairs  

>**returns** - the element object


#### element.attrs()

>Get the list of attributes attached to the element

>**returns** - an array of Attribute objects. may be empty


#### element.parent()

>Get the parent element

>**returns** - an Element node or the Document if this is the root node


#### element.doc()

>Get the document object containing the element

>**returns** - a Document object


#### element.child(idx)

>Get a child node by index

>**args**  
*idx* - a zero indexed integer representing the child node to return  

>**returns** - a Node object or null


#### elements.childNodes()

>Get a list of all the immediate children of the element

>**returns** - an array of Nodes, including text nodes


#### element.addChild(child)

>Add a child node to the node

>**args**  
*child* - an Element node to be added as a child  

>**returns** - the element node (not the child)


#### element.nextSibling()

>Get the next sibling node

>**returns** - a Node object or null


#### element.nextElement()

>Get the next element sibling

>**returns** - an Element node or null


#### element.addNextSibling(siblingNode)

>Add a Node as a sibling immediately after this element

>**args**  
*siblingNode* - a Node to add as a sibling

>**returns** - the sibling object


#### element.prevSibling()

>Get the previous sibling node

>**returns** - a Node object or null


#### element.prevElement()

>Get the previous element sibling

>**returns** - an Element object or null


#### element.addPrevSibling(siblingNode)

>Add a Node as a sibling immediately before this element

>**args**  
*siblingNode* - a Node to add as a sibling

>**returns** - the sibling object


#### element.find(xpath)

>Search the element's children by xpath

>**args**  
*xpath* - a string representing the xpath to search  

>**returns** - an array of Node objects. may be empty


#### element.find(xpath, ns_uri)

>Search the element's children by xpath within the URI namespace

>**args**  
*xpath* - a string representing the xpath to search  
*ns_uri* - a string representing the namespace URI  

>**returns** - an array of Node objects

*example*  
    doc.find("xmlns:child-name", "ns:uri")


#### element.get(xpath, ns_uri)

>Return the first node node that matches the xpath expression  
This this is syntactic sugar for `find(xpath, ns_uri)[0]`

>**args**  
*xpath* - a string representing the xpath to search  
*ns_uri* - a string representing the namespace URI  

>**returns** - a Node or null


#### element.find(xpath, namespaces)

>Search the element's children by xpath within any of the URI  
namespaces

>**args**  
*xpath* - a string representing the xpath to search  
*namespaces* - a hash representing the namespaces  

>**returns** - an array of Node objects

*example*  
    doc.find("ns-1:child-name", {"ns-1": "ns:uri"})
    doc.find("ns-1:child1/ns-2:child2", {"ns-1": "ns:uri1", "ns-2": "ns:uri2"})


#### element.get(xpath, ns_uri)

>Return the first node that matches the xpath  
This is syntactic sugar for `find(xpath, namespaces)[0]`

>**returns** - a element object or null


#### element.defineNamespace(href)

>Define a new namespace on the element using href for the URI.  This
will only define the namespace but wont add it to the node

>**args**  
*href* - a string representing the URI of the new namespace  

>**returns** - the new Namespace object


#### element.defineNamespace(prefix, href)

>Define a new namespace on the element using href for the URI and
prefix as the prefix. This will only define the namespace but wont add
it to the node

>**args**  
*prefix* - a string representing the prefix for the new namespace  
*href* - a string representing the URI for the new namespace  

>**returns** - the new Namespace object


#### element.namespace()

Get the elements's namespace

>**returns** - a Namespace object or null


#### element.namespace(ns)

>Set the element's namespace to ns

>**args**  
*ns* - a Namespace object  

>**returns** - the element object


#### element.namespace(href)

>Add namespace with href as the URI to the element.  This will search
up the tree to find a namespace with the given href and, if found will
use it. Otherwise it will create a new namespace.

>**args**  
*href* - a string representing the namespace URI  

>**returns** - the namespace object


#### element.namespace(prefix, href)

>Add namespace with href as the URI and prefix as the prefix to the
node. This will search up the tree to find a namespace with the given
href and, if found will use it. Otherwise it will create a new
namespace.

>**args**  
*prefix* - a string representing the namespace prefix  
*href* - a string representing the namespace URI  

>**returns** - the Namespace object


#### element.remove()

>Remove The element from the context

>**returns** - the Element


#### element.path()

>Get the xpath of the element

>**returns** - a string representing the xpath of the element
