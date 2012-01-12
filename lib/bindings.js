try {
    // node 0.6+
    module.exports = require('../build/Release/libxmljs');
} catch (e) {
    // node 0.4.x
    module.exports = require('../build/default/libxmljs');
}
