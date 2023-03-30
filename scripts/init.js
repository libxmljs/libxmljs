const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync(__dirname + "/../vendor/libxml2")) {
    console.log("Initializing submodules");
    execSync("npm run init-submodules", { stdio: "inherit" });
}

if (!fs.existsSync(__dirname + "/../src/libxml2.cc")) {
    console.log("Running SWIG");
    execSync("npm run swig", { stdio: "inherit" });
}
