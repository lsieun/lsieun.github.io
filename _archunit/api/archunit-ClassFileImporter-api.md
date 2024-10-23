---
title: "ClassFileImporter"
sequence: "101"
---

```text
                                         ┌─── withImportOption()
                     ┌─── option ────────┤
                     │                   └─── withImportOptions()
                     │
                     │                                     ┌─── importClass()
                     │                   ┌─── class ───────┤
                     │                   │                 └─── importClasses()
                     │                   │
ClassFileImporter ───┤                   │                 ┌─── importPackages()
                     │                   ├─── package ─────┤
                     │                   │                 └─── importPackagesOf()
                     │                   │
                     │                   ├─── classpath ───┼─── importClasspath()
                     │                   │
                     │                   │                 ┌─── importJar()
                     └─── JavaClasses ───┼─── jar ─────────┤
                                         │                 └─── importJars()
                                         │
                                         │                 ┌─── importPath()
                                         ├─── path ────────┤
                                         │                 └─── importPaths()
                                         │
                                         │                 ┌─── importUrl()
                                         ├─── url ─────────┤
                                         │                 └─── importUrls()
                                         │
                                         └─── location ────┼─── importLocations()
```
