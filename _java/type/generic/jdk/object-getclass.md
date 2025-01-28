---
title: "Object.getClass"
sequence: "133"
---

这里主要学习的地方在于：

- 对于 `Object` 类型的对象，调用 `getClass()` 方法，返回的类型是 `Class<?>`
- 对于其他对象（`X` 类型），调用 `getClass()` 方法，返回的类型是 `Class<? extends X>`

## Class: `java.lang.Object`

```java
public void test_Object(Object obj) {
    Class<?> clazz = obj.getClass();
}
```

## Class: Other

The result of the `getClass` method is of type `Class<? extends X>`.

```java
public void test_Number(Number num) {
    Class<?> clazz1 = num.getClass(); // fine
    Class<? extends Number> clazz = num.getClass(); // fine
    Class<Number> clazz = num.getClass(); // error
}
```

In our example the static type of the expression on which `getClass` is called is `Number`. Hence the return value is of type `Class<capture of ? extends Number>`. A variable of type `Class<capture of ? extends Number>` can refer to a `Class<Number>`, a `Class<Long>`, a `Class<Integer>`, etc.   There's no guarantee that is actually refers to a `Class<Number>`.
