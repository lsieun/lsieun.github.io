---
title: "#include"
sequence: "103"
---

There are 4 main types of preprocessor directives:

- Macros
- File Inclusion
- Conditional Compilation
- Other directives

**File Inclusion**: This type of preprocessor directive tells the compiler to include a file in the source code program.

There are **two types of files** which can be included by the user in the program:

- Header File or Standard Files
- User Defined Files

## Header File or Standard files

These files contains definition of pre-defined functions like `printf()`, `scanf()` etc.
These files must be included for working with these functions.
Different function are declared in different header files.

For example standard I/O functions are in `iostream` file
whereas functions which perform string operations are in `string` file.

```text
#include<file_name>
```

where `file_name` is the name of file to be included.
The `<` and `>` brackets tells the compiler to look for the file in standard directory.

## User Defined Files

When a program becomes very large, it is good practice to divide it into smaller files and include whenever needed.
These types of files are user defined files.

These files can be included as:

```text
#include "filename"
```

