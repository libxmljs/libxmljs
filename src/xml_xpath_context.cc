// Copyright 2009, Squish Tech, LLC.
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

v8::Handle<v8::Array>
XmlXpathContext::evaluate(const xmlChar* xpath) {
  v8::HandleScope scope;
  xmlXPathObject* result = xmlXPathEval(xpath, ctxt);

  if (!result) {
      return scope.Close(v8::Array::New(0));
  }

  if (result->type != XPATH_NODESET || !result->nodesetval) {
    xmlXPathFreeObject(result);

    return scope.Close(v8::Array::New(0));
  }

  v8::Handle<v8::Array> nodes = v8::Array::New(result->nodesetval->nodeNr);
  for (int i = 0; i != result->nodesetval->nodeNr; ++i) {
    xmlNode *node = result->nodesetval->nodeTab[i];
    nodes->Set(i,LibXmlObj::GetMaybeBuild<XmlElement, xmlNode>(node));
  }

  xmlXPathFreeObject(result);

  return scope.Close(nodes);
}

}  // namespace libxmljs
