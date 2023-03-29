
const version = require("../../package.json").version;

import { __xmlParserVersion, getMemUsed as memoryUsage, getNodeCount as nodeCount} from "./bindings/functions";
import { VERSION } from "./bindings/constants";
import { libxmljs_debug } from "./bindings/variables";

/**
 * Get the current version of libxml.js
 * @type {string}
 */
export { version };

const libxml_version = VERSION;

/**
 * Get the compiled version of libxml
 * @type {string}
 */
export { libxml_version };

const libxml_parser_version = __xmlParserVersion();

/**
 * Get the loaded version of libxml
 * @type {string}
 */
export { libxml_parser_version };

const libxml_debug_enabled = !!libxmljs_debug;

/**
 * Is debugging inabled
 * @type {boolean}
 */
export { libxml_debug_enabled };

/**
 * Get the amount of memory allocated by libxml
 * @returns {number} - number of bytes
 */
export { memoryUsage };

/**
 * Get the number of nodes that haven't been freed
 * @returns {number} - number of nodes
 */

export { nodeCount };