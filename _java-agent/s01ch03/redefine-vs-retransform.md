---
title: "redefine VS. retransform"
sequence: "136"
---

[UP]({% link _java-agent/java-agent-01.md %})

redefine 和 retransform 的共同点之处：两者都是对已经加载的类（already loaded classes）进行修改。

## 时间不同

在 `Instrumentation` 类版本演进的过程中，先有 redefine，后有 retransform。

在 Java 1.5 的时候（2004.09），retransform 的概念还没有出现：

```java
public interface Instrumentation {
    // Since 1.5
    boolean isRedefineClassesSupported();
    // Since 1.5
    void addTransformer(ClassFileTransformer transformer);
    // Since 1.5
    void redefineClasses(ClassDefinition... definitions) throws ClassNotFoundException, UnmodifiableClassException;
}
```

到 Java 1.6 的时候（2006.12），才有了 retransform 相关的内容：

```java
public interface Instrumentation {
    // Since 1.6
    boolean isRetransformClassesSupported();
    // Since 1.6
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
    // Since 1.6
    void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
}
```

## 处理方式不同：替换和修改

- redefine 是进行“替换”
- retransform 是进行“修改”

The main difference seems to be that when we `redefine` a class, we supply a `byte[]` with the new definition out of the blue,
whereas when we `retransform`, we get a `byte[]` containing the current definition via the same API, and we return a modified `byte[]`.

Therefore, to `redefine`, we need to know more about the class.
With `retransform` you can do that more directly: just look at the bytecode given, modify it, and return it.

## 影响范围不同：transformer

redefine 操作会触发：

- retransformation incapable transformer
- retransformation capable transformer

retransform 操作会触发：

- retransformation capable transformer

![](/assets/images/java/agent/define-redefine-retransform.png)

## 总结

本文内容总结如下：

- 第一点，redefine 和 retransform 的共同之处：两者都是处理已经加载的类（already loaded classes）。
- 第二点，redefine 和 retransform 的不同之处：出现时间不同、处理方式不同、影响范围不同。

## References

- [StackOverflow: Difference between redefine and retransform in javaagent](https://stackoverflow.com/questions/19009583/difference-between-redefine-and-retransform-in-javaagent)

