#ifndef SRC_XML_COMMENT_H_
#define SRC_XML_COMMENT_H_

#include "libxmljs.h"
#include "xml_node.h"

namespace libxmljs {

class XmlComment : public XmlNode {
public:

    explicit XmlComment(xmlNode* node);

    static void Initialize(v8::Handle<v8::Object> target);

    static v8::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml comment to wrap the node
    static v8::Handle<v8::Object> New(xmlNode* node);

protected:

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> Text(const v8::Arguments& args);
    
    void set_content(const char* content);
    v8::Handle<v8::Value> get_content();
};

}  // namespace libxmljs

#endif  // SRC_XML_COMMENT_H_
