---
title: "MapStruct"
sequence: "101"
---

MapStruct is a Java annotation processor based on [JSR 269][jsr-269] and
as such can be used within command line builds (javac, Ant, Maven etc.)
as well as from within your IDE.

It comprises the following artifacts:

- `org.mapstruct:mapstruct`: contains **the required annotations** such as `@Mapping`
- `org.mapstruct:mapstruct-processor`: contains the **annotation processor** which generates mapper implementations
- `org.mapstruct:mapstruct-jdk8`: Deprecated MapStruct artifact containing **annotations** to be used with JDK 8 and later - Relocated to mapstruct


[jsr-269]: https://www.jcp.org/en/jsr/detail?id=269
