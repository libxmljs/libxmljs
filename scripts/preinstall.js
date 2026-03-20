const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const packageRoot = __dirname + "/../";

// Pinned libxml2 submodule commit and repo URL
const LIBXML2_REPO = "https://github.com/GNOME/libxml2.git";
const LIBXML2_COMMIT = "22f1521122402bee88b58a463af58b5ab865dc3f";
const vendorDir = path.join(packageRoot, "vendor", "libxml2");

// Check if libxml2 headers are missing (indicates submodules not initialized)
const libxml2HeadersMissing = !fs.existsSync(path.join(vendorDir, "include", "libxml", "parserInternals.h")) ||
    !fs.existsSync(path.join(vendorDir, "globals.c"));

if (libxml2HeadersMissing) {
    if (fs.existsSync(path.join(packageRoot, ".git"))) {
        // Cloned repo: use git submodule update
        console.log("Initializing submodules");
        execSync("npm run init-submodules", { stdio: "inherit", cwd: packageRoot });
    } else {
        // Tarball install (e.g. yarn add github:...): clone libxml2 directly
        console.log("Cloning libxml2 source (no .git directory, cannot use submodules)");
        if (fs.existsSync(vendorDir)) {
            fs.rmSync(vendorDir, { recursive: true, force: true });
        }
        execSync(
            `git clone --depth 1 ${LIBXML2_REPO} ${vendorDir}`,
            { stdio: "inherit", cwd: packageRoot }
        );
        execSync(
            `git fetch --depth 1 origin ${LIBXML2_COMMIT} && git checkout ${LIBXML2_COMMIT}`,
            { stdio: "inherit", cwd: vendorDir }
        );
    }
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
