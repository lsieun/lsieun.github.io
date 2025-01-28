---
title: "ELF File Format"
sequence: "103"
---

## From Source Code To Binary Code

Programming starts with having a clever idea, and writing source code in a programming language of your choice,
for example C, and saving the source code in a file.
With the help of an adequate compiler, for example GCC, your source code is translated into object code, first.
Eventually, the linker translates the object code into a binary file
that links the object code with the referenced libraries.
This file contains the single instructions as machine code that are understood by the CPU,
and are executed as soon the compiled program is run.

The binary file mentioned above follows a specific structure,
and one of the most common ones is named **ELF** that abbreviates **Executable and Linkable Format**.
It is widely used for executable files, relocatable object files, shared libraries, and core dumps.

Twenty years ago – in 1999 – the 86open project has chosen **ELF** as the standard binary file format
for Unix and Unix-like systems on x86 processors.
Luckily, the ELF format had been previously documented in both the System V Application Binary Interface,
and the Tool Interface Standard.
This fact enormously simplified the agreement on standardization
between the different vendors and developers of Unix-based operating systems.

The reason behind that decision was the design of **ELF** – flexibility, extensibility, and cross-platform support
for different endian formats and address sizes.
ELF's design is not limited to a specific processor, instruction set, or hardware architecture.

Since then, the ELF format is in use by several operating systems.
Among others, this includes Linux, Solaris/Illumos, Free-, Net- and OpenBSD, QNX, BeOS/Haiku, and Fuchsia OS.
Furthermore, you will find it on mobile devices running Android,
Maemo or Meego OS/Sailfish OS as well as on game consoles like the PlayStation Portable, Dreamcast, and Wii.

**The specification does not clarify the filename extension for ELF files.**
In use is a variety of letter combinations,
such as `.axf`, `.bin`, `.elf`, `.o`, `.prx`, `.puff`, `.ko`, `.so`, and `.mod`, or none.

## The Structure of an ELF File

On a Linux terminal, the command man `elf` gives you a handy summary about the structure of an ELF file:

```text
$ man elf

ELF(5)                     Linux Programmer's Manual                    ELF(5)

NAME
       elf - format of Executable and Linking Format (ELF) files

SYNOPSIS
       #include <elf.h>

DESCRIPTION
       The  header  file  <elf.h>  defines the format of ELF executable binary
       files.  Amongst these files are normal  executable  files,  relocatable
       object files, core files and shared libraries.

       An executable file using the ELF file format consists of an ELF header,
       followed by a program header table or a section header table, or  both.
       The  ELF  header  is  always  at  offset zero of the file.  The program
       header table and the section header table's  offset  in  the  file  are
       defined  in  the  ELF  header.  The two tables describe the rest of the
       particularities of the file.

...
```

As you can see from the description above,
an ELF file consists of two sections – **an ELF header**, and **file data**.
The **file data** section can consist of a **program header** table describing zero or more segments,
a **section header** table describing zero or more sections,
that is followed by **data** referred to by entries from the program header table, and the section header table.
Each segment contains information that is necessary for run-time execution of the file,
while sections contain important data for linking and relocation.

![](/assets/images/linux/elf/elf-basic-format.webp)

## Reference

- [Understanding the ELF File Format](https://linuxhint.com/understanding_elf_file_format/)
