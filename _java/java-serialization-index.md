---
title: "Serialization"
sequence: "java-serialization"
---

```text
                     ┌─── stream ──────┼─── magic version contents
                     │
                     │                                          ┌─── object
                     │                 ┌─── content ────────────┤
                     ├─── contents ────┤                        └─── blockdata
                     │                 │
                     │                 └─── contents content
                     │
                     │                 ┌─── newObject ───────┼─── TC_OBJECT classDesc newHandle classdata[]  // data for each class
                     │                 │
                     │                 ├─── newClass ────────┼─── TC_CLASS classDesc newHandle
                     │                 │
                     │                 ├─── newArray ────────┼─── TC_ARRAY classDesc newHandle (int)<size> values[size]
                     │                 │
                     │                 │                     ┌─── TC_STRING newHandle (utf)
                     │                 ├─── newString ───────┤
Serialized stream ───┤                 │                     └─── TC_LONGSTRING newHandle (long-utf)
                     │                 │
                     │                 ├─── newEnum ─────────┼─── TC_ENUM classDesc newHandle enumConstantName
                     ├─── object ──────┤
                     │                 │                     ┌─── TC_CLASSDESC className serialVersionUID newHandle classDescInfo
                     │                 ├─── newClassDesc ────┤
                     │                 │                     └─── TC_PROXYCLASSDESC newHandle proxyClassDescInfo
                     │                 │
                     │                 ├─── prevObject ──────┼─── TC_REFERENCE (int)handle
                     │                 │
                     │                 ├─── nullReference ───┼─── TC_NULL
                     │                 │
                     │                 ├─── exception ───────┼─── TC_EXCEPTION reset (Throwable)object reset
                     │                 │
                     │                 └─── TC_RESET
                     │
                     │                 ┌─── blockdatashort ───┼─── TC_BLOCKDATA (unsigned byte)<size> (byte)[size]
                     └─── blockdata ───┤
                                       └─── blockdatalong ────┼─── TC_BLOCKDATALONG (int)<size> (byte)[size]
```

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/serialization/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

- The process of writing an object to a series of bytes is **serialization**.
- The process of reading those bytes back into object form is **deserialization**.

Serialization makes the transfer of data between Java and the outside world possible.

> JVM 是一个进程，它将内部的数据转换成 `byte[]` 内容之后，才能与外界进行交互。

serialization is not about classes but their state.

> 这句话对吗？

**static fields belong to a class (as opposed to an object) and are not serialized.**

> 静态字段，不参与 serialization

we can use the keyword transient to ignore class fields during serialization

> 非静态字段，可以使用 transient 修饰符来脱离 serialization

一个对象（object）可以进行 serialization 的条件是什么：

- 它的 class 要实现 `Serializable`

## Reference

- [Java Object Serialization Specification](https://docs.oracle.com/javase/8/docs/platform/serialization/spec/serialTOC.html)
- [The Java serialization algorithm revealed](https://www.infoworld.com/article/2072752/the-java-serialization-algorithm-revealed.html)
- [Understanding Java De-serialization](https://swapneildash.medium.com/understanding-java-de-serialization-ee96054da15d)
- [Understanding Java deserialization](https://nytrosecurity.com/2018/05/30/understanding-java-deserialization/)
- [Serializing Non-Serializable Lambdas](https://ruediste.github.io/java/kryo/2017/05/07/serializing-non-serializable-lambdas.html)
- [Serializable Java Lambdas](https://lankydan.dev/serializable-java-lambdas)
- [How to serialize a lambda?](https://stackoverflow.com/questions/22807912/how-to-serialize-a-lambda)
- [How does Java's serialization work and when it should be used instead of some other persistence technique?](https://stackoverflow.com/questions/352117/how-does-javas-serialization-work-and-when-it-should-be-used-instead-of-some-ot?noredirect=1&lq=1)

Baeldung

- [Introduction to Java Serialization](https://www.baeldung.com/java-serialization)
- [Guide to the Externalizable Interface in Java](https://www.baeldung.com/java-externalizable)
- [Serialization Validation in Java](https://www.baeldung.com/java-validate-serializable)
- [Different Serialization Approaches for Java](https://www.baeldung.com/java-serialization-approaches)
- [Guide to the @Serial Annotation in Java 14](https://www.baeldung.com/java-14-serial-annotation)
- [Deserialization Vulnerabilities in Java](https://www.baeldung.com/java-deserialization-vulnerabilities)

Github

- [eugenp/tutorials](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-serialization)

Stackoverflow

- [Java serialization: readObject() vs. readResolve()](https://stackoverflow.com/questions/1168348/java-serialization-readobject-vs-readresolve)

我觉得有价值，但现在还没有细看：

- [Java 反序列化漏洞之殇](http://www.javashuo.com/article/p-dxhmbqnd-cg.html)
- [JAVA 反序列化漏洞完整过程分析与调试](https://blog.csdn.net/a82514921/article/details/104629947/)
- [java 序列化 文件 _Java 原生序列化文件格式分析](https://blog.csdn.net/weixin_42371098/article/details/114589346)
- [Java 基础 (016)：序列化和反序列化](https://blog.51cto.com/u_15152252/2683354)
- [再来认识一下 Java 序列化](https://zhuanlan.zhihu.com/p/355308929)
- [Java 代码审计之浅谈 Java 反序列化漏洞修复方案](https://www.bilibili.com/read/cv15334266)
