---
title: "AsmVisitorWrapper"
sequence: "101"
---

```text
                          ┌─── mergeReader() ───┼─── ClassReader.accept(parsingOptions)
                          │
                          ├─── mergeWriter() ───┼─── ClassWriter.<init>(flags)
                          │
                          │                                    ┌─── TypeDescription
                          │                                    │
                          │                                    ├─── ClassVisitor
AsmVisitorWrapper::api ───┤                                    │
                          │                                    ├─── Implementation$Context
                          │                                    │
                          │                                    ├─── TypePool
                          │                     ┌─── params ───┤
                          │                     │              ├─── FieldList<FieldDescription$InDefinedShape>
                          │                     │              │
                          │                     │              ├─── MethodList<?>
                          └─── wrap() ──────────┤              │
                                                │              ├─── writerFlags
                                                │              │
                                                │              └─── readerFlags
                                                │
                                                └─── return ───┼─── ClassVisitor
```

