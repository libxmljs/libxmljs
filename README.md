# @jhulford/libxmljs

[![npm version](https://badge.fury.io/js/%40jhulford%2Flibxmljs.svg)](https://badge.fury.io/js/@jhulford/libxmljs)
[![Downloads monthly](https://img.shields.io/npm/dm/%40jhulford%2Flibxmljs.svg)](https://npmjs.org/package/@jhulford/libxmljs)
[![Downloads total](https://img.shields.io/npm/dt/%40jhulford%2Flibxmljs.svg)](https://npmjs.org/package/@jhulford/libxmljs)
[![Test & Upload](https://github.com/jhulford/libxmljs/actions/workflows/test-deploy.yml/badge.svg)](https://github.com/jhulford/libxmljs/actions/workflows/test-deploy.yml)

`npm install @jhulford/libxmljs`

NodeJS bindings for [libxml2](https://en.wikipedia.org/wiki/Libxml2) written in
Typescript.

This is a fork of [libxmljs/libxmljs](https://github.com/libxmljs/libxmljs) with support for **Node.js 22 and 24**, prebuilt binaries for **linux-x64** and **linux-arm64**, and modernized dev tooling.

## Documentation

[https://libxmljs.github.io/libxmljs/](https://libxmljs.github.io/libxmljs/)

## Examples

For more examples, check out the [test suite](https://github.com/jhulford/libxmljs/tree/master/test).

```javascript
import libxmljs from "libxmljs";

libxmljs
    .parseXmlAsync(
        `
        <?xml version="1.0" encoding="UTF-8"?>
        <root>
            <child foo="bar">
            <grandchild baz="fizbuzz">grandchild content</grandchild>
            </child>
            <sibling>with content!</sibling>
        </root>
        `
    )
    .then((xmlDoc) => {
        const gchild = xmlDoc.find("//grandchild")[0];

        console.log(gchild.text()); // prints "grandchild content"

        const child = xmlDoc.root()?.child(0);

        console.log(child?.getAttribute("foo")?.value()); // prints "bar"
    });
```

## Package Scripts

`npm run init-submodules`

> Clones libxml2 source code to `vendor/libxml2`

`npm run configure`

> Generate new cmake config headers with cmake in vendor/libxml2.config. Used when updating to a new libxml2 version.

`npm run build`

> Build the C++ source code using node-gyp

`npm run swig`

> Generate a new `src/libxml2.cc` and `swig.xml` file by processing the native code using SWIG. Used when making changes
> to native code or any of the SWIG interface files (src/\*.i)

`npm run tsgenerate`

> Generates typescript definitons for native bindings exports. Used when changes are made to native exports.
> Auto-generates `constants.ts`, `functions.ts`, `types.ts`, and `variables.ts` within `lib/bindings/`

`npm run tsc`

> Compiles Typescript within `lib/` and outputs it to `dist/` Use `npm run dev` to put Typescript compiler into watch
> mode.

`npm run lint`

> Runs eslint against `lib/`, `test/`, and `index.ts`.

`npm run test`

> Runs all tests in `test/` using Node's built-in test runner (`node:test`) via `tsx`. Use `npm run test -- --test-name-pattern="TEST_NAME"` to run a specific test.

`npm run docs`

> Generates `docs/` using Typedoc

## Publishing

This project uses automated GitHub Actions workflows for publishing. All publishing is done via Git tags.

### Prerequisites

1. **Initial Package Setup** (one-time):
   - Manually publish first version (e.g., `0.0.1-beta.1`) to establish package
   - After package exists, configure OIDC for automated publishing

2. **OIDC Setup** (for automated publishing):
   - Go to npm → Account Settings → Access Tokens → GitHub Actions
   - Add your GitHub repository and enable OIDC
   - More secure than static tokens, no secrets needed

3. **Branch protection**: Ensure your main branch is properly protected

### Publishing Process (Protected Main Branch)

Since the main branch is protected, all releases go through release branches and pull requests.

#### Patch Release (Bug Fixes)

```bash
# 1. Create release branch
git checkout -b release/v1.0.13

# 2. Bump patch version
npm version patch

# 3. Push release branch and create PR
git push origin release/v1.0.13
# Create PR: release/v1.0.13 → main
# Get PR approved and merged

# 4. Tag the merged commit on main
git checkout main
git pull origin main
git tag v1.0.13
git push origin v1.0.13
```

#### Minor Release (New Features)

```bash
# 1. Create release branch
git checkout -b release/v1.1.0

# 2. Bump minor version
npm version minor

# 3. Push release branch and create PR
git push origin release/v1.1.0
# Create PR: release/v1.1.0 → main
# Get PR approved and merged

# 4. Tag the merged commit on main
git checkout main
git pull origin main
git tag v1.1.0
git push origin v1.1.0
```

#### Major Release (Breaking Changes)

```bash
# 1. Create release branch
git checkout -b release/v2.0.0

# 2. Bump major version
npm version major

# 3. Push release branch and create PR
git push origin release/v2.0.0
# Create PR: release/v2.0.0 → main
# Get PR approved and merged

# 4. Tag the merged commit on main
git checkout main
git pull origin main
git tag v2.0.0
git push origin v2.0.0
```

#### Pre-release (Beta/Alpha)

```bash
# 1. Create pre-release branch
git checkout -b prerelease/v1.1.0-beta.1

# 2. Bump version with pre-release identifier
npm version 1.1.0-beta.1  # or 1.1.0-alpha.1, 1.1.0-rc.1, etc.

# 3. Push pre-release branch and create PR
git push origin prerelease/v1.1.0-beta.1
# Create PR: prerelease/v1.1.0-beta.1 → main
# Get PR approved and merged

# 4. Tag the merged commit on main
git checkout main
git pull origin main
git tag v1.1.0-beta.1
git push origin v1.1.0-beta.1
```

#### Installing Pre-release Versions

```bash
# Install latest pre-release
npm install @jhulford/libxmljs@beta

# Install specific pre-release version
npm install @jhulford/libxmljs@1.1.0-beta.1

# Install latest alpha
npm install @jhulford/libxmljs@alpha

# Install latest release candidate
npm install @jhulford/libxmljs@rc
```

#### Quick Reference

| Release Type | Command | Example Tag |
|---|---|---|
| Patch | `npm version patch` | `v1.0.13` |
| Minor | `npm version minor` | `v1.1.0` |
| Major | `npm version major` | `v2.0.0` |
| Beta | `npm version 1.1.0-beta.1` | `v1.1.0-beta.1` |
| Alpha | `npm version 1.1.0-alpha.1` | `v1.1.0-alpha.1` |
| RC | `npm version 1.1.0-rc.1` | `v1.1.0-rc.1` |

### What Gets Published

- **Prebuilt binaries**: `{Node 22, 24} × {linux-x64, linux-arm64, macos-arm64}`
- **npm package**: Includes compiled TypeScript and native bindings
- **Documentation**: Deployed to GitHub Pages
- **GitHub release**: Contains all prebuilt binary tarballs

### Manual Testing Before Release

```bash
# Test the build locally
npm run build
npm run tsc
npm run test

# Test from git URL in another project
yarn add github:jhulford/libxmljs#aws-arm-x86-builds

# Or test the published package
npm install @jhulford/libxmljs@alpha
```
