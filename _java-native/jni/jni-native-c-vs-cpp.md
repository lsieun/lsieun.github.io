---
title: "JNI C VS. C++"
sequence: "104"
---



## Difference between GCC and G++

`GCC` stands for **GNU Compiler Collections** which is used to compile mainly C and C++ language.

The `g++` command is a GNU c++ compiler invocation command,
which is used for preprocessing, compilation, assembly and linking of source code to generate an executable file.

```text
gcc: GNU C      Compiler
g++: GNU C++ Compiler
```

The main differences:

- `gcc` will compile: `*.c`/`*.cpp` files as C and C++ respectively.
- `g++` will compile: `*.c`/`*.cpp` files but they will all be treated as C++ files.
- Also if you use `g++` to link the object files it automatically links in the std C++ libraries (`gcc` does not do this).
- `gcc` compiling C files has fewer predefined macros.
- `gcc` compiling `*.cpp` and `g++` compiling `*.c`/`*.cpp` files has a few extra macros.

- Extra Macros when compiling *.cpp files:

```text
#define __GXX_WEAK__ 1
#define __cplusplus 1
#define __DEPRECATED 1
#define __GNUG__ 4
#define __EXCEPTIONS 1
#define __private_extern__ extern
```


