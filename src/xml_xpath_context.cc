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

v8::Handle<v8::Value>
XmlXpathContext::evaluate(const xmlChar* xpath) {
  v8::HandleScope scope;
  xmlXPathObject* xpathobj = xmlXPathEval(xpath, ctxt);
  v8::Handle<v8::Value> res;

  if (xpathobj) {
    switch (xpathobj->type) {
    case XPATH_NODESET: {
      if (xmlXPathNodeSetIsEmpty(xpathobj->nodesetval)) {
        res = v8::Array::New(0);
        break;
      }

      v8::Handle<v8::Array> nodes = v8::Array::New(xpathobj->nodesetval->nodeNr);
      for (int i = 0; i != xpathobj->nodesetval->nodeNr; ++i) {
        nodes->Set(i, XmlNode::New(xpathobj->nodesetval->nodeTab[i]));
      }

      res = nodes;
      break;
    }

    case XPATH_BOOLEAN:
      res = v8::Boolean::New(xpathobj->boolval);
      break;

    case XPATH_NUMBER:
      res = v8::Number::New(xpathobj->floatval);
      break;

    case XPATH_STRING:
      res = v8::String::New((const char *)xpathobj->stringval,
                            xmlStrlen(xpathobj->stringval));
      break;

    default:
      res = v8::Null();
      break;
    }
  }

  xmlXPathFreeObject(xpathobj);
  return scope.Close(res);
}

}  // namespace libxmljs
