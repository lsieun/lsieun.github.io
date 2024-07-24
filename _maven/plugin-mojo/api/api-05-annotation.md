---
title: "Mojo: Annotation"
sequence: "105"
---

[UP](/maven-index.html)


## @Mojo

```text
                           ┌─── goal ────┼─── name()
         ┌─── basic ───────┤
         │                 └─── phase ───┼─── defaultPhase()
         │
         │                 ┌─── instance ───────┼─── instantiationStrategy()
         │                 │
         │                 │                    ┌─── executionStrategy()
         ├─── run ─────────┼─── execution ──────┤
         │                 │                    └─── threadSafe()
         │                 │
         │                 │                    ┌─── aggregator()
         │                 └─── parent-child ───┤
         │                                      └─── inheritByDefault()
@Mojo ───┤
         │                                    ┌─── requiresProject()
         │                 ┌─── project ──────┤
         │                 │                  └─── requiresDirectInvocation()
         │                 │
         │                 ├─── report ───────┼─── requiresReports()
         ├─── condition ───┤
         │                 │                  ┌─── requiresDependencyResolution()
         │                 ├─── dependency ───┤
         │                 │                  └─── requiresDependencyCollection()
         │                 │
         │                 └─── online ───────┼─── requiresOnline()
         │
         └─── other ───────┼─── configurator()
```

A Maven plugin contains a road-map for Maven that tells Maven about the various Mojos and plugin configuration.
This plugin descriptor is present in the plugin JAR file in `META-INF/maven/plugin.xml`.

```text
plugin descriptor = META-INF/maven/plugin.xml
```

You can see that the `<mojo>` element largely corresponds to the `@Mojo` annotation,
with many of its default attributes explicitly defined.

## @Parameter

```text
                                                      ┌─── name()
                                ┌─── configuration ───┤
                                │                     └─── alias()
              ┌─── value ───────┤
              │                 ├─── property ────────┼─── property()
              │                 │
@Parameter ───┤                 └─── default ─────────┼─── defaultValue()
              │
              │                 ┌─── required()
              └─── auxiliary ───┤
                                └─── readonly()
```
