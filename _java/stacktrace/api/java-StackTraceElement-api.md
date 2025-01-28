---
title: "StackTraceElement"
sequence: "101"
---

## 从哪儿来

```text
                                                   ┌─── dumpStack()
                                ┌─── static ───────┤
                                │                  └─── getAllStackTraces() ───┼─── return ───┼─── Map<Thread, StackTraceElement[]>
              ┌─── Thread ──────┤
              │                 │                  ┌─── countStackFrames() ───┼─── return ───┼─── int
              │                 └─── non-static ───┤
              │                                    └─── getStackTrace() ──────┼─── return ───┼─── StackTraceElement[]
stacktrace ───┤
              │                 ┌─── getStackTrace() ──────┼─── return ───┼─── StackTraceElement[]
              │                 │
              │                 │                          ┌─── params ───┼─── StackTraceElement[]
              │                 ├─── setStackTrace() ──────┤
              └─── Throwable ───┤                          └─── return ───┼─── void
                                │
                                ├─── fillInStackTrace() ───┼─── return ───┼─── Throwable
                                │
                                │                          ┌─── params ───┼─── PrintWriter
                                └─── printStackTrace() ────┤
                                                           └─── return ───┼─── void
```

## API

```text
                     ┌─── classloader ───┼─── getClassLoaderName()
                     │
                     │                   ┌─── getModuleVersion()
                     ├─── module ────────┤
                     │                   └─── getModuleName()
                     │
StackTraceElement ───┤                   ┌─── getClassName()
                     │                   │
                     ├─── class ─────────┼─── getMethodName()
                     │                   │
                     │                   └─── isNativeMethod()
                     │
                     │                   ┌─── getFileName()
                     └─── file ──────────┤
                                         └─── getLineNumber()
```
