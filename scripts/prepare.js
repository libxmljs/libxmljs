const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const packageRoot = path.join(__dirname, "..");

// Only compile TypeScript if dist/ doesn't exist yet.
// This handles git URL installs where dist/ is gitignored.
// When installed from npm, dist/ is already included in the package.
if (!fs.existsSync(path.join(packageRoot, "dist", "index.js"))) {
    const tscPath = path.join(packageRoot, "node_modules", "typescript", "lib", "tsc.js");
    if (fs.existsSync(tscPath)) {
        console.log("Compiling TypeScript (dist/ not found)");
        execSync("npm run tsc", { stdio: "inherit", cwd: packageRoot });
    } else {
        console.warn("Warning: dist/ not found and typescript is not installed. Run 'npm run tsc' manually.");
    }
}
