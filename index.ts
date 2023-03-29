"use strict";

const version = require("../package.json").version;

/**
 * packageDocumentation
 * @module libxmljs
 */

export * from "./lib/api";
export * from "./lib/types";

import { __xmlParserVersion, getMemUsed as memoryUsage, getNodeCount as nodeCount} from "./lib/bindings/functions";
import { VERSION } from "./lib/bindings/constants";
import { libxmljs_debug } from "./lib/bindings/variables";
export { XMLDocument } from "./lib/document";
export { XMLNode, XMLElement, XMLAttribute, XMLNamespace } from "./lib/node";

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

import * as api from "./lib/api"
import * as types from "./lib/types";

export default {
    version,
    libxml_version,
    libxml_parser_version,
    libxml_debug_enabled,
    memoryUsage,
    nodeCount,
    ...api,
    ...types
};
