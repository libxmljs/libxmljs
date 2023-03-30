const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync(__dirname + "/../vendor/libxml2")) {
    execSync("npm run init-submodules", { stdio: "inherit" });
}

if (!fs.existsSync(__dirname + "/../src/libxml2.cc")) {
    execSync("npm run swig", { stdio: "inherit" });
}
