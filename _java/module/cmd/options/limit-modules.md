---
title: "--limit-modules"
sequence: "104"
---

## Limiting the observable modules

It is sometimes useful to limit the **observable modules** for,
e.g., debugging, or to reduce the number of modules resolved
when the **main module** is the **unnamed module** defined by the application class loader for the **class path**.
The `--limit-modules` option can be used, in any phase, to do this.

Its syntax is:

```text
--limit-modules <module>(,<module>)*
```

where `<module>` is a module name.
The effect of this option is to limit the **observable modules** to
those in the **transitive closure** of the **named modules** plus the **main module**,
if any, plus any further modules specified via the `--add-modules` option.

(The **transitive closure** computed for the interpretation of the `--limit-modules` option is a temporary result,
used only to compute the limited set of observable modules.
The resolver will be invoked again in order to compute the actual module graph.)

