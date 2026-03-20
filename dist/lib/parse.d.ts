import { HTMLParseOptions, XMLParseOptions } from "./types";
import { HTMLDocument, XMLDocument } from "./document";
import { XMLSchema } from "./schema";
export declare const parseXml: (buffer: string | Buffer, options?: XMLParseOptions) => XMLDocument;
export declare const parseSchema: (buffer: string | Buffer, options?: XMLParseOptions) => XMLSchema;
export declare const parseHtml: (buffer: string | Buffer, options?: HTMLParseOptions) => HTMLDocument;
export declare const parseHtmlAsync: (buffer: string | Buffer, options?: HTMLParseOptions) => Promise<HTMLDocument>;
export declare const parseXmlAsync: (buffer: string | Buffer, options?: XMLParseOptions) => Promise<XMLDocument>;
