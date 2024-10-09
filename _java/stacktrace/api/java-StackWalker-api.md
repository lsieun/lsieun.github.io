---
title: "StackWalker"
sequence: "102"
---

## StackWalker

```text
                                  ┌─── getInstance()
                                  │
                                  ├─── getInstance(Option option)
               ┌─── static ───────┤
               │                  ├─── getInstance(Set<Option> options)
               │                  │
               │                  └─── getInstance(Set<Option> options, int estimateDepth)
StackWalker ───┤
               │                  ┌─── getCallerClass() ───┼─── return ───┼─── Class<?>
               │                  │
               │                  │                        ┌─── params ───┼─── Consumer<? super StackWalker.StackFrame>
               └─── non-static ───┼─── forEach() ──────────┤
                                  │                        └─── return ───┼─── void
                                  │
                                  │                        ┌─── params ───┼─── Function<? super Stream<StackWalker.StackFrame>, ? extends T>
                                  └─── walk() ─────────────┤
                                                           └─── return ───┼─── T
```

## StackFrame

```text
                                          ┌─── getClassName()
                          ┌─── clazz ─────┤
                          │               └─── getDeclaringClass()
                          │
                          │                            ┌─── getMethodName()
                          │                            │
                          │               ┌─── head ───┼─── getDescriptor()
                          │               │            │
                          ├─── method ────┤            └─── getMethodType()
StackWalker.StackFrame ───┤               │
                          │               │            ┌─── native ───────┼─── isNativeMethod()
                          │               └─── body ───┤
                          │                            └─── non-native ───┼─── getByteCodeIndex()
                          │
                          │               ┌─── getFileName()
                          ├─── file ──────┤
                          │               └─── getLineNumber()
                          │
                          └─── convert ───┼─── toStackTraceElement()
```

### Option

```text
                                                     ┌─── StackWalker.getCallerClass()
                      ┌─── RETAIN_CLASS_REFERENCE ───┤
                      │                              └─── StackFrame. getDeclaringClass()
StackWalker.Option ───┤
                      ├─── SHOW_REFLECT_FRAMES
                      │
                      └─── SHOW_HIDDEN_FRAMES
```
