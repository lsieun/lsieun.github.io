---
title: "Description概览"
sequence: "101"
---

```text
                             ┌─── NamedElement
                             │
                             ├─── ByteCodeElement
                             │
                             ├─── ModifierReviewable
                             │
                             ├─── TypeVariableSource
                             │
                             │                          ┌─── TypeDescription
                             │                          │
                             ├─── type ─────────────────┼─── TypeDefinition
                             │                          │
                             │                          └─── TypeList
                             │
                             │                          ┌─── FieldDescription
                             ├─── field ────────────────┤
net.bytebuddy.description ───┤                          └─── FieldList
                             │
                             │                          ┌─── MethodDescription
                             │                          │
                             │                          ├─── MethodList
                             ├─── method ───────────────┤
                             │                          ├─── ParameterDescription
                             │                          │
                             │                          └─── ParameterList
                             │
                             ├─── enumeration ──────────┼─── EnumerationDescription
                             │
                             │
                             │                          ┌─── AnnotationDescription
                             │                          │
                             │                          ├─── AnnotationList
                             └─── annotation ───────────┤
                                                        ├─── AnnotationSource
                                                        │
                                                        └─── AnnotationValue
```

## NamedElement

Represents a Java element with a name.

```text
                ┌─── getActualName()
                │
                │                        ┌─── getName()
                │                        │
                ├─── WithRuntimeName ────┼─── getInternalName()
                │                        │
NamedElement ───┤                        └─── WithGenericName ─────┼─── toGenericString()
                │
                ├─── WithOptionalName ───┼─── isNamed()
                │
                │
                │                        ┌─── getDescriptor()
                └─── WithDescriptor ─────┤
                                         └─── getGenericSignature()
```



