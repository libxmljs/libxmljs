const package = require(__dirname + "/../package.json");
const fs = require("fs");
const { execSync } = require("child_process");

if (
    !fs.existsSync(__dirname + "/../vendor/libxml2/include/libxml/parserInternals.h") ||
    !fs.existsSync(__dirname + "/../vendor/libxml2/globals.c")
) {
    console.log("Initializing submodules");
    execSync(package.scripts["init-submodules"], { stdio: "inherit" });
}

if (!fs.existsSync(__dirname + "/../src/libxml2.cc")) {
    console.log("Running SWIG");
    execSync(package.scripts.swig, { stdio: "inherit" });
}
