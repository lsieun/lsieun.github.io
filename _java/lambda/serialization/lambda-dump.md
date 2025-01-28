---
title: "Lambda: Dump"
---

在 `java.lang.invoke.InnerClassLambdaMetafactory` 类当中，定义了 `dumper` 字段：

```java
final class InnerClassLambdaMetafactory extends AbstractValidatingLambdaMetafactory {
    private static final ProxyClassesDumper dumper;
}
```

在命令行设置如下属性，可以对生成 Lambda 内部类进行导出：

```text
-Djdk.internal.lambda.dumpProxyClasses=<dir>
```

```text
-Djdk.internal.lambda.dumpProxyClasses=./dump
```
