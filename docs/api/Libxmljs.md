# Libxmljs 

The module export object that comes from `require('libxmljs')`

### Properties


**version**  

>Get the current version of libxml.js

>**returns** a string

**libxml_version**  

>Get the compiled version of libxml

>**returns** a string

**libxml_parser_version**  

>Get the loaded version of libxml

>**returns** a string

### Functions

**parseXmlString(string)**

>Parse the string as xml and return a Document object. Throws if there was an error parsing

>**returns** a Document

**parseHtmlString(string)**

>Parse the string as html and return a Document object. Throws if there was an error parsing

>**returns** a Document
