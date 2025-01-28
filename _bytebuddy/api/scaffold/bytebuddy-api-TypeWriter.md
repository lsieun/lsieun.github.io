---
title: "TypeWriter"
sequence: "TypeWriter"
---

```text
                                                         ┌─── ForImplicitField
              ┌─── FieldPool ─────────────┼─── Record ───┤
              │                                          └─── ForExplicitField
              │
              │                                          ┌─── ForNonImplementedMethod
              │                                          │
              │                                          │                               ┌─── WithBody
              │                                          │                               │
              │                                          │                               ├─── WithoutBody
              ├─── MethodPool ────────────┼─── Record ───┼─── ForDefinedMethod ──────────┤
              │                                          │                               ├─── WithAnnotationDefaultValue
              │                                          │                               │
TypeWriter ───┤                                          │                               └─── OfVisibilityBridge
              │                                          │
              │                                          │                               ┌─── AccessorBridge
              │                                          └─── AccessBridgeWrapper ───────┤
              │                                                                          └─── BridgeTarget
              │
              │                                          ┌─── ForImplicitRecordComponent
              ├─── RecordComponentPool ───┼─── Record ───┤
              │                                          └─── ForExplicitRecordComponent
              │
              │                           ┌─── ForCreation
              │                           │
              └─── Default ───────────────┼─── ForInlining
                                          │
                                          └─── UnresolvedType
```

```java
public interface TypeWriter<T> {
    interface MethodPool {
        interface Record {
            Record prepend(ByteCodeAppender byteCodeAppender);
            
            abstract class ForDefinedMethod implements Record {
                public static class WithBody extends ForDefinedMethod {
                    private final ByteCodeAppender byteCodeAppender;

                    public void applyBody(MethodVisitor methodVisitor, Implementation.Context implementationContext, AnnotationValueFilter.Factory annotationValueFilterFactory) {
                        applyAttributes(methodVisitor, annotationValueFilterFactory);
                        methodVisitor.visitCode();
                        ByteCodeAppender.Size size = applyCode(methodVisitor, implementationContext);
                        methodVisitor.visitMaxs(size.getOperandStackSize(), size.getLocalVariableSize());
                    }

                    public ByteCodeAppender.Size applyCode(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
                        return byteCodeAppender.apply(methodVisitor, implementationContext, methodDescription);
                    }
                }
            }
        }
    }
}
```

## 具体类

### ForCreation

```text
                                ┌─── cv.visit()
                                │
                                ├─── fieldPool.target(fieldDesc).apply(cv)
                                │
ForCreation ───┼─── create() ───┼─── methodPool.target(methodDesc).apply(cv)
                                │
                                ├─── cv.visitEnd()
                                │
                                └─── cw.toByteArray()
```

### ForDefinedMethod

```text
                                  ┌─── mv = cv.visitMethod(...)
                                  │
                                  ├─── mv.visitParameter(...)
                                  │
                                  ├─── applyHead(mv)
                                  │
                                  │                                ┌─── applyAttributes(mv) ────┼─── methodAttributeAppender.apply(mv)
ForDefinedMethod ───┼─── apply ───┤                                │
                                  │                                ├─── mv.visitCode()
                                  ├─── applyBody(mv) ──────────────┤
                                  │                                ├─── size = applyCode(mv) ───┼─── byteCodeAppender.apply(mv)
                                  │                                │
                                  │                                └─── mv.visitMaxs(size)
                                  │
                                  └─── mv.visitEnd()
```

