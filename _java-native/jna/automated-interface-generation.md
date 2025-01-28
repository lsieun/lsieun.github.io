---
title: "Automated Interface Generation"
sequence: "106"
---

If the C header files for your library are available,
you can auto-generate a library mapping by using Olivier Chafik's excellent 
[JNAerator](https://github.com/nativelibs4java/JNAerator) utility.
This is especially useful if your library uses long or complicated structures
where translating by hand can be error-prone.

## What is JNAerator?

**JNAerator** (pronounce 'generator') is a tool that parses C / C++ & Objective-C sources (headers) and
generates the corresponding BridJ, JNA and Rococoa Java interfaces.

This makes it easy to call large native libraries from Java.



## Reference

- [JNAerator](https://github.com/nativelibs4java/JNAerator): Pronounced "generator",
  auto-generates JNA mappings from C headers, by Olivier Chafik.
- [jnaerator - JNAeratorFAQ.wiki](https://code.google.com/archive/p/jnaerator/wikis/JNAeratorFAQ.wiki)

