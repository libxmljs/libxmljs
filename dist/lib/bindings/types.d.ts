import { StructuredErrorCallback, GenericErrorCallback, FROM_BUFFER_ASYNC_TYPE } from "../types";
type attributeDeclSAXFunc = {};
type cdataBlockSAXFunc = {};
type charactersSAXFunc = {};
type commentSAXFunc = {};
type elementDeclSAXFunc = {};
type endDocumentSAXFunc = {};
type endElementNsSAX2Func = {};
type endElementSAXFunc = {};
type entityDeclSAXFunc = {};
type errorSAXFunc = {};
type externalSubsetSAXFunc = {};
type fatalErrorSAXFunc = {};
type getEntitySAXFunc = {};
type getParameterEntitySAXFunc = {};
type hasExternalSubsetSAXFunc = {};
type hasInternalSubsetSAXFunc = {};
export type htmlDocPtr = xmlDocPtr & {};
type htmlElemDesc = {};
export type htmlElemDescPtr = {
    name: string;
    startTag: string;
    endTag: string;
    saveEndTag: string;
    empty: string;
    depr: string;
    dtd: string;
    isinline: string;
    desc: string;
    subelts: string;
    defaultsubelt: string;
    attrs_opt: string;
    attrs_depr: string;
    attrs_req: string;
    getCPtr: {
        (): number;
    };
};
type htmlEntityDesc = {};
export type htmlEntityDescPtr = {
    value: number;
    name: string;
    desc: string;
    getCPtr: {
        (): number;
    };
};
export type htmlNodePtr = {};
export type htmlParserCtxtPtr = {};
export type htmlParserInputPtr = {};
export type htmlSAXHandlerPtr = {};
type htmlStatus = {};
type ignorableWhitespaceSAXFunc = {};
type internalSubsetSAXFunc = {};
type isStandaloneSAXFunc = {};
type notationDeclSAXFunc = {};
type processingInstructionSAXFunc = {};
type referenceSAXFunc = {};
type resolveEntitySAXFunc = {};
type setDocumentLocatorSAXFunc = {};
type startDocumentSAXFunc = {};
type startElementNsSAX2Func = {};
type startElementSAXFunc = {};
type unparsedEntityDeclSAXFunc = {};
type warningSAXFunc = {};
type xlinkExtendedLinkFunk = {};
type xlinkExtendedLinkSetFunk = {};
export type xlinkHandlerPtr = {
    simple: xlinkSimpleLinkFunk;
    extended: xlinkExtendedLinkFunk;
    set: xlinkExtendedLinkSetFunk;
    getCPtr: {
        (): number;
    };
};
type xlinkNodeDetectFunc = {};
type xlinkSimpleLinkFunk = {};
type xlinkType = {};
export type xmlAttrPtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlNodePtr | null;
    next: xmlAttrPtr | null;
    prev: xmlAttrPtr | null;
    doc: xmlDocPtr | null;
    ns: xmlNsPtr | null;
    atype: xmlAttributeType;
    psvi: any;
    getCPtr: {
        (): number;
    };
};
type xmlAttributeDefault = {};
export type xmlAttributePtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlDtdPtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    nexth: xmlAttributePtr;
    atype: xmlAttributeType;
    def: xmlAttributeDefault;
    defaultValue: string;
    tree: xmlEnumerationPtr;
    prefix: string;
    elem: string;
    getCPtr: {
        (): number;
    };
};
export type xmlAttributeTablePtr = {};
type xmlAttributeType = {};
export type xmlAutomataPtr = {};
export type xmlAutomataStatePtr = {};
export type xmlBufPtr = {};
type xmlBufferAllocationScheme = {};
export type xmlBufferPtr = {
    content: string;
    use: number;
    size: number;
    alloc: xmlBufferAllocationScheme;
    contentIO: string;
    getCPtr: {
        (): number;
    };
};
type xmlCatalogAllow = {};
type xmlCatalogPrefer = {};
export type xmlCatalogPtr = {};
type xmlChLRange = {};
export type xmlChLRangePtr = {
    low: number;
    high: number;
    getCPtr: {
        (): number;
    };
};
type xmlChRangeGroup = {};
export type xmlChRangeGroupPtr = {
    nbShortRange: number;
    nbLongRange: number;
    shortRange: xmlChSRange;
    longRange: xmlChLRange;
    getCPtr: {
        (): number;
    };
};
type xmlChSRange = {};
export type xmlChSRangePtr = {
    low: number;
    high: number;
    getCPtr: {
        (): number;
    };
};
type xmlCharEncoding = {};
type xmlCharEncodingHandler = {};
export type xmlCharEncodingHandlerPtr = {
    name: string;
    input: xmlCharEncodingInputFunc;
    output: xmlCharEncodingOutputFunc;
    getCPtr: {
        (): number;
    };
};
type xmlCharEncodingInputFunc = {};
type xmlCharEncodingOutputFunc = {};
type xmlDOMWrapAcquireNsFunction = {};
export type xmlDOMWrapCtxtPtr = {
    _private: any;
    type: number;
    namespaceMap: any;
    getNsForNodeFunc: xmlDOMWrapAcquireNsFunction;
    getCPtr: {
        (): number;
    };
};
type xmlDeregisterNodeFunc = {};
type xmlDict = {};
export type xmlDictPtr = {};
export type xmlDocPtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlNodePtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    compression: number;
    standalone: number;
    intSubset: xmlDtdPtr | null;
    extSubset: xmlDtdPtr | null;
    oldNs: xmlNsPtr | null;
    version: string;
    encoding: string;
    ids: any;
    refs: any;
    URL: string;
    charset: number;
    dict: xmlDictPtr;
    psvi: any;
    parseFlags: number;
    properties: number;
    getCPtr: {
        (): number;
    };
};
export type xmlDtdPtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlDocPtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    notations: any;
    elements: any;
    attributes: any;
    entities: any;
    ExternalID: string;
    SystemID: string;
    pentities: any;
    getCPtr: {
        (): number;
    };
};
type xmlElementContent = {};
type xmlElementContentOccur = {};
export type xmlElementContentPtr = {
    type: xmlElementContentType;
    ocur: xmlElementContentOccur;
    name: string;
    c1: xmlElementContentPtr;
    c2: xmlElementContentPtr;
    parent: xmlElementContentPtr;
    prefix: string;
    getCPtr: {
        (): number;
    };
};
type xmlElementContentType = {};
export type xmlElementPtr = xmlNodePtr & {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlDtdPtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    etype: xmlElementTypeVal;
    content: xmlElementContentPtr;
    attributes: xmlAttributePtr;
    prefix: string;
    contModel: xmlRegexpPtr;
    getCPtr: {
        (): number;
    };
};
export type xmlElementTablePtr = {};
type xmlElementType = {};
type xmlElementTypeVal = {};
export type xmlEntitiesTablePtr = {};
export type xmlEntityPtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlDtdPtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    orig: string;
    content: string;
    length: number;
    etype: xmlEntityType;
    ExternalID: string;
    SystemID: string;
    nexte: xmlEntityPtr;
    URI: string;
    owner: number;
    checked: number;
    getCPtr: {
        (): number;
    };
};
type xmlEntityReferenceFunc = {};
type xmlEntityType = {};
export type xmlEnumerationPtr = {
    next: xmlEnumerationPtr;
    name: string;
    getCPtr: {
        (): number;
    };
};
type xmlError = {};
type xmlErrorLevel = {};
export type xmlErrorPtr = {
    domain: number;
    code: number;
    message: string;
    level: xmlErrorLevel;
    file: string;
    line: number;
    str1: string;
    str2: string;
    str3: string;
    int1: number;
    int2: number;
    ctxt: any;
    node: any;
    getCPtr: {
        (): number;
    };
};
export type xmlExpCtxtPtr = {};
export type xmlExpNodePtr = {};
type xmlExternalEntityLoader = {};
type xmlFeature = {};
type xmlFreeFunc = {};
type xmlGenericErrorFunc = {};
export type xmlGlobalStatePtr = {
    xmlParserVersion: string;
    xmlDefaultSAXLocator: xmlSAXLocator;
    xmlDefaultSAXHandler: xmlSAXHandlerV1;
    docbDefaultSAXHandler: xmlSAXHandlerV1;
    htmlDefaultSAXHandler: xmlSAXHandlerV1;
    xmlFree: xmlFreeFunc;
    xmlMalloc: xmlMallocFunc;
    xmlMemStrdup: xmlStrdupFunc;
    xmlRealloc: xmlReallocFunc;
    xmlGenericError: xmlGenericErrorFunc;
    xmlStructuredError: xmlStructuredErrorFunc;
    xmlGenericErrorContext: any;
    oldXMLWDcompatibility: number;
    xmlBufferAllocScheme: xmlBufferAllocationScheme;
    xmlDefaultBufferSize: number;
    xmlSubstituteEntitiesDefaultValue: number;
    xmlDoValidityCheckingDefaultValue: number;
    xmlGetWarningsDefaultValue: number;
    xmlKeepBlanksDefaultValue: number;
    xmlLineNumbersDefaultValue: number;
    xmlLoadExtDtdDefaultValue: number;
    xmlParserDebugEntities: number;
    xmlPedanticParserDefaultValue: number;
    xmlSaveNoEmptyTags: number;
    xmlIndentTreeOutput: number;
    xmlTreeIndentString: string;
    xmlRegisterNodeDefaultValue: xmlRegisterNodeFunc;
    xmlDeregisterNodeDefaultValue: xmlDeregisterNodeFunc;
    xmlMallocAtomic: xmlMallocFunc;
    xmlLastError: xmlError;
    xmlParserInputBufferCreateFilenameValue: xmlParserInputBufferCreateFilenameFunc;
    xmlOutputBufferCreateFilenameValue: xmlOutputBufferCreateFilenameFunc;
    xmlStructuredErrorContext: any;
    getCPtr: {
        (): number;
    };
};
type xmlHashCopier = {};
type xmlHashDeallocator = {};
type xmlHashScanner = {};
type xmlHashScannerFull = {};
export type xmlHashTablePtr = {};
export type xmlIDPtr = {
    next: xmlIDPtr;
    value: string;
    attr: xmlAttrPtr | null;
    name: string;
    lineno: number;
    doc: xmlDocPtr | null;
    getCPtr: {
        (): number;
    };
};
export type xmlIDTablePtr = {};
type xmlInputCloseCallback = {};
type xmlInputMatchCallback = {};
type xmlInputOpenCallback = {};
type xmlInputReadCallback = {};
export type xmlLinkPtr = {};
type xmlListDataCompare = {};
type xmlListDeallocator = {};
export type xmlListPtr = {};
type xmlListWalker = {};
export type xmlLocationSetPtr = {
    locNr: number;
    locMax: number;
    locTab: xmlXPathObjectPtr;
    getCPtr: {
        (): number;
    };
};
type xmlMallocFunc = {};
export type xmlModulePtr = {};
export type xmlMutexPtr = {};
type xmlNode = {};
export type xmlNodePtr = {
    _private: any;
    type: xmlElementType;
    name: string;
    children: xmlNodePtr | null;
    last: xmlNodePtr | null;
    parent: xmlNodePtr | null;
    next: xmlNodePtr | null;
    prev: xmlNodePtr | null;
    doc: xmlDocPtr | null;
    ns: xmlNsPtr | null;
    content: string;
    properties: xmlAttrPtr | null;
    nsDef: xmlNsPtr | null;
    psvi: any;
    line: number;
    extra: number;
    getCPtr: {
        (): number;
    };
};
export type xmlNodeSetPtr = {
    nodeNr: number;
    nodeMax: number;
    nodeTab: xmlNodePtr | null;
    getCPtr: {
        (): number;
    };
};
export type xmlNotationPtr = {
    name: string;
    PublicID: string;
    SystemID: string;
    getCPtr: {
        (): number;
    };
};
export type xmlNotationTablePtr = {};
export type xmlNsPtr = {
    next: xmlNsPtr | null;
    type: xmlNsPtr | null;
    href: string;
    prefix: string;
    _private: any;
    context: xmlDocPtr | null;
    getCPtr: {
        (): number;
    };
};
type xmlOutputBufferCreateFilenameFunc = {};
export type xmlOutputBufferPtr = {
    context: any;
    writecallback: xmlOutputWriteCallback;
    closecallback: xmlOutputCloseCallback;
    encoder: xmlCharEncodingHandlerPtr;
    buffer: xmlBufPtr;
    conv: xmlBufPtr;
    written: number;
    error: number;
    getCPtr: {
        (): number;
    };
};
type xmlOutputCloseCallback = {};
type xmlOutputMatchCallback = {};
type xmlOutputOpenCallback = {};
type xmlOutputWriteCallback = {};
export type xmlParserCtxtPtr = {
    sax: xmlSAXHandlerPtr;
    userData: any;
    myDoc: xmlDocPtr | null;
    wellFormed: number;
    replaceEntities: number;
    version: string;
    encoding: string;
    standalone: number;
    html: number;
    input: xmlParserInputPtr;
    inputNr: number;
    inputMax: number;
    inputTab: xmlParserInputPtr;
    node: xmlNodePtr | null;
    nodeNr: number;
    nodeMax: number;
    nodeTab: xmlNodePtr | null;
    record_info: number;
    node_seq: xmlParserNodeInfoSeq;
    errNo: number;
    hasExternalSubset: number;
    hasPErefs: number;
    external: number;
    valid: number;
    validate: number;
    vctxt: xmlValidCtxt;
    instate: xmlParserInputState;
    token: number;
    directory: string;
    name: string;
    nameNr: number;
    nameMax: number;
    nameTab: string;
    nbChars: number;
    checkIndex: number;
    keepBlanks: number;
    disableSAX: number;
    inSubset: number;
    intSubName: string;
    extSubURI: string;
    extSubSystem: string;
    space: number;
    spaceNr: number;
    spaceMax: number;
    spaceTab: number;
    depth: number;
    entity: xmlParserInputPtr;
    charset: number;
    nodelen: number;
    nodemem: number;
    pedantic: number;
    _private: any;
    loadsubset: number;
    linenumbers: number;
    catalogs: any;
    recovery: number;
    progressive: number;
    dict: xmlDictPtr;
    atts: string;
    maxatts: number;
    docdict: number;
    str_xml: string;
    str_xmlns: string;
    str_xml_ns: string;
    sax2: number;
    nsNr: number;
    nsMax: number;
    nsTab: string;
    attallocs: number;
    pushTab: xmlStartTag;
    attsDefault: xmlHashTablePtr;
    attsSpecial: xmlHashTablePtr;
    nsWellFormed: number;
    options: number;
    dictNames: number;
    freeElemsNr: number;
    freeElems: xmlNodePtr | null;
    freeAttrsNr: number;
    freeAttrs: xmlAttrPtr | null;
    lastError: xmlError;
    parseMode: xmlParserMode;
    nbentities: number;
    sizeentities: number;
    nodeInfo: xmlParserNodeInfo;
    nodeInfoNr: number;
    nodeInfoMax: number;
    nodeInfoTab: xmlParserNodeInfo;
    input_id: number;
    sizeentcopy: number;
    getCPtr: {
        (): number;
    };
};
type xmlParserErrors = {};
type xmlParserInputBufferCreateFilenameFunc = {};
export type xmlParserInputBufferPtr = {
    context: any;
    readcallback: xmlInputReadCallback;
    closecallback: xmlInputCloseCallback;
    encoder: xmlCharEncodingHandlerPtr;
    buffer: xmlBufPtr;
    raw: xmlBufPtr;
    compressed: number;
    error: number;
    rawconsumed: number;
    getCPtr: {
        (): number;
    };
};
type xmlParserInputDeallocate = {};
export type xmlParserInputPtr = {
    buf: xmlParserInputBufferPtr;
    filename: string;
    directory: string;
    base: string;
    cur: string;
    end: string;
    length: number;
    line: number;
    col: number;
    consumed: number;
    free: xmlParserInputDeallocate;
    encoding: string;
    version: string;
    standalone: number;
    id: number;
    getCPtr: {
        (): number;
    };
};
type xmlParserInputState = {};
type xmlParserMode = {};
type xmlParserNodeInfo = {};
export type xmlParserNodeInfoPtr = {
    node: undefined;
    begin_pos: number;
    begin_line: number;
    end_pos: number;
    end_line: number;
    getCPtr: {
        (): number;
    };
};
type xmlParserNodeInfoSeq = {};
export type xmlParserNodeInfoSeqPtr = {
    maximum: number;
    length: number;
    buffer: xmlParserNodeInfo;
    getCPtr: {
        (): number;
    };
};
export type xmlPatternPtr = {};
export type xmlRMutexPtr = {};
type xmlReallocFunc = {};
export type xmlRefPtr = {
    next: xmlRefPtr;
    value: string;
    attr: xmlAttrPtr | null;
    name: string;
    lineno: number;
    getCPtr: {
        (): number;
    };
};
export type xmlRefTablePtr = {};
type xmlRegExecCallbacks = {};
export type xmlRegExecCtxtPtr = {};
export type xmlRegexpPtr = {};
type xmlRegisterNodeFunc = {};
export type xmlRelaxNGParserCtxtPtr = {};
export type xmlRelaxNGPtr = {};
export type xmlRelaxNGValidCtxtPtr = {};
type xmlRelaxNGValidityErrorFunc = {};
type xmlRelaxNGValidityWarningFunc = {};
type xmlSAXHandler = {};
export type xmlSAXHandlerPtr = {
    internalSubset: internalSubsetSAXFunc;
    isStandalone: isStandaloneSAXFunc;
    hasInternalSubset: hasInternalSubsetSAXFunc;
    hasExternalSubset: hasExternalSubsetSAXFunc;
    resolveEntity: resolveEntitySAXFunc;
    getEntity: getEntitySAXFunc;
    entityDecl: entityDeclSAXFunc;
    notationDecl: notationDeclSAXFunc;
    attributeDecl: attributeDeclSAXFunc;
    elementDecl: elementDeclSAXFunc;
    unparsedEntityDecl: unparsedEntityDeclSAXFunc;
    setDocumentLocator: setDocumentLocatorSAXFunc;
    startDocument: startDocumentSAXFunc;
    endDocument: endDocumentSAXFunc;
    startElement: startElementSAXFunc;
    endElement: endElementSAXFunc;
    reference: referenceSAXFunc;
    characters: charactersSAXFunc;
    ignorableWhitespace: ignorableWhitespaceSAXFunc;
    processingInstruction: processingInstructionSAXFunc;
    comment: commentSAXFunc;
    warning: warningSAXFunc;
    error: errorSAXFunc;
    fatalError: fatalErrorSAXFunc;
    getParameterEntity: getParameterEntitySAXFunc;
    cdataBlock: cdataBlockSAXFunc;
    externalSubset: externalSubsetSAXFunc;
    initialized: number;
    _private: any;
    startElementNs: startElementNsSAX2Func;
    endElementNs: endElementNsSAX2Func;
    serror: xmlStructuredErrorFunc;
    getCPtr: {
        (): number;
    };
};
type xmlSAXHandlerV1 = {};
export type xmlSAXHandlerV1Ptr = {
    internalSubset: internalSubsetSAXFunc;
    isStandalone: isStandaloneSAXFunc;
    hasInternalSubset: hasInternalSubsetSAXFunc;
    hasExternalSubset: hasExternalSubsetSAXFunc;
    resolveEntity: resolveEntitySAXFunc;
    getEntity: getEntitySAXFunc;
    entityDecl: entityDeclSAXFunc;
    notationDecl: notationDeclSAXFunc;
    attributeDecl: attributeDeclSAXFunc;
    elementDecl: elementDeclSAXFunc;
    unparsedEntityDecl: unparsedEntityDeclSAXFunc;
    setDocumentLocator: setDocumentLocatorSAXFunc;
    startDocument: startDocumentSAXFunc;
    endDocument: endDocumentSAXFunc;
    startElement: startElementSAXFunc;
    endElement: endElementSAXFunc;
    reference: referenceSAXFunc;
    characters: charactersSAXFunc;
    ignorableWhitespace: ignorableWhitespaceSAXFunc;
    processingInstruction: processingInstructionSAXFunc;
    comment: commentSAXFunc;
    warning: warningSAXFunc;
    error: errorSAXFunc;
    fatalError: fatalErrorSAXFunc;
    getParameterEntity: getParameterEntitySAXFunc;
    cdataBlock: cdataBlockSAXFunc;
    externalSubset: externalSubsetSAXFunc;
    initialized: number;
    getCPtr: {
        (): number;
    };
};
type xmlSAXLocator = {};
export type xmlSAXLocatorPtr = {
    getPublicId: string;
    getSystemId: string;
    getLineNumber: number;
    getColumnNumber: number;
    getCPtr: {
        (): number;
    };
};
export type xmlSaveCtxtPtr = {};
export type xmlSchemaAnnotPtr = {
    next: xmlSchemaAnnotPtr;
    content: xmlNodePtr | null;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaAttributeGroupPtr = {
    type: xmlSchemaTypeType;
    next: xmlSchemaAttributePtr;
    name: string;
    id: string;
    ref: string;
    refNs: string;
    annot: xmlSchemaAnnotPtr;
    attributes: xmlSchemaAttributePtr;
    node: xmlNodePtr | null;
    flags: number;
    attributeWildcard: xmlSchemaWildcardPtr;
    refPrefix: string;
    refItem: xmlSchemaAttributeGroupPtr;
    targetNamespace: string;
    attrUses: any;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaAttributeLinkPtr = {
    next: xmlSchemaAttributeLinkPtr;
    attr: xmlSchemaAttributePtr;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaAttributePtr = {
    type: xmlSchemaTypeType;
    next: xmlSchemaAttributePtr;
    name: string;
    id: string;
    ref: string;
    refNs: string;
    typeName: string;
    typeNs: string;
    annot: xmlSchemaAnnotPtr;
    base: xmlSchemaTypePtr;
    occurs: number;
    defValue: string;
    subtypes: xmlSchemaTypePtr;
    node: xmlNodePtr | null;
    targetNamespace: string;
    flags: number;
    refPrefix: string;
    defVal: xmlSchemaValPtr;
    refDecl: xmlSchemaAttributePtr;
    getCPtr: {
        (): number;
    };
};
type xmlSchemaContentType = {};
export type xmlSchemaElementPtr = {
    type: xmlSchemaTypeType;
    next: xmlSchemaTypePtr;
    name: string;
    id: string;
    ref: string;
    refNs: string;
    annot: xmlSchemaAnnotPtr;
    subtypes: xmlSchemaTypePtr;
    attributes: xmlSchemaAttributePtr;
    node: xmlNodePtr | null;
    minOccurs: number;
    maxOccurs: number;
    flags: number;
    targetNamespace: string;
    namedType: string;
    namedTypeNs: string;
    substGroup: string;
    substGroupNs: string;
    scope: string;
    value: string;
    refDecl: xmlSchemaElementPtr | null;
    contModel: xmlRegexpPtr;
    contentType: xmlSchemaContentType;
    refPrefix: string;
    defVal: xmlSchemaValPtr;
    idcs: any;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaFacetLinkPtr = {
    next: xmlSchemaFacetLinkPtr;
    facet: xmlSchemaFacetPtr;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaFacetPtr = {
    type: xmlSchemaTypeType;
    next: xmlSchemaFacetPtr;
    value: string;
    id: string;
    annot: xmlSchemaAnnotPtr;
    node: xmlNodePtr | null;
    fixed: number;
    whitespace: number;
    val: xmlSchemaValPtr;
    regexp: xmlRegexpPtr;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaNotationPtr = {
    type: xmlSchemaTypeType;
    name: string;
    annot: xmlSchemaAnnotPtr;
    identifier: string;
    targetNamespace: string;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaParserCtxtPtr = {};
export type xmlSchemaPtr = {
    name: string;
    targetNamespace: string;
    version: string;
    id: string;
    doc: xmlDocPtr | null;
    annot: xmlSchemaAnnotPtr;
    flags: number;
    typeDecl: xmlHashTablePtr;
    attrDecl: xmlHashTablePtr;
    attrgrpDecl: xmlHashTablePtr;
    elemDecl: xmlHashTablePtr;
    notaDecl: xmlHashTablePtr;
    schemasImports: xmlHashTablePtr;
    _private: any;
    groupDecl: xmlHashTablePtr;
    dict: xmlDictPtr;
    includes: any;
    preserve: number;
    counter: number;
    idcDef: xmlHashTablePtr;
    volatiles: any;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaSAXPlugPtr = {};
export type xmlSchemaTypeLinkPtr = {
    next: xmlSchemaTypeLinkPtr;
    type: xmlSchemaTypePtr;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaTypePtr = {
    type: xmlSchemaTypeType;
    next: xmlSchemaTypePtr;
    name: string;
    id: string;
    ref: string;
    refNs: string;
    annot: xmlSchemaAnnotPtr;
    subtypes: xmlSchemaTypePtr;
    attributes: xmlSchemaAttributePtr;
    node: xmlNodePtr | null;
    minOccurs: number;
    maxOccurs: number;
    flags: number;
    contentType: xmlSchemaContentType;
    base: string;
    baseNs: string;
    baseType: xmlSchemaTypePtr;
    facets: xmlSchemaFacetPtr;
    redef: xmlSchemaTypePtr;
    recurse: number;
    attributeUses: xmlSchemaAttributeLinkPtr;
    attributeWildcard: xmlSchemaWildcardPtr;
    builtInType: number;
    memberTypes: xmlSchemaTypeLinkPtr;
    facetSet: xmlSchemaFacetLinkPtr;
    refPrefix: string;
    contentTypeDef: xmlSchemaTypePtr;
    contModel: xmlRegexpPtr;
    targetNamespace: string;
    attrUses: any;
    getCPtr: {
        (): number;
    };
};
type xmlSchemaTypeType = {};
export type xmlSchemaValPtr = {};
type xmlSchemaValType = {};
export type xmlSchemaValidCtxtPtr = {};
type xmlSchemaValidityErrorFunc = {};
type xmlSchemaValidityLocatorFunc = {};
type xmlSchemaValidityWarningFunc = {};
type xmlSchemaWhitespaceValueType = {};
export type xmlSchemaWildcardNsPtr = {
    next: xmlSchemaWildcardNsPtr | null;
    value: string;
    getCPtr: {
        (): number;
    };
};
export type xmlSchemaWildcardPtr = {
    type: xmlSchemaTypeType;
    id: string;
    annot: xmlSchemaAnnotPtr;
    node: xmlNodePtr | null;
    minOccurs: number;
    maxOccurs: number;
    processContents: number;
    any: number;
    nsSet: xmlSchemaWildcardNsPtr | null;
    negNsSet: xmlSchemaWildcardNsPtr | null;
    flags: number;
    getCPtr: {
        (): number;
    };
};
type xmlStartTag = {};
type xmlStrdupFunc = {};
export type xmlStreamCtxtPtr = {};
type xmlStructuredErrorFunc = {};
export type xmlURIPtr = {
    scheme: string;
    opaque: string;
    authority: string;
    server: string;
    user: string;
    port: number;
    path: string;
    query: string;
    fragment: string;
    cleanup: number;
    query_raw: string;
    getCPtr: {
        (): number;
    };
};
type xmlValidCtxt = {};
export type xmlValidCtxtPtr = {
    userData: any;
    error: xmlValidityErrorFunc;
    warning: xmlValidityWarningFunc;
    node: xmlNodePtr | null;
    nodeNr: number;
    nodeMax: number;
    nodeTab: xmlNodePtr | null;
    finishDtd: number;
    doc: xmlDocPtr | null;
    valid: number;
    vstate: xmlValidState;
    vstateNr: number;
    vstateMax: number;
    vstateTab: xmlValidState;
    am: xmlAutomataPtr;
    state: xmlAutomataStatePtr;
    getCPtr: {
        (): number;
    };
};
type xmlValidState = {};
export type xmlValidStatePtr = {};
type xmlValidityErrorFunc = {};
type xmlValidityWarningFunc = {};
type xmlXPathAxisFunc = {};
export type xmlXPathAxisPtr = {
    name: string;
    func: xmlXPathAxisFunc;
    getCPtr: {
        (): number;
    };
};
export type xmlXPathCompExprPtr = {};
export type xmlXPathContextPtr = {
    doc: xmlDocPtr | null;
    node: xmlNodePtr | null;
    nb_variables_unused: number;
    max_variables_unused: number;
    varHash: xmlHashTablePtr;
    nb_types: number;
    max_types: number;
    types: xmlXPathTypePtr;
    nb_funcs_unused: number;
    max_funcs_unused: number;
    funcHash: xmlHashTablePtr;
    nb_axis: number;
    max_axis: number;
    axis: xmlXPathAxisPtr;
    namespaces: xmlNsPtr | null;
    nsNr: number;
    user: any;
    contextSize: number;
    proximityPosition: number;
    xptr: number;
    here: xmlNodePtr | null;
    origin: xmlNodePtr | null;
    nsHash: xmlHashTablePtr;
    varLookupFunc: xmlXPathVariableLookupFunc;
    varLookupData: any;
    extra: any;
    function: string;
    functionURI: string;
    funcLookupFunc: xmlXPathFuncLookupFunc;
    funcLookupData: any;
    tmpNsList: xmlNsPtr | null;
    tmpNsNr: number;
    userData: any;
    error: xmlStructuredErrorFunc;
    lastError: xmlError;
    debugNode: xmlNodePtr | null;
    dict: xmlDictPtr;
    flags: number;
    cache: any;
    opLimit: number;
    opCount: number;
    depth: number;
    getCPtr: {
        (): number;
    };
};
type xmlXPathConvertFunc = {};
type xmlXPathFuncLookupFunc = {};
export type xmlXPathFuncPtr = {};
type xmlXPathFunction = {};
export type xmlXPathObjectPtr = {
    type: xmlXPathObjectType;
    nodesetval: xmlNodePtr[];
    boolval: number;
    floatval: number;
    stringval: string;
    user: any;
    index: number;
    user2: any;
    index2: number;
    getCPtr: {
        (): number;
    };
};
type xmlXPathObjectType = {};
export type xmlXPathParserContextPtr = {
    cur: string;
    base: string;
    error: number;
    context: xmlXPathContextPtr;
    value: xmlXPathObjectPtr;
    valueNr: number;
    valueMax: number;
    valueTab: xmlXPathObjectPtr;
    comp: xmlXPathCompExprPtr;
    xptr: number;
    ancestor: xmlNodePtr | null;
    valueFrame: number;
    getCPtr: {
        (): number;
    };
};
export type xmlXPathTypePtr = {
    name: string;
    func: xmlXPathConvertFunc;
    getCPtr: {
        (): number;
    };
};
type xmlXPathVariableLookupFunc = {};
export type xmlXPathVariablePtr = {
    name: string;
    value: xmlXPathObjectPtr;
    getCPtr: {
        (): number;
    };
};
export interface NativeBindings {
    ATTRIBUTE_DESTRUCTOR: number;
    BASE_BUFFER_SIZE: number;
    HAVE_ARPA_INET_H: number;
    HAVE_ARPA_NAMESER_H: number;
    HAVE_CTYPE_H: number;
    HAVE_DIRENT_H: number;
    HAVE_DLFCN_H: number;
    HAVE_ERRNO_H: number;
    HAVE_FCNTL_H: number;
    HAVE_FLOAT_H: number;
    HAVE_FPRINTF: number;
    HAVE_FTIME: number;
    HAVE_GETTIMEOFDAY: number;
    HAVE_INTTYPES_H: number;
    HAVE_ISASCII: number;
    HAVE_LIMITS_H: number;
    HAVE_LOCALTIME: number;
    HAVE_MATH_H: number;
    HAVE_MEMORY_H: number;
    HAVE_MMAP: number;
    HAVE_MUNMAP: number;
    HAVE_NETDB_H: number;
    HAVE_NETINET_IN_H: number;
    HAVE_POLL_H: number;
    HAVE_PRINTF: number;
    HAVE_PUTENV: number;
    HAVE_RAND: number;
    HAVE_RESOLV_H: number;
    HAVE_SIGNAL: number;
    HAVE_SIGNAL_H: number;
    HAVE_SNPRINTF: number;
    HAVE_SPRINTF: number;
    HAVE_SRAND: number;
    HAVE_SSCANF: number;
    HAVE_STAT: number;
    HAVE_STDARG_H: number;
    HAVE_STDINT_H: number;
    HAVE_STDLIB_H: number;
    HAVE_STRFTIME: number;
    HAVE_STRINGS_H: number;
    HAVE_STRING_H: number;
    HAVE_SYS_MMAN_H: number;
    HAVE_SYS_SELECT_H: number;
    HAVE_SYS_SOCKET_H: number;
    HAVE_SYS_STAT_H: number;
    HAVE_SYS_TIMEB_H: number;
    HAVE_SYS_TIME_H: number;
    HAVE_SYS_TYPES_H: number;
    HAVE_TIME: number;
    HAVE_TIME_H: number;
    HAVE_VFPRINTF: number;
    HAVE_VSNPRINTF: number;
    HAVE_VSPRINTF: number;
    HTML_DEPRECATED: number;
    HTML_INVALID: number;
    HTML_NA: number;
    HTML_PARSE_COMPACT: number;
    HTML_PARSE_IGNORE_ENC: number;
    HTML_PARSE_NOBLANKS: number;
    HTML_PARSE_NODEFDTD: number;
    HTML_PARSE_NOERROR: number;
    HTML_PARSE_NOIMPLIED: number;
    HTML_PARSE_NONET: number;
    HTML_PARSE_NOWARNING: number;
    HTML_PARSE_PEDANTIC: number;
    HTML_PARSE_RECOVER: number;
    HTML_REQUIRED: number;
    HTML_VALID: number;
    INPUT_CHUNK: number;
    LIBXML_DOTTED_VERSION: string;
    LIBXML_MODULE_EXTENSION: string;
    LIBXML_VERSION: number;
    LIBXML_VERSION_EXTRA: string;
    LIBXML_VERSION_STRING: string;
    LT_OBJDIR: string;
    PACKAGE: string;
    PACKAGE_BUGREPORT: string;
    PACKAGE_NAME: string;
    PACKAGE_STRING: string;
    PACKAGE_TARNAME: string;
    PACKAGE_URL: string;
    PACKAGE_VERSION: string;
    STDC_HEADERS: number;
    VA_LIST_IS_ARRAY: number;
    VERSION: string;
    XLINK_ACTUATE_AUTO: number;
    XLINK_ACTUATE_NONE: number;
    XLINK_ACTUATE_ONREQUEST: number;
    XLINK_SHOW_EMBED: number;
    XLINK_SHOW_NEW: number;
    XLINK_SHOW_NONE: number;
    XLINK_SHOW_REPLACE: number;
    XLINK_TYPE_EXTENDED: number;
    XLINK_TYPE_EXTENDED_SET: number;
    XLINK_TYPE_NONE: number;
    XLINK_TYPE_SIMPLE: number;
    XML_ATTRIBUTE_CDATA: number;
    XML_ATTRIBUTE_DECL: number;
    XML_ATTRIBUTE_ENTITIES: number;
    XML_ATTRIBUTE_ENTITY: number;
    XML_ATTRIBUTE_ENUMERATION: number;
    XML_ATTRIBUTE_FIXED: number;
    XML_ATTRIBUTE_ID: number;
    XML_ATTRIBUTE_IDREF: number;
    XML_ATTRIBUTE_IDREFS: number;
    XML_ATTRIBUTE_IMPLIED: number;
    XML_ATTRIBUTE_NMTOKEN: number;
    XML_ATTRIBUTE_NMTOKENS: number;
    XML_ATTRIBUTE_NODE: number;
    XML_ATTRIBUTE_NONE: number;
    XML_ATTRIBUTE_NOTATION: number;
    XML_ATTRIBUTE_REQUIRED: number;
    XML_BUFFER_ALLOC_BOUNDED: number;
    XML_BUFFER_ALLOC_DOUBLEIT: number;
    XML_BUFFER_ALLOC_EXACT: number;
    XML_BUFFER_ALLOC_HYBRID: number;
    XML_BUFFER_ALLOC_IMMUTABLE: number;
    XML_BUFFER_ALLOC_IO: number;
    XML_BUF_OVERFLOW: number;
    XML_C14N_CREATE_CTXT: number;
    XML_C14N_CREATE_STACK: number;
    XML_C14N_INVALID_NODE: number;
    XML_C14N_RELATIVE_NAMESPACE: number;
    XML_C14N_REQUIRES_UTF8: number;
    XML_C14N_UNKNOW_NODE: number;
    XML_CATALOG_ENTRY_BROKEN: number;
    XML_CATALOG_MISSING_ATTR: number;
    XML_CATALOG_NOT_CATALOG: number;
    XML_CATALOG_PREFER_VALUE: number;
    XML_CATALOG_RECURSION: number;
    XML_CATA_ALLOW_ALL: number;
    XML_CATA_ALLOW_DOCUMENT: number;
    XML_CATA_ALLOW_GLOBAL: number;
    XML_CATA_ALLOW_NONE: number;
    XML_CATA_PREFER_NONE: number;
    XML_CATA_PREFER_PUBLIC: number;
    XML_CATA_PREFER_SYSTEM: number;
    XML_CDATA_SECTION_NODE: number;
    XML_CHAR_ENCODING_2022_JP: number;
    XML_CHAR_ENCODING_8859_1: number;
    XML_CHAR_ENCODING_8859_2: number;
    XML_CHAR_ENCODING_8859_3: number;
    XML_CHAR_ENCODING_8859_4: number;
    XML_CHAR_ENCODING_8859_5: number;
    XML_CHAR_ENCODING_8859_6: number;
    XML_CHAR_ENCODING_8859_7: number;
    XML_CHAR_ENCODING_8859_8: number;
    XML_CHAR_ENCODING_8859_9: number;
    XML_CHAR_ENCODING_ASCII: number;
    XML_CHAR_ENCODING_EBCDIC: number;
    XML_CHAR_ENCODING_ERROR: number;
    XML_CHAR_ENCODING_EUC_JP: number;
    XML_CHAR_ENCODING_NONE: number;
    XML_CHAR_ENCODING_SHIFT_JIS: number;
    XML_CHAR_ENCODING_UCS2: number;
    XML_CHAR_ENCODING_UCS4BE: number;
    XML_CHAR_ENCODING_UCS4LE: number;
    XML_CHAR_ENCODING_UCS4_2143: number;
    XML_CHAR_ENCODING_UCS4_3412: number;
    XML_CHAR_ENCODING_UTF16BE: number;
    XML_CHAR_ENCODING_UTF16LE: number;
    XML_CHAR_ENCODING_UTF8: number;
    XML_CHECK_ENTITY_TYPE: number;
    XML_CHECK_FOUND_ATTRIBUTE: number;
    XML_CHECK_FOUND_CDATA: number;
    XML_CHECK_FOUND_COMMENT: number;
    XML_CHECK_FOUND_DOCTYPE: number;
    XML_CHECK_FOUND_ELEMENT: number;
    XML_CHECK_FOUND_ENTITY: number;
    XML_CHECK_FOUND_ENTITYREF: number;
    XML_CHECK_FOUND_FRAGMENT: number;
    XML_CHECK_FOUND_NOTATION: number;
    XML_CHECK_FOUND_PI: number;
    XML_CHECK_FOUND_TEXT: number;
    XML_CHECK_NAME_NOT_NULL: number;
    XML_CHECK_NOT_ATTR: number;
    XML_CHECK_NOT_ATTR_DECL: number;
    XML_CHECK_NOT_DTD: number;
    XML_CHECK_NOT_ELEM_DECL: number;
    XML_CHECK_NOT_ENTITY_DECL: number;
    XML_CHECK_NOT_NCNAME: number;
    XML_CHECK_NOT_NS_DECL: number;
    XML_CHECK_NOT_UTF8: number;
    XML_CHECK_NO_DICT: number;
    XML_CHECK_NO_DOC: number;
    XML_CHECK_NO_ELEM: number;
    XML_CHECK_NO_HREF: number;
    XML_CHECK_NO_NAME: number;
    XML_CHECK_NO_NEXT: number;
    XML_CHECK_NO_PARENT: number;
    XML_CHECK_NO_PREV: number;
    XML_CHECK_NS_ANCESTOR: number;
    XML_CHECK_NS_SCOPE: number;
    XML_CHECK_OUTSIDE_DICT: number;
    XML_CHECK_UNKNOWN_NODE: number;
    XML_CHECK_WRONG_DOC: number;
    XML_CHECK_WRONG_NAME: number;
    XML_CHECK_WRONG_NEXT: number;
    XML_CHECK_WRONG_PARENT: number;
    XML_CHECK_WRONG_PREV: number;
    XML_COMMENT_NODE: number;
    XML_COMPLETE_ATTRS: number;
    XML_DEFAULT_VERSION: string;
    XML_DETECT_IDS: number;
    XML_DOCB_DOCUMENT_NODE: number;
    XML_DOCUMENT_FRAG_NODE: number;
    XML_DOCUMENT_NODE: number;
    XML_DOCUMENT_TYPE_NODE: number;
    XML_DOC_DTDVALID: number;
    XML_DOC_HTML: number;
    XML_DOC_INTERNAL: number;
    XML_DOC_NSVALID: number;
    XML_DOC_OLD10: number;
    XML_DOC_USERBUILT: number;
    XML_DOC_WELLFORMED: number;
    XML_DOC_XINCLUDE: number;
    XML_DTD_ATTRIBUTE_DEFAULT: number;
    XML_DTD_ATTRIBUTE_REDEFINED: number;
    XML_DTD_ATTRIBUTE_VALUE: number;
    XML_DTD_CONTENT_ERROR: number;
    XML_DTD_CONTENT_MODEL: number;
    XML_DTD_CONTENT_NOT_DETERMINIST: number;
    XML_DTD_DIFFERENT_PREFIX: number;
    XML_DTD_DUP_TOKEN: number;
    XML_DTD_ELEM_DEFAULT_NAMESPACE: number;
    XML_DTD_ELEM_NAMESPACE: number;
    XML_DTD_ELEM_REDEFINED: number;
    XML_DTD_EMPTY_NOTATION: number;
    XML_DTD_ENTITY_TYPE: number;
    XML_DTD_ID_FIXED: number;
    XML_DTD_ID_REDEFINED: number;
    XML_DTD_ID_SUBSET: number;
    XML_DTD_INVALID_CHILD: number;
    XML_DTD_INVALID_DEFAULT: number;
    XML_DTD_LOAD_ERROR: number;
    XML_DTD_MISSING_ATTRIBUTE: number;
    XML_DTD_MIXED_CORRUPT: number;
    XML_DTD_MULTIPLE_ID: number;
    XML_DTD_NODE: number;
    XML_DTD_NOTATION_REDEFINED: number;
    XML_DTD_NOTATION_VALUE: number;
    XML_DTD_NOT_EMPTY: number;
    XML_DTD_NOT_PCDATA: number;
    XML_DTD_NOT_STANDALONE: number;
    XML_DTD_NO_DOC: number;
    XML_DTD_NO_DTD: number;
    XML_DTD_NO_ELEM_NAME: number;
    XML_DTD_NO_PREFIX: number;
    XML_DTD_NO_ROOT: number;
    XML_DTD_ROOT_NAME: number;
    XML_DTD_STANDALONE_DEFAULTED: number;
    XML_DTD_STANDALONE_WHITE_SPACE: number;
    XML_DTD_UNKNOWN_ATTRIBUTE: number;
    XML_DTD_UNKNOWN_ELEM: number;
    XML_DTD_UNKNOWN_ENTITY: number;
    XML_DTD_UNKNOWN_ID: number;
    XML_DTD_UNKNOWN_NOTATION: number;
    XML_DTD_XMLID_TYPE: number;
    XML_DTD_XMLID_VALUE: number;
    XML_ELEMENT_CONTENT_ELEMENT: number;
    XML_ELEMENT_CONTENT_MULT: number;
    XML_ELEMENT_CONTENT_ONCE: number;
    XML_ELEMENT_CONTENT_OPT: number;
    XML_ELEMENT_CONTENT_OR: number;
    XML_ELEMENT_CONTENT_PCDATA: number;
    XML_ELEMENT_CONTENT_PLUS: number;
    XML_ELEMENT_CONTENT_SEQ: number;
    XML_ELEMENT_DECL: number;
    XML_ELEMENT_NODE: number;
    XML_ELEMENT_TYPE_ANY: number;
    XML_ELEMENT_TYPE_ELEMENT: number;
    XML_ELEMENT_TYPE_EMPTY: number;
    XML_ELEMENT_TYPE_MIXED: number;
    XML_ELEMENT_TYPE_UNDEFINED: number;
    XML_ENTITY_DECL: number;
    XML_ENTITY_NODE: number;
    XML_ENTITY_REF_NODE: number;
    XML_ERR_ATTLIST_NOT_FINISHED: number;
    XML_ERR_ATTLIST_NOT_STARTED: number;
    XML_ERR_ATTRIBUTE_NOT_FINISHED: number;
    XML_ERR_ATTRIBUTE_NOT_STARTED: number;
    XML_ERR_ATTRIBUTE_REDEFINED: number;
    XML_ERR_ATTRIBUTE_WITHOUT_VALUE: number;
    XML_ERR_CDATA_NOT_FINISHED: number;
    XML_ERR_CHARREF_AT_EOF: number;
    XML_ERR_CHARREF_IN_DTD: number;
    XML_ERR_CHARREF_IN_EPILOG: number;
    XML_ERR_CHARREF_IN_PROLOG: number;
    XML_ERR_COMMENT_NOT_FINISHED: number;
    XML_ERR_CONDSEC_INVALID: number;
    XML_ERR_CONDSEC_INVALID_KEYWORD: number;
    XML_ERR_CONDSEC_NOT_FINISHED: number;
    XML_ERR_CONDSEC_NOT_STARTED: number;
    XML_ERR_DOCTYPE_NOT_FINISHED: number;
    XML_ERR_DOCUMENT_EMPTY: number;
    XML_ERR_DOCUMENT_END: number;
    XML_ERR_DOCUMENT_START: number;
    XML_ERR_ELEMCONTENT_NOT_FINISHED: number;
    XML_ERR_ELEMCONTENT_NOT_STARTED: number;
    XML_ERR_ENCODING_NAME: number;
    XML_ERR_ENTITYREF_AT_EOF: number;
    XML_ERR_ENTITYREF_IN_DTD: number;
    XML_ERR_ENTITYREF_IN_EPILOG: number;
    XML_ERR_ENTITYREF_IN_PROLOG: number;
    XML_ERR_ENTITYREF_NO_NAME: number;
    XML_ERR_ENTITYREF_SEMICOL_MISSING: number;
    XML_ERR_ENTITY_BOUNDARY: number;
    XML_ERR_ENTITY_CHAR_ERROR: number;
    XML_ERR_ENTITY_IS_EXTERNAL: number;
    XML_ERR_ENTITY_IS_PARAMETER: number;
    XML_ERR_ENTITY_LOOP: number;
    XML_ERR_ENTITY_NOT_FINISHED: number;
    XML_ERR_ENTITY_NOT_STARTED: number;
    XML_ERR_ENTITY_PE_INTERNAL: number;
    XML_ERR_ENTITY_PROCESSING: number;
    XML_ERR_EQUAL_REQUIRED: number;
    XML_ERR_ERROR: number;
    XML_ERR_EXTRA_CONTENT: number;
    XML_ERR_EXT_ENTITY_STANDALONE: number;
    XML_ERR_EXT_SUBSET_NOT_FINISHED: number;
    XML_ERR_FATAL: number;
    XML_ERR_GT_REQUIRED: number;
    XML_ERR_HYPHEN_IN_COMMENT: number;
    XML_ERR_INTERNAL_ERROR: number;
    XML_ERR_INVALID_CHAR: number;
    XML_ERR_INVALID_CHARREF: number;
    XML_ERR_INVALID_DEC_CHARREF: number;
    XML_ERR_INVALID_ENCODING: number;
    XML_ERR_INVALID_HEX_CHARREF: number;
    XML_ERR_INVALID_URI: number;
    XML_ERR_LITERAL_NOT_FINISHED: number;
    XML_ERR_LITERAL_NOT_STARTED: number;
    XML_ERR_LTSLASH_REQUIRED: number;
    XML_ERR_LT_IN_ATTRIBUTE: number;
    XML_ERR_LT_REQUIRED: number;
    XML_ERR_MISPLACED_CDATA_END: number;
    XML_ERR_MISSING_ENCODING: number;
    XML_ERR_MIXED_NOT_FINISHED: number;
    XML_ERR_MIXED_NOT_STARTED: number;
    XML_ERR_NAME_REQUIRED: number;
    XML_ERR_NAME_TOO_LONG: number;
    XML_ERR_NMTOKEN_REQUIRED: number;
    XML_ERR_NONE: number;
    XML_ERR_NOTATION_NOT_FINISHED: number;
    XML_ERR_NOTATION_NOT_STARTED: number;
    XML_ERR_NOTATION_PROCESSING: number;
    XML_ERR_NOT_STANDALONE: number;
    XML_ERR_NOT_WELL_BALANCED: number;
    XML_ERR_NO_DTD: number;
    XML_ERR_NO_MEMORY: number;
    XML_ERR_NS_DECL_ERROR: number;
    XML_ERR_OK: number;
    XML_ERR_PCDATA_REQUIRED: number;
    XML_ERR_PEREF_AT_EOF: number;
    XML_ERR_PEREF_IN_EPILOG: number;
    XML_ERR_PEREF_IN_INT_SUBSET: number;
    XML_ERR_PEREF_IN_PROLOG: number;
    XML_ERR_PEREF_NO_NAME: number;
    XML_ERR_PEREF_SEMICOL_MISSING: number;
    XML_ERR_PI_NOT_FINISHED: number;
    XML_ERR_PI_NOT_STARTED: number;
    XML_ERR_PUBID_REQUIRED: number;
    XML_ERR_RESERVED_XML_NAME: number;
    XML_ERR_SEPARATOR_REQUIRED: number;
    XML_ERR_SPACE_REQUIRED: number;
    XML_ERR_STANDALONE_VALUE: number;
    XML_ERR_STRING_NOT_CLOSED: number;
    XML_ERR_STRING_NOT_STARTED: number;
    XML_ERR_TAG_NAME_MISMATCH: number;
    XML_ERR_TAG_NOT_FINISHED: number;
    XML_ERR_UNDECLARED_ENTITY: number;
    XML_ERR_UNKNOWN_ENCODING: number;
    XML_ERR_UNKNOWN_VERSION: number;
    XML_ERR_UNPARSED_ENTITY: number;
    XML_ERR_UNSUPPORTED_ENCODING: number;
    XML_ERR_URI_FRAGMENT: number;
    XML_ERR_URI_REQUIRED: number;
    XML_ERR_USER_STOP: number;
    XML_ERR_VALUE_REQUIRED: number;
    XML_ERR_VERSION_MISMATCH: number;
    XML_ERR_VERSION_MISSING: number;
    XML_ERR_WARNING: number;
    XML_ERR_XMLDECL_NOT_FINISHED: number;
    XML_ERR_XMLDECL_NOT_STARTED: number;
    XML_EXP_ATOM: number;
    XML_EXP_COUNT: number;
    XML_EXP_EMPTY: number;
    XML_EXP_FORBID: number;
    XML_EXP_OR: number;
    XML_EXP_SEQ: number;
    XML_EXTERNAL_GENERAL_PARSED_ENTITY: number;
    XML_EXTERNAL_GENERAL_UNPARSED_ENTITY: number;
    XML_EXTERNAL_PARAMETER_ENTITY: number;
    XML_FROM_BUFFER: number;
    XML_FROM_C14N: number;
    XML_FROM_CATALOG: number;
    XML_FROM_CHECK: number;
    XML_FROM_DATATYPE: number;
    XML_FROM_DTD: number;
    XML_FROM_FTP: number;
    XML_FROM_HTML: number;
    XML_FROM_HTTP: number;
    XML_FROM_I18N: number;
    XML_FROM_IO: number;
    XML_FROM_MEMORY: number;
    XML_FROM_MODULE: number;
    XML_FROM_NAMESPACE: number;
    XML_FROM_NONE: number;
    XML_FROM_OUTPUT: number;
    XML_FROM_PARSER: number;
    XML_FROM_REGEXP: number;
    XML_FROM_RELAXNGP: number;
    XML_FROM_RELAXNGV: number;
    XML_FROM_SCHEMASP: number;
    XML_FROM_SCHEMASV: number;
    XML_FROM_SCHEMATRONV: number;
    XML_FROM_TREE: number;
    XML_FROM_URI: number;
    XML_FROM_VALID: number;
    XML_FROM_WRITER: number;
    XML_FROM_XINCLUDE: number;
    XML_FROM_XPATH: number;
    XML_FROM_XPOINTER: number;
    XML_FROM_XSLT: number;
    XML_FTP_ACCNT: number;
    XML_FTP_EPSV_ANSWER: number;
    XML_FTP_PASV_ANSWER: number;
    XML_FTP_URL_SYNTAX: number;
    XML_HTML_DOCUMENT_NODE: number;
    XML_HTML_STRUCURE_ERROR: number;
    XML_HTML_UNKNOWN_TAG: number;
    XML_HTTP_UNKNOWN_HOST: number;
    XML_HTTP_URL_SYNTAX: number;
    XML_HTTP_USE_IP: number;
    XML_I18N_CONV_FAILED: number;
    XML_I18N_EXCESS_HANDLER: number;
    XML_I18N_NO_HANDLER: number;
    XML_I18N_NO_NAME: number;
    XML_I18N_NO_OUTPUT: number;
    XML_INTERNAL_GENERAL_ENTITY: number;
    XML_INTERNAL_PARAMETER_ENTITY: number;
    XML_INTERNAL_PREDEFINED_ENTITY: number;
    XML_IO_BUFFER_FULL: number;
    XML_IO_EACCES: number;
    XML_IO_EADDRINUSE: number;
    XML_IO_EAFNOSUPPORT: number;
    XML_IO_EAGAIN: number;
    XML_IO_EALREADY: number;
    XML_IO_EBADF: number;
    XML_IO_EBADMSG: number;
    XML_IO_EBUSY: number;
    XML_IO_ECANCELED: number;
    XML_IO_ECHILD: number;
    XML_IO_ECONNREFUSED: number;
    XML_IO_EDEADLK: number;
    XML_IO_EDOM: number;
    XML_IO_EEXIST: number;
    XML_IO_EFAULT: number;
    XML_IO_EFBIG: number;
    XML_IO_EINPROGRESS: number;
    XML_IO_EINTR: number;
    XML_IO_EINVAL: number;
    XML_IO_EIO: number;
    XML_IO_EISCONN: number;
    XML_IO_EISDIR: number;
    XML_IO_EMFILE: number;
    XML_IO_EMLINK: number;
    XML_IO_EMSGSIZE: number;
    XML_IO_ENAMETOOLONG: number;
    XML_IO_ENCODER: number;
    XML_IO_ENETUNREACH: number;
    XML_IO_ENFILE: number;
    XML_IO_ENODEV: number;
    XML_IO_ENOENT: number;
    XML_IO_ENOEXEC: number;
    XML_IO_ENOLCK: number;
    XML_IO_ENOMEM: number;
    XML_IO_ENOSPC: number;
    XML_IO_ENOSYS: number;
    XML_IO_ENOTDIR: number;
    XML_IO_ENOTEMPTY: number;
    XML_IO_ENOTSOCK: number;
    XML_IO_ENOTSUP: number;
    XML_IO_ENOTTY: number;
    XML_IO_ENXIO: number;
    XML_IO_EPERM: number;
    XML_IO_EPIPE: number;
    XML_IO_ERANGE: number;
    XML_IO_EROFS: number;
    XML_IO_ESPIPE: number;
    XML_IO_ESRCH: number;
    XML_IO_ETIMEDOUT: number;
    XML_IO_EXDEV: number;
    XML_IO_FLUSH: number;
    XML_IO_LOAD_ERROR: number;
    XML_IO_NETWORK_ATTEMPT: number;
    XML_IO_NO_INPUT: number;
    XML_IO_UNKNOWN: number;
    XML_IO_WRITE: number;
    XML_MAX_DICTIONARY_LIMIT: number;
    XML_MAX_LOOKUP_LIMIT: number;
    XML_MAX_NAMELEN: number;
    XML_MAX_NAME_LENGTH: number;
    XML_MAX_TEXT_LENGTH: number;
    XML_MODULE_CLOSE: number;
    XML_MODULE_LAZY: number;
    XML_MODULE_LOCAL: number;
    XML_MODULE_OPEN: number;
    XML_NAMESPACE_DECL: number;
    XML_NOTATION_NODE: number;
    XML_NS_ERR_ATTRIBUTE_REDEFINED: number;
    XML_NS_ERR_COLON: number;
    XML_NS_ERR_EMPTY: number;
    XML_NS_ERR_QNAME: number;
    XML_NS_ERR_UNDEFINED_NAMESPACE: number;
    XML_NS_ERR_XML_NAMESPACE: number;
    XML_PARSER_ATTRIBUTE_VALUE: number;
    XML_PARSER_CDATA_SECTION: number;
    XML_PARSER_COMMENT: number;
    XML_PARSER_CONTENT: number;
    XML_PARSER_DTD: number;
    XML_PARSER_END_TAG: number;
    XML_PARSER_ENTITY_DECL: number;
    XML_PARSER_ENTITY_VALUE: number;
    XML_PARSER_EOF: number;
    XML_PARSER_EPILOG: number;
    XML_PARSER_IGNORE: number;
    XML_PARSER_MISC: number;
    XML_PARSER_PI: number;
    XML_PARSER_PROLOG: number;
    XML_PARSER_PUBLIC_LITERAL: number;
    XML_PARSER_SEVERITY_ERROR: number;
    XML_PARSER_SEVERITY_VALIDITY_ERROR: number;
    XML_PARSER_SEVERITY_VALIDITY_WARNING: number;
    XML_PARSER_SEVERITY_WARNING: number;
    XML_PARSER_START: number;
    XML_PARSER_START_TAG: number;
    XML_PARSER_SYSTEM_LITERAL: number;
    XML_PARSE_BIG_LINES: number;
    XML_PARSE_COMPACT: number;
    XML_PARSE_DOM: number;
    XML_PARSE_DTDATTR: number;
    XML_PARSE_DTDLOAD: number;
    XML_PARSE_DTDVALID: number;
    XML_PARSE_HUGE: number;
    XML_PARSE_IGNORE_ENC: number;
    XML_PARSE_NOBASEFIX: number;
    XML_PARSE_NOBLANKS: number;
    XML_PARSE_NOCDATA: number;
    XML_PARSE_NODICT: number;
    XML_PARSE_NOENT: number;
    XML_PARSE_NOERROR: number;
    XML_PARSE_NONET: number;
    XML_PARSE_NOWARNING: number;
    XML_PARSE_NOXINCNODE: number;
    XML_PARSE_NSCLEAN: number;
    XML_PARSE_OLD10: number;
    XML_PARSE_OLDSAX: number;
    XML_PARSE_PEDANTIC: number;
    XML_PARSE_PUSH_DOM: number;
    XML_PARSE_PUSH_SAX: number;
    XML_PARSE_READER: number;
    XML_PARSE_RECOVER: number;
    XML_PARSE_SAX: number;
    XML_PARSE_SAX1: number;
    XML_PARSE_UNKNOWN: number;
    XML_PARSE_XINCLUDE: number;
    XML_PATTERN_DEFAULT: number;
    XML_PATTERN_XPATH: number;
    XML_PATTERN_XSFIELD: number;
    XML_PATTERN_XSSEL: number;
    XML_PI_NODE: number;
    XML_REGEXP_COMPILE_ERROR: number;
    XML_RELAXNGP_CRNG: number;
    XML_RELAXNGP_FREE_DOC: number;
    XML_RELAXNGP_NONE: number;
    XML_RELAXNG_ERR_ATTREXTRANS: number;
    XML_RELAXNG_ERR_ATTRNAME: number;
    XML_RELAXNG_ERR_ATTRNONS: number;
    XML_RELAXNG_ERR_ATTRVALID: number;
    XML_RELAXNG_ERR_ATTRWRONGNS: number;
    XML_RELAXNG_ERR_CONTENTVALID: number;
    XML_RELAXNG_ERR_DATAELEM: number;
    XML_RELAXNG_ERR_DATATYPE: number;
    XML_RELAXNG_ERR_DUPID: number;
    XML_RELAXNG_ERR_ELEMEXTRANS: number;
    XML_RELAXNG_ERR_ELEMNAME: number;
    XML_RELAXNG_ERR_ELEMNONS: number;
    XML_RELAXNG_ERR_ELEMNOTEMPTY: number;
    XML_RELAXNG_ERR_ELEMWRONG: number;
    XML_RELAXNG_ERR_ELEMWRONGNS: number;
    XML_RELAXNG_ERR_EXTRACONTENT: number;
    XML_RELAXNG_ERR_EXTRADATA: number;
    XML_RELAXNG_ERR_INTEREXTRA: number;
    XML_RELAXNG_ERR_INTERNAL: number;
    XML_RELAXNG_ERR_INTERNODATA: number;
    XML_RELAXNG_ERR_INTERSEQ: number;
    XML_RELAXNG_ERR_INVALIDATTR: number;
    XML_RELAXNG_ERR_LACKDATA: number;
    XML_RELAXNG_ERR_LIST: number;
    XML_RELAXNG_ERR_LISTELEM: number;
    XML_RELAXNG_ERR_LISTEMPTY: number;
    XML_RELAXNG_ERR_LISTEXTRA: number;
    XML_RELAXNG_ERR_MEMORY: number;
    XML_RELAXNG_ERR_NODEFINE: number;
    XML_RELAXNG_ERR_NOELEM: number;
    XML_RELAXNG_ERR_NOGRAMMAR: number;
    XML_RELAXNG_ERR_NOSTATE: number;
    XML_RELAXNG_ERR_NOTELEM: number;
    XML_RELAXNG_ERR_TEXTWRONG: number;
    XML_RELAXNG_ERR_TYPE: number;
    XML_RELAXNG_ERR_TYPECMP: number;
    XML_RELAXNG_ERR_TYPEVAL: number;
    XML_RELAXNG_ERR_VALELEM: number;
    XML_RELAXNG_ERR_VALUE: number;
    XML_RELAXNG_OK: number;
    XML_RNGP_ANYNAME_ATTR_ANCESTOR: number;
    XML_RNGP_ATTRIBUTE_CHILDREN: number;
    XML_RNGP_ATTRIBUTE_CONTENT: number;
    XML_RNGP_ATTRIBUTE_EMPTY: number;
    XML_RNGP_ATTRIBUTE_NOOP: number;
    XML_RNGP_ATTR_CONFLICT: number;
    XML_RNGP_CHOICE_CONTENT: number;
    XML_RNGP_CHOICE_EMPTY: number;
    XML_RNGP_CREATE_FAILURE: number;
    XML_RNGP_DATA_CONTENT: number;
    XML_RNGP_DEFINE_CREATE_FAILED: number;
    XML_RNGP_DEFINE_EMPTY: number;
    XML_RNGP_DEFINE_MISSING: number;
    XML_RNGP_DEFINE_NAME_MISSING: number;
    XML_RNGP_DEF_CHOICE_AND_INTERLEAVE: number;
    XML_RNGP_ELEMENT_CONTENT: number;
    XML_RNGP_ELEMENT_EMPTY: number;
    XML_RNGP_ELEMENT_NAME: number;
    XML_RNGP_ELEMENT_NO_CONTENT: number;
    XML_RNGP_ELEM_CONTENT_EMPTY: number;
    XML_RNGP_ELEM_CONTENT_ERROR: number;
    XML_RNGP_ELEM_TEXT_CONFLICT: number;
    XML_RNGP_EMPTY: number;
    XML_RNGP_EMPTY_CONSTRUCT: number;
    XML_RNGP_EMPTY_CONTENT: number;
    XML_RNGP_EMPTY_NOT_EMPTY: number;
    XML_RNGP_ERROR_TYPE_LIB: number;
    XML_RNGP_EXCEPT_EMPTY: number;
    XML_RNGP_EXCEPT_MISSING: number;
    XML_RNGP_EXCEPT_MULTIPLE: number;
    XML_RNGP_EXCEPT_NO_CONTENT: number;
    XML_RNGP_EXTERNALREF_EMTPY: number;
    XML_RNGP_EXTERNALREF_RECURSE: number;
    XML_RNGP_EXTERNAL_REF_FAILURE: number;
    XML_RNGP_FORBIDDEN_ATTRIBUTE: number;
    XML_RNGP_FOREIGN_ELEMENT: number;
    XML_RNGP_GRAMMAR_CONTENT: number;
    XML_RNGP_GRAMMAR_EMPTY: number;
    XML_RNGP_GRAMMAR_MISSING: number;
    XML_RNGP_GRAMMAR_NO_START: number;
    XML_RNGP_GROUP_ATTR_CONFLICT: number;
    XML_RNGP_HREF_ERROR: number;
    XML_RNGP_INCLUDE_EMPTY: number;
    XML_RNGP_INCLUDE_FAILURE: number;
    XML_RNGP_INCLUDE_RECURSE: number;
    XML_RNGP_INTERLEAVE_ADD: number;
    XML_RNGP_INTERLEAVE_CREATE_FAILED: number;
    XML_RNGP_INTERLEAVE_EMPTY: number;
    XML_RNGP_INTERLEAVE_NO_CONTENT: number;
    XML_RNGP_INVALID_DEFINE_NAME: number;
    XML_RNGP_INVALID_URI: number;
    XML_RNGP_INVALID_VALUE: number;
    XML_RNGP_MISSING_HREF: number;
    XML_RNGP_NAME_MISSING: number;
    XML_RNGP_NEED_COMBINE: number;
    XML_RNGP_NOTALLOWED_NOT_EMPTY: number;
    XML_RNGP_NSNAME_ATTR_ANCESTOR: number;
    XML_RNGP_NSNAME_NO_NS: number;
    XML_RNGP_PARAM_FORBIDDEN: number;
    XML_RNGP_PARAM_NAME_MISSING: number;
    XML_RNGP_PARENTREF_CREATE_FAILED: number;
    XML_RNGP_PARENTREF_NAME_INVALID: number;
    XML_RNGP_PARENTREF_NOT_EMPTY: number;
    XML_RNGP_PARENTREF_NO_NAME: number;
    XML_RNGP_PARENTREF_NO_PARENT: number;
    XML_RNGP_PARSE_ERROR: number;
    XML_RNGP_PAT_ANYNAME_EXCEPT_ANYNAME: number;
    XML_RNGP_PAT_ATTR_ATTR: number;
    XML_RNGP_PAT_ATTR_ELEM: number;
    XML_RNGP_PAT_DATA_EXCEPT_ATTR: number;
    XML_RNGP_PAT_DATA_EXCEPT_ELEM: number;
    XML_RNGP_PAT_DATA_EXCEPT_EMPTY: number;
    XML_RNGP_PAT_DATA_EXCEPT_GROUP: number;
    XML_RNGP_PAT_DATA_EXCEPT_INTERLEAVE: number;
    XML_RNGP_PAT_DATA_EXCEPT_LIST: number;
    XML_RNGP_PAT_DATA_EXCEPT_ONEMORE: number;
    XML_RNGP_PAT_DATA_EXCEPT_REF: number;
    XML_RNGP_PAT_DATA_EXCEPT_TEXT: number;
    XML_RNGP_PAT_LIST_ATTR: number;
    XML_RNGP_PAT_LIST_ELEM: number;
    XML_RNGP_PAT_LIST_INTERLEAVE: number;
    XML_RNGP_PAT_LIST_LIST: number;
    XML_RNGP_PAT_LIST_REF: number;
    XML_RNGP_PAT_LIST_TEXT: number;
    XML_RNGP_PAT_NSNAME_EXCEPT_ANYNAME: number;
    XML_RNGP_PAT_NSNAME_EXCEPT_NSNAME: number;
    XML_RNGP_PAT_ONEMORE_GROUP_ATTR: number;
    XML_RNGP_PAT_ONEMORE_INTERLEAVE_ATTR: number;
    XML_RNGP_PAT_START_ATTR: number;
    XML_RNGP_PAT_START_DATA: number;
    XML_RNGP_PAT_START_EMPTY: number;
    XML_RNGP_PAT_START_GROUP: number;
    XML_RNGP_PAT_START_INTERLEAVE: number;
    XML_RNGP_PAT_START_LIST: number;
    XML_RNGP_PAT_START_ONEMORE: number;
    XML_RNGP_PAT_START_TEXT: number;
    XML_RNGP_PAT_START_VALUE: number;
    XML_RNGP_PREFIX_UNDEFINED: number;
    XML_RNGP_REF_CREATE_FAILED: number;
    XML_RNGP_REF_CYCLE: number;
    XML_RNGP_REF_NAME_INVALID: number;
    XML_RNGP_REF_NOT_EMPTY: number;
    XML_RNGP_REF_NO_DEF: number;
    XML_RNGP_REF_NO_NAME: number;
    XML_RNGP_START_CHOICE_AND_INTERLEAVE: number;
    XML_RNGP_START_CONTENT: number;
    XML_RNGP_START_EMPTY: number;
    XML_RNGP_START_MISSING: number;
    XML_RNGP_TEXT_EXPECTED: number;
    XML_RNGP_TEXT_HAS_CHILD: number;
    XML_RNGP_TYPE_MISSING: number;
    XML_RNGP_TYPE_NOT_FOUND: number;
    XML_RNGP_TYPE_VALUE: number;
    XML_RNGP_UNKNOWN_ATTRIBUTE: number;
    XML_RNGP_UNKNOWN_COMBINE: number;
    XML_RNGP_UNKNOWN_CONSTRUCT: number;
    XML_RNGP_UNKNOWN_TYPE_LIB: number;
    XML_RNGP_URI_FRAGMENT: number;
    XML_RNGP_URI_NOT_ABSOLUTE: number;
    XML_RNGP_VALUE_EMPTY: number;
    XML_RNGP_VALUE_NO_CONTENT: number;
    XML_RNGP_XMLNS_NAME: number;
    XML_RNGP_XML_NS: number;
    XML_SAVE_AS_HTML: number;
    XML_SAVE_AS_XML: number;
    XML_SAVE_CHAR_INVALID: number;
    XML_SAVE_FORMAT: number;
    XML_SAVE_NOT_UTF8: number;
    XML_SAVE_NO_DECL: number;
    XML_SAVE_NO_DOCTYPE: number;
    XML_SAVE_NO_EMPTY: number;
    XML_SAVE_NO_XHTML: number;
    XML_SAVE_UNKNOWN_ENCODING: number;
    XML_SAVE_WSNONSIG: number;
    XML_SAVE_XHTML: number;
    XML_SAX2_MAGIC: number;
    XML_SCHEMAP_AG_PROPS_CORRECT: number;
    XML_SCHEMAP_ATTRFORMDEFAULT_VALUE: number;
    XML_SCHEMAP_ATTRGRP_NONAME_NOREF: number;
    XML_SCHEMAP_ATTR_NONAME_NOREF: number;
    XML_SCHEMAP_AU_PROPS_CORRECT: number;
    XML_SCHEMAP_AU_PROPS_CORRECT_2: number;
    XML_SCHEMAP_A_PROPS_CORRECT_2: number;
    XML_SCHEMAP_A_PROPS_CORRECT_3: number;
    XML_SCHEMAP_COMPLEXTYPE_NONAME_NOREF: number;
    XML_SCHEMAP_COS_ALL_LIMITED: number;
    XML_SCHEMAP_COS_CT_EXTENDS_1_1: number;
    XML_SCHEMAP_COS_CT_EXTENDS_1_2: number;
    XML_SCHEMAP_COS_CT_EXTENDS_1_3: number;
    XML_SCHEMAP_COS_ST_DERIVED_OK_2_1: number;
    XML_SCHEMAP_COS_ST_DERIVED_OK_2_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_1_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_1_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_1_3_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_1_3_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_1_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_1_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_2_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_2_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_2_3: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_2_4: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_2_3_2_5: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_1_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_2_1: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_2_2: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_2_3: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_2_4: number;
    XML_SCHEMAP_COS_ST_RESTRICTS_3_3_2_5: number;
    XML_SCHEMAP_COS_VALID_DEFAULT_1: number;
    XML_SCHEMAP_COS_VALID_DEFAULT_2_1: number;
    XML_SCHEMAP_COS_VALID_DEFAULT_2_2_1: number;
    XML_SCHEMAP_COS_VALID_DEFAULT_2_2_2: number;
    XML_SCHEMAP_CT_PROPS_CORRECT_1: number;
    XML_SCHEMAP_CT_PROPS_CORRECT_2: number;
    XML_SCHEMAP_CT_PROPS_CORRECT_3: number;
    XML_SCHEMAP_CT_PROPS_CORRECT_4: number;
    XML_SCHEMAP_CT_PROPS_CORRECT_5: number;
    XML_SCHEMAP_CVC_SIMPLE_TYPE: number;
    XML_SCHEMAP_C_PROPS_CORRECT: number;
    XML_SCHEMAP_DEF_AND_PREFIX: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_1: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_2_1_1: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_2_1_2: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_2_1_3: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_2_2: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_3: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_4_1: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_4_2: number;
    XML_SCHEMAP_DERIVATION_OK_RESTRICTION_4_3: number;
    XML_SCHEMAP_ELEMFORMDEFAULT_VALUE: number;
    XML_SCHEMAP_ELEM_DEFAULT_FIXED: number;
    XML_SCHEMAP_ELEM_NONAME_NOREF: number;
    XML_SCHEMAP_EXTENSION_NO_BASE: number;
    XML_SCHEMAP_E_PROPS_CORRECT_2: number;
    XML_SCHEMAP_E_PROPS_CORRECT_3: number;
    XML_SCHEMAP_E_PROPS_CORRECT_4: number;
    XML_SCHEMAP_E_PROPS_CORRECT_5: number;
    XML_SCHEMAP_E_PROPS_CORRECT_6: number;
    XML_SCHEMAP_FACET_NO_VALUE: number;
    XML_SCHEMAP_FAILED_BUILD_IMPORT: number;
    XML_SCHEMAP_FAILED_LOAD: number;
    XML_SCHEMAP_FAILED_PARSE: number;
    XML_SCHEMAP_GROUP_NONAME_NOREF: number;
    XML_SCHEMAP_IMPORT_NAMESPACE_NOT_URI: number;
    XML_SCHEMAP_IMPORT_REDEFINE_NSNAME: number;
    XML_SCHEMAP_IMPORT_SCHEMA_NOT_URI: number;
    XML_SCHEMAP_INCLUDE_SCHEMA_NOT_URI: number;
    XML_SCHEMAP_INCLUDE_SCHEMA_NO_URI: number;
    XML_SCHEMAP_INTERNAL: number;
    XML_SCHEMAP_INTERSECTION_NOT_EXPRESSIBLE: number;
    XML_SCHEMAP_INVALID_ATTR_COMBINATION: number;
    XML_SCHEMAP_INVALID_ATTR_INLINE_COMBINATION: number;
    XML_SCHEMAP_INVALID_ATTR_NAME: number;
    XML_SCHEMAP_INVALID_ATTR_USE: number;
    XML_SCHEMAP_INVALID_BOOLEAN: number;
    XML_SCHEMAP_INVALID_ENUM: number;
    XML_SCHEMAP_INVALID_FACET: number;
    XML_SCHEMAP_INVALID_FACET_VALUE: number;
    XML_SCHEMAP_INVALID_MAXOCCURS: number;
    XML_SCHEMAP_INVALID_MINOCCURS: number;
    XML_SCHEMAP_INVALID_REF_AND_SUBTYPE: number;
    XML_SCHEMAP_INVALID_WHITE_SPACE: number;
    XML_SCHEMAP_MG_PROPS_CORRECT_1: number;
    XML_SCHEMAP_MG_PROPS_CORRECT_2: number;
    XML_SCHEMAP_MISSING_SIMPLETYPE_CHILD: number;
    XML_SCHEMAP_NOATTR_NOREF: number;
    XML_SCHEMAP_NOROOT: number;
    XML_SCHEMAP_NOTATION_NO_NAME: number;
    XML_SCHEMAP_NOTHING_TO_PARSE: number;
    XML_SCHEMAP_NOTYPE_NOREF: number;
    XML_SCHEMAP_NOT_DETERMINISTIC: number;
    XML_SCHEMAP_NOT_SCHEMA: number;
    XML_SCHEMAP_NO_XMLNS: number;
    XML_SCHEMAP_NO_XSI: number;
    XML_SCHEMAP_PREFIX_UNDEFINED: number;
    XML_SCHEMAP_P_PROPS_CORRECT_1: number;
    XML_SCHEMAP_P_PROPS_CORRECT_2_1: number;
    XML_SCHEMAP_P_PROPS_CORRECT_2_2: number;
    XML_SCHEMAP_RECURSIVE: number;
    XML_SCHEMAP_REDEFINED_ATTR: number;
    XML_SCHEMAP_REDEFINED_ATTRGROUP: number;
    XML_SCHEMAP_REDEFINED_ELEMENT: number;
    XML_SCHEMAP_REDEFINED_GROUP: number;
    XML_SCHEMAP_REDEFINED_NOTATION: number;
    XML_SCHEMAP_REDEFINED_TYPE: number;
    XML_SCHEMAP_REF_AND_CONTENT: number;
    XML_SCHEMAP_REF_AND_SUBTYPE: number;
    XML_SCHEMAP_REGEXP_INVALID: number;
    XML_SCHEMAP_RESTRICTION_NONAME_NOREF: number;
    XML_SCHEMAP_S4S_ATTR_INVALID_VALUE: number;
    XML_SCHEMAP_S4S_ATTR_MISSING: number;
    XML_SCHEMAP_S4S_ATTR_NOT_ALLOWED: number;
    XML_SCHEMAP_S4S_ELEM_MISSING: number;
    XML_SCHEMAP_S4S_ELEM_NOT_ALLOWED: number;
    XML_SCHEMAP_SIMPLETYPE_NONAME: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_1: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_2: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_3_1: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_3_2: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_4: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_GROUP_1: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_GROUP_2: number;
    XML_SCHEMAP_SRC_ATTRIBUTE_GROUP_3: number;
    XML_SCHEMAP_SRC_CT_1: number;
    XML_SCHEMAP_SRC_ELEMENT_1: number;
    XML_SCHEMAP_SRC_ELEMENT_2_1: number;
    XML_SCHEMAP_SRC_ELEMENT_2_2: number;
    XML_SCHEMAP_SRC_ELEMENT_3: number;
    XML_SCHEMAP_SRC_IMPORT: number;
    XML_SCHEMAP_SRC_IMPORT_1_1: number;
    XML_SCHEMAP_SRC_IMPORT_1_2: number;
    XML_SCHEMAP_SRC_IMPORT_2: number;
    XML_SCHEMAP_SRC_IMPORT_2_1: number;
    XML_SCHEMAP_SRC_IMPORT_2_2: number;
    XML_SCHEMAP_SRC_IMPORT_3_1: number;
    XML_SCHEMAP_SRC_IMPORT_3_2: number;
    XML_SCHEMAP_SRC_INCLUDE: number;
    XML_SCHEMAP_SRC_LIST_ITEMTYPE_OR_SIMPLETYPE: number;
    XML_SCHEMAP_SRC_REDEFINE: number;
    XML_SCHEMAP_SRC_RESOLVE: number;
    XML_SCHEMAP_SRC_RESTRICTION_BASE_OR_SIMPLETYPE: number;
    XML_SCHEMAP_SRC_SIMPLE_TYPE_1: number;
    XML_SCHEMAP_SRC_SIMPLE_TYPE_2: number;
    XML_SCHEMAP_SRC_SIMPLE_TYPE_3: number;
    XML_SCHEMAP_SRC_SIMPLE_TYPE_4: number;
    XML_SCHEMAP_SRC_UNION_MEMBERTYPES_OR_SIMPLETYPES: number;
    XML_SCHEMAP_ST_PROPS_CORRECT_1: number;
    XML_SCHEMAP_ST_PROPS_CORRECT_2: number;
    XML_SCHEMAP_ST_PROPS_CORRECT_3: number;
    XML_SCHEMAP_SUPERNUMEROUS_LIST_ITEM_TYPE: number;
    XML_SCHEMAP_TYPE_AND_SUBTYPE: number;
    XML_SCHEMAP_UNION_NOT_EXPRESSIBLE: number;
    XML_SCHEMAP_UNKNOWN_ALL_CHILD: number;
    XML_SCHEMAP_UNKNOWN_ANYATTRIBUTE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_ATTRGRP_CHILD: number;
    XML_SCHEMAP_UNKNOWN_ATTRIBUTE_GROUP: number;
    XML_SCHEMAP_UNKNOWN_ATTR_CHILD: number;
    XML_SCHEMAP_UNKNOWN_BASE_TYPE: number;
    XML_SCHEMAP_UNKNOWN_CHOICE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_COMPLEXCONTENT_CHILD: number;
    XML_SCHEMAP_UNKNOWN_COMPLEXTYPE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_ELEM_CHILD: number;
    XML_SCHEMAP_UNKNOWN_EXTENSION_CHILD: number;
    XML_SCHEMAP_UNKNOWN_FACET_CHILD: number;
    XML_SCHEMAP_UNKNOWN_FACET_TYPE: number;
    XML_SCHEMAP_UNKNOWN_GROUP_CHILD: number;
    XML_SCHEMAP_UNKNOWN_IMPORT_CHILD: number;
    XML_SCHEMAP_UNKNOWN_INCLUDE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_LIST_CHILD: number;
    XML_SCHEMAP_UNKNOWN_MEMBER_TYPE: number;
    XML_SCHEMAP_UNKNOWN_NOTATION_CHILD: number;
    XML_SCHEMAP_UNKNOWN_PREFIX: number;
    XML_SCHEMAP_UNKNOWN_PROCESSCONTENT_CHILD: number;
    XML_SCHEMAP_UNKNOWN_REF: number;
    XML_SCHEMAP_UNKNOWN_RESTRICTION_CHILD: number;
    XML_SCHEMAP_UNKNOWN_SCHEMAS_CHILD: number;
    XML_SCHEMAP_UNKNOWN_SEQUENCE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_SIMPLECONTENT_CHILD: number;
    XML_SCHEMAP_UNKNOWN_SIMPLETYPE_CHILD: number;
    XML_SCHEMAP_UNKNOWN_TYPE: number;
    XML_SCHEMAP_UNKNOWN_UNION_CHILD: number;
    XML_SCHEMAP_WARN_ATTR_POINTLESS_PROH: number;
    XML_SCHEMAP_WARN_ATTR_REDECL_PROH: number;
    XML_SCHEMAP_WARN_SKIP_SCHEMA: number;
    XML_SCHEMAP_WARN_UNLOCATED_SCHEMA: number;
    XML_SCHEMAP_WILDCARD_INVALID_NS_MEMBER: number;
    XML_SCHEMAS_ANYATTR_LAX: number;
    XML_SCHEMAS_ANYATTR_SKIP: number;
    XML_SCHEMAS_ANYATTR_STRICT: number;
    XML_SCHEMAS_ANYSIMPLETYPE: number;
    XML_SCHEMAS_ANYTYPE: number;
    XML_SCHEMAS_ANYURI: number;
    XML_SCHEMAS_ANY_LAX: number;
    XML_SCHEMAS_ANY_SKIP: number;
    XML_SCHEMAS_ANY_STRICT: number;
    XML_SCHEMAS_ATTRGROUP_GLOBAL: number;
    XML_SCHEMAS_ATTRGROUP_HAS_REFS: number;
    XML_SCHEMAS_ATTRGROUP_MARKED: number;
    XML_SCHEMAS_ATTRGROUP_REDEFINED: number;
    XML_SCHEMAS_ATTRGROUP_WILDCARD_BUILDED: number;
    XML_SCHEMAS_ATTR_FIXED: number;
    XML_SCHEMAS_ATTR_GLOBAL: number;
    XML_SCHEMAS_ATTR_INTERNAL_RESOLVED: number;
    XML_SCHEMAS_ATTR_NSDEFAULT: number;
    XML_SCHEMAS_ATTR_USE_OPTIONAL: number;
    XML_SCHEMAS_ATTR_USE_PROHIBITED: number;
    XML_SCHEMAS_ATTR_USE_REQUIRED: number;
    XML_SCHEMAS_BASE64BINARY: number;
    XML_SCHEMAS_BLOCK_DEFAULT_EXTENSION: number;
    XML_SCHEMAS_BLOCK_DEFAULT_RESTRICTION: number;
    XML_SCHEMAS_BLOCK_DEFAULT_SUBSTITUTION: number;
    XML_SCHEMAS_BOOLEAN: number;
    XML_SCHEMAS_BYTE: number;
    XML_SCHEMAS_DATE: number;
    XML_SCHEMAS_DATETIME: number;
    XML_SCHEMAS_DECIMAL: number;
    XML_SCHEMAS_DOUBLE: number;
    XML_SCHEMAS_DURATION: number;
    XML_SCHEMAS_ELEM_ABSTRACT: number;
    XML_SCHEMAS_ELEM_BLOCK_ABSENT: number;
    XML_SCHEMAS_ELEM_BLOCK_EXTENSION: number;
    XML_SCHEMAS_ELEM_BLOCK_RESTRICTION: number;
    XML_SCHEMAS_ELEM_BLOCK_SUBSTITUTION: number;
    XML_SCHEMAS_ELEM_CIRCULAR: number;
    XML_SCHEMAS_ELEM_DEFAULT: number;
    XML_SCHEMAS_ELEM_FINAL_ABSENT: number;
    XML_SCHEMAS_ELEM_FINAL_EXTENSION: number;
    XML_SCHEMAS_ELEM_FINAL_RESTRICTION: number;
    XML_SCHEMAS_ELEM_FIXED: number;
    XML_SCHEMAS_ELEM_GLOBAL: number;
    XML_SCHEMAS_ELEM_INTERNAL_CHECKED: number;
    XML_SCHEMAS_ELEM_INTERNAL_RESOLVED: number;
    XML_SCHEMAS_ELEM_NILLABLE: number;
    XML_SCHEMAS_ELEM_NSDEFAULT: number;
    XML_SCHEMAS_ELEM_REF: number;
    XML_SCHEMAS_ELEM_SUBST_GROUP_HEAD: number;
    XML_SCHEMAS_ELEM_TOPLEVEL: number;
    XML_SCHEMAS_ENTITIES: number;
    XML_SCHEMAS_ENTITY: number;
    XML_SCHEMAS_ERR_: number;
    XML_SCHEMAS_ERR_ATTRINVALID: number;
    XML_SCHEMAS_ERR_ATTRUNKNOWN: number;
    XML_SCHEMAS_ERR_CONSTRUCT: number;
    XML_SCHEMAS_ERR_ELEMCONT: number;
    XML_SCHEMAS_ERR_EXTRACONTENT: number;
    XML_SCHEMAS_ERR_FACET: number;
    XML_SCHEMAS_ERR_HAVEDEFAULT: number;
    XML_SCHEMAS_ERR_INTERNAL: number;
    XML_SCHEMAS_ERR_INVALIDATTR: number;
    XML_SCHEMAS_ERR_INVALIDELEM: number;
    XML_SCHEMAS_ERR_ISABSTRACT: number;
    XML_SCHEMAS_ERR_MISSING: number;
    XML_SCHEMAS_ERR_NOROLLBACK: number;
    XML_SCHEMAS_ERR_NOROOT: number;
    XML_SCHEMAS_ERR_NOTDETERMINIST: number;
    XML_SCHEMAS_ERR_NOTEMPTY: number;
    XML_SCHEMAS_ERR_NOTNILLABLE: number;
    XML_SCHEMAS_ERR_NOTSIMPLE: number;
    XML_SCHEMAS_ERR_NOTTOPLEVEL: number;
    XML_SCHEMAS_ERR_NOTYPE: number;
    XML_SCHEMAS_ERR_OK: number;
    XML_SCHEMAS_ERR_UNDECLAREDELEM: number;
    XML_SCHEMAS_ERR_VALUE: number;
    XML_SCHEMAS_ERR_WRONGELEM: number;
    XML_SCHEMAS_ERR_XXX: number;
    XML_SCHEMAS_FACET_COLLAPSE: number;
    XML_SCHEMAS_FACET_PRESERVE: number;
    XML_SCHEMAS_FACET_REPLACE: number;
    XML_SCHEMAS_FACET_UNKNOWN: number;
    XML_SCHEMAS_FINAL_DEFAULT_EXTENSION: number;
    XML_SCHEMAS_FINAL_DEFAULT_LIST: number;
    XML_SCHEMAS_FINAL_DEFAULT_RESTRICTION: number;
    XML_SCHEMAS_FINAL_DEFAULT_UNION: number;
    XML_SCHEMAS_FLOAT: number;
    XML_SCHEMAS_GDAY: number;
    XML_SCHEMAS_GMONTH: number;
    XML_SCHEMAS_GMONTHDAY: number;
    XML_SCHEMAS_GYEAR: number;
    XML_SCHEMAS_GYEARMONTH: number;
    XML_SCHEMAS_HEXBINARY: number;
    XML_SCHEMAS_ID: number;
    XML_SCHEMAS_IDREF: number;
    XML_SCHEMAS_IDREFS: number;
    XML_SCHEMAS_INCLUDING_CONVERT_NS: number;
    XML_SCHEMAS_INT: number;
    XML_SCHEMAS_INTEGER: number;
    XML_SCHEMAS_LANGUAGE: number;
    XML_SCHEMAS_LONG: number;
    XML_SCHEMAS_NAME: number;
    XML_SCHEMAS_NCNAME: number;
    XML_SCHEMAS_NINTEGER: number;
    XML_SCHEMAS_NMTOKEN: number;
    XML_SCHEMAS_NMTOKENS: number;
    XML_SCHEMAS_NNINTEGER: number;
    XML_SCHEMAS_NORMSTRING: number;
    XML_SCHEMAS_NOTATION: number;
    XML_SCHEMAS_NPINTEGER: number;
    XML_SCHEMAS_PINTEGER: number;
    XML_SCHEMAS_QNAME: number;
    XML_SCHEMAS_QUALIF_ATTR: number;
    XML_SCHEMAS_QUALIF_ELEM: number;
    XML_SCHEMAS_SHORT: number;
    XML_SCHEMAS_STRING: number;
    XML_SCHEMAS_TIME: number;
    XML_SCHEMAS_TOKEN: number;
    XML_SCHEMAS_TYPE_ABSTRACT: number;
    XML_SCHEMAS_TYPE_BLOCK_DEFAULT: number;
    XML_SCHEMAS_TYPE_BLOCK_EXTENSION: number;
    XML_SCHEMAS_TYPE_BLOCK_RESTRICTION: number;
    XML_SCHEMAS_TYPE_BUILTIN_PRIMITIVE: number;
    XML_SCHEMAS_TYPE_DERIVATION_METHOD_EXTENSION: number;
    XML_SCHEMAS_TYPE_DERIVATION_METHOD_RESTRICTION: number;
    XML_SCHEMAS_TYPE_FACETSNEEDVALUE: number;
    XML_SCHEMAS_TYPE_FINAL_DEFAULT: number;
    XML_SCHEMAS_TYPE_FINAL_EXTENSION: number;
    XML_SCHEMAS_TYPE_FINAL_LIST: number;
    XML_SCHEMAS_TYPE_FINAL_RESTRICTION: number;
    XML_SCHEMAS_TYPE_FINAL_UNION: number;
    XML_SCHEMAS_TYPE_FIXUP_1: number;
    XML_SCHEMAS_TYPE_GLOBAL: number;
    XML_SCHEMAS_TYPE_HAS_FACETS: number;
    XML_SCHEMAS_TYPE_INTERNAL_INVALID: number;
    XML_SCHEMAS_TYPE_INTERNAL_RESOLVED: number;
    XML_SCHEMAS_TYPE_MARKED: number;
    XML_SCHEMAS_TYPE_MIXED: number;
    XML_SCHEMAS_TYPE_NORMVALUENEEDED: number;
    XML_SCHEMAS_TYPE_OWNED_ATTR_WILDCARD: number;
    XML_SCHEMAS_TYPE_REDEFINED: number;
    XML_SCHEMAS_TYPE_VARIETY_ABSENT: number;
    XML_SCHEMAS_TYPE_VARIETY_ATOMIC: number;
    XML_SCHEMAS_TYPE_VARIETY_LIST: number;
    XML_SCHEMAS_TYPE_VARIETY_UNION: number;
    XML_SCHEMAS_TYPE_WHITESPACE_COLLAPSE: number;
    XML_SCHEMAS_TYPE_WHITESPACE_PRESERVE: number;
    XML_SCHEMAS_TYPE_WHITESPACE_REPLACE: number;
    XML_SCHEMAS_UBYTE: number;
    XML_SCHEMAS_UINT: number;
    XML_SCHEMAS_ULONG: number;
    XML_SCHEMAS_UNKNOWN: number;
    XML_SCHEMAS_USHORT: number;
    XML_SCHEMAS_WILDCARD_COMPLETE: number;
    XML_SCHEMATRONV_ASSERT: number;
    XML_SCHEMATRONV_REPORT: number;
    XML_SCHEMAV_ATTRINVALID: number;
    XML_SCHEMAV_ATTRUNKNOWN: number;
    XML_SCHEMAV_CONSTRUCT: number;
    XML_SCHEMAV_CVC_ATTRIBUTE_1: number;
    XML_SCHEMAV_CVC_ATTRIBUTE_2: number;
    XML_SCHEMAV_CVC_ATTRIBUTE_3: number;
    XML_SCHEMAV_CVC_ATTRIBUTE_4: number;
    XML_SCHEMAV_CVC_AU: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_1: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_2_1: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_2_2: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_2_3: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_2_4: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_3_1: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_3_2_1: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_3_2_2: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_4: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_5_1: number;
    XML_SCHEMAV_CVC_COMPLEX_TYPE_5_2: number;
    XML_SCHEMAV_CVC_DATATYPE_VALID_1_2_1: number;
    XML_SCHEMAV_CVC_DATATYPE_VALID_1_2_2: number;
    XML_SCHEMAV_CVC_DATATYPE_VALID_1_2_3: number;
    XML_SCHEMAV_CVC_ELT_1: number;
    XML_SCHEMAV_CVC_ELT_2: number;
    XML_SCHEMAV_CVC_ELT_3_1: number;
    XML_SCHEMAV_CVC_ELT_3_2_1: number;
    XML_SCHEMAV_CVC_ELT_3_2_2: number;
    XML_SCHEMAV_CVC_ELT_4_1: number;
    XML_SCHEMAV_CVC_ELT_4_2: number;
    XML_SCHEMAV_CVC_ELT_4_3: number;
    XML_SCHEMAV_CVC_ELT_5_1_1: number;
    XML_SCHEMAV_CVC_ELT_5_1_2: number;
    XML_SCHEMAV_CVC_ELT_5_2_1: number;
    XML_SCHEMAV_CVC_ELT_5_2_2_1: number;
    XML_SCHEMAV_CVC_ELT_5_2_2_2_1: number;
    XML_SCHEMAV_CVC_ELT_5_2_2_2_2: number;
    XML_SCHEMAV_CVC_ELT_6: number;
    XML_SCHEMAV_CVC_ELT_7: number;
    XML_SCHEMAV_CVC_ENUMERATION_VALID: number;
    XML_SCHEMAV_CVC_FACET_VALID: number;
    XML_SCHEMAV_CVC_FRACTIONDIGITS_VALID: number;
    XML_SCHEMAV_CVC_IDC: number;
    XML_SCHEMAV_CVC_LENGTH_VALID: number;
    XML_SCHEMAV_CVC_MAXEXCLUSIVE_VALID: number;
    XML_SCHEMAV_CVC_MAXINCLUSIVE_VALID: number;
    XML_SCHEMAV_CVC_MAXLENGTH_VALID: number;
    XML_SCHEMAV_CVC_MINEXCLUSIVE_VALID: number;
    XML_SCHEMAV_CVC_MININCLUSIVE_VALID: number;
    XML_SCHEMAV_CVC_MINLENGTH_VALID: number;
    XML_SCHEMAV_CVC_PATTERN_VALID: number;
    XML_SCHEMAV_CVC_TOTALDIGITS_VALID: number;
    XML_SCHEMAV_CVC_TYPE_1: number;
    XML_SCHEMAV_CVC_TYPE_2: number;
    XML_SCHEMAV_CVC_TYPE_3_1_1: number;
    XML_SCHEMAV_CVC_TYPE_3_1_2: number;
    XML_SCHEMAV_CVC_WILDCARD: number;
    XML_SCHEMAV_DOCUMENT_ELEMENT_MISSING: number;
    XML_SCHEMAV_ELEMCONT: number;
    XML_SCHEMAV_ELEMENT_CONTENT: number;
    XML_SCHEMAV_EXTRACONTENT: number;
    XML_SCHEMAV_FACET: number;
    XML_SCHEMAV_HAVEDEFAULT: number;
    XML_SCHEMAV_INTERNAL: number;
    XML_SCHEMAV_INVALIDATTR: number;
    XML_SCHEMAV_INVALIDELEM: number;
    XML_SCHEMAV_ISABSTRACT: number;
    XML_SCHEMAV_MISC: number;
    XML_SCHEMAV_MISSING: number;
    XML_SCHEMAV_NOROLLBACK: number;
    XML_SCHEMAV_NOROOT: number;
    XML_SCHEMAV_NOTDETERMINIST: number;
    XML_SCHEMAV_NOTEMPTY: number;
    XML_SCHEMAV_NOTNILLABLE: number;
    XML_SCHEMAV_NOTSIMPLE: number;
    XML_SCHEMAV_NOTTOPLEVEL: number;
    XML_SCHEMAV_NOTYPE: number;
    XML_SCHEMAV_UNDECLAREDELEM: number;
    XML_SCHEMAV_VALUE: number;
    XML_SCHEMAV_WRONGELEM: number;
    XML_SCHEMA_CONTENT_ANY: number;
    XML_SCHEMA_CONTENT_BASIC: number;
    XML_SCHEMA_CONTENT_ELEMENTS: number;
    XML_SCHEMA_CONTENT_EMPTY: number;
    XML_SCHEMA_CONTENT_MIXED: number;
    XML_SCHEMA_CONTENT_MIXED_OR_ELEMENTS: number;
    XML_SCHEMA_CONTENT_SIMPLE: number;
    XML_SCHEMA_CONTENT_UNKNOWN: number;
    XML_SCHEMA_EXTRA_ATTR_USE_PROHIB: number;
    XML_SCHEMA_EXTRA_QNAMEREF: number;
    XML_SCHEMA_FACET_ENUMERATION: number;
    XML_SCHEMA_FACET_FRACTIONDIGITS: number;
    XML_SCHEMA_FACET_LENGTH: number;
    XML_SCHEMA_FACET_MAXEXCLUSIVE: number;
    XML_SCHEMA_FACET_MAXINCLUSIVE: number;
    XML_SCHEMA_FACET_MAXLENGTH: number;
    XML_SCHEMA_FACET_MINEXCLUSIVE: number;
    XML_SCHEMA_FACET_MININCLUSIVE: number;
    XML_SCHEMA_FACET_MINLENGTH: number;
    XML_SCHEMA_FACET_PATTERN: number;
    XML_SCHEMA_FACET_TOTALDIGITS: number;
    XML_SCHEMA_FACET_WHITESPACE: number;
    XML_SCHEMA_TYPE_ALL: number;
    XML_SCHEMA_TYPE_ANY: number;
    XML_SCHEMA_TYPE_ANY_ATTRIBUTE: number;
    XML_SCHEMA_TYPE_ATTRIBUTE: number;
    XML_SCHEMA_TYPE_ATTRIBUTEGROUP: number;
    XML_SCHEMA_TYPE_ATTRIBUTE_USE: number;
    XML_SCHEMA_TYPE_BASIC: number;
    XML_SCHEMA_TYPE_CHOICE: number;
    XML_SCHEMA_TYPE_COMPLEX: number;
    XML_SCHEMA_TYPE_COMPLEX_CONTENT: number;
    XML_SCHEMA_TYPE_ELEMENT: number;
    XML_SCHEMA_TYPE_EXTENSION: number;
    XML_SCHEMA_TYPE_FACET: number;
    XML_SCHEMA_TYPE_GROUP: number;
    XML_SCHEMA_TYPE_IDC_KEY: number;
    XML_SCHEMA_TYPE_IDC_KEYREF: number;
    XML_SCHEMA_TYPE_IDC_UNIQUE: number;
    XML_SCHEMA_TYPE_LIST: number;
    XML_SCHEMA_TYPE_NOTATION: number;
    XML_SCHEMA_TYPE_PARTICLE: number;
    XML_SCHEMA_TYPE_RESTRICTION: number;
    XML_SCHEMA_TYPE_SEQUENCE: number;
    XML_SCHEMA_TYPE_SIMPLE: number;
    XML_SCHEMA_TYPE_SIMPLE_CONTENT: number;
    XML_SCHEMA_TYPE_UNION: number;
    XML_SCHEMA_TYPE_UR: number;
    XML_SCHEMA_VAL_VC_I_CREATE: number;
    XML_SCHEMA_WHITESPACE_COLLAPSE: number;
    XML_SCHEMA_WHITESPACE_PRESERVE: number;
    XML_SCHEMA_WHITESPACE_REPLACE: number;
    XML_SCHEMA_WHITESPACE_UNKNOWN: number;
    XML_SKIP_IDS: number;
    XML_SUBSTITUTE_BOTH: number;
    XML_SUBSTITUTE_NONE: number;
    XML_SUBSTITUTE_PEREF: number;
    XML_SUBSTITUTE_REF: number;
    XML_TEXT_NODE: number;
    XML_TREE_INVALID_DEC: number;
    XML_TREE_INVALID_HEX: number;
    XML_TREE_NOT_UTF8: number;
    XML_TREE_UNTERMINATED_ENTITY: number;
    XML_WAR_CATALOG_PI: number;
    XML_WAR_ENTITY_REDEFINED: number;
    XML_WAR_LANG_VALUE: number;
    XML_WAR_NS_COLUMN: number;
    XML_WAR_NS_URI: number;
    XML_WAR_NS_URI_RELATIVE: number;
    XML_WAR_SPACE_VALUE: number;
    XML_WAR_UNDECLARED_ENTITY: number;
    XML_WAR_UNKNOWN_VERSION: number;
    XML_WITH_AUTOMATA: number;
    XML_WITH_C14N: number;
    XML_WITH_CATALOG: number;
    XML_WITH_DEBUG: number;
    XML_WITH_DEBUG_MEM: number;
    XML_WITH_DEBUG_RUN: number;
    XML_WITH_EXPR: number;
    XML_WITH_FTP: number;
    XML_WITH_HTML: number;
    XML_WITH_HTTP: number;
    XML_WITH_ICONV: number;
    XML_WITH_ICU: number;
    XML_WITH_ISO8859X: number;
    XML_WITH_LEGACY: number;
    XML_WITH_LZMA: number;
    XML_WITH_MODULES: number;
    XML_WITH_NONE: number;
    XML_WITH_OUTPUT: number;
    XML_WITH_PATTERN: number;
    XML_WITH_PUSH: number;
    XML_WITH_READER: number;
    XML_WITH_REGEXP: number;
    XML_WITH_SAX1: number;
    XML_WITH_SCHEMAS: number;
    XML_WITH_SCHEMATRON: number;
    XML_WITH_THREAD: number;
    XML_WITH_TREE: number;
    XML_WITH_UNICODE: number;
    XML_WITH_VALID: number;
    XML_WITH_WRITER: number;
    XML_WITH_XINCLUDE: number;
    XML_WITH_XPATH: number;
    XML_WITH_XPTR: number;
    XML_WITH_ZLIB: number;
    XML_XINCLUDE_BUILD_FAILED: number;
    XML_XINCLUDE_DEPRECATED_NS: number;
    XML_XINCLUDE_END: number;
    XML_XINCLUDE_ENTITY_DEF_MISMATCH: number;
    XML_XINCLUDE_FALLBACKS_IN_INCLUDE: number;
    XML_XINCLUDE_FALLBACK_NOT_IN_INCLUDE: number;
    XML_XINCLUDE_FRAGMENT_ID: number;
    XML_XINCLUDE_HREF_URI: number;
    XML_XINCLUDE_INCLUDE_IN_INCLUDE: number;
    XML_XINCLUDE_INVALID_CHAR: number;
    XML_XINCLUDE_MULTIPLE_ROOT: number;
    XML_XINCLUDE_NO_FALLBACK: number;
    XML_XINCLUDE_NO_HREF: number;
    XML_XINCLUDE_PARSE_VALUE: number;
    XML_XINCLUDE_RECURSION: number;
    XML_XINCLUDE_START: number;
    XML_XINCLUDE_TEXT_DOCUMENT: number;
    XML_XINCLUDE_TEXT_FRAGMENT: number;
    XML_XINCLUDE_UNKNOWN_ENCODING: number;
    XML_XINCLUDE_XPTR_FAILED: number;
    XML_XINCLUDE_XPTR_RESULT: number;
    XML_XPATH_CHECKNS: number;
    XML_XPATH_ENCODING_ERROR: number;
    XML_XPATH_EXPRESSION_OK: number;
    XML_XPATH_EXPR_ERROR: number;
    XML_XPATH_INVALID_ARITY: number;
    XML_XPATH_INVALID_CHAR_ERROR: number;
    XML_XPATH_INVALID_CTXT_POSITION: number;
    XML_XPATH_INVALID_CTXT_SIZE: number;
    XML_XPATH_INVALID_OPERAND: number;
    XML_XPATH_INVALID_PREDICATE_ERROR: number;
    XML_XPATH_INVALID_TYPE: number;
    XML_XPATH_MEMORY_ERROR: number;
    XML_XPATH_NOVAR: number;
    XML_XPATH_NUMBER_ERROR: number;
    XML_XPATH_START_LITERAL_ERROR: number;
    XML_XPATH_UNCLOSED_ERROR: number;
    XML_XPATH_UNDEF_PREFIX_ERROR: number;
    XML_XPATH_UNDEF_VARIABLE_ERROR: number;
    XML_XPATH_UNFINISHED_LITERAL_ERROR: number;
    XML_XPATH_UNKNOWN_FUNC_ERROR: number;
    XML_XPATH_VARIABLE_REF_ERROR: number;
    XML_XPTR_CHILDSEQ_START: number;
    XML_XPTR_EVAL_FAILED: number;
    XML_XPTR_EXTRA_OBJECTS: number;
    XML_XPTR_RESOURCE_ERROR: number;
    XML_XPTR_SUB_RESOURCE_ERROR: number;
    XML_XPTR_SYNTAX_ERROR: number;
    XML_XPTR_UNKNOWN_SCHEME: number;
    XPATH_BOOLEAN: number;
    XPATH_ENCODING_ERROR: number;
    XPATH_EXPRESSION_OK: number;
    XPATH_EXPR_ERROR: number;
    XPATH_FORBID_VARIABLE_ERROR: number;
    XPATH_INVALID_ARITY: number;
    XPATH_INVALID_CHAR_ERROR: number;
    XPATH_INVALID_CTXT: number;
    XPATH_INVALID_CTXT_POSITION: number;
    XPATH_INVALID_CTXT_SIZE: number;
    XPATH_INVALID_OPERAND: number;
    XPATH_INVALID_PREDICATE_ERROR: number;
    XPATH_INVALID_TYPE: number;
    XPATH_LOCATIONSET: number;
    XPATH_MEMORY_ERROR: number;
    XPATH_NODESET: number;
    XPATH_NUMBER: number;
    XPATH_NUMBER_ERROR: number;
    XPATH_OP_LIMIT_EXCEEDED: number;
    XPATH_POINT: number;
    XPATH_RANGE: number;
    XPATH_RECURSION_LIMIT_EXCEEDED: number;
    XPATH_STACK_ERROR: number;
    XPATH_START_LITERAL_ERROR: number;
    XPATH_STRING: number;
    XPATH_UNCLOSED_ERROR: number;
    XPATH_UNDEFINED: number;
    XPATH_UNDEF_PREFIX_ERROR: number;
    XPATH_UNDEF_VARIABLE_ERROR: number;
    XPATH_UNFINISHED_LITERAL_ERROR: number;
    XPATH_UNKNOWN_FUNC_ERROR: number;
    XPATH_USERS: number;
    XPATH_VARIABLE_REF_ERROR: number;
    XPATH_XSLT_TREE: number;
    XPTR_RESOURCE_ERROR: number;
    XPTR_SUB_RESOURCE_ERROR: number;
    XPTR_SYNTAX_ERROR: number;
    docbDefaultSAXHandler: xmlSAXHandlerV1;
    emptyExp: xmlExpNodePtr;
    forbiddenExp: xmlExpNodePtr;
    htmlDefaultSAXHandler: xmlSAXHandlerV1;
    libxmljs_debug: number;
    oldXMLWDcompatibility: number;
    xmlBufferAllocScheme: xmlBufferAllocationScheme;
    xmlDefaultBufferSize: number;
    xmlDefaultSAXHandler: xmlSAXHandlerV1;
    xmlDefaultSAXLocator: xmlSAXLocator;
    xmlDeregisterNodeDefaultValue: xmlDeregisterNodeFunc;
    xmlDoValidityCheckingDefaultValue: number;
    xmlFree: xmlFreeFunc;
    xmlGenericError: xmlGenericErrorFunc;
    xmlGenericErrorContext: any;
    xmlGetWarningsDefaultValue: number;
    xmlIndentTreeOutput: number;
    xmlIsBaseCharGroup: xmlChRangeGroup;
    xmlIsCharGroup: xmlChRangeGroup;
    xmlIsCombiningGroup: xmlChRangeGroup;
    xmlIsDigitGroup: xmlChRangeGroup;
    xmlIsExtenderGroup: xmlChRangeGroup;
    xmlIsIdeographicGroup: xmlChRangeGroup;
    xmlIsPubidChar_tab: string;
    xmlKeepBlanksDefaultValue: number;
    xmlLastError: xmlError;
    xmlLineNumbersDefaultValue: number;
    xmlLoadExtDtdDefaultValue: number;
    xmlMalloc: xmlMallocFunc;
    xmlMallocAtomic: xmlMallocFunc;
    xmlMemStrdup: xmlStrdupFunc;
    xmlOutputBufferCreateFilenameValue: xmlOutputBufferCreateFilenameFunc;
    xmlParserDebugEntities: number;
    xmlParserInputBufferCreateFilenameValue: xmlParserInputBufferCreateFilenameFunc;
    xmlParserMaxDepth: number;
    xmlParserVersion: string;
    xmlPedanticParserDefaultValue: number;
    xmlRealloc: xmlReallocFunc;
    xmlRegisterNodeDefaultValue: xmlRegisterNodeFunc;
    xmlSaveNoEmptyTags: number;
    xmlStringComment: string;
    xmlStringText: string;
    xmlStringTextNoenc: string;
    xmlStructuredError: xmlStructuredErrorFunc;
    xmlStructuredErrorContext: any;
    xmlSubstituteEntitiesDefaultValue: number;
    xmlTreeIndentString: string;
    xmlXPathNAN: number;
    xmlXPathNINF: number;
    xmlXPathPINF: number;
    withStructuredErrors: {
        <T>(callback: StructuredErrorCallback): T;
    };
    withGenericErrors: {
        <T>(callback: GenericErrorCallback): T;
    };
    UTF8ToHtml: {
        (out: string | Buffer | null, outlen: number, inArg: string | Buffer | null, inlen: number): number;
    };
    UTF8Toisolat1: {
        (out: string | Buffer | null, outlen: number, inArg: string | Buffer | null, inlen: number): number;
    };
    __docbDefaultSAXHandler: {
        (): xmlSAXHandlerV1;
    };
    __htmlDefaultSAXHandler: {
        (): xmlSAXHandlerV1;
    };
    __oldXMLWDcompatibility: {
        (): number;
    };
    __xmlBufferAllocScheme: {
        (): xmlBufferAllocationScheme;
    };
    __xmlDefaultBufferSize: {
        (): number;
    };
    __xmlDefaultSAXHandler: {
        (): xmlSAXHandlerV1;
    };
    __xmlDefaultSAXLocator: {
        (): xmlSAXLocator;
    };
    __xmlDeregisterNodeDefaultValue: {
        (): xmlDeregisterNodeFunc;
    };
    __xmlDoValidityCheckingDefaultValue: {
        (): number;
    };
    __xmlGenericError: {
        (): xmlGenericErrorFunc;
    };
    __xmlGenericErrorContext: {
        (): any;
    };
    __xmlGetWarningsDefaultValue: {
        (): number;
    };
    __xmlIndentTreeOutput: {
        (): number;
    };
    __xmlKeepBlanksDefaultValue: {
        (): number;
    };
    __xmlLastError: {
        (): xmlError;
    };
    __xmlLineNumbersDefaultValue: {
        (): number;
    };
    __xmlLoadExtDtdDefaultValue: {
        (): number;
    };
    __xmlOutputBufferCreateFilename: {
        (URI: string | Buffer | null, encoder: xmlCharEncodingHandlerPtr | null, compression: number): xmlOutputBufferPtr;
    };
    __xmlOutputBufferCreateFilenameValue: {
        (): xmlOutputBufferCreateFilenameFunc;
    };
    __xmlParserDebugEntities: {
        (): number;
    };
    __xmlParserInputBufferCreateFilename: {
        (URI: string | Buffer | null, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    __xmlParserInputBufferCreateFilenameValue: {
        (): xmlParserInputBufferCreateFilenameFunc;
    };
    __xmlParserVersion: {
        (): string;
    };
    __xmlPedanticParserDefaultValue: {
        (): number;
    };
    __xmlRegisterNodeDefaultValue: {
        (): xmlRegisterNodeFunc;
    };
    __xmlSaveNoEmptyTags: {
        (): number;
    };
    __xmlStructuredError: {
        (): xmlStructuredErrorFunc;
    };
    __xmlStructuredErrorContext: {
        (): any;
    };
    __xmlSubstituteEntitiesDefaultValue: {
        (): number;
    };
    __xmlTreeIndentString: {
        (): string;
    };
    attribute: {
        (ctx: any, fullname: string | Buffer | null, value: string | Buffer | null): any;
    };
    attributeDecl: {
        (ctx: any, elem: string | Buffer | null, fullname: string | Buffer | null, type: number, def: number, defaultValue: string | Buffer | null, tree: xmlEnumerationPtr | null): any;
    };
    cdataBlock: {
        (ctx: any, value: string | Buffer | null, len: number): any;
    };
    characters: {
        (ctx: any, ch: string | Buffer | null, len: number): any;
    };
    checkNamespace: {
        (ctx: any, nameSpace: string | Buffer | null): number;
    };
    comment: {
        (ctx: any, value: string | Buffer | null): any;
    };
    docbDefaultSAXHandlerInit: {
        (): any;
    };
    elementDecl: {
        (ctx: any, name: string | Buffer | null, type: number, content: xmlElementContentPtr | null): any;
    };
    endDocument: {
        (ctx: any): any;
    };
    endElement: {
        (ctx: any, name: string | Buffer | null): any;
    };
    entityDecl: {
        (ctx: any, name: string | Buffer | null, type: number, publicId: string | Buffer | null, systemId: string | Buffer | null, content: string | Buffer | null): any;
    };
    externalSubset: {
        (ctx: any, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): any;
    };
    getColumnNumber: {
        (ctx: any): number;
    };
    getEntity: {
        (ctx: any, name: string | Buffer | null): xmlEntityPtr;
    };
    getLineNumber: {
        (ctx: any): number;
    };
    getMemUsed: {
        (): number;
    };
    getNamespace: {
        (ctx: any): xmlNsPtr | null;
    };
    getNodeCount: {
        (): number;
    };
    getParameterEntity: {
        (ctx: any, name: string | Buffer | null): xmlEntityPtr;
    };
    getPublicId: {
        (ctx: any): string;
    };
    getSystemId: {
        (ctx: any): string;
    };
    getWrapCount: {
        (): number;
    };
    globalNamespace: {
        (ctx: any, href: string | Buffer | null, prefix: string | Buffer | null): any;
    };
    hasExternalSubset: {
        (ctx: any): number;
    };
    hasInternalSubset: {
        (ctx: any): number;
    };
    htmlAttrAllowed: {
        (arg0: htmlElemDescPtr | null, arg1: string | Buffer | null, arg2: number): htmlStatus;
    };
    htmlAutoCloseTag: {
        (doc: htmlDocPtr | null, name: string | Buffer | null, elem: htmlNodePtr | null): number;
    };
    htmlCreateFileParserCtxt: {
        (filename: string | Buffer | null, encoding: string | Buffer | null): htmlParserCtxtPtr;
    };
    htmlCreateMemoryParserCtxt: {
        (buffer: string | Buffer | null, size: number): htmlParserCtxtPtr;
    };
    htmlCreatePushParserCtxt: {
        (sax: htmlSAXHandlerPtr | null, user_data: any, chunk: string | Buffer | null, size: number, filename: string | Buffer | null, enc: xmlCharEncoding): htmlParserCtxtPtr;
    };
    htmlCtxtReadDoc: {
        (ctxt: xmlParserCtxtPtr | null, cur: string | Buffer | null, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlCtxtReadFd: {
        (ctxt: xmlParserCtxtPtr | null, fd: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlCtxtReadFile: {
        (ctxt: xmlParserCtxtPtr | null, filename: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlCtxtReadIO: {
        (ctxt: xmlParserCtxtPtr | null, ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlCtxtReadMemory: {
        (ctxt: xmlParserCtxtPtr | null, buffer: string | Buffer | null, size: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlCtxtReset: {
        (ctxt: htmlParserCtxtPtr | null): any;
    };
    htmlCtxtUseOptions: {
        (ctxt: htmlParserCtxtPtr | null, options: number): number;
    };
    htmlDefaultSAXHandlerInit: {
        (): any;
    };
    htmlDocContentDumpFormatOutput: {
        (buf: xmlOutputBufferPtr | null, cur: xmlDocPtr | null, encoding: string | Buffer | null, format: number): any;
    };
    htmlDocContentDumpOutput: {
        (buf: xmlOutputBufferPtr | null, cur: xmlDocPtr | null, encoding: string | Buffer | null): any;
    };
    htmlDocDump: {
        (f: undefined, cur: xmlDocPtr | null): number;
    };
    htmlDocDumpMemory: {
        (cur: xmlDocPtr | null, mem: string | Buffer | null, size: number): any;
    };
    htmlDocDumpMemoryFormat: {
        (cur: xmlDocPtr | null, mem: string | Buffer | null, size: number, format: number): any;
    };
    htmlElementAllowedHere: {
        (arg0: htmlElemDescPtr | null, arg1: string | Buffer | null): number;
    };
    htmlElementStatusHere: {
        (arg0: htmlElemDescPtr | null, arg1: htmlElemDescPtr | null): htmlStatus;
    };
    htmlEncodeEntities: {
        (out: string | Buffer | null, outlen: number, inArg: string | Buffer | null, inlen: number, quoteChar: number): number;
    };
    htmlEntityLookup: {
        (name: string | Buffer | null): htmlEntityDesc;
    };
    htmlEntityValueLookup: {
        (value: number): htmlEntityDesc;
    };
    htmlFreeParserCtxt: {
        (ctxt: htmlParserCtxtPtr | null): any;
    };
    htmlGetMetaEncoding: {
        (doc: htmlDocPtr | null): string;
    };
    htmlHandleOmittedElem: {
        (val: number): number;
    };
    htmlInitAutoClose: {
        (): any;
    };
    htmlIsAutoClosed: {
        (doc: htmlDocPtr | null, elem: htmlNodePtr | null): number;
    };
    htmlIsBooleanAttr: {
        (name: string | Buffer | null): number;
    };
    htmlIsScriptAttribute: {
        (name: string | Buffer | null): number;
    };
    htmlNewDoc: {
        (URI: string | Buffer | null, ExternalID: string | Buffer | null): htmlDocPtr | null;
    };
    htmlNewDocNoDtD: {
        (URI: string | Buffer | null, ExternalID: string | Buffer | null): htmlDocPtr | null;
    };
    htmlNewParserCtxt: {
        (): htmlParserCtxtPtr;
    };
    htmlNodeDump: {
        (buf: xmlBufferPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null): number;
    };
    htmlNodeDumpFile: {
        (out: undefined, doc: xmlDocPtr | null, cur: xmlNodePtr | null): any;
    };
    htmlNodeDumpFileFormat: {
        (out: undefined, doc: xmlDocPtr | null, cur: xmlNodePtr | null, encoding: string | Buffer | null, format: number): number;
    };
    htmlNodeDumpFormatOutput: {
        (buf: xmlOutputBufferPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null, encoding: string | Buffer | null, format: number): any;
    };
    htmlNodeDumpOutput: {
        (buf: xmlOutputBufferPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null, encoding: string | Buffer | null): any;
    };
    htmlNodeStatus: {
        (arg0: htmlNodePtr | null, arg1: number): htmlStatus;
    };
    htmlParseCharRef: {
        (ctxt: htmlParserCtxtPtr | null): number;
    };
    htmlParseChunk: {
        (ctxt: htmlParserCtxtPtr | null, chunk: string | Buffer | null, size: number, terminate: number): number;
    };
    htmlParseDoc: {
        (cur: string | Buffer | null, encoding: string | Buffer | null): htmlDocPtr | null;
    };
    htmlParseDocument: {
        (ctxt: htmlParserCtxtPtr | null): number;
    };
    htmlParseElement: {
        (ctxt: htmlParserCtxtPtr | null): any;
    };
    htmlParseEntityRef: {
        (ctxt: htmlParserCtxtPtr | null, str: string | Buffer | null): htmlEntityDesc;
    };
    htmlParseFile: {
        (filename: string | Buffer | null, encoding: string | Buffer | null): htmlDocPtr | null;
    };
    htmlReadDoc: {
        (cur: string | Buffer | null, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlReadFd: {
        (fd: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlReadFile: {
        (URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlReadIO: {
        (ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlReadMemory: {
        (buffer: string | Buffer | null, size: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): htmlDocPtr | null;
    };
    htmlSAXParseDoc: {
        (cur: string | Buffer | null, encoding: string | Buffer | null, sax: htmlSAXHandlerPtr | null, userData: any): htmlDocPtr | null;
    };
    htmlSAXParseFile: {
        (filename: string | Buffer | null, encoding: string | Buffer | null, sax: htmlSAXHandlerPtr | null, userData: any): htmlDocPtr | null;
    };
    htmlSaveFile: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null): number;
    };
    htmlSaveFileEnc: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null, encoding: string | Buffer | null): number;
    };
    htmlSaveFileFormat: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null, encoding: string | Buffer | null, format: number): number;
    };
    htmlSetMetaEncoding: {
        (doc: htmlDocPtr | null, encoding: string | Buffer | null): number;
    };
    htmlTagLookup: {
        (tag: string | Buffer | null): htmlElemDesc;
    };
    ignorableWhitespace: {
        (ctx: any, ch: string | Buffer | null, len: number): any;
    };
    initGenericErrorDefaultFunc: {
        (handler: xmlGenericErrorFunc): any;
    };
    initdocbDefaultSAXHandler: {
        (hdlr: xmlSAXHandlerV1): any;
    };
    inithtmlDefaultSAXHandler: {
        (hdlr: xmlSAXHandlerV1): any;
    };
    initxmlDefaultSAXHandler: {
        (hdlr: xmlSAXHandlerV1, warning: number): any;
    };
    inputPop: {
        (ctxt: xmlParserCtxtPtr | null): xmlParserInputPtr;
    };
    inputPush: {
        (ctxt: xmlParserCtxtPtr | null, value: xmlParserInputPtr | null): number;
    };
    internalSubset: {
        (ctx: any, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): any;
    };
    isStandalone: {
        (ctx: any): number;
    };
    isolat1ToUTF8: {
        (out: string | Buffer | null, outlen: number, inArg: string | Buffer | null, inlen: number): number;
    };
    namePop: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    namePush: {
        (ctxt: xmlParserCtxtPtr | null, value: string | Buffer | null): number;
    };
    namespaceDecl: {
        (ctx: any, href: string | Buffer | null, prefix: string | Buffer | null): any;
    };
    nodePop: {
        (ctxt: xmlParserCtxtPtr | null): xmlNodePtr | null;
    };
    nodePush: {
        (ctxt: xmlParserCtxtPtr | null, value: xmlNodePtr | null): number;
    };
    notationDecl: {
        (ctx: any, name: string | Buffer | null, publicId: string | Buffer | null, systemId: string | Buffer | null): any;
    };
    processingInstruction: {
        (ctx: any, target: string | Buffer | null, data: string | Buffer | null): any;
    };
    reference: {
        (ctx: any, name: string | Buffer | null): any;
    };
    resolveEntity: {
        (ctx: any, publicId: string | Buffer | null, systemId: string | Buffer | null): xmlParserInputPtr;
    };
    setDebugDisable: {
        (): any;
    };
    setDebugEnable: {
        (): any;
    };
    setDocumentLocator: {
        (ctx: any, loc: xmlSAXLocatorPtr | null): any;
    };
    setNamespace: {
        (ctx: any, name: string | Buffer | null): any;
    };
    startDocument: {
        (ctx: any): any;
    };
    startElement: {
        (ctx: any, fullname: string | Buffer | null, atts: string | Buffer | null): any;
    };
    unparsedEntityDecl: {
        (ctx: any, name: string | Buffer | null, publicId: string | Buffer | null, systemId: string | Buffer | null, notationName: string | Buffer | null): any;
    };
    valuePop: {
        (ctxt: xmlXPathParserContextPtr | null): xmlXPathObjectPtr;
    };
    valuePush: {
        (ctxt: xmlXPathParserContextPtr | null, value: xmlXPathObjectPtr | null): number;
    };
    xlinkGetDefaultDetect: {
        (): xlinkNodeDetectFunc;
    };
    xlinkGetDefaultHandler: {
        (): xlinkHandlerPtr;
    };
    xlinkIsLink: {
        (doc: xmlDocPtr | null, node: xmlNodePtr | null): xlinkType;
    };
    xlinkSetDefaultDetect: {
        (func: xlinkNodeDetectFunc): any;
    };
    xlinkSetDefaultHandler: {
        (handler: xlinkHandlerPtr | null): any;
    };
    xmlACatalogAdd: {
        (catal: xmlCatalogPtr | null, type: string | Buffer | null, orig: string | Buffer | null, replace: string | Buffer | null): number;
    };
    xmlACatalogDump: {
        (catal: xmlCatalogPtr | null, out: undefined): any;
    };
    xmlACatalogRemove: {
        (catal: xmlCatalogPtr | null, value: string | Buffer | null): number;
    };
    xmlACatalogResolve: {
        (catal: xmlCatalogPtr | null, pubID: string | Buffer | null, sysID: string | Buffer | null): string;
    };
    xmlACatalogResolvePublic: {
        (catal: xmlCatalogPtr | null, pubID: string | Buffer | null): string;
    };
    xmlACatalogResolveSystem: {
        (catal: xmlCatalogPtr | null, sysID: string | Buffer | null): string;
    };
    xmlACatalogResolveURI: {
        (catal: xmlCatalogPtr | null, URI: string | Buffer | null): string;
    };
    xmlAddAttributeDecl: {
        (ctxt: xmlValidCtxtPtr | null, dtd: xmlDtdPtr | null, elem: string | Buffer | null, name: string | Buffer | null, ns: string | Buffer | null, type: xmlAttributeType, def: xmlAttributeDefault, defaultValue: string | Buffer | null, tree: xmlEnumerationPtr | null): xmlAttributePtr;
    };
    xmlAddChild: {
        (parent: xmlNodePtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlAddChildList: {
        (parent: xmlNodePtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlAddDocEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, type: number, ExternalID: string | Buffer | null, SystemID: string | Buffer | null, content: string | Buffer | null): xmlEntityPtr;
    };
    xmlAddDtdEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, type: number, ExternalID: string | Buffer | null, SystemID: string | Buffer | null, content: string | Buffer | null): xmlEntityPtr;
    };
    xmlAddElementDecl: {
        (ctxt: xmlValidCtxtPtr | null, dtd: xmlDtdPtr | null, name: string | Buffer | null, type: xmlElementTypeVal, content: xmlElementContentPtr | null): xmlElementPtr | null;
    };
    xmlAddEncodingAlias: {
        (name: string | Buffer | null, alias: string | Buffer | null): number;
    };
    xmlAddID: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, value: string | Buffer | null, attr: xmlAttrPtr | null): xmlIDPtr;
    };
    xmlAddNextSibling: {
        (cur: xmlNodePtr | null, elem: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlAddNotationDecl: {
        (ctxt: xmlValidCtxtPtr | null, dtd: xmlDtdPtr | null, name: string | Buffer | null, PublicID: string | Buffer | null, SystemID: string | Buffer | null): xmlNotationPtr;
    };
    xmlAddPrevSibling: {
        (cur: xmlNodePtr | null, elem: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlAddRef: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, value: string | Buffer | null, attr: xmlAttrPtr | null): xmlRefPtr;
    };
    xmlAddSibling: {
        (cur: xmlNodePtr | null, elem: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlAllocOutputBuffer: {
        (encoder: xmlCharEncodingHandlerPtr | null): xmlOutputBufferPtr;
    };
    xmlAllocParserInputBuffer: {
        (enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlAttrSerializeTxtContent: {
        (buf: xmlBufferPtr | null, doc: xmlDocPtr | null, attr: xmlAttrPtr | null, string: string | Buffer | null): any;
    };
    xmlAutomataCompile: {
        (am: xmlAutomataPtr | null): xmlRegexpPtr;
    };
    xmlAutomataGetInitState: {
        (am: xmlAutomataPtr | null): xmlAutomataStatePtr;
    };
    xmlAutomataIsDeterminist: {
        (am: xmlAutomataPtr | null): number;
    };
    xmlAutomataNewAllTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, lax: number): xmlAutomataStatePtr;
    };
    xmlAutomataNewCountTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, min: number, max: number, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewCountTrans2: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, token2: string | Buffer | null, min: number, max: number, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewCountedTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, counter: number): xmlAutomataStatePtr;
    };
    xmlAutomataNewCounter: {
        (am: xmlAutomataPtr | null, min: number, max: number): number;
    };
    xmlAutomataNewCounterTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, counter: number): xmlAutomataStatePtr;
    };
    xmlAutomataNewEpsilon: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null): xmlAutomataStatePtr;
    };
    xmlAutomataNewNegTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, token2: string | Buffer | null, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewOnceTrans: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, min: number, max: number, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewOnceTrans2: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, token2: string | Buffer | null, min: number, max: number, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewState: {
        (am: xmlAutomataPtr | null): xmlAutomataStatePtr;
    };
    xmlAutomataNewTransition: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataNewTransition2: {
        (am: xmlAutomataPtr | null, from: xmlAutomataStatePtr | null, to: xmlAutomataStatePtr | null, token: string | Buffer | null, token2: string | Buffer | null, data: any): xmlAutomataStatePtr;
    };
    xmlAutomataSetFinalState: {
        (am: xmlAutomataPtr | null, state: xmlAutomataStatePtr | null): number;
    };
    xmlBufContent: {
        (buf: xmlBufPtr | null): string;
    };
    xmlBufEnd: {
        (buf: xmlBufPtr | null): string;
    };
    xmlBufGetNodeContent: {
        (buf: xmlBufPtr | null, cur: xmlNodePtr | null): number;
    };
    xmlBufNodeDump: {
        (buf: xmlBufPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null, level: number, format: number): number;
    };
    xmlBufShrink: {
        (buf: xmlBufPtr | null, len: number): number;
    };
    xmlBufUse: {
        (buf: xmlBufPtr | null): number;
    };
    xmlBufferAdd: {
        (buf: xmlBufferPtr | null, str: string | Buffer | null, len: number): number;
    };
    xmlBufferAddHead: {
        (buf: xmlBufferPtr | null, str: string | Buffer | null, len: number): number;
    };
    xmlBufferCCat: {
        (buf: xmlBufferPtr | null, str: string | Buffer | null): number;
    };
    xmlBufferCat: {
        (buf: xmlBufferPtr | null, str: string | Buffer | null): number;
    };
    xmlBufferContent: {
        (buf: xmlBufferPtr | null): string;
    };
    xmlBufferCreate: {
        (): xmlBufferPtr;
    };
    xmlBufferCreateSize: {
        (size: number): xmlBufferPtr;
    };
    xmlBufferCreateStatic: {
        (mem: any, size: number): xmlBufferPtr;
    };
    xmlBufferDetach: {
        (buf: xmlBufferPtr | null): string;
    };
    xmlBufferDump: {
        (file: undefined, buf: xmlBufferPtr | null): number;
    };
    xmlBufferEmpty: {
        (buf: xmlBufferPtr | null): any;
    };
    xmlBufferFree: {
        (buf: xmlBufferPtr | null): any;
    };
    xmlBufferGrow: {
        (buf: xmlBufferPtr | null, len: number): number;
    };
    xmlBufferLength: {
        (buf: xmlBufferPtr | null): number;
    };
    xmlBufferResize: {
        (buf: xmlBufferPtr | null, size: number): number;
    };
    xmlBufferSetAllocationScheme: {
        (buf: xmlBufferPtr | null, scheme: xmlBufferAllocationScheme): any;
    };
    xmlBufferShrink: {
        (buf: xmlBufferPtr | null, len: number): number;
    };
    xmlBufferWriteCHAR: {
        (buf: xmlBufferPtr | null, string: string | Buffer | null): any;
    };
    xmlBufferWriteChar: {
        (buf: xmlBufferPtr | null, string: string | Buffer | null): any;
    };
    xmlBufferWriteQuotedString: {
        (buf: xmlBufferPtr | null, string: string | Buffer | null): any;
    };
    xmlBuildQName: {
        (ncname: string | Buffer | null, prefix: string | Buffer | null, memory: string | Buffer | null, len: number): string;
    };
    xmlBuildRelativeURI: {
        (URI: string | Buffer | null, base: string | Buffer | null): string;
    };
    xmlBuildURI: {
        (URI: string | Buffer | null, base: string | Buffer | null): string;
    };
    xmlByteConsumed: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlCanonicPath: {
        (path: string | Buffer | null): string;
    };
    xmlCatalogAdd: {
        (type: string | Buffer | null, orig: string | Buffer | null, replace: string | Buffer | null): number;
    };
    xmlCatalogAddLocal: {
        (catalogs: any, URL: string | Buffer | null): any;
    };
    xmlCatalogCleanup: {
        (): any;
    };
    xmlCatalogConvert: {
        (): number;
    };
    xmlCatalogDump: {
        (out: undefined): any;
    };
    xmlCatalogFreeLocal: {
        (catalogs: any): any;
    };
    xmlCatalogGetDefaults: {
        (): xmlCatalogAllow;
    };
    xmlCatalogGetPublic: {
        (pubID: string | Buffer | null): string;
    };
    xmlCatalogGetSystem: {
        (sysID: string | Buffer | null): string;
    };
    xmlCatalogIsEmpty: {
        (catal: xmlCatalogPtr | null): number;
    };
    xmlCatalogLocalResolve: {
        (catalogs: any, pubID: string | Buffer | null, sysID: string | Buffer | null): string;
    };
    xmlCatalogLocalResolveURI: {
        (catalogs: any, URI: string | Buffer | null): string;
    };
    xmlCatalogRemove: {
        (value: string | Buffer | null): number;
    };
    xmlCatalogResolve: {
        (pubID: string | Buffer | null, sysID: string | Buffer | null): string;
    };
    xmlCatalogResolvePublic: {
        (pubID: string | Buffer | null): string;
    };
    xmlCatalogResolveSystem: {
        (sysID: string | Buffer | null): string;
    };
    xmlCatalogResolveURI: {
        (URI: string | Buffer | null): string;
    };
    xmlCatalogSetDebug: {
        (level: number): number;
    };
    xmlCatalogSetDefaultPrefer: {
        (prefer: xmlCatalogPrefer): xmlCatalogPrefer;
    };
    xmlCatalogSetDefaults: {
        (allow: xmlCatalogAllow): any;
    };
    xmlCharEncCloseFunc: {
        (handler: xmlCharEncodingHandler): number;
    };
    xmlCharEncFirstLine: {
        (handler: xmlCharEncodingHandler, out: xmlBufferPtr | null, inArg: xmlBufferPtr | null): number;
    };
    xmlCharEncInFunc: {
        (handler: xmlCharEncodingHandler, out: xmlBufferPtr | null, inArg: xmlBufferPtr | null): number;
    };
    xmlCharEncOutFunc: {
        (handler: xmlCharEncodingHandler, out: xmlBufferPtr | null, inArg: xmlBufferPtr | null): number;
    };
    xmlCharInRange: {
        (val: number, group: xmlChRangeGroupPtr | null): number;
    };
    xmlCharStrdup: {
        (cur: string | Buffer | null): string;
    };
    xmlCharStrndup: {
        (cur: string | Buffer | null, len: number): string;
    };
    xmlCheckFilename: {
        (path: string | Buffer | null): number;
    };
    xmlCheckHTTPInput: {
        (ctxt: xmlParserCtxtPtr | null, ret: xmlParserInputPtr | null): xmlParserInputPtr;
    };
    xmlCheckLanguageID: {
        (lang: string | Buffer | null): number;
    };
    xmlCheckUTF8: {
        (utf: string | Buffer | null): number;
    };
    xmlCheckVersion: {
        (version: number): any;
    };
    xmlChildElementCount: {
        (parent: xmlNodePtr | null): number;
    };
    xmlCleanupCharEncodingHandlers: {
        (): any;
    };
    xmlCleanupEncodingAliases: {
        (): any;
    };
    xmlCleanupGlobals: {
        (): any;
    };
    xmlCleanupInputCallbacks: {
        (): any;
    };
    xmlCleanupMemory: {
        (): any;
    };
    xmlCleanupOutputCallbacks: {
        (): any;
    };
    xmlCleanupParser: {
        (): any;
    };
    xmlCleanupPredefinedEntities: {
        (): any;
    };
    xmlCleanupThreads: {
        (): any;
    };
    xmlClearNodeInfoSeq: {
        (seq: xmlParserNodeInfoSeqPtr | null): any;
    };
    xmlClearParserCtxt: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlConvertSGMLCatalog: {
        (catal: xmlCatalogPtr | null): number;
    };
    xmlCopyAttributeTable: {
        (table: xmlAttributeTablePtr | null): xmlAttributeTablePtr;
    };
    xmlCopyChar: {
        (len: number, out: string | Buffer | null, val: number): number;
    };
    xmlCopyCharMultiByte: {
        (out: string | Buffer | null, val: number): number;
    };
    xmlCopyDoc: {
        (doc: xmlDocPtr | null, recursive: number): xmlDocPtr | null;
    };
    xmlCopyDocElementContent: {
        (doc: xmlDocPtr | null, content: xmlElementContentPtr | null): xmlElementContentPtr;
    };
    xmlCopyDtd: {
        (dtd: xmlDtdPtr | null): xmlDtdPtr | null;
    };
    xmlCopyElementContent: {
        (content: xmlElementContentPtr | null): xmlElementContentPtr;
    };
    xmlCopyElementTable: {
        (table: xmlElementTablePtr | null): xmlElementTablePtr;
    };
    xmlCopyEntitiesTable: {
        (table: xmlEntitiesTablePtr | null): xmlEntitiesTablePtr;
    };
    xmlCopyEnumeration: {
        (cur: xmlEnumerationPtr | null): xmlEnumerationPtr;
    };
    xmlCopyError: {
        (from: xmlErrorPtr | null, to: xmlErrorPtr | null): number;
    };
    xmlCopyNamespace: {
        (cur: xmlNsPtr | null): xmlNsPtr | null;
    };
    xmlCopyNamespaceList: {
        (cur: xmlNsPtr | null): xmlNsPtr | null;
    };
    xmlCopyNode: {
        (node: xmlNodePtr | null, recursive: number): xmlNodePtr | null;
    };
    xmlCopyNodeList: {
        (node: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlCopyNotationTable: {
        (table: xmlNotationTablePtr | null): xmlNotationTablePtr;
    };
    xmlCopyProp: {
        (target: xmlNodePtr | null, cur: xmlAttrPtr | null): xmlAttrPtr | null;
    };
    xmlCopyPropList: {
        (target: xmlNodePtr | null, cur: xmlAttrPtr | null): xmlAttrPtr | null;
    };
    xmlCreateDocParserCtxt: {
        (cur: string | Buffer | null): xmlParserCtxtPtr;
    };
    xmlCreateEntitiesTable: {
        (): xmlEntitiesTablePtr;
    };
    xmlCreateEntityParserCtxt: {
        (URL: string | Buffer | null, ID: string | Buffer | null, base: string | Buffer | null): xmlParserCtxtPtr;
    };
    xmlCreateEnumeration: {
        (name: string | Buffer | null): xmlEnumerationPtr;
    };
    xmlCreateFileParserCtxt: {
        (filename: string | Buffer | null): xmlParserCtxtPtr;
    };
    xmlCreateIOParserCtxt: {
        (sax: xmlSAXHandlerPtr | null, user_data: any, ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, enc: xmlCharEncoding): xmlParserCtxtPtr;
    };
    xmlCreateIntSubset: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): xmlDtdPtr | null;
    };
    xmlCreateMemoryParserCtxt: {
        (buffer: string | Buffer | null, size: number): xmlParserCtxtPtr;
    };
    xmlCreatePushParserCtxt: {
        (sax: xmlSAXHandlerPtr | null, user_data: any, chunk: string | Buffer | null, size: number, filename: string | Buffer | null): xmlParserCtxtPtr;
    };
    xmlCreateURI: {
        (): xmlURIPtr;
    };
    xmlCreateURLParserCtxt: {
        (filename: string | Buffer | null, options: number): xmlParserCtxtPtr;
    };
    xmlCtxtGetLastError: {
        (ctx: any): xmlErrorPtr;
    };
    xmlCtxtReadDoc: {
        (ctxt: xmlParserCtxtPtr | null, cur: string | Buffer | null, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlCtxtReadFd: {
        (ctxt: xmlParserCtxtPtr | null, fd: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlCtxtReadFile: {
        (ctxt: xmlParserCtxtPtr | null, filename: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlCtxtReadIO: {
        (ctxt: xmlParserCtxtPtr | null, ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlCtxtReadMemory: {
        (ctxt: xmlParserCtxtPtr | null, buffer: string | Buffer | null, size: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlCtxtReset: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlCtxtResetLastError: {
        (ctx: any): any;
    };
    xmlCtxtResetPush: {
        (ctxt: xmlParserCtxtPtr | null, chunk: string | Buffer | null, size: number, filename: string | Buffer | null, encoding: string | Buffer | null): number;
    };
    xmlCtxtUseOptions: {
        (ctxt: xmlParserCtxtPtr | null, options: number): number;
    };
    xmlCurrentChar: {
        (ctxt: xmlParserCtxtPtr | null, len: number): number;
    };
    xmlDOMWrapAdoptNode: {
        (ctxt: xmlDOMWrapCtxtPtr | null, sourceDoc: xmlDocPtr | null, node: xmlNodePtr | null, destDoc: xmlDocPtr | null, destParent: xmlNodePtr | null, options: number): number;
    };
    xmlDOMWrapCloneNode: {
        (ctxt: xmlDOMWrapCtxtPtr | null, sourceDoc: xmlDocPtr | null, node: xmlNodePtr | null, clonedNode: xmlNodePtr | null, destDoc: xmlDocPtr | null, destParent: xmlNodePtr | null, deep: number, options: number): number;
    };
    xmlDOMWrapFreeCtxt: {
        (ctxt: xmlDOMWrapCtxtPtr | null): any;
    };
    xmlDOMWrapNewCtxt: {
        (): xmlDOMWrapCtxtPtr;
    };
    xmlDOMWrapReconcileNamespaces: {
        (ctxt: xmlDOMWrapCtxtPtr | null, elem: xmlNodePtr | null, options: number): number;
    };
    xmlDOMWrapRemoveNode: {
        (ctxt: xmlDOMWrapCtxtPtr | null, doc: xmlDocPtr | null, node: xmlNodePtr | null, options: number): number;
    };
    xmlDecodeEntities: {
        (ctxt: xmlParserCtxtPtr | null, len: number, what: number, end: string | Buffer | null, end2: string | Buffer | null, end3: string | Buffer | null): string;
    };
    xmlDefaultSAXHandlerInit: {
        (): any;
    };
    xmlDelEncodingAlias: {
        (alias: string | Buffer | null): number;
    };
    xmlDeregisterNodeDefault: {
        (func: xmlDeregisterNodeFunc): xmlDeregisterNodeFunc;
    };
    xmlDetectCharEncoding: {
        (inArg: string | Buffer | null, len: number): xmlCharEncoding;
    };
    xmlDictCleanup: {
        (): any;
    };
    xmlDictCreate: {
        (): xmlDictPtr;
    };
    xmlDictCreateSub: {
        (sub: xmlDictPtr | null): xmlDictPtr;
    };
    xmlDictExists: {
        (dict: xmlDictPtr | null, name: string | Buffer | null, len: number): string;
    };
    xmlDictFree: {
        (dict: xmlDictPtr | null): any;
    };
    xmlDictGetUsage: {
        (dict: xmlDictPtr | null): number;
    };
    xmlDictLookup: {
        (dict: xmlDictPtr | null, name: string | Buffer | null, len: number): string;
    };
    xmlDictOwns: {
        (dict: xmlDictPtr | null, str: string | Buffer | null): number;
    };
    xmlDictQLookup: {
        (dict: xmlDictPtr | null, prefix: string | Buffer | null, name: string | Buffer | null): string;
    };
    xmlDictReference: {
        (dict: xmlDictPtr | null): number;
    };
    xmlDictSetLimit: {
        (dict: xmlDictPtr | null, limit: number): number;
    };
    xmlDictSize: {
        (dict: xmlDictPtr | null): number;
    };
    xmlDocCopyNode: {
        (node: xmlNodePtr | null, doc: xmlDocPtr | null, recursive: number): xmlNodePtr | null;
    };
    xmlDocCopyNodeList: {
        (doc: xmlDocPtr | null, node: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlDocDump: {
        (f: undefined, cur: xmlDocPtr | null): number;
    };
    xmlDocDumpFormatMemory: {
        (cur: xmlDocPtr | null, mem: string | Buffer | null, size: number, format: number): any;
    };
    xmlDocDumpFormatMemoryEnc: {
        (out_doc: xmlDocPtr | null, doc_txt_ptr: string | Buffer | null, doc_txt_len: number, txt_encoding: string | Buffer | null, format: number): any;
    };
    xmlDocDumpMemory: {
        (cur: xmlDocPtr | null, mem: string | Buffer | null, size: number): any;
    };
    xmlDocDumpMemoryEnc: {
        (out_doc: xmlDocPtr | null, doc_txt_ptr: string | Buffer | null, doc_txt_len: number, txt_encoding: string | Buffer | null): any;
    };
    xmlDocFormatDump: {
        (f: undefined, cur: xmlDocPtr | null, format: number): number;
    };
    xmlDocGetRootElement: {
        (doc: xmlDocPtr | null): xmlNodePtr | null;
    };
    xmlDocHasRootElement: {
        (doc: xmlDocPtr | null): boolean;
    };
    xmlDocSetRootElement: {
        (doc: xmlDocPtr | null, root: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlDumpAttributeDecl: {
        (buf: xmlBufferPtr | null, attr: xmlAttributePtr | null): any;
    };
    xmlDumpAttributeTable: {
        (buf: xmlBufferPtr | null, table: xmlAttributeTablePtr | null): any;
    };
    xmlDumpElementDecl: {
        (buf: xmlBufferPtr | null, elem: xmlElementPtr | null): any;
    };
    xmlDumpElementTable: {
        (buf: xmlBufferPtr | null, table: xmlElementTablePtr | null): any;
    };
    xmlDumpEntitiesTable: {
        (buf: xmlBufferPtr | null, table: xmlEntitiesTablePtr | null): any;
    };
    xmlDumpEntityDecl: {
        (buf: xmlBufferPtr | null, ent: xmlEntityPtr | null): any;
    };
    xmlDumpNotationDecl: {
        (buf: xmlBufferPtr | null, nota: xmlNotationPtr | null): any;
    };
    xmlDumpNotationTable: {
        (buf: xmlBufferPtr | null, table: xmlNotationTablePtr | null): any;
    };
    xmlElemDump: {
        (f: undefined, doc: xmlDocPtr | null, cur: xmlNodePtr | null): any;
    };
    xmlEncodeEntities: {
        (doc: xmlDocPtr | null, input: string | Buffer | null): string;
    };
    xmlEncodeEntitiesReentrant: {
        (doc: xmlDocPtr | null, input: string | Buffer | null): string;
    };
    xmlEncodeSpecialChars: {
        (doc: xmlDocPtr | null, input: string | Buffer | null): string;
    };
    xmlExpCtxtNbCons: {
        (ctxt: xmlExpCtxtPtr | null): number;
    };
    xmlExpCtxtNbNodes: {
        (ctxt: xmlExpCtxtPtr | null): number;
    };
    xmlExpDump: {
        (buf: xmlBufferPtr | null, expr: xmlExpNodePtr | null): any;
    };
    xmlExpExpDerive: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null, sub: xmlExpNodePtr | null): xmlExpNodePtr | null;
    };
    xmlExpFree: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null): any;
    };
    xmlExpFreeCtxt: {
        (ctxt: xmlExpCtxtPtr | null): any;
    };
    xmlExpGetLanguage: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null, langList: string | Buffer | null, len: number): number;
    };
    xmlExpGetStart: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null, tokList: string | Buffer | null, len: number): number;
    };
    xmlExpIsNillable: {
        (expr: xmlExpNodePtr | null): number;
    };
    xmlExpMaxToken: {
        (expr: xmlExpNodePtr | null): number;
    };
    xmlExpNewAtom: {
        (ctxt: xmlExpCtxtPtr | null, name: string | Buffer | null, len: number): xmlExpNodePtr | null;
    };
    xmlExpNewCtxt: {
        (maxNodes: number, dict: xmlDictPtr | null): xmlExpCtxtPtr;
    };
    xmlExpNewOr: {
        (ctxt: xmlExpCtxtPtr | null, left: xmlExpNodePtr | null, right: xmlExpNodePtr | null): xmlExpNodePtr | null;
    };
    xmlExpNewRange: {
        (ctxt: xmlExpCtxtPtr | null, subset: xmlExpNodePtr | null, min: number, max: number): xmlExpNodePtr | null;
    };
    xmlExpNewSeq: {
        (ctxt: xmlExpCtxtPtr | null, left: xmlExpNodePtr | null, right: xmlExpNodePtr | null): xmlExpNodePtr | null;
    };
    xmlExpParse: {
        (ctxt: xmlExpCtxtPtr | null, expr: string | Buffer | null): xmlExpNodePtr | null;
    };
    xmlExpRef: {
        (expr: xmlExpNodePtr | null): any;
    };
    xmlExpStringDerive: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null, str: string | Buffer | null, len: number): xmlExpNodePtr | null;
    };
    xmlExpSubsume: {
        (ctxt: xmlExpCtxtPtr | null, expr: xmlExpNodePtr | null, sub: xmlExpNodePtr | null): number;
    };
    xmlFileClose: {
        (context: any): number;
    };
    xmlFileMatch: {
        (filename: string | Buffer | null): number;
    };
    xmlFileOpen: {
        (filename: string | Buffer | null): any;
    };
    xmlFileRead: {
        (context: any, buffer: string | Buffer | null, len: number): number;
    };
    xmlFindCharEncodingHandler: {
        (name: string | Buffer | null): xmlCharEncodingHandlerPtr;
    };
    xmlFirstElementChild: {
        (parent: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlFreeAttributeTable: {
        (table: xmlAttributeTablePtr | null): any;
    };
    xmlFreeAutomata: {
        (am: xmlAutomataPtr | null): any;
    };
    xmlFreeCatalog: {
        (catal: xmlCatalogPtr | null): any;
    };
    xmlFreeDoc: {
        (cur: xmlDocPtr | null): any;
    };
    xmlFreeDocElementContent: {
        (doc: xmlDocPtr | null, cur: xmlElementContentPtr | null): any;
    };
    xmlFreeDtd: {
        (cur: xmlDtdPtr | null): any;
    };
    xmlFreeElementContent: {
        (cur: xmlElementContentPtr | null): any;
    };
    xmlFreeElementTable: {
        (table: xmlElementTablePtr | null): any;
    };
    xmlFreeEntitiesTable: {
        (table: xmlEntitiesTablePtr | null): any;
    };
    xmlFreeEnumeration: {
        (cur: xmlEnumerationPtr | null): any;
    };
    xmlFreeIDTable: {
        (table: xmlIDTablePtr | null): any;
    };
    xmlFreeInputStream: {
        (input: xmlParserInputPtr | null): any;
    };
    xmlFreeMutex: {
        (tok: xmlMutexPtr | null): any;
    };
    xmlFreeNode: {
        (cur: xmlNodePtr | null): any;
    };
    xmlFreeNodeList: {
        (cur: xmlNodePtr | null): any;
    };
    xmlFreeNotationTable: {
        (table: xmlNotationTablePtr | null): any;
    };
    xmlFreeNs: {
        (cur: xmlNsPtr | null): any;
    };
    xmlFreeNsList: {
        (cur: xmlNsPtr | null): any;
    };
    xmlFreeParserCtxt: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlFreeParserInputBuffer: {
        (inArg: xmlParserInputBufferPtr | null): any;
    };
    xmlFreePattern: {
        (comp: xmlPatternPtr | null): any;
    };
    xmlFreePatternList: {
        (comp: xmlPatternPtr | null): any;
    };
    xmlFreeProp: {
        (cur: xmlAttrPtr | null): any;
    };
    xmlFreePropList: {
        (cur: xmlAttrPtr | null): any;
    };
    xmlFreeRMutex: {
        (tok: xmlRMutexPtr | null): any;
    };
    xmlFreeRefTable: {
        (table: xmlRefTablePtr | null): any;
    };
    xmlFreeStreamCtxt: {
        (stream: xmlStreamCtxtPtr | null): any;
    };
    xmlFreeURI: {
        (uri: xmlURIPtr | null): any;
    };
    xmlFreeValidCtxt: {
        (arg0: xmlValidCtxtPtr | null): any;
    };
    xmlGcMemGet: {
        (freeFunc: xmlFreeFunc, mallocFunc: xmlMallocFunc, mallocAtomicFunc: xmlMallocFunc, reallocFunc: xmlReallocFunc, strdupFunc: xmlStrdupFunc): number;
    };
    xmlGcMemSetup: {
        (freeFunc: xmlFreeFunc, mallocFunc: xmlMallocFunc, mallocAtomicFunc: xmlMallocFunc, reallocFunc: xmlReallocFunc, strdupFunc: xmlStrdupFunc): number;
    };
    xmlGetBufferAllocationScheme: {
        (): xmlBufferAllocationScheme;
    };
    xmlGetCharEncodingHandler: {
        (enc: xmlCharEncoding): xmlCharEncodingHandlerPtr;
    };
    xmlGetCharEncodingName: {
        (enc: xmlCharEncoding): string;
    };
    xmlGetCompressMode: {
        (): number;
    };
    xmlGetDocCompressMode: {
        (doc: xmlDocPtr | null): number;
    };
    xmlGetDocEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): xmlEntityPtr;
    };
    xmlGetDtdAttrDesc: {
        (dtd: xmlDtdPtr | null, elem: string | Buffer | null, name: string | Buffer | null): xmlAttributePtr;
    };
    xmlGetDtdElementDesc: {
        (dtd: xmlDtdPtr | null, name: string | Buffer | null): xmlElementPtr | null;
    };
    xmlGetDtdEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): xmlEntityPtr;
    };
    xmlGetDtdNotationDesc: {
        (dtd: xmlDtdPtr | null, name: string | Buffer | null): xmlNotationPtr;
    };
    xmlGetDtdQAttrDesc: {
        (dtd: xmlDtdPtr | null, elem: string | Buffer | null, name: string | Buffer | null, prefix: string | Buffer | null): xmlAttributePtr;
    };
    xmlGetDtdQElementDesc: {
        (dtd: xmlDtdPtr | null, name: string | Buffer | null, prefix: string | Buffer | null): xmlElementPtr | null;
    };
    xmlGetEncodingAlias: {
        (alias: string | Buffer | null): string;
    };
    xmlGetExternalEntityLoader: {
        (): xmlExternalEntityLoader;
    };
    xmlGetFeature: {
        (ctxt: xmlParserCtxtPtr | null, name: string | Buffer | null, result: any): number;
    };
    xmlGetFeaturesList: {
        (len: number, result: string | Buffer | null): number;
    };
    xmlGetGlobalState: {
        (): xmlGlobalStatePtr;
    };
    xmlGetID: {
        (doc: xmlDocPtr | null, ID: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlGetIntSubset: {
        (doc: xmlDocPtr | null): xmlDtdPtr | null;
    };
    xmlGetLastChild: {
        (parent: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlGetLastError: {
        (): xmlErrorPtr;
    };
    xmlGetLineNo: {
        (node: xmlNodePtr | null): number;
    };
    xmlGetNoNsProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null): string;
    };
    xmlGetNodePath: {
        (node: xmlNodePtr | null): string;
    };
    xmlGetNsList: {
        (doc: xmlDocPtr | null, node: xmlNodePtr | null): xmlNsPtr[];
    };
    xmlGetNsProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null, nameSpace: string | Buffer | null): string;
    };
    xmlGetParameterEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): xmlEntityPtr;
    };
    xmlGetPredefinedEntity: {
        (name: string | Buffer | null): xmlEntityPtr;
    };
    xmlGetProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null): string;
    };
    xmlGetRefs: {
        (doc: xmlDocPtr | null, ID: string | Buffer | null): xmlListPtr;
    };
    xmlGetThreadId: {
        (): number;
    };
    xmlGetUTF8Char: {
        (utf: string | Buffer | null, len: number): number;
    };
    xmlHandleEntity: {
        (ctxt: xmlParserCtxtPtr | null, entity: xmlEntityPtr | null): any;
    };
    xmlHasFeature: {
        (feature: xmlFeature): number;
    };
    xmlHasNsProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null, nameSpace: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlHasProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlHashAddEntry: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, userdata: any): number;
    };
    xmlHashAddEntry2: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, userdata: any): number;
    };
    xmlHashAddEntry3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null, userdata: any): number;
    };
    xmlHashCopy: {
        (table: xmlHashTablePtr | null, f: xmlHashCopier): xmlHashTablePtr;
    };
    xmlHashCreate: {
        (size: number): xmlHashTablePtr;
    };
    xmlHashCreateDict: {
        (size: number, dict: xmlDictPtr | null): xmlHashTablePtr;
    };
    xmlHashDefaultDeallocator: {
        (entry: any, name: string | Buffer | null): any;
    };
    xmlHashFree: {
        (table: xmlHashTablePtr | null, f: xmlHashDeallocator): any;
    };
    xmlHashLookup: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null): any;
    };
    xmlHashLookup2: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null): any;
    };
    xmlHashLookup3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null): any;
    };
    xmlHashQLookup: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, prefix: string | Buffer | null): any;
    };
    xmlHashQLookup2: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, prefix: string | Buffer | null, name2: string | Buffer | null, prefix2: string | Buffer | null): any;
    };
    xmlHashQLookup3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, prefix: string | Buffer | null, name2: string | Buffer | null, prefix2: string | Buffer | null, name3: string | Buffer | null, prefix3: string | Buffer | null): any;
    };
    xmlHashRemoveEntry: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, f: xmlHashDeallocator): number;
    };
    xmlHashRemoveEntry2: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, f: xmlHashDeallocator): number;
    };
    xmlHashRemoveEntry3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null, f: xmlHashDeallocator): number;
    };
    xmlHashScan: {
        (table: xmlHashTablePtr | null, f: xmlHashScanner, data: any): any;
    };
    xmlHashScan3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null, f: xmlHashScanner, data: any): any;
    };
    xmlHashScanFull: {
        (table: xmlHashTablePtr | null, f: xmlHashScannerFull, data: any): any;
    };
    xmlHashScanFull3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null, f: xmlHashScannerFull, data: any): any;
    };
    xmlHashSize: {
        (table: xmlHashTablePtr | null): number;
    };
    xmlHashUpdateEntry: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, userdata: any, f: xmlHashDeallocator): number;
    };
    xmlHashUpdateEntry2: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, userdata: any, f: xmlHashDeallocator): number;
    };
    xmlHashUpdateEntry3: {
        (table: xmlHashTablePtr | null, name: string | Buffer | null, name2: string | Buffer | null, name3: string | Buffer | null, userdata: any, f: xmlHashDeallocator): number;
    };
    xmlIOParseDTD: {
        (sax: xmlSAXHandlerPtr | null, input: xmlParserInputBufferPtr | null, enc: xmlCharEncoding): xmlDtdPtr | null;
    };
    xmlInitCharEncodingHandlers: {
        (): any;
    };
    xmlInitGlobals: {
        (): any;
    };
    xmlInitMemory: {
        (): number;
    };
    xmlInitNodeInfoSeq: {
        (seq: xmlParserNodeInfoSeqPtr | null): any;
    };
    xmlInitParser: {
        (): any;
    };
    xmlInitParserCtxt: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlInitThreads: {
        (): any;
    };
    xmlInitializeCatalog: {
        (): any;
    };
    xmlInitializeDict: {
        (): number;
    };
    xmlInitializeGlobalState: {
        (gs: xmlGlobalStatePtr | null): any;
    };
    xmlInitializePredefinedEntities: {
        (): any;
    };
    xmlIsBaseChar: {
        (ch: number): number;
    };
    xmlIsBlank: {
        (ch: number): number;
    };
    xmlIsBlankNode: {
        (node: xmlNodePtr | null): number;
    };
    xmlIsChar: {
        (ch: number): number;
    };
    xmlIsCombining: {
        (ch: number): number;
    };
    xmlIsDigit: {
        (ch: number): number;
    };
    xmlIsExtender: {
        (ch: number): number;
    };
    xmlIsID: {
        (doc: xmlDocPtr | null, elem: xmlNodePtr | null, attr: xmlAttrPtr | null): number;
    };
    xmlIsIdeographic: {
        (ch: number): number;
    };
    xmlIsLetter: {
        (c: number): number;
    };
    xmlIsMainThread: {
        (): number;
    };
    xmlIsMixedElement: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): number;
    };
    xmlIsPubidChar: {
        (ch: number): number;
    };
    xmlIsRef: {
        (doc: xmlDocPtr | null, elem: xmlNodePtr | null, attr: xmlAttrPtr | null): number;
    };
    xmlIsXHTML: {
        (systemID: string | Buffer | null, publicID: string | Buffer | null): number;
    };
    xmlKeepBlanksDefault: {
        (val: number): number;
    };
    xmlLastElementChild: {
        (parent: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlLineNumbersDefault: {
        (val: number): number;
    };
    xmlLinkGetData: {
        (lk: xmlLinkPtr | null): any;
    };
    xmlListAppend: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListClear: {
        (l: xmlListPtr | null): any;
    };
    xmlListCopy: {
        (cur: xmlListPtr | null, old: xmlListPtr | null): number;
    };
    xmlListCreate: {
        (deallocator: xmlListDeallocator, compare: xmlListDataCompare): xmlListPtr;
    };
    xmlListDelete: {
        (l: xmlListPtr | null): any;
    };
    xmlListDup: {
        (old: xmlListPtr | null): xmlListPtr;
    };
    xmlListEmpty: {
        (l: xmlListPtr | null): number;
    };
    xmlListEnd: {
        (l: xmlListPtr | null): xmlLinkPtr;
    };
    xmlListFront: {
        (l: xmlListPtr | null): xmlLinkPtr;
    };
    xmlListInsert: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListMerge: {
        (l1: xmlListPtr | null, l2: xmlListPtr | null): any;
    };
    xmlListPopBack: {
        (l: xmlListPtr | null): any;
    };
    xmlListPopFront: {
        (l: xmlListPtr | null): any;
    };
    xmlListPushBack: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListPushFront: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListRemoveAll: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListRemoveFirst: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListRemoveLast: {
        (l: xmlListPtr | null, data: any): number;
    };
    xmlListReverse: {
        (l: xmlListPtr | null): any;
    };
    xmlListReverseSearch: {
        (l: xmlListPtr | null, data: any): any;
    };
    xmlListReverseWalk: {
        (l: xmlListPtr | null, walker: xmlListWalker, user: any): any;
    };
    xmlListSearch: {
        (l: xmlListPtr | null, data: any): any;
    };
    xmlListSize: {
        (l: xmlListPtr | null): number;
    };
    xmlListSort: {
        (l: xmlListPtr | null): any;
    };
    xmlListWalk: {
        (l: xmlListPtr | null, walker: xmlListWalker, user: any): any;
    };
    xmlLoadACatalog: {
        (filename: string | Buffer | null): xmlCatalogPtr;
    };
    xmlLoadCatalog: {
        (filename: string | Buffer | null): number;
    };
    xmlLoadCatalogs: {
        (paths: string | Buffer | null): any;
    };
    xmlLoadExternalEntity: {
        (URL: string | Buffer | null, ID: string | Buffer | null, ctxt: xmlParserCtxtPtr | null): xmlParserInputPtr;
    };
    xmlLoadSGMLSuperCatalog: {
        (filename: string | Buffer | null): xmlCatalogPtr;
    };
    xmlLockLibrary: {
        (): any;
    };
    xmlMallocAtomicLoc: {
        (size: number, file: string | Buffer | null, line: number): any;
    };
    xmlMallocLoc: {
        (size: number, file: string | Buffer | null, line: number): any;
    };
    xmlMemBlocks: {
        (): number;
    };
    xmlMemDisplay: {
        (fp: undefined): any;
    };
    xmlMemDisplayLast: {
        (fp: undefined, nbBytes: number): any;
    };
    xmlMemFree: {
        (ptr: any): any;
    };
    xmlMemGet: {
        (freeFunc: xmlFreeFunc, mallocFunc: xmlMallocFunc, reallocFunc: xmlReallocFunc, strdupFunc: xmlStrdupFunc): number;
    };
    xmlMemMalloc: {
        (size: number): any;
    };
    xmlMemRealloc: {
        (ptr: any, size: number): any;
    };
    xmlMemSetup: {
        (freeFunc: xmlFreeFunc, mallocFunc: xmlMallocFunc, reallocFunc: xmlReallocFunc, strdupFunc: xmlStrdupFunc): number;
    };
    xmlMemShow: {
        (fp: undefined, nr: number): any;
    };
    xmlMemStrdupLoc: {
        (str: string | Buffer | null, file: string | Buffer | null, line: number): string;
    };
    xmlMemUsed: {
        (): number;
    };
    xmlMemoryDump: {
        (): any;
    };
    xmlMemoryStrdup: {
        (str: string | Buffer | null): string;
    };
    xmlModuleClose: {
        (module: xmlModulePtr | null): number;
    };
    xmlModuleFree: {
        (module: xmlModulePtr | null): number;
    };
    xmlModuleOpen: {
        (filename: string | Buffer | null, options: number): xmlModulePtr;
    };
    xmlModuleSymbol: {
        (module: xmlModulePtr | null, name: string | Buffer | null, result: any): number;
    };
    xmlMutexLock: {
        (tok: xmlMutexPtr | null): any;
    };
    xmlMutexUnlock: {
        (tok: xmlMutexPtr | null): any;
    };
    xmlNamespaceParseNCName: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlNamespaceParseNSDef: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlNamespaceParseQName: {
        (ctxt: xmlParserCtxtPtr | null, prefix: string | Buffer | null): string;
    };
    xmlNewAutomata: {
        (): xmlAutomataPtr;
    };
    xmlNewCDataBlock: {
        (doc: xmlDocPtr | null, content: string | Buffer | null, len: number): xmlNodePtr | null;
    };
    xmlNewCatalog: {
        (sgml: number): xmlCatalogPtr;
    };
    xmlNewCharEncodingHandler: {
        (name: string | Buffer | null, input: xmlCharEncodingInputFunc, output: xmlCharEncodingOutputFunc): xmlCharEncodingHandlerPtr;
    };
    xmlNewCharRef: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewChild: {
        (parent: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewComment: {
        (content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDoc: {
        (version: string | Buffer | null): xmlDocPtr | null;
    };
    xmlNewDocComment: {
        (doc: xmlDocPtr | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocElementContent: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, type: xmlElementContentType): xmlElementContentPtr;
    };
    xmlNewDocFragment: {
        (doc: xmlDocPtr | null): xmlNodePtr | null;
    };
    xmlNewDocNode: {
        (doc: xmlDocPtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocNodeEatName: {
        (doc: xmlDocPtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocPI: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocProp: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlNewDocRawNode: {
        (doc: xmlDocPtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocText: {
        (doc: xmlDocPtr | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewDocTextLen: {
        (doc: xmlDocPtr | null, content: string | Buffer | null, len: number): xmlNodePtr | null;
    };
    xmlNewDtd: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): xmlDtdPtr | null;
    };
    xmlNewElementContent: {
        (name: string | Buffer | null, type: xmlElementContentType): xmlElementContentPtr;
    };
    xmlNewEntity: {
        (doc: xmlDocPtr | null, name: string | Buffer | null, type: number, ExternalID: string | Buffer | null, SystemID: string | Buffer | null, content: string | Buffer | null): xmlEntityPtr;
    };
    xmlNewEntityInputStream: {
        (ctxt: xmlParserCtxtPtr | null, entity: xmlEntityPtr | null): xmlParserInputPtr;
    };
    xmlNewGlobalNs: {
        (doc: xmlDocPtr | null, href: string | Buffer | null, prefix: string | Buffer | null): xmlNsPtr | null;
    };
    xmlNewIOInputStream: {
        (ctxt: xmlParserCtxtPtr | null, input: xmlParserInputBufferPtr | null, enc: xmlCharEncoding): xmlParserInputPtr;
    };
    xmlNewInputFromFile: {
        (ctxt: xmlParserCtxtPtr | null, filename: string | Buffer | null): xmlParserInputPtr;
    };
    xmlNewInputStream: {
        (ctxt: xmlParserCtxtPtr | null): xmlParserInputPtr;
    };
    xmlNewMutex: {
        (): xmlMutexPtr;
    };
    xmlNewNode: {
        (ns: xmlNsPtr | null, name: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewNodeEatName: {
        (ns: xmlNsPtr | null, name: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewNs: {
        (node: xmlNodePtr | null, href: string | Buffer | null, prefix: string | Buffer | null): xmlNsPtr | null;
    };
    xmlNewNsProp: {
        (node: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlNewNsPropEatName: {
        (node: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlNewPI: {
        (name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewParserCtxt: {
        (): xmlParserCtxtPtr;
    };
    xmlNewProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlNewRMutex: {
        (): xmlRMutexPtr;
    };
    xmlNewReference: {
        (doc: xmlDocPtr | null, name: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewStringInputStream: {
        (ctxt: xmlParserCtxtPtr | null, buffer: string | Buffer | null): xmlParserInputPtr;
    };
    xmlNewText: {
        (content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewTextChild: {
        (parent: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, content: string | Buffer | null): xmlNodePtr | null;
    };
    xmlNewTextLen: {
        (content: string | Buffer | null, len: number): xmlNodePtr | null;
    };
    xmlNewValidCtxt: {
        (): xmlValidCtxtPtr;
    };
    xmlNextChar: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlNextElementSibling: {
        (node: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlNoNetExternalEntityLoader: {
        (URL: string | Buffer | null, ID: string | Buffer | null, ctxt: xmlParserCtxtPtr | null): xmlParserInputPtr;
    };
    xmlNodeAddContent: {
        (cur: xmlNodePtr | null, content: string | Buffer | null): any;
    };
    xmlNodeAddContentLen: {
        (cur: xmlNodePtr | null, content: string | Buffer | null, len: number): any;
    };
    xmlNodeBufGetContent: {
        (buffer: xmlBufferPtr | null, cur: xmlNodePtr | null): number;
    };
    xmlNodeDump: {
        (buf: xmlBufferPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null, level: number, format: number): number;
    };
    xmlNodeDumpOutput: {
        (buf: xmlOutputBufferPtr | null, doc: xmlDocPtr | null, cur: xmlNodePtr | null, level: number, format: number, encoding: string | Buffer | null): any;
    };
    xmlNodeGetBase: {
        (doc: xmlDocPtr | null, cur: xmlNodePtr | null): string;
    };
    xmlNodeGetContent: {
        (cur: xmlNodePtr | null): string;
    };
    xmlNodeGetLang: {
        (cur: xmlNodePtr | null): string;
    };
    xmlNodeGetSpacePreserve: {
        (cur: xmlNodePtr | null): number;
    };
    xmlNodeIsText: {
        (node: xmlNodePtr | null): number;
    };
    xmlNodeListGetRawString: {
        (doc: xmlDocPtr | null, list: xmlNodePtr | null, inLine: number): string;
    };
    xmlNodeListGetString: {
        (doc: xmlDocPtr | null, list: xmlNodePtr | null, inLine: number): string;
    };
    xmlNodeSetBase: {
        (cur: xmlNodePtr | null, uri: string | Buffer | null): any;
    };
    xmlNodeSetContent: {
        (cur: xmlNodePtr | null, content: string | Buffer | null): any;
    };
    xmlNodeSetContentLen: {
        (cur: xmlNodePtr | null, content: string | Buffer | null, len: number): any;
    };
    xmlNodeSetLang: {
        (cur: xmlNodePtr | null, lang: string | Buffer | null): any;
    };
    xmlNodeSetName: {
        (cur: xmlNodePtr | null, name: string | Buffer | null): any;
    };
    xmlNodeSetSpacePreserve: {
        (cur: xmlNodePtr | null, val: number): any;
    };
    xmlNormalizeURIPath: {
        (path: string | Buffer | null): number;
    };
    xmlNormalizeWindowsPath: {
        (path: string | Buffer | null): string;
    };
    xmlOutputBufferClose: {
        (out: xmlOutputBufferPtr | null): number;
    };
    xmlOutputBufferCreateBuffer: {
        (buffer: xmlBufferPtr | null, encoder: xmlCharEncodingHandlerPtr | null): xmlOutputBufferPtr;
    };
    xmlOutputBufferCreateFd: {
        (fd: number, encoder: xmlCharEncodingHandlerPtr | null): xmlOutputBufferPtr;
    };
    xmlOutputBufferCreateFile: {
        (file: undefined, encoder: xmlCharEncodingHandlerPtr | null): xmlOutputBufferPtr;
    };
    xmlOutputBufferCreateFilename: {
        (URI: string | Buffer | null, encoder: xmlCharEncodingHandlerPtr | null, compression: number): xmlOutputBufferPtr;
    };
    xmlOutputBufferCreateFilenameDefault: {
        (func: xmlOutputBufferCreateFilenameFunc): xmlOutputBufferCreateFilenameFunc;
    };
    xmlOutputBufferCreateIO: {
        (iowrite: xmlOutputWriteCallback, ioclose: xmlOutputCloseCallback, ioctx: any, encoder: xmlCharEncodingHandlerPtr | null): xmlOutputBufferPtr;
    };
    xmlOutputBufferFlush: {
        (out: xmlOutputBufferPtr | null): number;
    };
    xmlOutputBufferGetContent: {
        (out: xmlOutputBufferPtr | null): string;
    };
    xmlOutputBufferGetSize: {
        (out: xmlOutputBufferPtr | null): number;
    };
    xmlOutputBufferWrite: {
        (out: xmlOutputBufferPtr | null, len: number, buf: string | Buffer | null): number;
    };
    xmlOutputBufferWriteEscape: {
        (out: xmlOutputBufferPtr | null, str: string | Buffer | null, escaping: xmlCharEncodingOutputFunc): number;
    };
    xmlOutputBufferWriteString: {
        (out: xmlOutputBufferPtr | null, str: string | Buffer | null): number;
    };
    xmlParseAttValue: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseAttribute: {
        (ctxt: xmlParserCtxtPtr | null, value: string | Buffer | null): string;
    };
    xmlParseAttributeListDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseAttributeType: {
        (ctxt: xmlParserCtxtPtr | null, tree: xmlEnumerationPtr | null): number;
    };
    xmlParseBalancedChunkMemory: {
        (doc: xmlDocPtr | null, sax: xmlSAXHandlerPtr | null, user_data: any, depth: number, string: string | Buffer | null, lst: xmlNodePtr | null): number;
    };
    xmlParseBalancedChunkMemoryRecover: {
        (doc: xmlDocPtr | null, sax: xmlSAXHandlerPtr | null, user_data: any, depth: number, string: string | Buffer | null, lst: xmlNodePtr | null, recover: number): number;
    };
    xmlParseCDSect: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseCatalogFile: {
        (filename: string | Buffer | null): xmlDocPtr | null;
    };
    xmlParseCharData: {
        (ctxt: xmlParserCtxtPtr | null, cdata: number): any;
    };
    xmlParseCharEncoding: {
        (name: string | Buffer | null): xmlCharEncoding;
    };
    xmlParseCharRef: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlParseChunk: {
        (ctxt: xmlParserCtxtPtr | null, chunk: string | Buffer | null, size: number, terminate: number): number;
    };
    xmlParseComment: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseContent: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseCtxtExternalEntity: {
        (ctx: xmlParserCtxtPtr | null, URL: string | Buffer | null, ID: string | Buffer | null, lst: xmlNodePtr | null): number;
    };
    xmlParseDTD: {
        (ExternalID: string | Buffer | null, SystemID: string | Buffer | null): xmlDtdPtr | null;
    };
    xmlParseDefaultDecl: {
        (ctxt: xmlParserCtxtPtr | null, value: string | Buffer | null): number;
    };
    xmlParseDoc: {
        (cur: string | Buffer | null): xmlDocPtr | null;
    };
    xmlParseDocTypeDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseDocument: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlParseElement: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseElementChildrenContentDecl: {
        (ctxt: xmlParserCtxtPtr | null, inputchk: number): xmlElementContentPtr;
    };
    xmlParseElementContentDecl: {
        (ctxt: xmlParserCtxtPtr | null, name: string | Buffer | null, result: xmlElementContentPtr | null): number;
    };
    xmlParseElementDecl: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlParseElementMixedContentDecl: {
        (ctxt: xmlParserCtxtPtr | null, inputchk: number): xmlElementContentPtr;
    };
    xmlParseEncName: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseEncodingDecl: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseEndTag: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseEntity: {
        (filename: string | Buffer | null): xmlDocPtr | null;
    };
    xmlParseEntityDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseEntityRef: {
        (ctxt: xmlParserCtxtPtr | null): xmlEntityPtr;
    };
    xmlParseEntityValue: {
        (ctxt: xmlParserCtxtPtr | null, orig: string | Buffer | null): string;
    };
    xmlParseEnumeratedType: {
        (ctxt: xmlParserCtxtPtr | null, tree: xmlEnumerationPtr | null): number;
    };
    xmlParseEnumerationType: {
        (ctxt: xmlParserCtxtPtr | null): xmlEnumerationPtr;
    };
    xmlParseExtParsedEnt: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlParseExternalEntity: {
        (doc: xmlDocPtr | null, sax: xmlSAXHandlerPtr | null, user_data: any, depth: number, URL: string | Buffer | null, ID: string | Buffer | null, lst: xmlNodePtr | null): number;
    };
    xmlParseExternalID: {
        (ctxt: xmlParserCtxtPtr | null, publicID: string | Buffer | null, strict: number): string;
    };
    xmlParseExternalSubset: {
        (ctxt: xmlParserCtxtPtr | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): any;
    };
    xmlParseFile: {
        (filename: string | Buffer | null): xmlDocPtr | null;
    };
    xmlParseInNodeContext: {
        (node: xmlNodePtr | null, data: string | Buffer | null, datalen: number, options: number, lst: xmlNodePtr | null): xmlParserErrors;
    };
    xmlParseMarkupDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseMemory: {
        (buffer: string | Buffer | null, size: number): xmlDocPtr | null;
    };
    xmlParseMisc: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseName: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseNamespace: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseNmtoken: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseNotationDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseNotationType: {
        (ctxt: xmlParserCtxtPtr | null): xmlEnumerationPtr;
    };
    xmlParsePEReference: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParsePI: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParsePITarget: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParsePubidLiteral: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseQuotedString: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseReference: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseSDDecl: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlParseStartTag: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseSystemLiteral: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseTextDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParseURI: {
        (str: string | Buffer | null): xmlURIPtr;
    };
    xmlParseURIRaw: {
        (str: string | Buffer | null, raw: number): xmlURIPtr;
    };
    xmlParseURIReference: {
        (uri: xmlURIPtr | null, str: string | Buffer | null): number;
    };
    xmlParseVersionInfo: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseVersionNum: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlParseXMLDecl: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParserAddNodeInfo: {
        (ctxt: xmlParserCtxtPtr | null, info: xmlParserNodeInfoPtr | null): any;
    };
    xmlParserError: {
        (ctx: any, msg: string | Buffer | null, arg2: undefined): any;
    };
    xmlParserFindNodeInfo: {
        (ctxt: xmlParserCtxtPtr | null, node: xmlNodePtr | null): xmlParserNodeInfo;
    };
    xmlParserFindNodeInfoIndex: {
        (seq: xmlParserNodeInfoSeqPtr | null, node: xmlNodePtr | null): number;
    };
    xmlParserGetDirectory: {
        (filename: string | Buffer | null): string;
    };
    xmlParserHandlePEReference: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParserHandleReference: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlParserInputBufferCreateFd: {
        (fd: number, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferCreateFile: {
        (file: undefined, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferCreateFilename: {
        (URI: string | Buffer | null, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferCreateFilenameDefault: {
        (func: xmlParserInputBufferCreateFilenameFunc): xmlParserInputBufferCreateFilenameFunc;
    };
    xmlParserInputBufferCreateIO: {
        (ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferCreateMem: {
        (mem: string | Buffer | null, size: number, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferCreateStatic: {
        (mem: string | Buffer | null, size: number, enc: xmlCharEncoding): xmlParserInputBufferPtr;
    };
    xmlParserInputBufferGrow: {
        (inArg: xmlParserInputBufferPtr | null, len: number): number;
    };
    xmlParserInputBufferPush: {
        (inArg: xmlParserInputBufferPtr | null, len: number, buf: string | Buffer | null): number;
    };
    xmlParserInputBufferRead: {
        (inArg: xmlParserInputBufferPtr | null, len: number): number;
    };
    xmlParserInputGrow: {
        (inArg: xmlParserInputPtr | null, len: number): number;
    };
    xmlParserInputRead: {
        (inArg: xmlParserInputPtr | null, len: number): number;
    };
    xmlParserInputShrink: {
        (inArg: xmlParserInputPtr | null): any;
    };
    xmlParserPrintFileContext: {
        (input: xmlParserInputPtr | null): any;
    };
    xmlParserPrintFileInfo: {
        (input: xmlParserInputPtr | null): any;
    };
    xmlParserValidityError: {
        (ctx: any, msg: string | Buffer | null, arg2: undefined): any;
    };
    xmlParserValidityWarning: {
        (ctx: any, msg: string | Buffer | null, arg2: undefined): any;
    };
    xmlParserWarning: {
        (ctx: any, msg: string | Buffer | null, arg2: undefined): any;
    };
    xmlPathToURI: {
        (path: string | Buffer | null): string;
    };
    xmlPatternFromRoot: {
        (comp: xmlPatternPtr | null): number;
    };
    xmlPatternGetStreamCtxt: {
        (comp: xmlPatternPtr | null): xmlStreamCtxtPtr;
    };
    xmlPatternMatch: {
        (comp: xmlPatternPtr | null, node: xmlNodePtr | null): number;
    };
    xmlPatternMaxDepth: {
        (comp: xmlPatternPtr | null): number;
    };
    xmlPatternMinDepth: {
        (comp: xmlPatternPtr | null): number;
    };
    xmlPatternStreamable: {
        (comp: xmlPatternPtr | null): number;
    };
    xmlPatterncompile: {
        (pattern: string | Buffer | null, dict: xmlDict, flags: number, namespaces: string | Buffer | null): xmlPatternPtr;
    };
    xmlPedanticParserDefault: {
        (val: number): number;
    };
    xmlPopInput: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlPopInputCallbacks: {
        (): number;
    };
    xmlPopOutputCallbacks: {
        (): number;
    };
    xmlPreviousElementSibling: {
        (node: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlPrintURI: {
        (stream: undefined, uri: xmlURIPtr | null): any;
    };
    xmlPushInput: {
        (ctxt: xmlParserCtxtPtr | null, input: xmlParserInputPtr | null): number;
    };
    xmlRMutexLock: {
        (tok: xmlRMutexPtr | null): any;
    };
    xmlRMutexUnlock: {
        (tok: xmlRMutexPtr | null): any;
    };
    xmlReadDoc: {
        (cur: string | Buffer | null, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlReadFd: {
        (fd: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlReadFile: {
        (URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlReadIO: {
        (ioread: xmlInputReadCallback, ioclose: xmlInputCloseCallback, ioctx: any, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlReadMemory: {
        (buffer: string | Buffer | null, size: number, URL: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlDocPtr | null;
    };
    xmlReallocLoc: {
        (ptr: any, size: number, file: string | Buffer | null, line: number): any;
    };
    xmlReconciliateNs: {
        (doc: xmlDocPtr | null, tree: xmlNodePtr | null): number;
    };
    xmlRecoverDoc: {
        (cur: string | Buffer | null): xmlDocPtr | null;
    };
    xmlRecoverFile: {
        (filename: string | Buffer | null): xmlDocPtr | null;
    };
    xmlRecoverMemory: {
        (buffer: string | Buffer | null, size: number): xmlDocPtr | null;
    };
    xmlRegExecErrInfo: {
        (exec: xmlRegExecCtxtPtr | null, string: string | Buffer | null, nbval: number, nbneg: number, values: string | Buffer | null, terminal: number): number;
    };
    xmlRegExecNextValues: {
        (exec: xmlRegExecCtxtPtr | null, nbval: number, nbneg: number, values: string | Buffer | null, terminal: number): number;
    };
    xmlRegExecPushString: {
        (exec: xmlRegExecCtxtPtr | null, value: string | Buffer | null, data: any): number;
    };
    xmlRegExecPushString2: {
        (exec: xmlRegExecCtxtPtr | null, value: string | Buffer | null, value2: string | Buffer | null, data: any): number;
    };
    xmlRegFreeExecCtxt: {
        (exec: xmlRegExecCtxtPtr | null): any;
    };
    xmlRegFreeRegexp: {
        (regexp: xmlRegexpPtr | null): any;
    };
    xmlRegNewExecCtxt: {
        (comp: xmlRegexpPtr | null, callback: xmlRegExecCallbacks, data: any): xmlRegExecCtxtPtr;
    };
    xmlRegexpCompile: {
        (regexp: string | Buffer | null): xmlRegexpPtr;
    };
    xmlRegexpExec: {
        (comp: xmlRegexpPtr | null, value: string | Buffer | null): number;
    };
    xmlRegexpIsDeterminist: {
        (comp: xmlRegexpPtr | null): number;
    };
    xmlRegexpPrint: {
        (output: undefined, regexp: xmlRegexpPtr | null): any;
    };
    xmlRegisterCharEncodingHandler: {
        (handler: xmlCharEncodingHandlerPtr | null): any;
    };
    xmlRegisterDefaultInputCallbacks: {
        (): any;
    };
    xmlRegisterDefaultOutputCallbacks: {
        (): any;
    };
    xmlRegisterInputCallbacks: {
        (matchFunc: xmlInputMatchCallback, openFunc: xmlInputOpenCallback, readFunc: xmlInputReadCallback, closeFunc: xmlInputCloseCallback): number;
    };
    xmlRegisterNodeDefault: {
        (func: xmlRegisterNodeFunc): xmlRegisterNodeFunc;
    };
    xmlRegisterOutputCallbacks: {
        (matchFunc: xmlOutputMatchCallback, openFunc: xmlOutputOpenCallback, writeFunc: xmlOutputWriteCallback, closeFunc: xmlOutputCloseCallback): number;
    };
    xmlRelaxNGCleanupTypes: {
        (): any;
    };
    xmlRelaxNGDump: {
        (output: undefined, schema: xmlRelaxNGPtr | null): any;
    };
    xmlRelaxNGDumpTree: {
        (output: undefined, schema: xmlRelaxNGPtr | null): any;
    };
    xmlRelaxNGFree: {
        (schema: xmlRelaxNGPtr | null): any;
    };
    xmlRelaxNGFreeParserCtxt: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null): any;
    };
    xmlRelaxNGFreeValidCtxt: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null): any;
    };
    xmlRelaxNGGetParserErrors: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null, err: xmlRelaxNGValidityErrorFunc, warn: xmlRelaxNGValidityWarningFunc, ctx: any): number;
    };
    xmlRelaxNGGetValidErrors: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, err: xmlRelaxNGValidityErrorFunc, warn: xmlRelaxNGValidityWarningFunc, ctx: any): number;
    };
    xmlRelaxNGInitTypes: {
        (): number;
    };
    xmlRelaxNGNewDocParserCtxt: {
        (doc: xmlDocPtr | null): xmlRelaxNGParserCtxtPtr;
    };
    xmlRelaxNGNewMemParserCtxt: {
        (buffer: string | Buffer | null, size: number): xmlRelaxNGParserCtxtPtr;
    };
    xmlRelaxNGNewParserCtxt: {
        (URL: string | Buffer | null): xmlRelaxNGParserCtxtPtr;
    };
    xmlRelaxNGNewValidCtxt: {
        (schema: xmlRelaxNGPtr | null): xmlRelaxNGValidCtxtPtr;
    };
    xmlRelaxNGParse: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null): xmlRelaxNGPtr;
    };
    xmlRelaxNGSetParserErrors: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null, err: xmlRelaxNGValidityErrorFunc, warn: xmlRelaxNGValidityWarningFunc, ctx: any): any;
    };
    xmlRelaxNGSetParserStructuredErrors: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null, serror: xmlStructuredErrorFunc, ctx: any): any;
    };
    xmlRelaxNGSetValidErrors: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, err: xmlRelaxNGValidityErrorFunc, warn: xmlRelaxNGValidityWarningFunc, ctx: any): any;
    };
    xmlRelaxNGSetValidStructuredErrors: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, serror: xmlStructuredErrorFunc, ctx: any): any;
    };
    xmlRelaxNGValidateDoc: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlRelaxNGValidateFullElement: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlRelaxNGValidatePopElement: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlRelaxNGValidatePushCData: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, data: string | Buffer | null, len: number): number;
    };
    xmlRelaxNGValidatePushElement: {
        (ctxt: xmlRelaxNGValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlRelaxParserSetFlag: {
        (ctxt: xmlRelaxNGParserCtxtPtr | null, flag: number): number;
    };
    xmlRemoveID: {
        (doc: xmlDocPtr | null, attr: xmlAttrPtr | null): number;
    };
    xmlRemoveProp: {
        (cur: xmlAttrPtr | null): number;
    };
    xmlRemoveRef: {
        (doc: xmlDocPtr | null, attr: xmlAttrPtr | null): number;
    };
    xmlReplaceNode: {
        (old: xmlNodePtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlResetError: {
        (err: xmlErrorPtr | null): any;
    };
    xmlResetLastError: {
        (): any;
    };
    xmlSAX2AttributeDecl: {
        (ctx: any, elem: string | Buffer | null, fullname: string | Buffer | null, type: number, def: number, defaultValue: string | Buffer | null, tree: xmlEnumerationPtr | null): any;
    };
    xmlSAX2CDataBlock: {
        (ctx: any, value: string | Buffer | null, len: number): any;
    };
    xmlSAX2Characters: {
        (ctx: any, ch: string | Buffer | null, len: number): any;
    };
    xmlSAX2Comment: {
        (ctx: any, value: string | Buffer | null): any;
    };
    xmlSAX2ElementDecl: {
        (ctx: any, name: string | Buffer | null, type: number, content: xmlElementContentPtr | null): any;
    };
    xmlSAX2EndDocument: {
        (ctx: any): any;
    };
    xmlSAX2EndElement: {
        (ctx: any, name: string | Buffer | null): any;
    };
    xmlSAX2EndElementNs: {
        (ctx: any, localname: string | Buffer | null, prefix: string | Buffer | null, URI: string | Buffer | null): any;
    };
    xmlSAX2EntityDecl: {
        (ctx: any, name: string | Buffer | null, type: number, publicId: string | Buffer | null, systemId: string | Buffer | null, content: string | Buffer | null): any;
    };
    xmlSAX2ExternalSubset: {
        (ctx: any, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): any;
    };
    xmlSAX2GetColumnNumber: {
        (ctx: any): number;
    };
    xmlSAX2GetEntity: {
        (ctx: any, name: string | Buffer | null): xmlEntityPtr;
    };
    xmlSAX2GetLineNumber: {
        (ctx: any): number;
    };
    xmlSAX2GetParameterEntity: {
        (ctx: any, name: string | Buffer | null): xmlEntityPtr;
    };
    xmlSAX2GetPublicId: {
        (ctx: any): string;
    };
    xmlSAX2GetSystemId: {
        (ctx: any): string;
    };
    xmlSAX2HasExternalSubset: {
        (ctx: any): number;
    };
    xmlSAX2HasInternalSubset: {
        (ctx: any): number;
    };
    xmlSAX2IgnorableWhitespace: {
        (ctx: any, ch: string | Buffer | null, len: number): any;
    };
    xmlSAX2InitDefaultSAXHandler: {
        (hdlr: xmlSAXHandler, warning: number): any;
    };
    xmlSAX2InitDocbDefaultSAXHandler: {
        (hdlr: xmlSAXHandler): any;
    };
    xmlSAX2InitHtmlDefaultSAXHandler: {
        (hdlr: xmlSAXHandler): any;
    };
    xmlSAX2InternalSubset: {
        (ctx: any, name: string | Buffer | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): any;
    };
    xmlSAX2IsStandalone: {
        (ctx: any): number;
    };
    xmlSAX2NotationDecl: {
        (ctx: any, name: string | Buffer | null, publicId: string | Buffer | null, systemId: string | Buffer | null): any;
    };
    xmlSAX2ProcessingInstruction: {
        (ctx: any, target: string | Buffer | null, data: string | Buffer | null): any;
    };
    xmlSAX2Reference: {
        (ctx: any, name: string | Buffer | null): any;
    };
    xmlSAX2ResolveEntity: {
        (ctx: any, publicId: string | Buffer | null, systemId: string | Buffer | null): xmlParserInputPtr;
    };
    xmlSAX2SetDocumentLocator: {
        (ctx: any, loc: xmlSAXLocatorPtr | null): any;
    };
    xmlSAX2StartDocument: {
        (ctx: any): any;
    };
    xmlSAX2StartElement: {
        (ctx: any, fullname: string | Buffer | null, atts: string | Buffer | null): any;
    };
    xmlSAX2StartElementNs: {
        (ctx: any, localname: string | Buffer | null, prefix: string | Buffer | null, URI: string | Buffer | null, nb_namespaces: number, namespaces: string | Buffer | null, nb_attributes: number, nb_defaulted: number, attributes: string | Buffer | null): any;
    };
    xmlSAX2UnparsedEntityDecl: {
        (ctx: any, name: string | Buffer | null, publicId: string | Buffer | null, systemId: string | Buffer | null, notationName: string | Buffer | null): any;
    };
    xmlSAXDefaultVersion: {
        (version: number): number;
    };
    xmlSAXParseDTD: {
        (sax: xmlSAXHandlerPtr | null, ExternalID: string | Buffer | null, SystemID: string | Buffer | null): xmlDtdPtr | null;
    };
    xmlSAXParseDoc: {
        (sax: xmlSAXHandlerPtr | null, cur: string | Buffer | null, recovery: number): xmlDocPtr | null;
    };
    xmlSAXParseEntity: {
        (sax: xmlSAXHandlerPtr | null, filename: string | Buffer | null): xmlDocPtr | null;
    };
    xmlSAXParseFile: {
        (sax: xmlSAXHandlerPtr | null, filename: string | Buffer | null, recovery: number): xmlDocPtr | null;
    };
    xmlSAXParseFileWithData: {
        (sax: xmlSAXHandlerPtr | null, filename: string | Buffer | null, recovery: number, data: any): xmlDocPtr | null;
    };
    xmlSAXParseMemory: {
        (sax: xmlSAXHandlerPtr | null, buffer: string | Buffer | null, size: number, recovery: number): xmlDocPtr | null;
    };
    xmlSAXParseMemoryWithData: {
        (sax: xmlSAXHandlerPtr | null, buffer: string | Buffer | null, size: number, recovery: number, data: any): xmlDocPtr | null;
    };
    xmlSAXUserParseFile: {
        (sax: xmlSAXHandlerPtr | null, user_data: any, filename: string | Buffer | null): number;
    };
    xmlSAXUserParseMemory: {
        (sax: xmlSAXHandlerPtr | null, user_data: any, buffer: string | Buffer | null, size: number): number;
    };
    xmlSAXVersion: {
        (hdlr: xmlSAXHandler, version: number): number;
    };
    xmlSaveClose: {
        (ctxt: xmlSaveCtxtPtr | null): number;
    };
    xmlSaveDoc: {
        (ctxt: xmlSaveCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlSaveFile: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null): number;
    };
    xmlSaveFileEnc: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null, encoding: string | Buffer | null): number;
    };
    xmlSaveFileTo: {
        (buf: xmlOutputBufferPtr | null, cur: xmlDocPtr | null, encoding: string | Buffer | null): number;
    };
    xmlSaveFlush: {
        (ctxt: xmlSaveCtxtPtr | null): number;
    };
    xmlSaveFormatFile: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null, format: number): number;
    };
    xmlSaveFormatFileEnc: {
        (filename: string | Buffer | null, cur: xmlDocPtr | null, encoding: string | Buffer | null, format: number): number;
    };
    xmlSaveFormatFileTo: {
        (buf: xmlOutputBufferPtr | null, cur: xmlDocPtr | null, encoding: string | Buffer | null, format: number): number;
    };
    xmlSaveSetAttrEscape: {
        (ctxt: xmlSaveCtxtPtr | null, escape: xmlCharEncodingOutputFunc): number;
    };
    xmlSaveSetEscape: {
        (ctxt: xmlSaveCtxtPtr | null, escape: xmlCharEncodingOutputFunc): number;
    };
    xmlSaveToBuffer: {
        (buffer: xmlBufferPtr | null, encoding: string | Buffer | null, options: number): xmlSaveCtxtPtr;
    };
    xmlSaveToFd: {
        (fd: number, encoding: string | Buffer | null, options: number): xmlSaveCtxtPtr;
    };
    xmlSaveToFilename: {
        (filename: string | Buffer | null, encoding: string | Buffer | null, options: number): xmlSaveCtxtPtr;
    };
    xmlSaveToIO: {
        (iowrite: xmlOutputWriteCallback, ioclose: xmlOutputCloseCallback, ioctx: any, encoding: string | Buffer | null, options: number): xmlSaveCtxtPtr;
    };
    xmlSaveTree: {
        (ctxt: xmlSaveCtxtPtr | null, node: xmlNodePtr | null): number;
    };
    xmlSaveUri: {
        (uri: xmlURIPtr | null): string;
    };
    xmlScanName: {
        (ctxt: xmlParserCtxtPtr | null): string;
    };
    xmlSchemaCheckFacet: {
        (facet: xmlSchemaFacetPtr | null, typeDecl: xmlSchemaTypePtr | null, ctxt: xmlSchemaParserCtxtPtr | null, name: string | Buffer | null): number;
    };
    xmlSchemaCleanupTypes: {
        (): any;
    };
    xmlSchemaCollapseString: {
        (value: string | Buffer | null): string;
    };
    xmlSchemaCompareValues: {
        (x: xmlSchemaValPtr | null, y: xmlSchemaValPtr | null): number;
    };
    xmlSchemaCompareValuesWhtsp: {
        (x: xmlSchemaValPtr | null, xws: xmlSchemaWhitespaceValueType, y: xmlSchemaValPtr | null, yws: xmlSchemaWhitespaceValueType): number;
    };
    xmlSchemaCopyValue: {
        (val: xmlSchemaValPtr | null): xmlSchemaValPtr;
    };
    xmlSchemaDump: {
        (output: undefined, schema: xmlSchemaPtr | null): any;
    };
    xmlSchemaFree: {
        (schema: xmlSchemaPtr | null): any;
    };
    xmlSchemaFreeFacet: {
        (facet: xmlSchemaFacetPtr | null): any;
    };
    xmlSchemaFreeParserCtxt: {
        (ctxt: xmlSchemaParserCtxtPtr | null): any;
    };
    xmlSchemaFreeType: {
        (type: xmlSchemaTypePtr | null): any;
    };
    xmlSchemaFreeValidCtxt: {
        (ctxt: xmlSchemaValidCtxtPtr | null): any;
    };
    xmlSchemaFreeValue: {
        (val: xmlSchemaValPtr | null): any;
    };
    xmlSchemaFreeWildcard: {
        (wildcard: xmlSchemaWildcardPtr | null): any;
    };
    xmlSchemaGetBuiltInListSimpleTypeItemType: {
        (type: xmlSchemaTypePtr | null): xmlSchemaTypePtr;
    };
    xmlSchemaGetBuiltInType: {
        (type: xmlSchemaValType): xmlSchemaTypePtr;
    };
    xmlSchemaGetCanonValue: {
        (val: xmlSchemaValPtr | null, retValue: string | Buffer | null): number;
    };
    xmlSchemaGetCanonValueWhtsp: {
        (val: xmlSchemaValPtr | null, retValue: string | Buffer | null, ws: xmlSchemaWhitespaceValueType): number;
    };
    xmlSchemaGetFacetValueAsULong: {
        (facet: xmlSchemaFacetPtr | null): number;
    };
    xmlSchemaGetParserErrors: {
        (ctxt: xmlSchemaParserCtxtPtr | null, err: xmlSchemaValidityErrorFunc, warn: xmlSchemaValidityWarningFunc, ctx: any): number;
    };
    xmlSchemaGetPredefinedType: {
        (name: string | Buffer | null, ns: string | Buffer | null): xmlSchemaTypePtr;
    };
    xmlSchemaGetValType: {
        (val: xmlSchemaValPtr | null): xmlSchemaValType;
    };
    xmlSchemaGetValidErrors: {
        (ctxt: xmlSchemaValidCtxtPtr | null, err: xmlSchemaValidityErrorFunc, warn: xmlSchemaValidityWarningFunc, ctx: any): number;
    };
    xmlSchemaInitTypes: {
        (): any;
    };
    xmlSchemaIsBuiltInTypeFacet: {
        (type: xmlSchemaTypePtr | null, facetType: number): number;
    };
    xmlSchemaIsValid: {
        (ctxt: xmlSchemaValidCtxtPtr | null): number;
    };
    xmlSchemaNewDocParserCtxt: {
        (doc: xmlDocPtr | null): xmlSchemaParserCtxtPtr;
    };
    xmlSchemaNewFacet: {
        (): xmlSchemaFacetPtr;
    };
    xmlSchemaNewMemParserCtxt: {
        (buffer: string | Buffer | null, size: number): xmlSchemaParserCtxtPtr;
    };
    xmlSchemaNewNOTATIONValue: {
        (name: string | Buffer | null, ns: string | Buffer | null): xmlSchemaValPtr;
    };
    xmlSchemaNewParserCtxt: {
        (URL: string | Buffer | null): xmlSchemaParserCtxtPtr;
    };
    xmlSchemaNewQNameValue: {
        (namespaceName: string | Buffer | null, localName: string | Buffer | null): xmlSchemaValPtr;
    };
    xmlSchemaNewStringValue: {
        (type: xmlSchemaValType, value: string | Buffer | null): xmlSchemaValPtr;
    };
    xmlSchemaNewValidCtxt: {
        (schema: xmlSchemaPtr | null): xmlSchemaValidCtxtPtr;
    };
    xmlSchemaParse: {
        (ctxt: xmlSchemaParserCtxtPtr | null): xmlSchemaPtr;
    };
    xmlSchemaSAXPlug: {
        (ctxt: xmlSchemaValidCtxtPtr | null, sax: xmlSAXHandlerPtr | null, user_data: any): xmlSchemaSAXPlugPtr;
    };
    xmlSchemaSAXUnplug: {
        (plug: xmlSchemaSAXPlugPtr | null): number;
    };
    xmlSchemaSetParserErrors: {
        (ctxt: xmlSchemaParserCtxtPtr | null, err: xmlSchemaValidityErrorFunc, warn: xmlSchemaValidityWarningFunc, ctx: any): any;
    };
    xmlSchemaSetParserStructuredErrors: {
        (ctxt: xmlSchemaParserCtxtPtr | null, serror: xmlStructuredErrorFunc, ctx: any): any;
    };
    xmlSchemaSetValidErrors: {
        (ctxt: xmlSchemaValidCtxtPtr | null, err: xmlSchemaValidityErrorFunc, warn: xmlSchemaValidityWarningFunc, ctx: any): any;
    };
    xmlSchemaSetValidOptions: {
        (ctxt: xmlSchemaValidCtxtPtr | null, options: number): number;
    };
    xmlSchemaSetValidStructuredErrors: {
        (ctxt: xmlSchemaValidCtxtPtr | null, serror: xmlStructuredErrorFunc, ctx: any): any;
    };
    xmlSchemaValPredefTypeNode: {
        (type: xmlSchemaTypePtr | null, value: string | Buffer | null, val: xmlSchemaValPtr | null, node: xmlNodePtr | null): number;
    };
    xmlSchemaValPredefTypeNodeNoNorm: {
        (type: xmlSchemaTypePtr | null, value: string | Buffer | null, val: xmlSchemaValPtr | null, node: xmlNodePtr | null): number;
    };
    xmlSchemaValidCtxtGetOptions: {
        (ctxt: xmlSchemaValidCtxtPtr | null): number;
    };
    xmlSchemaValidCtxtGetParserCtxt: {
        (ctxt: xmlSchemaValidCtxtPtr | null): xmlParserCtxtPtr;
    };
    xmlSchemaValidateDoc: {
        (ctxt: xmlSchemaValidCtxtPtr | null, instance: xmlDocPtr | null): number;
    };
    xmlSchemaValidateFacet: {
        (base: xmlSchemaTypePtr | null, facet: xmlSchemaFacetPtr | null, value: string | Buffer | null, val: xmlSchemaValPtr | null): number;
    };
    xmlSchemaValidateFacetWhtsp: {
        (facet: xmlSchemaFacetPtr | null, fws: xmlSchemaWhitespaceValueType, valType: xmlSchemaValType, value: string | Buffer | null, val: xmlSchemaValPtr | null, ws: xmlSchemaWhitespaceValueType): number;
    };
    xmlSchemaValidateFile: {
        (ctxt: xmlSchemaValidCtxtPtr | null, filename: string | Buffer | null, options: number): number;
    };
    xmlSchemaValidateLengthFacet: {
        (type: xmlSchemaTypePtr | null, facet: xmlSchemaFacetPtr | null, value: string | Buffer | null, val: xmlSchemaValPtr | null, length: number): number;
    };
    xmlSchemaValidateLengthFacetWhtsp: {
        (facet: xmlSchemaFacetPtr | null, valType: xmlSchemaValType, value: string | Buffer | null, val: xmlSchemaValPtr | null, length: number, ws: xmlSchemaWhitespaceValueType): number;
    };
    xmlSchemaValidateListSimpleTypeFacet: {
        (facet: xmlSchemaFacetPtr | null, value: string | Buffer | null, actualLen: number, expectedLen: number): number;
    };
    xmlSchemaValidateOneElement: {
        (ctxt: xmlSchemaValidCtxtPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlSchemaValidatePredefinedType: {
        (type: xmlSchemaTypePtr | null, value: string | Buffer | null, val: xmlSchemaValPtr | null): number;
    };
    xmlSchemaValidateSetFilename: {
        (vctxt: xmlSchemaValidCtxtPtr | null, filename: string | Buffer | null): any;
    };
    xmlSchemaValidateSetLocator: {
        (vctxt: xmlSchemaValidCtxtPtr | null, f: xmlSchemaValidityLocatorFunc, ctxt: any): any;
    };
    xmlSchemaValidateStream: {
        (ctxt: xmlSchemaValidCtxtPtr | null, input: xmlParserInputBufferPtr | null, enc: xmlCharEncoding, sax: xmlSAXHandlerPtr | null, user_data: any): number;
    };
    xmlSchemaValueAppend: {
        (prev: xmlSchemaValPtr | null, cur: xmlSchemaValPtr | null): number;
    };
    xmlSchemaValueGetAsBoolean: {
        (val: xmlSchemaValPtr | null): number;
    };
    xmlSchemaValueGetAsString: {
        (val: xmlSchemaValPtr | null): string;
    };
    xmlSchemaValueGetNext: {
        (cur: xmlSchemaValPtr | null): xmlSchemaValPtr;
    };
    xmlSchemaWhiteSpaceReplace: {
        (value: string | Buffer | null): string;
    };
    xmlSearchNs: {
        (doc: xmlDocPtr | null, node: xmlNodePtr | null, nameSpace: string | Buffer | null): xmlNsPtr | null;
    };
    xmlSearchNsByHref: {
        (doc: xmlDocPtr | null, node: xmlNodePtr | null, href: string | Buffer | null): xmlNsPtr | null;
    };
    xmlSetBufferAllocationScheme: {
        (scheme: xmlBufferAllocationScheme): any;
    };
    xmlSetCompressMode: {
        (mode: number): any;
    };
    xmlSetDocCompressMode: {
        (doc: xmlDocPtr | null, mode: number): any;
    };
    xmlSetEntityReferenceFunc: {
        (func: xmlEntityReferenceFunc): any;
    };
    xmlSetExternalEntityLoader: {
        (f: xmlExternalEntityLoader): any;
    };
    xmlSetFeature: {
        (ctxt: xmlParserCtxtPtr | null, name: string | Buffer | null, value: any): number;
    };
    xmlSetGenericErrorFunc: {
        (ctx: any, handler: xmlGenericErrorFunc): any;
    };
    xmlSetListDoc: {
        (list: xmlNodePtr | null, doc: xmlDocPtr | null): any;
    };
    xmlSetNs: {
        (node: xmlNodePtr | null, ns: xmlNsPtr | null): any;
    };
    xmlSetNsProp: {
        (node: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlSetProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null, value: string | Buffer | null): xmlAttrPtr | null;
    };
    xmlSetStructuredErrorFunc: {
        (ctx: any, handler: xmlStructuredErrorFunc): any;
    };
    xmlSetTreeDoc: {
        (tree: xmlNodePtr | null, doc: xmlDocPtr | null): any;
    };
    xmlSetupParserForBuffer: {
        (ctxt: xmlParserCtxtPtr | null, buffer: string | Buffer | null, filename: string | Buffer | null): any;
    };
    xmlSkipBlankChars: {
        (ctxt: xmlParserCtxtPtr | null): number;
    };
    xmlSnprintfElementContent: {
        (buf: string | Buffer | null, size: number, content: xmlElementContentPtr | null, englob: number): any;
    };
    xmlSplitQName: {
        (ctxt: xmlParserCtxtPtr | null, name: string | Buffer | null, prefix: string | Buffer | null): string;
    };
    xmlSplitQName2: {
        (name: string | Buffer | null, prefix: string | Buffer | null): string;
    };
    xmlSplitQName3: {
        (name: string | Buffer | null, len: number): string;
    };
    xmlSprintfElementContent: {
        (buf: string | Buffer | null, content: xmlElementContentPtr | null, englob: number): any;
    };
    xmlStopParser: {
        (ctxt: xmlParserCtxtPtr | null): any;
    };
    xmlStrEqual: {
        (str1: string | Buffer | null, str2: string | Buffer | null): number;
    };
    xmlStrPrintf: {
        (buf: string | Buffer | null, len: number, msg: string | Buffer | null, arg3: undefined): number;
    };
    xmlStrQEqual: {
        (pref: string | Buffer | null, name: string | Buffer | null, str: string | Buffer | null): number;
    };
    xmlStrcasecmp: {
        (str1: string | Buffer | null, str2: string | Buffer | null): number;
    };
    xmlStrcasestr: {
        (str: string | Buffer | null, val: string | Buffer | null): string;
    };
    xmlStrcat: {
        (cur: string | Buffer | null, add: string | Buffer | null): string;
    };
    xmlStrchr: {
        (str: string | Buffer | null, val: string | Buffer | null): string;
    };
    xmlStrcmp: {
        (str1: string | Buffer | null, str2: string | Buffer | null): number;
    };
    xmlStrdup: {
        (cur: string | Buffer | null): string;
    };
    xmlStreamPop: {
        (stream: xmlStreamCtxtPtr | null): number;
    };
    xmlStreamPush: {
        (stream: xmlStreamCtxtPtr | null, name: string | Buffer | null, ns: string | Buffer | null): number;
    };
    xmlStreamPushAttr: {
        (stream: xmlStreamCtxtPtr | null, name: string | Buffer | null, ns: string | Buffer | null): number;
    };
    xmlStreamPushNode: {
        (stream: xmlStreamCtxtPtr | null, name: string | Buffer | null, ns: string | Buffer | null, nodeType: number): number;
    };
    xmlStreamWantsAnyNode: {
        (stream: xmlStreamCtxtPtr | null): number;
    };
    xmlStringCurrentChar: {
        (ctxt: xmlParserCtxtPtr | null, cur: string | Buffer | null, len: number): number;
    };
    xmlStringDecodeEntities: {
        (ctxt: xmlParserCtxtPtr | null, str: string | Buffer | null, what: number, end: string | Buffer | null, end2: string | Buffer | null, end3: string | Buffer | null): string;
    };
    xmlStringGetNodeList: {
        (doc: xmlDocPtr | null, value: string | Buffer | null): xmlNodePtr | null;
    };
    xmlStringLenDecodeEntities: {
        (ctxt: xmlParserCtxtPtr | null, str: string | Buffer | null, len: number, what: number, end: string | Buffer | null, end2: string | Buffer | null, end3: string | Buffer | null): string;
    };
    xmlStringLenGetNodeList: {
        (doc: xmlDocPtr | null, value: string | Buffer | null, len: number): xmlNodePtr | null;
    };
    xmlStrlen: {
        (str: string | Buffer | null): number;
    };
    xmlStrncasecmp: {
        (str1: string | Buffer | null, str2: string | Buffer | null, len: number): number;
    };
    xmlStrncat: {
        (cur: string | Buffer | null, add: string | Buffer | null, len: number): string;
    };
    xmlStrncatNew: {
        (str1: string | Buffer | null, str2: string | Buffer | null, len: number): string;
    };
    xmlStrncmp: {
        (str1: string | Buffer | null, str2: string | Buffer | null, len: number): number;
    };
    xmlStrndup: {
        (cur: string | Buffer | null, len: number): string;
    };
    xmlStrstr: {
        (str: string | Buffer | null, val: string | Buffer | null): string;
    };
    xmlStrsub: {
        (str: string | Buffer | null, start: number, len: number): string;
    };
    xmlSubstituteEntitiesDefault: {
        (val: number): number;
    };
    xmlSwitchEncoding: {
        (ctxt: xmlParserCtxtPtr | null, enc: xmlCharEncoding): number;
    };
    xmlSwitchInputEncoding: {
        (ctxt: xmlParserCtxtPtr | null, input: xmlParserInputPtr | null, handler: xmlCharEncodingHandlerPtr | null): number;
    };
    xmlSwitchToEncoding: {
        (ctxt: xmlParserCtxtPtr | null, handler: xmlCharEncodingHandlerPtr | null): number;
    };
    xmlTextConcat: {
        (node: xmlNodePtr | null, content: string | Buffer | null, len: number): number;
    };
    xmlTextMerge: {
        (first: xmlNodePtr | null, second: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlThrDefBufferAllocScheme: {
        (v: xmlBufferAllocationScheme): xmlBufferAllocationScheme;
    };
    xmlThrDefDefaultBufferSize: {
        (v: number): number;
    };
    xmlThrDefDeregisterNodeDefault: {
        (func: xmlDeregisterNodeFunc): xmlDeregisterNodeFunc;
    };
    xmlThrDefDoValidityCheckingDefaultValue: {
        (v: number): number;
    };
    xmlThrDefGetWarningsDefaultValue: {
        (v: number): number;
    };
    xmlThrDefIndentTreeOutput: {
        (v: number): number;
    };
    xmlThrDefKeepBlanksDefaultValue: {
        (v: number): number;
    };
    xmlThrDefLineNumbersDefaultValue: {
        (v: number): number;
    };
    xmlThrDefLoadExtDtdDefaultValue: {
        (v: number): number;
    };
    xmlThrDefOutputBufferCreateFilenameDefault: {
        (func: xmlOutputBufferCreateFilenameFunc): xmlOutputBufferCreateFilenameFunc;
    };
    xmlThrDefParserDebugEntities: {
        (v: number): number;
    };
    xmlThrDefParserInputBufferCreateFilenameDefault: {
        (func: xmlParserInputBufferCreateFilenameFunc): xmlParserInputBufferCreateFilenameFunc;
    };
    xmlThrDefPedanticParserDefaultValue: {
        (v: number): number;
    };
    xmlThrDefRegisterNodeDefault: {
        (func: xmlRegisterNodeFunc): xmlRegisterNodeFunc;
    };
    xmlThrDefSaveNoEmptyTags: {
        (v: number): number;
    };
    xmlThrDefSetGenericErrorFunc: {
        (ctx: any, handler: xmlGenericErrorFunc): any;
    };
    xmlThrDefSetStructuredErrorFunc: {
        (ctx: any, handler: xmlStructuredErrorFunc): any;
    };
    xmlThrDefSubstituteEntitiesDefaultValue: {
        (v: number): number;
    };
    xmlThrDefTreeIndentString: {
        (v: string | Buffer | null): string;
    };
    xmlUCSIsAegeanNumbers: {
        (code: number): number;
    };
    xmlUCSIsAlphabeticPresentationForms: {
        (code: number): number;
    };
    xmlUCSIsArabic: {
        (code: number): number;
    };
    xmlUCSIsArabicPresentationFormsA: {
        (code: number): number;
    };
    xmlUCSIsArabicPresentationFormsB: {
        (code: number): number;
    };
    xmlUCSIsArmenian: {
        (code: number): number;
    };
    xmlUCSIsArrows: {
        (code: number): number;
    };
    xmlUCSIsBasicLatin: {
        (code: number): number;
    };
    xmlUCSIsBengali: {
        (code: number): number;
    };
    xmlUCSIsBlock: {
        (code: number, block: string | Buffer | null): number;
    };
    xmlUCSIsBlockElements: {
        (code: number): number;
    };
    xmlUCSIsBopomofo: {
        (code: number): number;
    };
    xmlUCSIsBopomofoExtended: {
        (code: number): number;
    };
    xmlUCSIsBoxDrawing: {
        (code: number): number;
    };
    xmlUCSIsBraillePatterns: {
        (code: number): number;
    };
    xmlUCSIsBuhid: {
        (code: number): number;
    };
    xmlUCSIsByzantineMusicalSymbols: {
        (code: number): number;
    };
    xmlUCSIsCJKCompatibility: {
        (code: number): number;
    };
    xmlUCSIsCJKCompatibilityForms: {
        (code: number): number;
    };
    xmlUCSIsCJKCompatibilityIdeographs: {
        (code: number): number;
    };
    xmlUCSIsCJKCompatibilityIdeographsSupplement: {
        (code: number): number;
    };
    xmlUCSIsCJKRadicalsSupplement: {
        (code: number): number;
    };
    xmlUCSIsCJKSymbolsandPunctuation: {
        (code: number): number;
    };
    xmlUCSIsCJKUnifiedIdeographs: {
        (code: number): number;
    };
    xmlUCSIsCJKUnifiedIdeographsExtensionA: {
        (code: number): number;
    };
    xmlUCSIsCJKUnifiedIdeographsExtensionB: {
        (code: number): number;
    };
    xmlUCSIsCat: {
        (code: number, cat: string | Buffer | null): number;
    };
    xmlUCSIsCatC: {
        (code: number): number;
    };
    xmlUCSIsCatCc: {
        (code: number): number;
    };
    xmlUCSIsCatCf: {
        (code: number): number;
    };
    xmlUCSIsCatCo: {
        (code: number): number;
    };
    xmlUCSIsCatCs: {
        (code: number): number;
    };
    xmlUCSIsCatL: {
        (code: number): number;
    };
    xmlUCSIsCatLl: {
        (code: number): number;
    };
    xmlUCSIsCatLm: {
        (code: number): number;
    };
    xmlUCSIsCatLo: {
        (code: number): number;
    };
    xmlUCSIsCatLt: {
        (code: number): number;
    };
    xmlUCSIsCatLu: {
        (code: number): number;
    };
    xmlUCSIsCatM: {
        (code: number): number;
    };
    xmlUCSIsCatMc: {
        (code: number): number;
    };
    xmlUCSIsCatMe: {
        (code: number): number;
    };
    xmlUCSIsCatMn: {
        (code: number): number;
    };
    xmlUCSIsCatN: {
        (code: number): number;
    };
    xmlUCSIsCatNd: {
        (code: number): number;
    };
    xmlUCSIsCatNl: {
        (code: number): number;
    };
    xmlUCSIsCatNo: {
        (code: number): number;
    };
    xmlUCSIsCatP: {
        (code: number): number;
    };
    xmlUCSIsCatPc: {
        (code: number): number;
    };
    xmlUCSIsCatPd: {
        (code: number): number;
    };
    xmlUCSIsCatPe: {
        (code: number): number;
    };
    xmlUCSIsCatPf: {
        (code: number): number;
    };
    xmlUCSIsCatPi: {
        (code: number): number;
    };
    xmlUCSIsCatPo: {
        (code: number): number;
    };
    xmlUCSIsCatPs: {
        (code: number): number;
    };
    xmlUCSIsCatS: {
        (code: number): number;
    };
    xmlUCSIsCatSc: {
        (code: number): number;
    };
    xmlUCSIsCatSk: {
        (code: number): number;
    };
    xmlUCSIsCatSm: {
        (code: number): number;
    };
    xmlUCSIsCatSo: {
        (code: number): number;
    };
    xmlUCSIsCatZ: {
        (code: number): number;
    };
    xmlUCSIsCatZl: {
        (code: number): number;
    };
    xmlUCSIsCatZp: {
        (code: number): number;
    };
    xmlUCSIsCatZs: {
        (code: number): number;
    };
    xmlUCSIsCherokee: {
        (code: number): number;
    };
    xmlUCSIsCombiningDiacriticalMarks: {
        (code: number): number;
    };
    xmlUCSIsCombiningDiacriticalMarksforSymbols: {
        (code: number): number;
    };
    xmlUCSIsCombiningHalfMarks: {
        (code: number): number;
    };
    xmlUCSIsCombiningMarksforSymbols: {
        (code: number): number;
    };
    xmlUCSIsControlPictures: {
        (code: number): number;
    };
    xmlUCSIsCurrencySymbols: {
        (code: number): number;
    };
    xmlUCSIsCypriotSyllabary: {
        (code: number): number;
    };
    xmlUCSIsCyrillic: {
        (code: number): number;
    };
    xmlUCSIsCyrillicSupplement: {
        (code: number): number;
    };
    xmlUCSIsDeseret: {
        (code: number): number;
    };
    xmlUCSIsDevanagari: {
        (code: number): number;
    };
    xmlUCSIsDingbats: {
        (code: number): number;
    };
    xmlUCSIsEnclosedAlphanumerics: {
        (code: number): number;
    };
    xmlUCSIsEnclosedCJKLettersandMonths: {
        (code: number): number;
    };
    xmlUCSIsEthiopic: {
        (code: number): number;
    };
    xmlUCSIsGeneralPunctuation: {
        (code: number): number;
    };
    xmlUCSIsGeometricShapes: {
        (code: number): number;
    };
    xmlUCSIsGeorgian: {
        (code: number): number;
    };
    xmlUCSIsGothic: {
        (code: number): number;
    };
    xmlUCSIsGreek: {
        (code: number): number;
    };
    xmlUCSIsGreekExtended: {
        (code: number): number;
    };
    xmlUCSIsGreekandCoptic: {
        (code: number): number;
    };
    xmlUCSIsGujarati: {
        (code: number): number;
    };
    xmlUCSIsGurmukhi: {
        (code: number): number;
    };
    xmlUCSIsHalfwidthandFullwidthForms: {
        (code: number): number;
    };
    xmlUCSIsHangulCompatibilityJamo: {
        (code: number): number;
    };
    xmlUCSIsHangulJamo: {
        (code: number): number;
    };
    xmlUCSIsHangulSyllables: {
        (code: number): number;
    };
    xmlUCSIsHanunoo: {
        (code: number): number;
    };
    xmlUCSIsHebrew: {
        (code: number): number;
    };
    xmlUCSIsHighPrivateUseSurrogates: {
        (code: number): number;
    };
    xmlUCSIsHighSurrogates: {
        (code: number): number;
    };
    xmlUCSIsHiragana: {
        (code: number): number;
    };
    xmlUCSIsIPAExtensions: {
        (code: number): number;
    };
    xmlUCSIsIdeographicDescriptionCharacters: {
        (code: number): number;
    };
    xmlUCSIsKanbun: {
        (code: number): number;
    };
    xmlUCSIsKangxiRadicals: {
        (code: number): number;
    };
    xmlUCSIsKannada: {
        (code: number): number;
    };
    xmlUCSIsKatakana: {
        (code: number): number;
    };
    xmlUCSIsKatakanaPhoneticExtensions: {
        (code: number): number;
    };
    xmlUCSIsKhmer: {
        (code: number): number;
    };
    xmlUCSIsKhmerSymbols: {
        (code: number): number;
    };
    xmlUCSIsLao: {
        (code: number): number;
    };
    xmlUCSIsLatin1Supplement: {
        (code: number): number;
    };
    xmlUCSIsLatinExtendedA: {
        (code: number): number;
    };
    xmlUCSIsLatinExtendedAdditional: {
        (code: number): number;
    };
    xmlUCSIsLatinExtendedB: {
        (code: number): number;
    };
    xmlUCSIsLetterlikeSymbols: {
        (code: number): number;
    };
    xmlUCSIsLimbu: {
        (code: number): number;
    };
    xmlUCSIsLinearBIdeograms: {
        (code: number): number;
    };
    xmlUCSIsLinearBSyllabary: {
        (code: number): number;
    };
    xmlUCSIsLowSurrogates: {
        (code: number): number;
    };
    xmlUCSIsMalayalam: {
        (code: number): number;
    };
    xmlUCSIsMathematicalAlphanumericSymbols: {
        (code: number): number;
    };
    xmlUCSIsMathematicalOperators: {
        (code: number): number;
    };
    xmlUCSIsMiscellaneousMathematicalSymbolsA: {
        (code: number): number;
    };
    xmlUCSIsMiscellaneousMathematicalSymbolsB: {
        (code: number): number;
    };
    xmlUCSIsMiscellaneousSymbols: {
        (code: number): number;
    };
    xmlUCSIsMiscellaneousSymbolsandArrows: {
        (code: number): number;
    };
    xmlUCSIsMiscellaneousTechnical: {
        (code: number): number;
    };
    xmlUCSIsMongolian: {
        (code: number): number;
    };
    xmlUCSIsMusicalSymbols: {
        (code: number): number;
    };
    xmlUCSIsMyanmar: {
        (code: number): number;
    };
    xmlUCSIsNumberForms: {
        (code: number): number;
    };
    xmlUCSIsOgham: {
        (code: number): number;
    };
    xmlUCSIsOldItalic: {
        (code: number): number;
    };
    xmlUCSIsOpticalCharacterRecognition: {
        (code: number): number;
    };
    xmlUCSIsOriya: {
        (code: number): number;
    };
    xmlUCSIsOsmanya: {
        (code: number): number;
    };
    xmlUCSIsPhoneticExtensions: {
        (code: number): number;
    };
    xmlUCSIsPrivateUse: {
        (code: number): number;
    };
    xmlUCSIsPrivateUseArea: {
        (code: number): number;
    };
    xmlUCSIsRunic: {
        (code: number): number;
    };
    xmlUCSIsShavian: {
        (code: number): number;
    };
    xmlUCSIsSinhala: {
        (code: number): number;
    };
    xmlUCSIsSmallFormVariants: {
        (code: number): number;
    };
    xmlUCSIsSpacingModifierLetters: {
        (code: number): number;
    };
    xmlUCSIsSpecials: {
        (code: number): number;
    };
    xmlUCSIsSuperscriptsandSubscripts: {
        (code: number): number;
    };
    xmlUCSIsSupplementalArrowsA: {
        (code: number): number;
    };
    xmlUCSIsSupplementalArrowsB: {
        (code: number): number;
    };
    xmlUCSIsSupplementalMathematicalOperators: {
        (code: number): number;
    };
    xmlUCSIsSupplementaryPrivateUseAreaA: {
        (code: number): number;
    };
    xmlUCSIsSupplementaryPrivateUseAreaB: {
        (code: number): number;
    };
    xmlUCSIsSyriac: {
        (code: number): number;
    };
    xmlUCSIsTagalog: {
        (code: number): number;
    };
    xmlUCSIsTagbanwa: {
        (code: number): number;
    };
    xmlUCSIsTags: {
        (code: number): number;
    };
    xmlUCSIsTaiLe: {
        (code: number): number;
    };
    xmlUCSIsTaiXuanJingSymbols: {
        (code: number): number;
    };
    xmlUCSIsTamil: {
        (code: number): number;
    };
    xmlUCSIsTelugu: {
        (code: number): number;
    };
    xmlUCSIsThaana: {
        (code: number): number;
    };
    xmlUCSIsThai: {
        (code: number): number;
    };
    xmlUCSIsTibetan: {
        (code: number): number;
    };
    xmlUCSIsUgaritic: {
        (code: number): number;
    };
    xmlUCSIsUnifiedCanadianAboriginalSyllabics: {
        (code: number): number;
    };
    xmlUCSIsVariationSelectors: {
        (code: number): number;
    };
    xmlUCSIsVariationSelectorsSupplement: {
        (code: number): number;
    };
    xmlUCSIsYiRadicals: {
        (code: number): number;
    };
    xmlUCSIsYiSyllables: {
        (code: number): number;
    };
    xmlUCSIsYijingHexagramSymbols: {
        (code: number): number;
    };
    xmlURIEscape: {
        (str: string | Buffer | null): string;
    };
    xmlURIEscapeStr: {
        (str: string | Buffer | null, list: string | Buffer | null): string;
    };
    xmlURIUnescapeString: {
        (str: string | Buffer | null, len: number, target: string | Buffer | null): string;
    };
    xmlUTF8Charcmp: {
        (utf1: string | Buffer | null, utf2: string | Buffer | null): number;
    };
    xmlUTF8Size: {
        (utf: string | Buffer | null): number;
    };
    xmlUTF8Strlen: {
        (utf: string | Buffer | null): number;
    };
    xmlUTF8Strloc: {
        (utf: string | Buffer | null, utfchar: string | Buffer | null): number;
    };
    xmlUTF8Strndup: {
        (utf: string | Buffer | null, len: number): string;
    };
    xmlUTF8Strpos: {
        (utf: string | Buffer | null, pos: number): string;
    };
    xmlUTF8Strsize: {
        (utf: string | Buffer | null, len: number): number;
    };
    xmlUTF8Strsub: {
        (utf: string | Buffer | null, start: number, len: number): string;
    };
    xmlUnlinkNode: {
        (cur: xmlNodePtr | null): any;
    };
    xmlUnlockLibrary: {
        (): any;
    };
    xmlUnsetNsProp: {
        (node: xmlNodePtr | null, ns: xmlNsPtr | null, name: string | Buffer | null): number;
    };
    xmlUnsetProp: {
        (node: xmlNodePtr | null, name: string | Buffer | null): number;
    };
    xmlValidBuildContentModel: {
        (ctxt: xmlValidCtxtPtr | null, elem: xmlElementPtr | null): number;
    };
    xmlValidCtxtNormalizeAttributeValue: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null, name: string | Buffer | null, value: string | Buffer | null): string;
    };
    xmlValidGetPotentialChildren: {
        (ctree: xmlElementContent, names: string | Buffer | null, len: number, max: number): number;
    };
    xmlValidGetValidElements: {
        (prev: xmlNode, next: xmlNode, names: string | Buffer | null, max: number): number;
    };
    xmlValidNormalizeAttributeValue: {
        (doc: xmlDocPtr | null, elem: xmlNodePtr | null, name: string | Buffer | null, value: string | Buffer | null): string;
    };
    xmlValidateAttributeDecl: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, attr: xmlAttributePtr | null): number;
    };
    xmlValidateAttributeValue: {
        (type: xmlAttributeType, value: string | Buffer | null): number;
    };
    xmlValidateDocument: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlValidateDocumentFinal: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlValidateDtd: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, dtd: xmlDtdPtr | null): number;
    };
    xmlValidateDtdFinal: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlValidateElement: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlValidateElementDecl: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlElementPtr | null): number;
    };
    xmlValidateNCName: {
        (value: string | Buffer | null, space: number): number;
    };
    xmlValidateNMToken: {
        (value: string | Buffer | null, space: number): number;
    };
    xmlValidateName: {
        (value: string | Buffer | null, space: number): number;
    };
    xmlValidateNameValue: {
        (value: string | Buffer | null): number;
    };
    xmlValidateNamesValue: {
        (value: string | Buffer | null): number;
    };
    xmlValidateNmtokenValue: {
        (value: string | Buffer | null): number;
    };
    xmlValidateNmtokensValue: {
        (value: string | Buffer | null): number;
    };
    xmlValidateNotationDecl: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, nota: xmlNotationPtr | null): number;
    };
    xmlValidateNotationUse: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, notationName: string | Buffer | null): number;
    };
    xmlValidateOneAttribute: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null, attr: xmlAttrPtr | null, value: string | Buffer | null): number;
    };
    xmlValidateOneElement: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null): number;
    };
    xmlValidateOneNamespace: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null, prefix: string | Buffer | null, ns: xmlNsPtr | null, value: string | Buffer | null): number;
    };
    xmlValidatePopElement: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null, qname: string | Buffer | null): number;
    };
    xmlValidatePushCData: {
        (ctxt: xmlValidCtxtPtr | null, data: string | Buffer | null, len: number): number;
    };
    xmlValidatePushElement: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null, elem: xmlNodePtr | null, qname: string | Buffer | null): number;
    };
    xmlValidateQName: {
        (value: string | Buffer | null, space: number): number;
    };
    xmlValidateRoot: {
        (ctxt: xmlValidCtxtPtr | null, doc: xmlDocPtr | null): number;
    };
    xmlXPathAddValues: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathBooleanFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathCastBooleanToNumber: {
        (val: number): number;
    };
    xmlXPathCastBooleanToString: {
        (val: number): string;
    };
    xmlXPathCastNodeSetToBoolean: {
        (ns: xmlNodePtr[]): number;
    };
    xmlXPathCastNodeSetToNumber: {
        (ns: xmlNodePtr[]): number;
    };
    xmlXPathCastNodeSetToString: {
        (ns: xmlNodePtr[]): string;
    };
    xmlXPathCastNodeToNumber: {
        (node: xmlNodePtr | null): number;
    };
    xmlXPathCastNodeToString: {
        (node: xmlNodePtr | null): string;
    };
    xmlXPathCastNumberToBoolean: {
        (val: number): number;
    };
    xmlXPathCastNumberToString: {
        (val: number): string;
    };
    xmlXPathCastStringToBoolean: {
        (val: string | Buffer | null): number;
    };
    xmlXPathCastStringToNumber: {
        (val: string | Buffer | null): number;
    };
    xmlXPathCastToBoolean: {
        (val: xmlXPathObjectPtr | null): number;
    };
    xmlXPathCastToNumber: {
        (val: xmlXPathObjectPtr | null): number;
    };
    xmlXPathCastToString: {
        (val: xmlXPathObjectPtr | null): string;
    };
    xmlXPathCeilingFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathCmpNodes: {
        (node1: xmlNodePtr | null, node2: xmlNodePtr | null): number;
    };
    xmlXPathCompareValues: {
        (ctxt: xmlXPathParserContextPtr | null, inf: number, strict: number): number;
    };
    xmlXPathCompile: {
        (str: string | Buffer | null): xmlXPathCompExprPtr;
    };
    xmlXPathCompiledEval: {
        (comp: xmlXPathCompExprPtr | null, ctx: xmlXPathContextPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathCompiledEvalToBoolean: {
        (comp: xmlXPathCompExprPtr | null, ctxt: xmlXPathContextPtr | null): number;
    };
    xmlXPathConcatFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathContainsFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathContextSetCache: {
        (ctxt: xmlXPathContextPtr | null, active: number, value: number, options: number): number;
    };
    xmlXPathConvertBoolean: {
        (val: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathConvertNumber: {
        (val: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathConvertString: {
        (val: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathCountFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathCtxtCompile: {
        (ctxt: xmlXPathContextPtr | null, str: string | Buffer | null): xmlXPathCompExprPtr;
    };
    xmlXPathDifference: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathDistinct: {
        (nodes: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathDistinctSorted: {
        (nodes: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathDivValues: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathEqualValues: {
        (ctxt: xmlXPathParserContextPtr | null): number;
    };
    xmlXPathErr: {
        (ctxt: xmlXPathParserContextPtr | null, error: number): any;
    };
    xmlXPathEval: {
        (str: string | Buffer | null, ctx: xmlXPathContextPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathEvalExpr: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathEvalExpression: {
        (str: string | Buffer | null, ctxt: xmlXPathContextPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathEvalPredicate: {
        (ctxt: xmlXPathContextPtr | null, res: xmlXPathObjectPtr | null): number;
    };
    xmlXPathEvaluatePredicateResult: {
        (ctxt: xmlXPathParserContextPtr | null, res: xmlXPathObjectPtr | null): number;
    };
    xmlXPathFalseFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathFloorFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathFreeCompExpr: {
        (comp: xmlXPathCompExprPtr | null): any;
    };
    xmlXPathFreeContext: {
        (ctxt: xmlXPathContextPtr | null): any;
    };
    xmlXPathFreeNodeSet: {
        (obj: xmlNodePtr[]): any;
    };
    xmlXPathFreeNodeSetList: {
        (obj: xmlXPathObjectPtr | null): any;
    };
    xmlXPathFreeObject: {
        (obj: xmlXPathObjectPtr | null): any;
    };
    xmlXPathFreeParserContext: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathFunctionLookup: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null): xmlXPathFunction;
    };
    xmlXPathFunctionLookupNS: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, ns_uri: string | Buffer | null): xmlXPathFunction;
    };
    xmlXPathHasSameNodes: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): number;
    };
    xmlXPathIdFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathInit: {
        (): any;
    };
    xmlXPathIntersection: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathIsInf: {
        (val: number): number;
    };
    xmlXPathIsNaN: {
        (val: number): number;
    };
    xmlXPathIsNodeType: {
        (name: string | Buffer | null): number;
    };
    xmlXPathLangFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathLastFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathLeading: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathLeadingSorted: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathLocalNameFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathModValues: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathMultValues: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathNamespaceURIFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathNewBoolean: {
        (val: number): xmlXPathObjectPtr;
    };
    xmlXPathNewCString: {
        (val: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPathNewContext: {
        (doc: xmlDocPtr | null): xmlXPathContextPtr;
    };
    xmlXPathNewFloat: {
        (val: number): xmlXPathObjectPtr;
    };
    xmlXPathNewNodeSet: {
        (val: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPathNewNodeSetList: {
        (val: xmlNodePtr[]): xmlXPathObjectPtr;
    };
    xmlXPathNewParserContext: {
        (str: string | Buffer | null, ctxt: xmlXPathContextPtr | null): xmlXPathParserContextPtr;
    };
    xmlXPathNewString: {
        (val: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPathNewValueTree: {
        (val: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPathNextAncestor: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextAncestorOrSelf: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextAttribute: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextChild: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextDescendant: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextDescendantOrSelf: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextFollowing: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextFollowingSibling: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextNamespace: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextParent: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextPreceding: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextPrecedingSibling: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNextSelf: {
        (ctxt: xmlXPathParserContextPtr | null, cur: xmlNodePtr | null): xmlNodePtr | null;
    };
    xmlXPathNodeEval: {
        (node: xmlNodePtr | null, str: string | Buffer | null, ctx: xmlXPathContextPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathNodeLeading: {
        (nodes: xmlNodePtr[], node: xmlNodePtr | null): xmlNodePtr[];
    };
    xmlXPathNodeLeadingSorted: {
        (nodes: xmlNodePtr[], node: xmlNodePtr | null): xmlNodePtr[];
    };
    xmlXPathNodeSetAdd: {
        (cur: xmlNodePtr[], val: xmlNodePtr | null): number;
    };
    xmlXPathNodeSetAddNs: {
        (cur: xmlNodePtr[], node: xmlNodePtr | null, ns: xmlNsPtr | null): number;
    };
    xmlXPathNodeSetAddUnique: {
        (cur: xmlNodePtr[], val: xmlNodePtr | null): number;
    };
    xmlXPathNodeSetContains: {
        (cur: xmlNodePtr[], val: xmlNodePtr | null): number;
    };
    xmlXPathNodeSetCreate: {
        (val: xmlNodePtr | null): xmlNodePtr[];
    };
    xmlXPathNodeSetDel: {
        (cur: xmlNodePtr[], val: xmlNodePtr | null): any;
    };
    xmlXPathNodeSetFreeNs: {
        (ns: xmlNsPtr | null): any;
    };
    xmlXPathNodeSetMerge: {
        (val1: xmlNodePtr[], val2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathNodeSetRemove: {
        (cur: xmlNodePtr[], val: number): any;
    };
    xmlXPathNodeSetSort: {
        (set: xmlNodePtr[]): any;
    };
    xmlXPathNodeTrailing: {
        (nodes: xmlNodePtr[], node: xmlNodePtr | null): xmlNodePtr[];
    };
    xmlXPathNodeTrailingSorted: {
        (nodes: xmlNodePtr[], node: xmlNodePtr | null): xmlNodePtr[];
    };
    xmlXPathNormalizeFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathNotEqualValues: {
        (ctxt: xmlXPathParserContextPtr | null): number;
    };
    xmlXPathNotFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathNsLookup: {
        (ctxt: xmlXPathContextPtr | null, prefix: string | Buffer | null): string;
    };
    xmlXPathNumberFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathObjectCopy: {
        (val: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPathOrderDocElems: {
        (doc: xmlDocPtr | null): number;
    };
    xmlXPathParseNCName: {
        (ctxt: xmlXPathParserContextPtr | null): string;
    };
    xmlXPathParseName: {
        (ctxt: xmlXPathParserContextPtr | null): string;
    };
    xmlXPathPopBoolean: {
        (ctxt: xmlXPathParserContextPtr | null): number;
    };
    xmlXPathPopExternal: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathPopNodeSet: {
        (ctxt: xmlXPathParserContextPtr | null): xmlNodePtr[];
    };
    xmlXPathPopNumber: {
        (ctxt: xmlXPathParserContextPtr | null): number;
    };
    xmlXPathPopString: {
        (ctxt: xmlXPathParserContextPtr | null): string;
    };
    xmlXPathPositionFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathRegisterAllFunctions: {
        (ctxt: xmlXPathContextPtr | null): any;
    };
    xmlXPathRegisterFunc: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, f: xmlXPathFunction): number;
    };
    xmlXPathRegisterFuncLookup: {
        (ctxt: xmlXPathContextPtr | null, f: xmlXPathFuncLookupFunc, funcCtxt: any): any;
    };
    xmlXPathRegisterFuncNS: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, ns_uri: string | Buffer | null, f: xmlXPathFunction): number;
    };
    xmlXPathRegisterNs: {
        (ctxt: xmlXPathContextPtr | null, prefix: string | Buffer | null, ns_uri: string | Buffer | null): number;
    };
    xmlXPathRegisterVariable: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, value: xmlXPathObjectPtr | null): number;
    };
    xmlXPathRegisterVariableLookup: {
        (ctxt: xmlXPathContextPtr | null, f: xmlXPathVariableLookupFunc, data: any): any;
    };
    xmlXPathRegisterVariableNS: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, ns_uri: string | Buffer | null, value: xmlXPathObjectPtr | null): number;
    };
    xmlXPathRegisteredFuncsCleanup: {
        (ctxt: xmlXPathContextPtr | null): any;
    };
    xmlXPathRegisteredNsCleanup: {
        (ctxt: xmlXPathContextPtr | null): any;
    };
    xmlXPathRegisteredVariablesCleanup: {
        (ctxt: xmlXPathContextPtr | null): any;
    };
    xmlXPathRoot: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathRoundFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathSetContextNode: {
        (node: xmlNodePtr | null, ctx: xmlXPathContextPtr | null): number;
    };
    xmlXPathStartsWithFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathStringEvalNumber: {
        (str: string | Buffer | null): number;
    };
    xmlXPathStringFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathStringLengthFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathSubValues: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathSubstringAfterFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathSubstringBeforeFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathSubstringFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathSumFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathTrailing: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathTrailingSorted: {
        (nodes1: xmlNodePtr[], nodes2: xmlNodePtr[]): xmlNodePtr[];
    };
    xmlXPathTranslateFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathTrueFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPathValueFlipSign: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPathVariableLookup: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPathVariableLookupNS: {
        (ctxt: xmlXPathContextPtr | null, name: string | Buffer | null, ns_uri: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPathWrapCString: {
        (val: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPathWrapExternal: {
        (val: any): xmlXPathObjectPtr;
    };
    xmlXPathWrapNodeSet: {
        (val: xmlNodePtr[]): xmlXPathObjectPtr;
    };
    xmlXPathWrapString: {
        (val: string | Buffer | null): xmlXPathObjectPtr;
    };
    xmlXPatherror: {
        (ctxt: xmlXPathParserContextPtr | null, file: string | Buffer | null, line: number, no: number): any;
    };
    xmlXPtrBuildNodeList: {
        (obj: xmlXPathObjectPtr | null): xmlNodePtr | null;
    };
    xmlXPtrEval: {
        (str: string | Buffer | null, ctx: xmlXPathContextPtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrEvalRangePredicate: {
        (ctxt: xmlXPathParserContextPtr | null): any;
    };
    xmlXPtrFreeLocationSet: {
        (obj: xmlLocationSetPtr | null): any;
    };
    xmlXPtrLocationSetAdd: {
        (cur: xmlLocationSetPtr | null, val: xmlXPathObjectPtr | null): any;
    };
    xmlXPtrLocationSetCreate: {
        (val: xmlXPathObjectPtr | null): xmlLocationSetPtr;
    };
    xmlXPtrLocationSetDel: {
        (cur: xmlLocationSetPtr | null, val: xmlXPathObjectPtr | null): any;
    };
    xmlXPtrLocationSetMerge: {
        (val1: xmlLocationSetPtr | null, val2: xmlLocationSetPtr | null): xmlLocationSetPtr;
    };
    xmlXPtrLocationSetRemove: {
        (cur: xmlLocationSetPtr | null, val: number): any;
    };
    xmlXPtrNewCollapsedRange: {
        (start: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewContext: {
        (doc: xmlDocPtr | null, here: xmlNodePtr | null, origin: xmlNodePtr | null): xmlXPathContextPtr;
    };
    xmlXPtrNewLocationSetNodeSet: {
        (set: xmlNodePtr[]): xmlXPathObjectPtr;
    };
    xmlXPtrNewLocationSetNodes: {
        (start: xmlNodePtr | null, end: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewRange: {
        (start: xmlNodePtr | null, startindex: number, end: xmlNodePtr | null, endindex: number): xmlXPathObjectPtr;
    };
    xmlXPtrNewRangeNodeObject: {
        (start: xmlNodePtr | null, end: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewRangeNodePoint: {
        (start: xmlNodePtr | null, end: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewRangeNodes: {
        (start: xmlNodePtr | null, end: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewRangePointNode: {
        (start: xmlXPathObjectPtr | null, end: xmlNodePtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrNewRangePoints: {
        (start: xmlXPathObjectPtr | null, end: xmlXPathObjectPtr | null): xmlXPathObjectPtr;
    };
    xmlXPtrRangeToFunction: {
        (ctxt: xmlXPathParserContextPtr | null, nargs: number): any;
    };
    xmlXPtrWrapLocationSet: {
        (val: xmlLocationSetPtr | null): xmlXPathObjectPtr;
    };
    fromBufferAsync: {
        (type: FROM_BUFFER_ASYNC_TYPE, buffer: string | Buffer, size: number, URL: string, encoding: string, options: number, callback: Function): xmlDocPtr;
    };
    xmlPtrToXmlAttr: {
        (arg0: any): xmlAttrPtr;
    };
    xmlPtrToXmlDoc: {
        (arg0: any): xmlDocPtr;
    };
    xmlPtrToXmlDtd: {
        (arg0: any): xmlDtdPtr;
    };
    xmlPtrToXmlElement: {
        (arg0: any): xmlElementPtr;
    };
    xmlPtrToXmlNode: {
        (arg0: any): xmlNodePtr;
    };
    xmlPtrToXmlNs: {
        (arg0: any): xmlNsPtr;
    };
}
export type XMLReferenceType = xmlNodePtr | xmlDocPtr | xmlDtdPtr | xmlAttrPtr | xmlElementPtr | xmlNsPtr;
export {};
