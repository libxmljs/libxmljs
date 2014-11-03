# API overhaul

## Implementation approach

**definitions**
* v8 types/methods - Handles, Nan, AddChild etc.
* libxmljs types/methods - XmlNode, XmlElement, add_child, etc.
* libxml types/functions - types, functions from libxml2

#### js methods
* arguments
    * check types
    * do we do string conversions?
    * throw errors on bad or missing args
* when do we fail silently?
    * when the args don't actually mutate the tree?

#### v8 methods
* arguments
    * pull args and unwrap libxmljs types
    * can we always assume correct args due to js layer? 
* manage scopes
* manage js return values
* try to avoid manipulating libxml types in this layer
* try to avoid libxml functions in this layer
* libxml methods
    * pass in libxml types (do null checks here)
    * get libxml return types and wrap them

#### libxml methods
* arguments
    * encode text content (don't forget to free)
    * import nodes before adding
* try to avoid v8 types and methods in this layer
* try to avoid libxmljs and v8 types in this layer
* try to avoid libxmljs methods in this layer
* functions or macros for common actions
    * encoding text
