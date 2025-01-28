---
title: "Lambda 实现分析"
sequence: "160"
published: false
---

[UP]({% link _java-agent/java-agent-01.md %})

在 Java 8 版本中，引入了 Lambda 表达式，它的好处是可以将“方法”作为参数进行传递。

如果我们利用 Java Agent 来探究一下 Lambda 表达式的实现原理，就会发现：Lambda 表达式会转换成一个具体的类，这个类会实现某个特定的接口。

例如，有一个 Lambda 表达式：

```text
BiFunction<Integer, Integer, Integer> func = (x, y) -> x + y;
```

在程序运行的过程中，JVM 会利用内置的 ASM 类库生成一个类，示例如下：

```java
final class LoadTimeAgent$$Lambda$1 implements BiFunction {
    private LoadTimeAgent$$Lambda$1() {
    }

    public Object apply(Object var1, Object var2) {
        return LoadTimeAgent.lambda$premain$0((Integer)var1, (Integer)var2);
    }
}
```

```text
-Djdk.internal.lambda.dumpProxyClasses=<dir>
```

```text
-Djdk.internal.lambda.dumpProxyClasses=./dump
```

## Reference

- [Transforming lambdas in Java 8](https://stackoverflow.com/questions/34162074/transforming-lambdas-in-java-8)
- [NoClassDefFound error in transforming lambdas](https://bugs.openjdk.java.net/browse/JDK-8145964)
- [ruediste/lambda-inspector](https://github.com/ruediste/lambda-inspector)
