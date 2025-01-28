---
title: "Method"
sequence: "139"
---

## Get Generic Method

**Generic methods** are retrieved like **non-generic methods**:  the `getMethod()` method of class `Class` is invoked providing a description of **the method's type signature**, that is, **the name of the method** and **the raw types of the parameter types**.<sub>在对 Generic Method 进行 Reflection 时，和普通的方法的获取方式是一样的，需要提供“方法名”和“参数类型”</sub> What we supply is a description of the **method's type erasure**<sub>所不同的一点是：“参数类型”是经过 Type Erasure 之后的类型</sub>; we need not specify in any way, that the method is a generic method.

As an example let us retrieve the representation of the generic `toArray()` method of interface `Collection`.  It is declared as:

```java
interface Collection<E> {
  ...
  <T> T[]  toArray(T[] a) { ... }
}
```

Example (of retrieving the representation of a generic method):

```java
Method method = Collection.class.getMethod("toArray", Object[].class );
System.out.println("METHOD: "+method.toGenericString());
```

```txt
METHOD: public abstract <T> T[] java.util.Collection.toArray(T[])
```

Note, that we did not mention whether we are looking for a generic or a non-generic method. We just supplied the method name "toArray" and specified its parameter type as `Object[]`, which is the type erasure of the declared parameter type `T[]`.

Note, that there is some minor potential for confusion regarding the method description that is delivered by the resulting `Method` object. In the example above, we retrieved the method description using the `toGenericString()` method of class `Method`.

```java
System.out.println("METHOD: "+method.toGenericString() );
```

```txt
METHOD: public abstract <T> T[] java.util.Collection.toArray(T[])
```

It describes the generic method's signature including information regarding its type parameter `T`. Had we used the `toString()` method instead, the resulting method description had described the type erasure of the method.

```java
System.out.println("METHOD: "+method. toString() );
```

```txt
METHOD: public abstract java.lang.Object[] java.util.Collection.toArray(java.lang.Object[])
```

The confusing element here is the fact that `toString()` does not deliver a description of the method as it is declared, but of its **type erasure**.
