---
title: "ClassFile 快速参考"
sequence: "104"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Java ClassFile

对于一个具体的 `.class` 而言，它是遵循 ClassFile 结构的。这个数据结构位于 [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) 的
[The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html) 部分。

```text
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

其中，

- `u1`: 表示占用 1 个字节
- `u2`: 表示占用 2 个字节
- `u4`: 表示占用 4 个字节
- `u8`: 表示占用 8 个字节

而 `cp_info`、`field_info`、`method_info` 和 `attribute_info` 表示较为复杂的结构，但它们也是由 `u1`、`u2`、`u4` 和 `u8` 组成的。

相应的，在 `.class` 文件当中，定义的字段，要遵循 `field_info` 的结构。

```text
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

同样的，在 `.class` 文件当中，定义的方法，要遵循 `method_info` 的结构。

```text
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

在 `method_info` 结构中，方法当中方法体的代码，是存在于 `Code` 属性结构中，其结构如下：

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

## 示例演示

在下面内容中，我们会使用到《[Java 8 ClassFile](https://edu.51cto.com/course/25908.html)》课程的源码 [java8-classfile-tutorial](https://gitee.com/lsieun/java8-classfile-tutorial)。

假如，我们有一个 `sample.HelloWorld` 类，它的内容如下：

```java
package sample;

public class HelloWorld implements Cloneable {
    private static final int intValue = 10;

    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
    }
}
```

针对 `sample.HelloWorld` 类，我们可以

- 第一，运行 `run.A_File_Hex` 类，查看 `sample.HelloWorld` 类当中包含的数据，以十六进制进行呈现。
- 第二，运行 `run.B_ClassFile_Raw` 类，能够对 `sample.HelloWorld` 类当中包含的数据进行拆分。这样做的目的，是为了与 ClassFile 的结构进行对照，进行参考。
- 第三，运行 `run.I_Attributes_Method` 类，能够对 `sample.HelloWorld` 类当中方法的 Code 属性结构进行查看。
- 第四，运行 `run.K_Code_Locals` 类，能够对 `sample.HelloWorld` 类当中 `Code` 属性包含的 instruction 进行查看。

## 总结

本文主要是对 Java ClassFile 进行了介绍，内容总结如下：

- 第一点，一个具体的 `.class` 文件，它是要遵循 ClassFile 结构的；而 ClassFile 的结构是定义在 [The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) 文档中。
- 第二点，示例演示，主要是希望大家能够把 `.class` 文件里的内容与 ClassFile 结构之间对应起来。

在后续内容当中，我们会讲到从“无”到“有”的生成新的 Class 文件，以及对已有的 Class 文件进行转换；此时，我们对 ClassFile 进行介绍，目的就是为了对生成 Class 或转换 Class 的过程有一个较深刻的理解。
