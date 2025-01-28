---
title: "Static Libraries"
sequence: "103"
---

Static libraries are simply a collection of ordinary object files;
conventionally, static libraries end with the `.a` suffix.
This collection is created using the `ar` (archiver) program.
Static libraries aren't used as often as they once were,
because of the advantages of shared libraries.
Still, they're sometimes created, they existed first historically, and they're simpler to explain.

Static libraries permit users to link to programs without having to recompile its code, saving recompilation time.
Note that recompilation time is less important given today's faster compilers,
so this reason is not as strong as it once was.
Static libraries are often useful for developers if they wish to permit programmers to link to their library,
but don't want to give the library source code
(which is an advantage to the library vendor, but obviously not an advantage to the programmer trying to use the library).
In theory, code in static ELF libraries that is linked into an executable should run slightly faster (by 1-5%)
than a shared library or a dynamically loaded library,
but in practice this rarely seems to be the case due to other confounding factors.

To create a static library, or to add additional object files to an existing static library, use a command like this:

```text
ar rcs my_library.a file1.o file2.o
```

This sample command adds the object files `file1.o` and `file2.o` to the static library `my_library.a`,
creating `my_library.a` if it doesn't already exist.

Once you've created a static library, you'll want to use it.
You can use a static library by invoking it as part of the compilation and linking process
when creating a program executable.
If you're using `gcc` to generate your executable, you can use the `-l` option to specify the library.

Be careful about the order of the parameters when using `gcc`;
the `-l` option is a linker option, and thus needs to be placed AFTER the name of the file to be compiled.
This is quite different from the normal option syntax.
If you place the `-l` option before the filename,
it may fail to link at all, and you can end up with mysterious errors.

You can also use the linker `ld` directly, using its `-l` and `-L` options;
however, in most cases it's better to use `gcc` since the interface of `ld` is more likely to change.

