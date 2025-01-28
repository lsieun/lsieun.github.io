---
title: "Marker Interface"
sequence: "101"
---


## Intro

**Marker interfaces** are a special kind of interfaces which have no methods or other nested constructs defined.

Though marker interfaces are still in use, they very likely point to a code smell and should be used carefully. The main reason for this is that they blur the lines about what an interface represents since markers don't define any behavior. Newer development favors annotations to solve some of the same problems.

## Marker interface

In Java language programming, interfaces with no methods are known as marker interfaces. Marker interfaces are `Serializable`, `Cloneable`, `SingleThreadModel`, `EventListener`. Marker Interfaces are implemented by the classes or their super classes in order to add some functionality.

e.g. Suppose you want to persist (save) the state of an object then you have to implement the `Serializable` interface, otherwise the compiler will throw an error.

Suppose the interface `Cloneable` is neither implemented by a class named `Myclass` nor it's any super class, then a call to the method `clone()` on `Myclass`'s object will give an error. This means, to add this functionality one should implement the `Cloneable` interface. While the `Cloneable` is an empty interface but it provides an important functionality.

Generally, they are used to give additional information about the behaviour of a class.It is just used to "mark" Java classes which support a certain capability.

Examples:

- `java.lang.Clonable`
- `java.io.Serializable`
- `java.util.RandomAccess`
- `java.util.EventListner`
- `javax.ejb.EnterpriseBean`
- `java.rmi.Remote`
- `javax.servlet.SingleThreadModel`

## JDK Marker Interfaces

Java has many built-in marker interfaces, such as `Serializable`, `Cloneable`, and `Remote`.

### Cloneable

Here is how it is the `Cloneable` interface defined in the Java library:<sub>第一步：说明是如何定义的</sub>

```java
public interface Cloneable {
}
```

**Marker interfaces** are not contracts **per se** but somewhat **useful technique to “attach” or “tie” some particular trait to the class**. For example, with respect to `Cloneable`, the class is marked as being available for cloning however the way it should or could be done is not a part of the interface.<sub>第二步：指明“要做什么”，而并不指定“要怎么做”</sub>

> 注解：  
> per se 的意思是“本身；本质上”  
> 要理解“Marker interfaces are not contracts per se”这句话，可以参考下面这段话：  
> In object-oriented programming, **the concept of interfaces** forms the basics of **contract-driven** (or contract-based) development. **In a nutshell**( 简言之；简而言之；总而言之 ), interfaces define the set of methods (contract) and every class which claims to support this particular interface must provide the implementation of those methods: a pretty simple, but powerful idea.

If we try to clone an object that doesn't implement this interface, the JVM throws a `CloneNotSupportedException`. Hence, the `Cloneable` marker interface is an indicator to the JVM that we can call the `Object.clone()` method.<sub>第三步：在使用的时候，可能会出错</sub>

### Serializable

Another very well-known and widely used example of marker interface is `Serializable`:<sub>第一步：说明是如何定义的</sub>

```java
public interface Serializable {
}
```

This interface marks the class as being available for serialization and deserialization, and again, it does not specify the way it could or should be done.<sub>第二步：指明“要做什么”，而并不指定“要怎么做”</sub>

> Serializable 接口，只是标明了 class 可以进行 serialization 和 deserialization 的能力；  
> 但是，并没有指明进行 serialization 和 deserialization 的方式。  
> 哈哈，我联想到一个类比：条条大路通罗马，却不管你是走路，还是坐车，只要到达就好。  
> 2018-12-18  
> 我此刻理解如下：  
> interface 分为三个层次：  
> 第 1 层，抽象层，赋予能力，就像 marker interface 一样；  
> 第 2 层，Standard 层，指定有哪些方法要进行实现；  
> 第 3 层，实现层，每个不同的 subclass 有自己的实现方法。

In the same way, when calling the `ObjectOutputStream.writeObject()` method, the JVM checks if the object implements the `Serializable` marker interface. When it's not the case, a `NotSerializableException` is thrown. Therefore, the object isn't serialized to the output stream.<sub>第三步：在使用的时候，可能会出错</sub>

The marker interfaces have their place in object-oriented design, although they do not satisfy the main purpose of interface to be a contract.

> 这段话说明两点：  
> （1） marker interface 自有其存在的价值；  
> （2）但是，marker interface 并不是一个 contract。

## Marker Interfaces vs. Annotations

By introducing **annotations**, Java has provided us with an alternative to achieve the same results as the **marker interfaces**. Moreover, like marker interfaces, we can apply annotations to any class, and we can use them as indicators to perform certain actions.

这段注释：

- （1） 作为 Marker Interface，`Cloneable` 是在 `Java 1`（1996 年）中添加的，而 `Serializable` 是在 `Java 1.1`（1997 年）中添加的
- （2） Annotations 是在 `Java 5`（2004 年）添加的
- （3） 从时间发展顺序上来说，Annotations 比 Marker Interface 来的要晚，可能在解决特定的问题上有优势。要说“有什么决定性的优势”，这个我倒是没有理解出来。

So what is the key difference?

Unlike annotations, interfaces allow us to take advantage of polymorphism. As a result, we can add additional restrictions to the marker interface.

For instance, let's add a restriction that only a Shape type can be removed from the database:

接下来，我没有整理，可能是因为我没有清楚的理解它，也可以是因为文章没有达到我的预期。

## Reference

- [Marker Interfaces in Java](https://www.baeldung.com/java-marker-interfaces)
