---
title: "The Four Stages of Compiling a C Program"
sequence: "105"
---

Compiling a C program is a multi-stage process.
At an overview level, the process can be split into four separate stages:
**Preprocessing**, **compilation**, **assembly**, and **linking**.

```text
// File: hello_world.h

// first method
int add(int a, int b);
// second method
int sub(int a, int b);
// third method
int mul(int a, int b);
// fourth method
int div(int a, int b);
```

```text
// File: hello_world.c

#include"hello_world.h"

int main(void)
{
    int a = 12;
    int b = 4;
    int sum = add(a, b);
    int diff = sub(a, b);
    return 0;
}

int add(int a, int b)
{
    return a + b;
}

int sub(int a, int b)
{
    return a - b;
}

int mul(int a, int b)
{
    return a * b;
}

int div(int a, int b)
{
    return a / b;
}
```

```text
#include <stdio.h>

// This is a comment.

#define STRING "This is a test"
#define COUNT (5)

int main()
{
    int i;

    for (i = 0; i < COUNT; i++)
    {
        puts(STRING);
    }

    return 1;
}
```

## Preprocessing

The first stage of compilation is called **preprocessing**.

The C Preprocessor is responsible for 3 tasks: **text substitution**, **stripping comments**, and **file inclusion**.
**Text substitution** and **file inclusion** is requested in our source code using **preprocessor directives**.
The lines in our code that begin with the "#" character are preprocessor directives.
The first one requests that a standard header, `stdio.h`, be included into our source file.
The other two request a string substitution to take place in our code.
By using gcc's "-E" flag, we can see the results of only running the C preprocessor on our code.

In this stage, lines starting with a `#` character are interpreted by the preprocessor as preprocessor commands.
These commands form a simple macro language with its own syntax and semantics.
This language is used to reduce repetition in source code
by providing functionality to inline files, define macros, and to conditionally omit code.

Before interpreting commands, the preprocessor does some initial processing.
This includes **joining continued lines** (lines ending with a `\`) and stripping comments.

To print the result of the preprocessing stage, pass the `-E` option to `gcc`:

```text
gcc -E hello_world.c
```

Output:

```text
# 1 "hello_world.c"
# 1 "<built-in>"
# 1 "<command-line>"
# 31 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 32 "<command-line>" 2
# 1 "hello_world.c"
# 1 "hello_world.h" 1
int add(int a, int b);
int sub(int a, int b);
int mul(int a, int b);
int div(int a, int b);
# 2 "hello_world.c" 2

int main(void)
{
    int a = 12;
    int b = 4;
    int sum = add(a, b);
    int diff = sub(a, b);
    return 0;
}

int add(int a, int b)
{
    return a + b;
}

int sub(int a, int b)
{
    return a - b;
}

int mul(int a, int b)
{
    return a * b;
}

int div(int a, int b)
{
    return a / b;
}
```

## Compilation

The second stage of compilation is confusingly enough called **compilation**.
In this stage, the preprocessed code is translated to assembly instructions specific to the target processor architecture.
These form an intermediate human readable language.

To save the result of the compilation stage, pass the `-S` option to `gcc`:

```text
gcc -S hello_world.c
```

This will create a file named `hello_world.s`, containing the generated assembly instructions.

## Assembly

During this stage, an assembler is used to translate the assembly instructions to object code.
The output consists of actual instructions to be run by the target processor.

To save the result of the assembly stage, pass the `-c` option to `gcc`:

```text
gcc -c hello_world.c
```

Running the above command will create a file named `hello_world.o`, containing the object code of the program.
The contents of this file is in a binary format and can be inspected using `hexdump` by running the following commands:

```text
hexdump -C hello_world.o
```

## Linking

The object code generated in the assembly stage is composed of machine instructions
that the processor understands but some pieces of the program are out of order or missing.
To produce an executable program,
the existing pieces have to be rearranged and the missing ones filled in.
This process is called **linking**.

The linker will arrange the pieces of object code
so that functions in some pieces can successfully call functions in other ones.
It will also add pieces containing the instructions for library functions used by the program.

The result of this stage is the final executable program.
When run without options, `gcc` will name this file `a.out`.

The name `a.out` has some history behind it.
Back in the days of the PDP computer, `a.out` stood for "**assembler output**."

To name the file something else, pass the `-o` option to `gcc`:

```text
gcc -o <desired_output_filename> <source filename>
```

```text
gcc -o hello_world hello_world.c
```

## Reference

- [The Four Stages of Compiling a C Program](https://www.calleluks.com/the-four-stages-of-compiling-a-c-program/)
- [Examining the Compilation Process. Part 1.](https://www.linuxjournal.com/content/examining-compilation-process-part-1)
- [Examining the compilation process. part 2.](https://www.linuxjournal.com/content/examining-compilation-process-part-2)
- [Examining the compilation process. part 3.](https://www.linuxjournal.com/content/examining-compilation-process-part-3)
