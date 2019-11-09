// Copyright 2009, Squish Tech, LLC.

#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>

#include "xml_xpath_context.h"
#include "xml_element.h"

using namespace v8;

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

Local<Value>
XmlXpathContext::evaluate(const xmlChar* xpath) {
  Nan::EscapableHandleScope scope;
  xmlXPathObject* xpathobj = xmlXPathEval(xpath, ctxt);
  Local<Value> res;

  if (xpathobj) {
    switch (xpathobj->type) {
    case XPATH_NODESET: {
      if (xmlXPathNodeSetIsEmpty(xpathobj->nodesetval)) {
        res = Nan::New<Array>(0);
        break;
      }

      Local<Array> nodes = Nan::New<Array>(xpathobj->nodesetval->nodeNr);
      for (int i = 0; i != xpathobj->nodesetval->nodeNr; ++i) {
        Nan::Set(nodes, i, XmlNode::New(xpathobj->nodesetval->nodeTab[i]));
      }

      res = nodes;
      break;
    }

    case XPATH_BOOLEAN:
      res = Nan::New<Boolean>(xpathobj->boolval);
      break;

    case XPATH_NUMBER:
      res = Nan::New<Number>(xpathobj->floatval);
      break;

    case XPATH_STRING:
      res = Nan::New<String>((const char *)xpathobj->stringval,
                            xmlStrlen(xpathobj->stringval)).ToLocalChecked();
      break;

    default:
      res = Nan::Null();
      break;
    }
  }

  xmlXPathFreeObject(xpathobj);
  return scope.Escape(res);
}

}  // namespace libxmljs
