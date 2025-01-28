---
title: ".NET Assembly Format"
sequence: "104"
---

Structurally speaking, a .NET assembly (*.dll or *.exe) consists of the following elements:

- A Windows file header
- A CLR file header
- CIL code
- Type metadata
- An assembly manifest
- Optional embedded resources

While **the first two elements (the Windows and CLR headers) are blocks of data 
you can typically always ignore**, they do deserve some brief consideration.

## The Windows File Header

The Windows file header establishes the fact that 
the assembly can be loaded and manipulated by the Windows family of operating systems.

```text
the fact
```

This header data also identifies the kind of application
(console-based, GUI-based, or `*.dll` code library) to be hosted by Windows.

```text
the kind of application
```

If you open a .NET assembly using the `dumpbin.exe` utility and specify the `/headers` flag as so:

```text
> dumpbin /headers CarLibrary.dll
```

```text
>dumpbin /headers Lsieun.Cad.Basic.dll
Microsoft (R) COFF/PE Dumper Version 14.29.30147.0
Copyright (C) Microsoft Corporation.  All rights reserved.


Dump of file Lsieun.Cad.Basic.dll

PE signature found

File Type: DLL

FILE HEADER VALUES
            8664 machine (x64)
               2 number of sections
        8948DF76 time date stamp
               0 file pointer to symbol table
               0 number of symbols
              F0 size of optional header
            2022 characteristics
                   Executable
                   Application can handle large (>2GB) addresses
                   DLL

OPTIONAL HEADER VALUES
             20B magic # (PE32+)
           48.00 linker version
            1400 size of code
...

  Summary

        2000 .rsrc
        2000 .text
```

Do be aware, however, that this information is used under the covers
**when Windows loads the binary image into memory.**

## The CLR File Header

The CLR header is a block of data that all .NET assemblies must support to be hosted by the CLR.

In a nutshell, this header defines **numerous flags**
that enable the runtime to understand the layout of the managed file.
For example, flags exist that identify the location of the metadata and resources within the file,
the version of the runtime the assembly was built against,
the value of the (optional) public key, and so forth.

If you supply the `/clrheader` flag to `dumpbin.exe` like so:

```text
dumpbin /clrheader CarLibrary.dll
```

```text
>dumpbin /clrheader Lsieun.Cad.Basic.dll
Microsoft (R) COFF/PE Dumper Version 14.29.30147.0
Copyright (C) Microsoft Corporation.  All rights reserved.


Dump of file Lsieun.Cad.Basic.dll

File Type: DLL

  clr Header:

              48 cb
            2.05 runtime version
            24C4 [     E54] RVA [size] of MetaData Directory
               1 flags
                   IL Only
               0 entry point token
               0 [       0] RVA [size] of Resources Directory
               0 [       0] RVA [size] of StrongNameSignature Directory
               0 [       0] RVA [size] of CodeManagerTable Directory
               0 [       0] RVA [size] of VTableFixups Directory
               0 [       0] RVA [size] of ExportAddressTableJumps Directory
               0 [       0] RVA [size] of ManagedNativeHeader Directory


  Summary

        2000 .rsrc
        2000 .text
```

Again, as a .NET developer, you will not need to concern yourself with
the gory details of an assembly's CLR header information.
Just understand that every .NET assembly contains this data,
which is used behind the scenes by **the .NET runtime as the image data loads into memory.**


## CIL Code, Type Metadata, and the Assembly Manifest

At its core, an assembly contains **CIL code**,
which is a platform- and CPU-agnostic intermediate language.
At runtime, the internal CIL is compiled on the fly using a just-in-time (JIT) compiler, 
according to platform- and CPU-specific instructions.
Given this design, .NET assemblies can indeed execute on a variety of architectures, devices, and operating systems.

An assembly also contains **metadata** that completely describes **the format of the contained types**,
as well as **the format of external types** referenced by this assembly.
The .NET runtime uses this metadata to resolve the location of types (and their members) within the binary,
lay out types in memory, and facilitate remote method invocations.

An assembly must also contain **an associated manifest** (also referred to as assembly metadata).
The manifest documents each **module** within the assembly, establishes the **version** of the assembly,
and also documents any **external assemblies** referenced by the current assembly.

## Optional Assembly Resources

Finally, a .NET assembly may contain any number of **embedded resources**,
such as application icons, image files, sound clips, or string tables.

In fact, the .NET platform supports **satellite assemblies** that contain nothing but localized resources.
This can be useful if you want to partition your resources based on a specific culture 
(English, German, etc.) for the purposes of building international software.
