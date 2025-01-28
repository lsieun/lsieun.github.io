---
title: "Serialize a Lambda in Java"
sequence: "102"
---

## TODO

- SerializedLambda要整理
- writeReplace要整理
- 对lambda进行serialization的必要性在哪里呢？
- David提示有许多Lambda文章，我看看是否能够关联上
- [BAEL-5145](https://jira.baeldung.com/browse/BAEL-5145) 之前，有人做过这个主题，他写了文章和代码，我要看一下
- 

## Google Search

- [x] [How and Why to Serialize Lambdas](https://dzone.com/articles/how-and-why-to-serialialize-lambdas)，前半段看了，后半段没有看太懂
- [Java lambda expressions, how and why to serialize them?](https://sudonull.com/post/96174-Java-lambda-expressions-how-and-why-to-serialize-them)

- [On Lambdas, Anonymous Classes and Serialization in Java](https://levelup.gitconnected.com/on-lambdas-anonymous-classes-and-serialization-in-java-72173e345492)



## Oracle

- [Class SerializedLambda](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/SerializedLambda.html)

Casts can be used to explicitly "tag" a **lambda expression** or a **method reference** expression with a particular **target type**.
To provide an appropriate degree of flexibility,
the **target type** may be a list of types denoting an **intersection type**, provided the intersection induces a **functional interface**.

- 一个类要进行Serializable，要保证它的类型和字段都可以；一个lambda要进行serialize，要保证它的Target type和captureing arguments is serializable.

## Third Party

- [ ] Kryo如何序列化Lambda
