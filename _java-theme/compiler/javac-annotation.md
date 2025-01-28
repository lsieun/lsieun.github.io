---
title: "javac Annotation"
---

The `javac` command provides direct support for **annotation processing**, superseding the need for the separate annotation processing command, `apt`.

The API for annotation processors is defined in the `javax.annotation.processing` and `javax.lang.model` packages and subpackages.

## Standard Options

- `-proc: [none, only]`: Controls whether **annotation processin**g and **compilation** are done.
  - `-proc:none` means that **compilation** takes place without **annotation processing**.
  - `-proc:only` means that only **annotation processing** is done, without any subsequent **compilation**.

- `-processor class1 [,class2,class3...]`: Names of the annotation processors to run. This bypasses the default discovery process.
- `-processorpath path`: Specifies where to find **annotation processors**. If this option is not used, then the **class path** is searched for processors.

## How Annotation Processing Works

Unless annotation processing is disabled with the `-proc:none` option, the compiler searches for any annotation processors that are available.

> 默认是开启的，除非使用-proc:none关闭

The search path can be specified with the `-processorpath` option.
If no path is specified, then the user class path is used.

> 从哪里查找

Processors are located by means of **service provider-configuration files**
named `META-INF/services/javax.annotation.processing.Processor` on the search path.
Such files should contain the names of any annotation processors to be used, listed one per line.

> 第一种机制，SPI

Alternatively, processors can be specified explicitly, using the `-processor` option.

> 第二种机制：`-processor`选项

After scanning the source files and classes on the command line to determine **what annotations are present**,
the compiler queries the **processors** to determine **what annotations they process**.
When a match is found, the processor is called.
A processor can claim the annotations it processes, in which case no further attempt is made to find any processors for those annotations.
After all of the annotations are claimed, the compiler does not search for additional processors.

> 围绕着annotations和processors来展开

If any processors generate new source files, then another round of annotation processing occurs:
Any newly generated source files are scanned, and the annotations processed as before.
Any processors called on previous rounds are also called on all subsequent rounds.
This continues until no new source files are generated.

> 不断递进的过程

After a round occurs where no new source files are generated,
the **annotation processors** are called one last time, to give them a chance to complete any remaining work.
Finally, unless the `-proc:only` option is used,
the compiler compiles the original and all generated source files.

> 最终

## Implicitly Loaded Source Files

To compile a set of source files, the compiler might need to implicitly load additional source files.
See Searching for Types.

Such files are currently not subject to annotation processing.
By default, the compiler gives a warning when annotation processing occurred and any implicitly loaded source files are compiled.
The `-implicit` option provides a way to suppress the warning.

