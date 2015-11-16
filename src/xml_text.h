#ifndef SRC_XML_TEXT_H_
#define SRC_XML_TEXT_H_

#include "libxmljs.h"
#include "xml_non_attribute_node.h"
#include "xml_node.h"

namespace libxmljs {

class XmlText : public XmlNonAttributeNode {
public:

    explicit XmlText(xmlNode* node);

    static void Initialize(v8::Handle<v8::Object> target);

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml element to wrap the node
    static v8::Local<v8::Object> New(xmlNode* node);

protected:

    static NAN_METHOD(New);

};

}  // namespace libxmljs

#endif  // SRC_XML_TEXT_H_
