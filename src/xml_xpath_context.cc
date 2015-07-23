// Copyright 2009, Squish Tech, LLC.

#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>

#include "xml_xpath_context.h"
#include "xml_element.h"

namespace libxmljs {

XmlXpathContext::XmlXpathContext(xmlNode* node) {
  ctxt = xmlXPathNewContext(node->doc);
  ctxt->node = node;
}

XmlXpathContext::~XmlXpathContext() {
  xmlXPathFreeContext(ctxt);
}

void
XmlXpathContext::register_ns(const xmlChar* prefix,
                             const xmlChar* uri) {
  xmlXPathRegisterNs(ctxt, prefix, uri);
}

v8::Local<v8::Value>
XmlXpathContext::evaluate(const xmlChar* xpath) {
  NanEscapableScope();
  xmlXPathObject* xpathobj = xmlXPathEval(xpath, ctxt);
  v8::Local<v8::Value> res;

  if (xpathobj) {
    switch (xpathobj->type) {
    case XPATH_NODESET: {
      if (xmlXPathNodeSetIsEmpty(xpathobj->nodesetval)) {
        res = NanNew<v8::Array>(0);
        break;
      }

      v8::Local<v8::Array> nodes = NanNew<v8::Array>(xpathobj->nodesetval->nodeNr);
      for (int i = 0; i != xpathobj->nodesetval->nodeNr; ++i) {
        nodes->Set(i, XmlNode::New(xpathobj->nodesetval->nodeTab[i]));
      }

      res = nodes;
      break;
    }

    case XPATH_BOOLEAN:
      res = NanNew<v8::Boolean>(xpathobj->boolval);
      break;

    case XPATH_NUMBER:
      res = NanNew<v8::Number>(xpathobj->floatval);
      break;

    case XPATH_STRING:
      res = NanNew<v8::String>((const char *)xpathobj->stringval,
                            xmlStrlen(xpathobj->stringval));
      break;

    default:
      res = NanNull();
      break;
    }
  }

  xmlXPathFreeObject(xpathobj);
  return NanEscapeScope(res);
}

}  // namespace libxmljs
