var bindings = require('../build/Release/libxmljs');

var Element = bindings.Element;

Element.prototype.attr = function() {
    if (arguments.length === 1) {
        var arg = arguments[0];
        if (typeof arg === 'object') {
            // object setter
            // iterate keys/value to set attributes
            for (var k in arg) {
                this._attr(k, arg[k]);
            };
            return this;
        } else if (typeof arg === 'string') {
            // getter
            return this._attr(arg);
        }
    } else if (arguments.length === 2) {
        // 2 arg setter
        var name = arguments[0];
        var value = arguments[1];
        this._attr(name, value);
        return this;
    }
};

/// helper method to attach a new node to this element
/// @param name the element name
/// @param [content] element content
Element.prototype.node = function(name, content) {
    var elem = new Element(this.doc(), name, content);
    this.addChild(elem);
    return elem;
};

Element.prototype.get = function() {
    return this.find.apply(this, arguments)[0];
};

Element.prototype.defineNamespace = function(prefix, href) {
    // if no prefix specified
    if (!href) {
        href = prefix;
        prefix = null;
    }
    return new bindings.Namespace(this, prefix, href);
};

/// create a new element on the given document
/// @param doc the Document to create the element for
/// @param name the element name
/// @param [content] element content
module.exports.new = function(doc, name, content) {
    if (!doc) {
        throw new Error('document argument required');
    } else if (!name) {
        throw new Error('name argument required');
    }

    var elem = new Element(doc, name, content);
    return elem;
};
