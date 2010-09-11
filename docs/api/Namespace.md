# Namespace

Namespace is a an object representing the namespace of a specific node.

### Constructor

#### new libxmljs.Namespace(node, prefix, href)

>Creates a new namespace object defined on nodeThis will not set the namespace to the node

>**args**  
*node* - a node object to carry the namespace definition  
*prefix* - a string or null representing the desired prefix  
*href* - a string representing the URI of the namespace  


>**returns**  a new namespace object

### Methods

#### namespace.href()

>Get the href of the namespace

>**returns**  a string representing the URI of the namespace

#### namespace.prefix()

>Get the prefix of the namespace

>**returns**  a string representing the namespace's prefix or null
