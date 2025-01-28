---
title: "Advice 的注解"
sequence: "103"
---

## 注解的作用

- `@Advice.OnMethodEnter` 和 `@Advice.OnMethodExit` 表示『织入 advice code 的代码位置』，即『方法进入』和『方法退出』。
- 其他注解，应该传递什么样的参数值。

## 注解的理解

### 第一版

```text
                                        ┌─── @OnMethodEnter
                      ┌─── method ──────┤
                      │                 └─── @OnMethodExit
                      │
                      │                 ┌─── @AllArguments
                      │                 │
                      │                 ├─── @Argument
                      │                 │
                      │                 ├─── @Enter
Advice::annotation ───┤                 │
                      │                 ├─── @Exit
                      │                 │
                      │                 ├─── @FieldGetterHandle
                      │                 │
                      │                 ├─── @FieldSetterHandle
                      │                 │
                      │                 ├─── @FieldValue
                      │                 │
                      └─── parameter ───┼─── @Local
                                        │
                                        ├─── @Origin
                                        │
                                        ├─── @Return
                                        │
                                        ├─── @SelfCallHandle
                                        │
                                        ├─── @StubValue
                                        │
                                        ├─── @This
                                        │
                                        ├─── @Thrown
                                        │
                                        └─── @Unused
```

### 第二版

```text
                                        ┌─── @OnMethodEnter
                      ┌─── method ──────┤
                      │                 └─── @OnMethodExit
                      │
                      │                                ┌─── @Origin
                      │                 ┌─── clazz ────┤
                      │                 │              └─── @This
                      │                 │
                      │                 │              ┌─── @FieldValue
Advice::annotation ───┤                 │              │
                      │                 ├─── field ────┼─── @FieldGetterHandle
                      │                 │              │
                      │                 │              └─── @FieldSetterHandle
                      │                 │
                      │                 │                               ┌─── @Argument
                      │                 │              ┌─── argument ───┤
                      │                 │              │                └─── @AllArguments
                      │                 │              │
                      └─── parameter ───┤              │                ┌─── @Local
                                        │              ├─── local ──────┤
                                        │              │                │              ┌─── @Enter
                                        ├─── method ───┤                └─── advice ───┤
                                        │              │                               └─── @Exit
                                        │              │
                                        │              ├─── invoke ─────┼─── @SelfCallHandle
                                        │              │
                                        │              │                                  ┌─── @Return
                                        │              │                ┌─── normal ──────┤
                                        │              └─── exit ───────┤                 └─── @StubValue
                                        │                               │
                                        │                               └─── exception ───┼─── @Thrown
                                        │
                                        └─── unused ───┼─── @Unused
```

### 第三版

```text
                                                ┌─── @Origin
                                 ┌─── clazz ────┤
                                 │              └─── @This
                                 │
                                 │              ┌─── @FieldValue
                                 │              │
                                 ├─── field ────┼─── @FieldGetterHandle
                                 │              │
                                 │              └─── @FieldSetterHandle
          ┌─── Both ─────────────┤
          │                      │                             ┌─── @Argument
          │                      │              ┌─── arg ──────┤
          │                      │              │              └─── @AllArguments
          │                      ├─── method ───┤
          │                      │              ├─── local ────┼─── @Local
          │                      │              │
          │                      │              └─── invoke ───┼─── @SelfCallHandle
Advice ───┤                      │
          │                      └─── unused ───┼─── @Unused
          │
          ├─── @OnMethodEnter
          │
          │                                    ┌─── @Enter
          │                      ┌─── local ───┤
          │                      │             └─── @Exit
          └─── @OnMethodExit ────┤
                                 │                               ┌─── @Return
                                 │             ┌─── return ──────┤
                                 └─── exit ────┤                 └─── @StubValue
                                               │
                                               └─── exception ───┼─── @Thrown
```
