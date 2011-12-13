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

        var ns = children[0].namespace(uri);
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

        var ns = children[0].namespace(prefix, uri);
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

