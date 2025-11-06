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

if (parseInt(process.versions.node.split('.')[0]) >= 24) {
    // https://github.com/nodejs/nan/pull/979
    // TODO: check if fixed in future swig versions
    require("./swigfix_node24");
}
