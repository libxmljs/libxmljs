"use strict";

const fs = require("fs");

const libxml = require("bindings")("xmljs");

// libxml.setDebugEnable();

const xml = fs.readFileSync("swig.xml").toString();

libxml.xmlLineNumbersDefault(1);
const doc = libxml.xmlReadMemory(xml, xml.length, "", "utf8", libxml.XML_PARSE_HUGE + libxml.XML_PARSE_BIG_LINES);

const xpathContext = libxml.xmlXPathNewContext(doc);

const symbols = [];
const functions = [];
const classes = [];
const typedefs = [];
const enums = [];
const constants = [];
const variables = [];

const reserved = [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
];

function couldBeNullPointer(name) {
    return /(Doc|Node|Element|Attr|Ns|Dtd)Ptr$/.test(name);
}

function sortByName(array) {
    return array.sort((a, b) => (a.name > b.name ? 1 : -1));
}

function sanitizeName(name) {
    if (reserved.indexOf(name) > -1) {
        return sanitizeName(`${name}Arg`);
    }

    return name;
}

function addSymbol(name) {
    if (symbols.indexOf(name) !== -1) {
        // console.log(`Symbol ${name} already exists!`);
    } else {
        symbols.push(name);
    }
}

function cType2JS(str, wrap_action) {
    if (/\b(string|char|xmlChar)\b/.test(str)) {
        return "string";
    }

    if (/\b(int|float|long|short|double|size_t)\b/.test(str)) {
        return "number";
    }

    if (/\b(bool)\b/.test(str)) {
        return "boolean";
    }

    if (/\b(void)\b/.test(str)) {
        return "any";
    }

    str = str.replace(/^p\.q\(const\)\.(.*)/, "$1Ptr");

    if (/xmlNs/.test(str)) {
        if (wrap_action && /Ptr\s*\*/.test(wrap_action)) {
            return "xmlNsPtr[]";
        }

        return "xmlNsPtr";
    }

    if (/xmlNodeSetPtr/.test(str)) {
        return "xmlNodePtr[]";
    }

    str = str.replace("struct ", "");

    if (/^_/.test(str)) {
        return `${str.replace(/^_/, "")}Ptr`;
    }

    const typeObj = typedefs.find((obj) => {
        return new RegExp(`\\b${obj.name}$`).test(str);
    });

    if (typeObj) {
        // if (/Ptr$/.test(typeObj.name)) {
        //     return `${typeObj.name} | null`;
        // }

        return typeObj.name;
    }

    return "undefined";
}

function getAttributes(node, attributes) {
    libxml.xmlXPathNodeEval(node, "./attribute|./attributelist/attribute", xpathContext).nodesetval.forEach((attr) => {
        // console.log(attr.type);
        let prop = attr.properties;
        let name = "";
        let value = "";

        while (prop !== null) {
            // console.log(prop.type);

            if (prop.name === "name") {
                name = prop.children.content;
            }

            if (prop.name === "value") {
                value = prop.children.content;
            }

            prop = prop.next;
        }

        attributes[name] = value;
    });

    return attributes;
}

let root = libxml.xmlDocGetRootElement(doc);

libxml.xmlXPathNodeEval(root, ".//class", xpathContext).nodesetval.forEach((node) => {
    const attributes = {
        props: [],
    };

    getAttributes(node, attributes);

    libxml.xmlXPathNodeEval(node, "./cdecl", xpathContext).nodesetval.forEach((param) => {
        attributes.props.push(getAttributes(param, {}));
    });

    addSymbol(attributes.name);
    classes.push(attributes);
});

libxml.xmlXPathNodeEval(root, ".//enum", xpathContext).nodesetval.forEach((node) => {
    const attributes = {
        items: [],
    };

    getAttributes(node, attributes);

    libxml.xmlXPathNodeEval(node, "./enumitem", xpathContext).nodesetval.forEach((param) => {
        const paramAttrs = getAttributes(param, {});

        attributes.items.push(paramAttrs);

        if (constants.indexOf(paramAttrs.name) === -1) {
            constants.push(paramAttrs);
        }

        addSymbol(paramAttrs.name);
    });

    enums.push(attributes);
});

libxml.xmlXPathNodeEval(root, ".//constant", xpathContext).nodesetval.forEach((node) => {
    const attributes = {
        props: [],
    };

    getAttributes(node, attributes);
    addSymbol(attributes.name);
    constants.push(attributes);
});

libxml
    .xmlXPathNodeEval(root, './/attribute[@name="kind"][@value="variable"]', xpathContext)
    .nodesetval.map((node) => {
        return node.parent;
    })
    .forEach((node) => {
        const attributes = {};

        getAttributes(node, attributes);

        addSymbol(attributes.name);

        variables.push(attributes);
    });

libxml
    .xmlXPathNodeEval(root, './/attribute[@name="kind"][@value="typedef"]', xpathContext)
    .nodesetval.map((node) => {
        return node.parent;
    })
    .forEach((node) => {
        const attributes = {
            template: null,
            props: [],
        };

        getAttributes(node, attributes);

        libxml.xmlXPathNodeEval(node, "./ancestor-or-self::template", xpathContext).nodesetval.forEach((param) => {
            attributes.template = getAttributes(param, {});
        });

        libxml.xmlXPathNodeEval(node, "./cdecl", xpathContext).nodesetval.forEach((param) => {
            attributes.props.push(getAttributes(param, {}));
        });

        addSymbol(attributes.name);
        typedefs.push(attributes);
    });

libxml
    .xmlXPathNodeEval(root, './/attribute[@name="kind"][@value="function"]', xpathContext)
    .nodesetval.map((node) => {
        return node.parent;
    })
    .forEach((node, index) => {
        const attributes = {
            constructor: null,
            params: [],
        };

        getAttributes(node, attributes);
        // console.log(attributes);

        libxml
            .xmlXPathNodeEval(node, "./ancestor-or-self::constructor|./ancestor-or-self::template", xpathContext)
            .nodesetval.forEach((param) => {
                // console.log(Object.keys(param).forEach((key) => {
                //     console.log(key);
                //     console.log(param[key]);
                // }));

                attributes.constructor = getAttributes(param, {});
            });

        libxml.xmlXPathNodeEval(node, "./parmlist/parm", xpathContext).nodesetval.forEach((param) => {
            const paramAttrs = getAttributes(param, {});

            if (!(paramAttrs.type === "void" && !paramAttrs.name)) {
                attributes.params.push(paramAttrs);
            }
        });

        // console.log(attributes)

        if (attributes.feature_ignore && attributes.feature_ignore === "1") {
            return;
        }

        addSymbol(attributes.name);
        functions.push(attributes);
    });

fs.writeFileSync(
    "lib/bindings/types.ts",
    `
    /**
     * This file was auto-generated by swig2ts.js
     */

    import { StructuredErrorCallback, GenericErrorCallback, FROM_BUFFER_ASYNC_TYPE } from "../types";
    
    ${sortByName(typedefs)
        .map((typedef) => {
            let declaration = ["type"];

            if (typedef.template) {
                return "";
            }

            const classObj = classes.find((obj) => {
                return `_${typedef.name}` === `${obj.name}Ptr`;
            });

            if (classObj || /Ptr$/.test(typedef.name)) {
                declaration = ["export", "type"];
            }

            return `
    ${declaration.join(" ")} ${typedef.name} = {${
                classObj
                    ? [
                          classObj.props
                              .map((prop) => {
                                  let type = cType2JS(prop.type);
                                  let maybeNull = couldBeNullPointer(type);

                                  return `
                ${prop.name}: ${maybeNull ? `${type} | null` : type},   // ${prop.type}`;
                              })
                              .join("") + "\n",
                          `getCPtr: {
                (): number,
            }`,
                      ].join("\n")
                    : ""
            }}`;
        })
        .join("")}

    export interface NativeBindings {
        /* Constants */
    
        ${sortByName(constants)
            .map((obj) => {
                if (!libxml.hasOwnProperty(obj.name)) {
                    return "";
                }

                return `
                ${obj.name}: ${cType2JS(obj.type)}`;
            })
            .join("")}
    
        /* Variables */
    
        ${sortByName(variables)
            .map((obj) => {
                if (!libxml.hasOwnProperty(obj.name) || obj.ismember === "1") {
                    return "";
                }

                return `
                ${obj.name}: ${cType2JS(obj.type)}`;
            })
            .join("")}
    
        /* Functions */
    
        withStructuredErrors: {
            <T>(callback: StructuredErrorCallback): T
        }
        
        withGenericErrors: {
            <T>(callback: GenericErrorCallback): T
        }

        ${sortByName(functions)
            .map((func) => {
                if (!libxml.hasOwnProperty(func.name)) {
                    return "";
                }

                if (func.constructor) {
                    return "";
                }

                let retVal = cType2JS(func.type, func.wrap_action);

                let maybeNull = couldBeNullPointer(retVal);

                return `
                    ${func.name}: {
                        /** ${func.params
                            .map((param, index) => {
                                param.jsType = cType2JS(param.type);

                                if (param.jsType === "string") {
                                    param.jsType = "string | Buffer | null";
                                }

                                if (/Ptr$/.test(param.jsType)) {
                                    param.jsType = `${param.jsType} | null`;
                                }

                                return `
                        * @param ${param.name || `arg${index}`} {${param.jsType}} ${param.type}`;
                            })
                            .join("")}
                        * @returns {${maybeNull ? `(${retVal} | null)` : retVal}} ${func.type}
                        */
                        (${func.params
                            .map((param, index) => {
                                return `${sanitizeName(param.name || `arg${index}`)}: ${param.jsType}`;
                            })
                            .join(", ")}): ${maybeNull ? `${retVal} | null` : retVal}
                    }
                `;
            })
            .join("")}
    
        fromBufferAsync: {
            /** 
            * @param type {FROM_BUFFER_ASYNC_TYPE} - type
            * @param buffer {string | Buffer} - p.q(const).char
            * @param size {number} - int
            * @param URL {string} - p.q(const).char
            * @param encoding {string} - p.q(const).char
            * @param options {number} - int
            * @param callback {Function} - callback
            * @returns xmlDocPtr - xmlDocPtr
            */
            (type: FROM_BUFFER_ASYNC_TYPE, buffer: string | Buffer, size: number, URL: string, encoding: string, options: number, callback: Function): xmlDocPtr
        }
                
        xmlPtrToXmlAttr: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlAttrPtr - xmlAttrPtr}
            */
            (arg0: any): xmlAttrPtr
        }
    
        xmlPtrToXmlDoc: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlDocPtr - xmlDocPtr}
            */
            (arg0: any): xmlDocPtr
        }
    
        xmlPtrToXmlDtd: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlDtdPtr - xmlDtdPtr}
            */
            (arg0: any): xmlDtdPtr
        }
    
        xmlPtrToXmlElement: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlElementPtr - xmlElementPtr}
            */
            (arg0: any): xmlElementPtr
        }
    
        xmlPtrToXmlNode: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlNodePtr - xmlNodePtr}
            */
            (arg0: any): xmlNodePtr
        }
    
        xmlPtrToXmlNs: {
            /** 
            * @param arg0 {any} - p.void
            * @returns {xmlNodePtr - xmlNsPtr}
            */
            (arg0: any): xmlNsPtr
        }
    }
    
    export type XMLReferenceType = xmlNodePtr | xmlDocPtr | xmlDtdPtr | xmlAttrPtr | xmlElementPtr | xmlNsPtr;
    
    `
        .replace("type htmlDocPtr =", "type htmlDocPtr = xmlDocPtr &")
        .replace("type xmlElementPtr =", "type xmlElementPtr = xmlNodePtr &")
);

fs.writeFileSync(
    "lib/bindings/constants.ts",
    `
/**
 * This file was auto-generated by swig2ts.js
 */

import bindings from "./index";
import {NativeBindings} from "./types";

export const {${
        // Object.keys(libxml).sort().map((key) => {
        //     return `
        //     ${key},`;
        // }).join('')

        sortByName(constants)
            .map((obj) => {
                if (!libxml.hasOwnProperty(obj.name)) {
                    return "";
                }

                return `
        ${obj.name},`;
            })
            .join("")
    }
} = bindings as NativeBindings;`
);

fs.writeFileSync(
    "lib/bindings/variables.ts",
    `
/**
 * This file was auto-generated by swig2ts.js
 */

import bindings from "./index";
import {NativeBindings} from "./types";

export const {${sortByName(variables)
        .map((obj) => {
            if (!libxml.hasOwnProperty(obj.name) || obj.ismember === "1") {
                return "";
            }

            return `
        ${obj.name},`;
        })
        .join("")}
} = bindings as NativeBindings;`
);

fs.writeFileSync(
    "lib/bindings/functions.ts",
    `
/**
 * This file was auto-generated by swig2ts.js
 */

import bindings from "./index";
import {NativeBindings} from "./types";

export const {${
        // Object.keys(libxml).sort().map((key) => {
        //     return `
        //     ${key},`;
        // }).join('')

        sortByName(functions)
            .map((func) => {
                if (!libxml.hasOwnProperty(func.name)) {
                    return "";
                }

                if (func.constructor) {
                    return "";
                }

                return `
        ${func.name},`;
            })
            .join("")
    }
    fromBufferAsync,
    xmlPtrToXmlNode,
    xmlPtrToXmlDoc,
    xmlPtrToXmlAttr,
    xmlPtrToXmlElement,
    xmlPtrToXmlDtd,
    xmlPtrToXmlNs,
    withStructuredErrors,
    withGenericErrors,
} = bindings as NativeBindings;`
);
