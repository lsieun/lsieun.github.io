---
title: "MinGW-w64"
sequence: "102"
---

Downloads

```text
https://www.mingw-w64.org/downloads/
```

## w64devkit

[w64devkit](https://github.com/skeeto/w64devkit)
is a portable C and C++ development kit for x64 (and x86) Windows.

## WinLibs

Standalone MinGW-w64+GCC builds for Windows,
built from scratch (including all dependencies) natively on Windows for Windows.

Downloads are archive files (`.zip` or `.7z`).
No installation is required, just extract the archive and start using the programs in `mingw32\bin` or `mingw64\bin`.
This allows for a relocatable compiler suite and allows having multiple versions on the same system.

Also contains other tools including:

- GDB - the GNU Project debugger
- GNU Binutils - a collection of binary tools
- GNU Make - a tool which controls the generation of executables and other non-source files
- Yasm - The Yasm Modular Assembler Project
- NASM - The Netwide Assembler
- JWasm - A free MASM-compatible assembler

Flavors:

- separate packages for 32-bit (i686) and 64-bit (x86_64) Windows
- separate packages for MSVCRT and UCRT builds
- only POSIX threads builds (which also include Win32 API thread functions)
- exception model: Dwarf for 32-bit (i686) and SEH for 64-bit (x86_64)

Installation: Download from [winlibs.com](https://winlibs.com/) and extract archive (no installation needed).

[WinLibs standalone build of GCC and MinGW-w64 for Windows](https://winlibs.com/)

