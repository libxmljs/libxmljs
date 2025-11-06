var fs = require("fs");

var path = __dirname + "/../src/libxml2.cc";
var source = fs.readFileSync(path).toString();

fs.writeFileSync(
    path,
    source
        .replaceAll(
            "args\.Holder()",
            "args\.This()"
        )
);
