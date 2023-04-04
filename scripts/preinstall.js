const fs = require("fs");
const { execSync } = require("child_process");
const packageRoot = __dirname + "/../";

if (
    fs.existsSync(packageRoot + ".git") &&
    (!fs.existsSync(packageRoot + "vendor/libxml2/include/libxml/parserInternals.h") ||
        !fs.existsSync(packageRoot + "vendor/libxml2/globals.c"))
) {
    console.log("Initializing submodules");
    execSync("npm run init-submodules", { stdio: "inherit", cwd: packageRoot });
}

if (!fs.existsSync(__dirname + "/../src/libxml2.cc")) {
    console.log("Running SWIG");
    execSync("npm run swig", { stdio: "inherit", cwd: packageRoot });
}
