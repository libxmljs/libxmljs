# Attribute

The Attribute object represents an element attribute.

## Constructor


### new libxml.Attribute(node, name, value)

>Creates a new attribute on node with name and value

>**args**  
*node* - an element node object to attach the attribute to  
*name* - a string representing the name of the attribute  
*value* - a string representing the value of the attribute  


>**returns**  a new attribute object

### new libxml.Attribute(node, name, value, ns)

>Creates a new attribute on node with name and value under the ns
            namespace

>**args**  
*node* - an element node object to attach the attribute to  
*name* - a string representing the name of the attribute  
*value* - a string representing the value of the attribute  
*ns* - a namespace object  


>**returns**  a new attribute object

## Methods


### attribute.name()

>Get the attribute name

>**returns**  a string representing the name of the attribute

### attribute.namespace()

>See Element#namespace()

### attribute.namespace(ns)

>See Element#namespace(ns)

### attribute.nextSibling()

>Get the next sibling

>**returns**  an attribute object or null

### attribute.node()

>Get the node the attribute is attached to
            

>**returns**  an element object

### attribute.prevSibling()

>Get the previous sibling

>**returns**  an attribute object or null

### attribute.remove()

>Remove the node from the context

>**returns**  the attribute

### attribute.value()

>Get the value of the attribute

>**returns**  a string representing the attribute's value

