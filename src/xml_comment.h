#ifndef SRC_XML_COMMENT_H_
#define SRC_XML_COMMENT_H_

#include "libxmljs.h"
#include "xml_node.h"

namespace libxmljs {

class XmlComment : public XmlNode {
public:

    explicit XmlComment(xmlNode* node);

    static void Initialize(v8::Handle<v8::Object> target);

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml comment to wrap the node
    static v8::Local<v8::Object> New(xmlNode* node);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Text);

    void set_content(const char* content);
    v8::Local<v8::Value> get_content();
};

}  // namespace libxmljs

#endif  // SRC_XML_COMMENT_H_
