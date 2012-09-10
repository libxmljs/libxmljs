This page lists the API changes that occurred between the 0.4.x release and the 0.5.0 release. If you find that something was missed, please add it below.

## Node Creation
Node creation no longer takes a callback. This was changed to not give the appearance that the function is async. It returns immediately. This also simplifies code as you don't need to keep creating functions to use the new nodes.

Where you would previously do:

    doc.node('root', function(node) {
        node.node('child', function(child) {
        });
    });

You should now do:

    var root = doc.node('root');
    var child = root.node('child');

## Attributes
The attribute constructor no longer exists. To create an attribute just call the 'attr' method on a node. The constructor method was more verbose and error prone.

Old way

    var a = new libxmljs.Attribute(node, attr_name, attr_value);

New Way

    node.attr(attr_name, attr_value);

You can also pass an object to attr of key-value pairs to set multiple attributes.

## Sax Parsers

Sax parser is an event emitter. You can connect to all of the events after creating a sax parser using the typical event emitter api.

You can now do:

    var parser = new SaxPushParser();
    parser.on('startDocument', function() ... );

Sax parser constructor no longer takes a function to configure but instead an object which lists the callbacks.

Before you would do:

    var parser = new SaxPushParser(function(cb) {
        cb.onStartDocument(function() ... );
    });

You should now do (or better use the event emitter interface, see above):

    var parser = new SaxPushParser({
        startDocument: function() ...
    });

Or you can use the parser as an event emitter as described previously.

## Removed API

_parseHtmlFile_ and _parseXmlFile_ have been removed. Likewise, _SaxParser.parseFile_ has also been removed. If you want to read a file, use the nodejs file module instead.