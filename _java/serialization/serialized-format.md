---
title: "The serialized format of an object"
sequence: "102"
---

关于 Serializable 的使用，有几点需要说明：

- 1 Serializable 只是一个接口，本身没有任何实现
- 2 对象的反序列化并没有调用对象的任何构造方法
- 3 `serialVersionUID` 是用于记录文件版本信息的，最好能够自定义。
    否则，系统会自动生成一个 `serialVersionUID`，文件或者对象的任何改变，都会改变 `serialVersionUID`，导致反序列化的失败，如果自定义就没有这个问题。
- 4 如果某个属性不想实现序列化，可以采用 `transient` 修饰
- 5 `Serializable` 的系统实现是采用 `ObjectInputStream` 和 `ObjectOutputStream` 实现的，
    这也是为什么调用 `ObjectInputStream` 和 `ObjectOutputStream` 时，需要对应的类实现 `Serializable` 接口。

