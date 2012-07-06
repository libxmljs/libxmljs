// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_XML_XPATH_CONTEXT_H_
#define SRC_XML_XPATH_CONTEXT_H_

#include <libxml/xpath.h>

#include "libxmljs.h"

namespace libxmljs {

class XmlXpathContext {
  public:

  explicit XmlXpathContext(xmlNode* node);
  ~XmlXpathContext();

  void register_ns(const xmlChar* prefix, const xmlChar* uri);
  v8::Handle<v8::Value> evaluate(const xmlChar* xpath);

  xmlXPathContext *ctxt;
};
}  // namespace libxmljs

#endif  // SRC_XML_XPATH_CONTEXT_H_
