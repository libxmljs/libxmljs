#ifndef SRC_XML_TEXT_H_
#define SRC_XML_TEXT_H_

#include "libxmljs.h"
#include "xml_node.h"

namespace libxmljs {

class XmlText : public XmlNode {
public:

    explicit XmlText(xmlNode* node);

    static void Initialize(v8::Handle<v8::Object> target);

    static Nan::Persistent<v8::FunctionTemplate> constructor_template;

    // create new xml element to wrap the node
    static v8::Local<v8::Object> New(xmlNode* node);

protected:

    static NAN_METHOD(New);
    static NAN_METHOD(Text);
    static NAN_METHOD(Replace);

    static NAN_METHOD(NextElement);
    static NAN_METHOD(PrevElement);
    static NAN_METHOD(AddPrevSibling);
    static NAN_METHOD(AddNextSibling);


    v8::Local<v8::Value> get_next_element();
    v8::Local<v8::Value> get_prev_element();
    v8::Local<v8::Value> get_content();
    void set_content(const char* content);
    void replace_text(const char* content);
    void replace_element(xmlNode* element);
    xmlNode *import_element(XmlText* element);
    void add_prev_sibling(xmlNode* element);
    void add_next_sibling(xmlNode* element);
};

}  // namespace libxmljs

#endif  // SRC_XML_TEXT_H_
