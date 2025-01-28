---
title: "Conditional Compilation: #ifdef, #endif"
sequence: "104"
---

There are 4 main types of preprocessor directives:

- Macros
- File Inclusion
- Conditional Compilation
- Other directives

Conditional Compilation directives are type of directives
which helps to compile a specific portion of the program or to skip compilation of some specific part of the program based on some conditions.

## ifdef and endif

This can be done with the help of two preprocessing commands `ifdef` and `endif`. 

```c++
#ifdef macro_name
    statement1;
    statement2;
    statement3;
    .
    .
    .
    statementN;
#endif
```

If the macro with name as `macroname` is defined, then the block of statements will execute normally;
but if it is not defined, the compiler will simply skip this block of statements. 

## undef



