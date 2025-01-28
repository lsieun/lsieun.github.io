---
title: "Application.doExit()"
sequence: "102"
---

[UP](/ide/intellij-idea-index.html)

## 思路

```text
System.exit() --> ApplicationImpl.doExit() --> 跳出 ApplicationImpl 类的范围，找上一层方面，清空方法体
```

## 2024.2.1

### app-client.jar

目标：找到 `ApplicationImpl.doExit()` 方法

- Jar: `lib/app-client.jar`
- Class: `com.intellij.openapi.application.impl.ApplicationImpl.doExit()`
- 处理：添加 Stack Trace

```text
Stack Trace:
    com.intellij.openapi.application.impl.ApplicationImpl::doExit:(IZ[Ljava/lang/String;I)V:bci=171
    com.intellij.openapi.application.impl.ApplicationImpl::exit:(IZ[Ljava/lang/String;I)V:bci=61
    com.intellij.openapi.application.impl.ApplicationImpl::exit:(ZZZI)V:bci=32
    com.intellij.ide.b.m.R::b:(Lcom/intellij/openapi/application/Application;Z)V:bci=26    <--- 清空这个方法
    com.intellij.util.concurrency.ContextRunnable::run:()V:bci=24
```

### product.jar

- Jar: `lib/product.jar`
- Class: `com.intellij.ide.b.m.R::b:(Lcom/intellij/openapi/application/Application;Z)V`

- 处理：清空方法体
- 后果：弹出激活窗口，点击退出后，并不会退出

## 类

### AppExitCodes

- `util-8.jar`

```text
com.intellij.idea.AppExitCodes
```

```java
package com.intellij.idea;

public final class AppExitCodes {
    public static final int NO_GRAPHICS = 1;
    public static final int RESTART_FAILED = 2;
    public static final int STARTUP_EXCEPTION = 3;
    public static final int DIR_CHECK_FAILED = 5;
    public static final int INSTANCE_CHECK_FAILED = 6;
    public static final int LICENSE_ERROR = 7;
    public static final int PLUGIN_ERROR = 8;
    public static final int PRIVACY_POLICY_REJECTION = 11;
    public static final int INSTALLATION_CORRUPTED = 12;
    public static final int ACTIVATE_NOT_INITIALIZED = 14;
    public static final int ACTIVATE_ERROR = 15;
    public static final int ACTIVATE_DISPOSING = 16;
}
```
