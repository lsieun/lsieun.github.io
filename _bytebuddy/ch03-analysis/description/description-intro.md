---
title: "Description Intro"
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
