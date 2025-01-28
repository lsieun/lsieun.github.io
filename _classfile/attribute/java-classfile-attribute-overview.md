---
title: "ClassFile Attribute Overview"
sequence: "101"
---

```text
                                        ┌─── Synthetic
                                        │
                                        ├─── Signature
                                        │
                                        ├─── Deprecated
                                        │
                         ┌─── common ───┼─── RuntimeVisibleAnnotations
                         │              │
                         │              ├─── RuntimeInvisibleAnnotations
                         │              │
                         │              ├─── RuntimeVisibleTypeAnnotations
                         │              │
                         │              └─── RuntimeInvisibleTypeAnnotations
                         │
                         │              ┌─── InnerClasses
                         │              │
                         │              ├─── EnclosingMethod
                         │              │
                         │              ├─── SourceFile
                         │              │
                         │              ├─── SourceDebugExtension
                         │              │
                         │              ├─── BootstrapMethods
                         │              │
ClassFile::Attributes ───┤              ├─── Module
                         ├─── class ────┤
                         │              ├─── ModulePackages
                         │              │
                         │              ├─── ModuleMainClass
                         │              │
                         │              ├─── NestHost
                         │              │
                         │              ├─── NestMembers
                         │              │
                         │              ├─── Record
                         │              │
                         │              └─── PermittedSubclasses
                         │
                         │              ┌─── field ────┼─── ConstantValue
                         │              │
                         │              │              ┌─── Exceptions
                         │              │              │
                         └─── member ───┤              ├─── MethodParameters
                                        │              │
                                        │              ├─── AnnotationDefault
                                        │              │
                                        └─── method ───┼─── RuntimeVisibleParameterAnnotations
                                                       │
                                                       ├─── RuntimeInvisibleParameterAnnotations
                                                       │
                                                       │                                            ┌─── StackMapTable
                                                       │                                            │
                                                       │                                            ├─── LineNumberTable
                                                       └─── Code ───────────────────────────────────┤
                                                                                                    ├─── LocalVariableTable
                                                                                                    │
                                                                                                    └─── LocalVariableTypeTable
```
