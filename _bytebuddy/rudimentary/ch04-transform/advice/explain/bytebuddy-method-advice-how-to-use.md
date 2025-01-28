---
title: "Advice 的用法"
sequence: "102"
---

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-how-to-use.png)

## 如何使用




```text
                                                                 ┌─── [p] AsmVisitorWrapper
                 ┌─── DynamicType.Builder ───┼─── [m] visit() ───┤
                 │                                               └─── [r] DynamicType.Builder<T>
                 │
                 │                           ┌─── [m] wrap() ───────────────┼─── [r] ClassVisitor (ASM)
                 ├─── AsmVisitorWrapper ─────┤
advice::usage ───┤                           │                                                               ┌─── [m] wrap() ───┼─── [r] MethodVisitor (ASM)
                 │                           └─── [s] ForDeclaredMethods ───┼─── [n] MethodVisitorWrapper ───┤
                 │                                                                                           └─── [s] Advice
                 │
                 │                           ┌─── [m] to() ───┼─── [r] Advice
                 └─── Advice ────────────────┤
                                             └─── [m] on() ───┼─── [r] AsmVisitorWrapper.ForDeclaredMethods
```

- 第一，`DynamicType.Builder.visit()` 方法接收的是 `AsmVisitorWrapper` 类型的值，返回是 `DynamicType.Builder` 类型。
- 第二，`Advice.to()` 方法返回的是 `Advice` 类型。
- 第三，`Advice.on()` 方法返回的是 `AsmVisitorWrapper.ForDeclaredMethods` 类型。
- 第四，`AsmVisitorWrapper.ForDeclaredMethods` 是 `AsmVisitorWrapper` 的子类型。

## API

```text
                                                                             ┌─── Class<?>
                                                              ┌─── params ───┤
                                  ┌─── to() ──────────────────┤              └─── ClassFileLocator
                                  │                           │
               ┌─── static ───────┤                           └─── return ───┼─── Advice
               │                  │
               │                  └─── withCustomMapping() ───┼─── return ───┼─── Advice.WithCustomMapping
               │
               │                                                                                ┌─── params ───┼─── Assigner
Advice::api ───┤                                                ┌─── withAssigner() ────────────┤
               │                                                │                               └─── return ───┼─── Advice
               │                                                │
               │                                  ┌─── chain ───┤                               ┌─── params ───┼─── Advice.ExceptionHandler
               │                                  │             ├─── withExceptionHandler() ────┤
               │                                  │             │                               └─── return ───┼─── Advice
               └─── non-static ───┼─── builder ───┤             │
                                                  │             └─── withExceptionPrinting() ───┼─── return ───┼─── Advice
                                                  │
                                                  │                          ┌─── params ───┼─── ElementMatcher<? super MethodDescription>
                                                  └─── build ───┼─── on() ───┤
                                                                             └─── return ───┼─── AsmVisitorWrapper.ForDeclaredMethods
```


