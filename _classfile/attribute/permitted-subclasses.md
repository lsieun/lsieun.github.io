---
title: "PermittedSubclasses"
sequence: "103"
---

The Java programming language uses the modifier `sealed` to indicate a class or interface
that limits its direct subclasses or direct subinterfaces.
One might suppose that this modifier would correspond to an `ACC_SEALED` flag in a class file,
since the related modifier `final` corresponds to the `ACC_FINAL` flag.
In fact, a sealed class or interface is indicated in a class file
by the presence of the `PermittedSubclasses` attribute.

There must be no `PermittedSubclasses` attribute in the `attributes` table of a
`ClassFile` structure whose `access_flags` item has the `ACC_FINAL` flag set.

> PermittedSubclasses 与 final 是相互冲突的

```text
PermittedSubclasses_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 number_of_classes;
    u2 classes[number_of_classes];
}
```


