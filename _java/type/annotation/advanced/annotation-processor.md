---
title: "Annotation processors"
sequence: "105"
---

The Java compiler supports a special kind of plugins called **annotation processors** (using the `-processor` command line argument)
which could process the annotations during the compilation phase.
**Annotation processors** can analyze the annotations usage (perform static code analysis),
create additional Java source files or resources (which in turn could be compiled and processed) or mutate the annotated code.

The **retention policy** plays a key role by instructing the compiler which annotations should be available for processing by annotation processors.

Annotation processors are widely used, however to write one it requires some knowledge of how Java compiler works and the compilation process itself.

Annotation 是一个接口，程序可以通过反射来获取指定程序元素的 Annotation 对象，然后通过 Annotation 对象来取得注释里的元数据。

值得指出的是，Annotation 不影响程序代码的执行，无论增加、删除 Annotation，代码都始终如一地执行。
如果希望让程序中的 Annotation 在运行时起一定的作用，只有通过某种配套的工具对 Annotation 中的信息进行访问和处理，访问和处理 Annotation 的工具统称 APT（Annotation Processing Tool）。


－ Annotation
－ APT


- 4 个基本 Annotation
- 加入元数据
- 取出元数据 APT

如何定义：

- RetentionPolicy






