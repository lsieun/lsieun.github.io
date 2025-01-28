---
title: "Program Library"
sequence: "102"
---

A 'program library' is simply a file containing compiled code (and data)
that is to be incorporated later into a program;
program libraries allow programs to be more modular, faster to recompile, and easier to update.

Program libraries can be divided into three types:

- static libraries,
- shared libraries, and
- dynamically loaded (DL) libraries.

This paper first discusses **static libraries**,
which are installed into a program executable before the program can be run.
It then discusses **shared libraries**,
which are loaded at program start-up and shared between programs.
Finally, it discusses **dynamically loaded (DL) libraries**,
which can be loaded and used at any time while a program is running.
DL libraries aren't really a different kind of library format
(both static and shared libraries can be used as DL libraries);
instead, the difference is in how DL libraries are used by programmers.

Most developers who are developing libraries should create **shared libraries**,
since these allow users to update their libraries separately from the applications that use the libraries.
**Dynamically loaded (DL) libraries** are useful,
but they require a little more work to use and many programs don't need the flexibility they offer.
Conversely, **static libraries** make upgrading libraries far more troublesome,
so for general-purpose use they're hard to recommend.
Still, each have their advantages.


It's worth noting that some people use the term **dynamically linked libraries (DLLs)** to refer to **shared libraries**,
some use the term DLL to mean any library that is used as a DL library,
and some use the term DLL to mean a library meeting either condition.


This paper discusses only the **Executable and Linking Format (ELF) format** for executables and libraries,
the format used by nearly all Linux distributions today.
The GNU gcc toolset can actually handle library formats other than ELF;
in particular, most Linux distributions can still use the obsolete `a.out` format.
However, these formats are outside the scope of this paper.

If you're building an application that should port to many systems,
you might consider using GNU libtool to build and install libraries instead of using the Linux tools directly.
GNU libtool is a generic library support script that hides the complexity of using shared libraries
(e.g., creating and installing them) behind a consistent, portable interface.
On Linux, GNU libtool is built on top of the tools and conventions described in this HOWTO.
For a portable interface to dynamically loaded libraries, you can use various portability wrappers.
GNU libtool includes such a wrapper, called `libltdl`.
Alternatively, you could use the `glib` library (not to be confused with `glibc`)
with its portable support for Dynamic Loading of Modules.
You can learn more about glib at http://developer.gnome.org/doc/API/glib/glib-dynamic-loading-of-modules.html.
Again, on Linux this functionality is implemented using the constructs described in this HOWTO.
If you're actually developing or debugging the code on Linux, you'll probably still want the information in this HOWTO.

This HOWTO's master location is http://www.dwheeler.com/program-library, and it has been contributed to the Linux Documentation Project (http://www.linuxdoc.org). It is Copyright (C) 2000 David A. Wheeler and is licensed through the General Public License (GPL); see the last section for more information.















