#ifndef SRC_XML_NON_ATTRIBUTE_NODE_H_
#define SRC_XML_NON_ATTRIBUTE_NODE_H_

#include "libxmljs.h"
#include "xml_node.h"

namespace libxmljs {

class XmlNonAttributeNode : public XmlNode {
public:

    explicit XmlNonAttributeNode(xmlNode* node);

    static void Initialize();

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

protected:

    static NAN_METHOD(Text);
    static NAN_METHOD(Replace);
    static NAN_METHOD(NextElement);
    static NAN_METHOD(PrevElement);
    static NAN_METHOD(AddPrevSibling);
    static NAN_METHOD(AddNextSibling);

    static NAN_METHOD(Path);

    v8::Local<v8::Value> get_next_element();
    v8::Local<v8::Value> get_prev_element();
    v8::Local<v8::Value> get_content();

    void set_content(const char* content);
    void replace_text(const char* content);
    void replace_node(xmlNode* node);
    void add_prev_sibling(xmlNode* node);
    void add_next_sibling(xmlNode* node);
    bool prev_sibling_will_merge(xmlNode* node);
    bool next_sibling_will_merge(xmlNode* node);
    v8::Local<v8::Value> get_path();
};

}  // namespace libxmljs

#endif  // SRC_XML_NON_ATTRIBUTE_NODE_H_

