---
title: "Configuration locations"
sequence: "101"
---

The configuration will be loaded from multiple locations.

Properties are considered in the following order:

- Environment variables
- `.testcontainers.properties` in user's home folder. Example locations:
    - Linux: `/home/myuser/.testcontainers.properties`
    - Windows: `C:/Users/myuser/.testcontainers.properties`
    - macOS: `/Users/myuser/.testcontainers.properties`
- `testcontainers.properties` on the classpath.

## environment variables

Note that when using **environment variables**,
configuration property names should be set in **upper case with underscore separators**,
preceded by `TESTCONTAINERS_` - e.g. `checks.disable` becomes `TESTCONTAINERS_CHECKS_DISABLE`.

## classpath

The classpath `testcontainers.properties` file may exist

- within the **local codebase** (e.g. within the `src/test/resources` directory) or
- within **library dependencies** that you may have.

Any such configuration files will have their contents merged.
If any keys conflict, the value will be taken on the basis of the first value found in:

- **'local' classpath** (i.e. where the URL of the file on the classpath begins with `file:`), then
- **other classpath locations** (i.e. JAR files) - considered in alphabetical order of path to provide deterministic ordering.
