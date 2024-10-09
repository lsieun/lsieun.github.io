---
title: "方法参数：从 MethodEnter 到 MethodExit 传递值"
sequence: "105"
---

```text
                                                                 ┌─── advice.code.enter
                                                                 │
                                       ┌─── instrumented.code ───┼─── functional.code
                                       │                         │
advice::passing-data ───┼─── method ───┤                         └─── advice.code.exit
                                       │
                                       │                         ┌─── @Local
                                       └─── local.variable ──────┤
                                                                 │              ┌─── @Enter
                                                                 └─── advice ───┤
                                                                                └─── @Exit
```
