---
title: "AsmVisitorWrapper"
sequence: "101"
---

```java
public interface DynamicType extends ClassFileLocator {
    interface Builder<T> {
        // 注意：visit 方法接收 AsmVisitorWrapper 类型的参数
        Builder<T> visit(AsmVisitorWrapper asmVisitorWrapper);
    }
}
```

## AsmVisitorWrapper

```text
                     ┌─── NoOp
                     │
AsmVisitorWrapper ───┤
                     │                    ┌─── ForDeclaredFields ────┼─── FieldVisitorWrapper
                     └─── AbstractBase ───┤
                                          └─── ForDeclaredMethods ───┼─── MethodVisitorWrapper
```

```java
public interface AsmVisitorWrapper {
    int NO_FLAGS = 0;

    // 相对不重要
    int mergeWriter(int flags);

    // 相对不重要
    int mergeReader(int flags);

    // 相对重要
    ClassVisitor wrap(TypeDescription instrumentedType,
                      ClassVisitor classVisitor,
                      Implementation.Context implementationContext,
                      TypePool typePool,
                      FieldList<FieldDescription.InDefinedShape> fields,
                      MethodList<?> methods,
                      int writerFlags,
                      int readerFlags);
}
```

```text
AsmVisitorWrapper --> ClassVisitor
```

### AsmVisitorWrapper.AbstractBase

```java
public interface AsmVisitorWrapper {
    abstract class AbstractBase implements AsmVisitorWrapper {
        public int mergeWriter(int flags) {
            return flags;
        }

        public int mergeReader(int flags) {
            return flags;
        }
    }
}
```

## FieldVisitorWrapper

```java
public interface AsmVisitorWrapper {
    abstract class AbstractBase implements AsmVisitorWrapper {
        public int mergeWriter(int flags) {
            return flags;
        }

        public int mergeReader(int flags) {
            return flags;
        }
    }

    class ForDeclaredFields extends AbstractBase {
        public interface FieldVisitorWrapper {
            FieldVisitor wrap(TypeDescription instrumentedType,
                              FieldDescription.InDefinedShape fieldDescription,
                              FieldVisitor fieldVisitor);
        }
    }
}
```

```text
FieldVisitorWrapper --> FieldVisitor
```

## MethodVisitorWrapper

```java
public interface AsmVisitorWrapper {
    abstract class AbstractBase implements AsmVisitorWrapper {
        public int mergeWriter(int flags) {
            return flags;
        }

        public int mergeReader(int flags) {
            return flags;
        }
    }
}
```
