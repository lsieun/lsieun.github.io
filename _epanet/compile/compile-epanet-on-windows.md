---
title: "Compile EPANET on Windows"
sequence: "202"
---

## 已经编译好的版本

- [OWA:EPANET 2.2](https://github.com/OpenWaterAnalytics/EPANET/releases/tag/v2.2)

![](/assets/images/epanet/compile/epanet-2-2-win32-64-github.png)

## CMake

- [CMake Download](https://cmake.org/download/)

The CMake build process is the same across operating systems and compilers:

- **configure**: This is normally run only once unless making major project changes.
- **build**: This is the command run each time you make a change to the project code.
- **install** (optional): Put the binary artifacts into a convenient directory like `/bin` or `/lib`

```text
cmake -S myproj -B myproj/build

cmake --build myproj/build

cmake --install myproj/build
```

- [Using CMake on Windows](https://www.scivision.dev/cmake-install-windows/)

On Windows, CMake defaults to **Visual Studio** and **Nmake**.
This is usually not a useful default.
We use the [Ninja build system with CMake](https://www.scivision.dev/cmake-generator-ninja),
which is generally faster on any operating system.
Ninja on Windows solves numerous issues vs. GNU Make.
Ninja works with Visual Studio as well.

Override the default CMake generator by setting environment variable:

```text
CMAKE_GENERATOR=Ninja
```

`CMAKE_GENERATOR` can be overridden (e.g. to use GNU Make from MSYS2) like:

```text
cmake -G "MinGW Makefiles"
```

- [ninja-build/ninja releases](https://github.com/ninja-build/ninja/releases)

Specifies the CMake **default generator** to use when no generator is supplied with `-G`.
If the provided value doesn't name a generator known by CMake,
the internal default is used.
Either way the resulting generator selection is stored in the `CMAKE_GENERATOR` variable.

```text
cmake -G "Ninja"
```

```text
cmake -G "MinGW Makefiles" ..
cmake --build . --config Release
```

cmake -G "MinGW Makefiles" .. -A x64
