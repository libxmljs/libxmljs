var fs = require("fs");
var path = __dirname + "/../src/libxml2.cc";
var source = fs.readFileSync(path).toString();

fs.writeFileSync(
    path,
    source
        .replace(
            "v8::Persistent<v8::Object> handle;",
            `v8::Persistent<v8::Object> handle; int refCount; xmlNode* ancestor; xmlDoc* doc;
            
            void Ref();
            void Unref();`
        )
        .replace(
            "swigCMemOwn(false), swigCObject(0), info(0)",
            "swigCMemOwn(false), swigCObject(0), info(0), refCount(0), ancestor(NULL), doc(NULL)"
        )
);
