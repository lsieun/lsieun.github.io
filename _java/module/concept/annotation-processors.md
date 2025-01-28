---
title: "Annotation processors"
sequence: "105"
---

If you're using annotation processors,
you've been placing them on the **class path** together with the application's artifact.

Java 9 suggests to separate by concerns and use `--class-path` or `--module-path` for application JARs and
`--processor-path` or `--processor-module-path` for processor JARs.
For unmodularized JARs, the distinction between the application and processor paths is optional:
placing everything on the class path is valid,
but for modules it's binding; processors on the module path won't be used.
