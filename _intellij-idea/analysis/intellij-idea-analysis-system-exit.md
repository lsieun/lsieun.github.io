---
title: "System.exit()"
sequence: "101"
---

```text
System.exit() --> ApplicationImpl.doExit() --> 跳出 ApplicationImpl 类的范围，找上一层方面，清空方法体
```

## 2024.2.1

### app-client.jar

`lib/app-client.jar`

```text
com.intellij.openapi.application.impl.ApplicationImpl.doExit()
```

```text
com/intellij/openapi/application/impl/ApplicationImpl.class
doExit:(IZ[Ljava/lang/String;I)V
```

```text
Stack Trace:
    com.intellij.openapi.application.impl.ApplicationImpl::doExit:(IZ[Ljava/lang/String;I)V:bci=171
    com.intellij.openapi.application.impl.ApplicationImpl::exit:(IZ[Ljava/lang/String;I)V:bci=61
    com.intellij.openapi.application.impl.ApplicationImpl::exit:(ZZZI)V:bci=32
    com.intellij.ide.b.m.R::b:(Lcom/intellij/openapi/application/Application;Z)V:bci=26    <--- 清空这个方法
    com.intellij.util.concurrency.ContextRunnable::run:()V:bci=24
```

### product.jar

`lib/product.jar`

```text
com.intellij.ide.b.m.R::b:(Lcom/intellij/openapi/application/Application;Z)V
```

```text
com/intellij/ide/b/m/R.class
b:(Lcom/intellij/openapi/application/Application;Z)V
```
