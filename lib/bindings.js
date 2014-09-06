try {
	module.exports = require('bindings')('xmljs');
} catch (e) {
	e.message += '\n\nThis error might be caused by an installation failure or by an older node-gyp version bundled in your npm.';
	e.message += '\nYou can update node-gyp using these instructions : https://github.com/TooTallNate/node-gyp/wiki/Updating-npm\'s-bundled-node-gyp';
	e.message += '\nThen run \'npm install\' again.\n';
	throw e;
}