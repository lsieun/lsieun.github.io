---
title: "Annotating Packages"
sequence: "108"
---

You need to create a file, which should be named `package-info.java`,
and place the annotated package declaration in it.

When you compile the `package-info.java` file, a class file will be created.



```java
// package-info.java
@Version(major = 1, minor = 2)
package lsieun.annotation;
```

```java
import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.CONSTRUCTOR,
        ElementType.METHOD, ElementType.MODULE,
        ElementType.PACKAGE, ElementType.LOCAL_VARIABLE,
        ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Version {
    int major();

    int minor();
}
```

查看 `package-info.class` 文件：

```text
magic_number='CAFEBABE'
version='0000003D'
constant_pool_count='000D' (13)
constant_pool
    |001| CONSTANT_Class {Value='lsieun/annotation/package-info', HexCode='070002'}
    |002| CONSTANT_Utf8 {Value='lsieun/annotation/package-info', HexCode='01001E6C736965756E2F616E6E6F746174696F6E2F7061636B6167652D696E666F'}
    |003| CONSTANT_Class {Value='java/lang/Object', HexCode='070004'}
    |004| CONSTANT_Utf8 {Value='java/lang/Object', HexCode='0100106A6176612F6C616E672F4F626A656374'}
    |005| CONSTANT_Utf8 {Value='SourceFile', HexCode='01000A536F7572636546696C65'}
    |006| CONSTANT_Utf8 {Value='package-info.java', HexCode='0100117061636B6167652D696E666F2E6A617661'}
    |007| CONSTANT_Utf8 {Value='RuntimeVisibleAnnotations', HexCode='01001952756E74696D6556697369626C65416E6E6F746174696F6E73'}
    |008| CONSTANT_Utf8 {Value='Llsieun/annotation/Version;', HexCode='01001B4C6C736965756E2F616E6E6F746174696F6E2F56657273696F6E3B'}
    |009| CONSTANT_Utf8 {Value='major', HexCode='0100056D616A6F72'}
    |010| CONSTANT_Integer {Value='1', HexCode='0300000001'}
    |011| CONSTANT_Utf8 {Value='minor', HexCode='0100056D696E6F72'}
    |012| CONSTANT_Integer {Value='2', HexCode='0300000002'}
class_info='1600000100030000'
    access_flags='1600' ([ACC_INTERFACE,ACC_ABSTRACT,ACC_SYNTHETIC])
    this_class='0001' (#1)
    super_class='0003' (#3)
    interfaces_count='0000' (0)
    interfaces='' ([])
fields_count='0000' (0)
fields
methods_count='0000' (0)
methods
attributes_count='0002' (2)
attributes
--->|000| SourceFile:
HexCode: 0005000000020006
attribute_name_index='0005' (#5)
attribute_length='00000002' (2)
info='0006'

--->|001| RuntimeVisibleAnnotations:
HexCode: 000700000010000100080002000949000A000B49000C
attribute_name_index='0007' (#7)
attribute_length='00000010' (16)
info='000100080002000949000A000B49000C'
```
