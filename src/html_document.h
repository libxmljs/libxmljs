// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_HTML_DOCUMENT_H_
#define SRC_HTML_DOCUMENT_H_

#include "libxmljs.h"
#include "xml_document.h"

namespace libxmljs {

class HtmlDocument : public XmlDocument {
  public:

  explicit HtmlDocument(xmlDoc* doc) : XmlDocument(doc) {}
  static void Initialize(v8::Handle<v8::Object> target);
};

}  // namespace libxmljs

#endif  // SRC_HTML_DOCUMENT_H_
