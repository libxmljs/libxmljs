var libxml = require('../index');

module.exports.get = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root');
    var child = root.node('child');
    var grandchild = child.node('grandchild');

    // on document
    assert.equal(child, doc.get('child'));

    // nested
    assert.equal(grandchild, doc.get('child').get('grandchild'));
    assert.done();
};

module.exports.get_missing = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root');

    var missing = doc.get('missing/text()');
    assert.equal(missing, undefined);
    assert.done();
};

module.exports.get_attr = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root');
    var child = root.node('child');
    child.attr('attr', 'val');
    var attr = child.attr('attr');

    // on document
    assert.equal(attr, doc.get('//@attr'));
    assert.equal('val', doc.get('//@attr').value());

    // nested
    assert.equal(attr, doc.get('child').get('@attr'));
    assert.equal('val', doc.get('child').get('@attr').value());

    // check again after re-parsign the doc
    doc = libxml.parseXml(doc.toString())
    assert.equal('val', doc.get('//@attr').value());
    assert.equal('val', doc.get('child').get('@attr').value());
    assert.equal(doc.get('child'), doc.get('//@attr').node());

    assert.done();
};

module.exports.get_non_nodeset = function(assert) {
    var doc = libxml.Document();
    var root = doc.node('root');

    assert.equal(true, doc.get('true()'));
    assert.equal(false, doc.get('false()'));
    assert.equal('Hello, world!', doc.get('"Hello, world!"'));
    assert.equal(1.23, doc.get('1.23'));
    assert.done();
};

module.exports.find = function(assert) {
    var children = [];
    var doc = libxml.Document();
    var root = doc.node('root');
    children.push(root.node('child'));
    children.push(root.node('child'));

    var results = doc.find('child');
    assert.equal(2, children.length);
    assert.equal(2, results.length);

    for (var child = 0; child < children.length; ++child) {
        assert.equal(children[child], results[child]);
    }

    assert.done();
};

var uri = 'nsuri';
var prefix = 'pefname';

// non prefixed namespaces
module.exports.namespace = {
    get: function(assert) {
        var doc = libxml.Document();
        var root = doc.node('root');
        var child = root.node('child');
        var grandchild = child.node('grandchild');
        grandchild.namespace(uri);

        // on document
        assert.equal(child, doc.get('child'));

        // nested
        assert.equal(grandchild, doc.get('child').get('xmlns:grandchild', uri));
        assert.done();
    },
    find: function(assert) {
        var children = [];
        var doc = libxml.Document();
        var root = doc.node('root');
        children.push(root.node('child'));
        children.push(root.node('child'));

        var ns = children[0].namespace(uri).namespace();
        children[1].namespace(ns);

        var results = doc.find('xmlns:child', uri);
        assert.equal(2, children.length);
        assert.equal(2, results.length);
        for (var child = 0; child < children.length; ++child) {
            assert.equal(children[child], results[child]);
        }
        assert.done();
    }
};

module.exports.prefixed_namespace = {
    get: function(assert) {
        var doc = libxml.Document();
        var root = doc.node('root');
        var child = root.node('child');
        var grandchild = child.node('grandchild');
        grandchild.namespace(prefix, uri);

        // on document
        assert.equal(child, doc.get('child'));

        var ns_params = {
            pefname: uri
        };

        // nested
        assert.equal(grandchild, doc.get('child').get('pefname:grandchild', ns_params));
        assert.done();
    },
    find: function(assert) {
        var children = [];
        var doc = libxml.Document();
        var root = doc.node('root');
        children.push(root.node('child'));
        children.push(root.node('child'));

        var ns = children[0].namespace(prefix, uri).namespace();
        children[1].namespace(ns);

        var ns_params = {
            pefname: uri
        };

        var results = doc.find('pefname:child', ns_params);
        assert.equal(2, children.length);
        assert.equal(2, results.length);
        for (var child = 0; child < children.length; ++child) {
            assert.equal(children[child], results[child]);
        }
        assert.done();
    }
};

