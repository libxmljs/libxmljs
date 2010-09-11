# Parser

A document can be parsed as a string or a file. Once parsed an object holding
the document as a set of javascript objects is returned

### Methods


#### libxmljs.parseXmlString(string)

>Parse an in-memory XML string

>**args**  
*string* - a string representing the document to parse  


>**returns**  an XmlDocument object

#### libxmljs.parseXmlFile(filename)

>Parse an XML file

>**args**  
*filename* - a string representing the filename of the document  


>**returns**  an XmlDocument object

#### libxmljs.parseHtmlString(string)

>Parse an in-memory HTML string

>**args**  
*string* - a string representing the document to parse  


>**returns**  an HtmlDocument object

#### libxmljs.parseHtmlFile(filename)

>Parse an HTML file

>**args**  
*filename* - a string representing the filename of the document  


>**returns**  an HtmlDocument object

