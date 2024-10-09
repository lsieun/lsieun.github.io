---
title: "Limitation of Generics"
sequence: "109"
---

Being one of the brightest features of the language, **generics** unfortunately have some limitations,
mainly caused by the fact that they were introduced quite late into already mature language.
Most likely, more thorough implementation required significantly more time and resources
so the trade-offs had been made in order to have generics delivered in a timely manner.

> Generics 有自己的限制。

## 1. No Primitive Types

Firstly, **primitive types** (like `int`, `long`, `byte`, . . . ) are not allowed to be used in generics.
It means whenever you need to parameterize your generic type with a primitive one,
the respective class wrapper (`Integer`, `Long`, `Byte`, . . . ) has to be used instead.
Not only that, because of necessity to use class wrappers in generics,
it causes implicit boxing and unboxing of primitive values.

> 限制一：不能使用 primitive types。

```text
final List<Long> longs = new ArrayList<>();
longs.add(0L); // 'long' is boxed to 'Long'
long value = longs.get( 0 ); // 'Long' is unboxed to 'long'
```

## Type Erasure

Another one, more obscure, is **type erasure**.
It is important to know that **generics exist only at compile time**:
the Java compiler uses a complicated set of rules to enforce **type safety** with respect to generics and their type parameters usage,
however the produced JVM bytecode has all concrete types erased (and replaced with the `Object` class).

### Method Signature

It could come as a surprise first that the following code does not compile:

> 限制二：（1）在 compile 过程中，类型擦除后，可能导致两个看起来不同的方法有相同的签名

```text
void sort(Collection<String> strings) {
    // Some implementation over strings heres
}

void sort(Collection<Number> numbers) {
    // Some implementation over numbers here
}
```

From the developer's standpoint, it is a perfectly valid code, however because of type erasure,
those two methods are narrowed down to the same signature and it leads to compilation error
(with a weird message like “Erasure of method `sort(Collection<String>)` is the same as another method . . . ”)

### No Class

```java
public class HelloWorld {
    public <T> void test(Object obj) {
        Class<T> clazz = T.class; // error
        if (obj instanceof T) {   // error
            T t = (T) obj;        // non sense
        }
    }
}
```

### No Object

Another disadvantage caused by type erasure come from the fact that
**it is not possible to use generics' type parameters in any meaningful way**,

- (1) create new instances of the type
- (2) get the concrete class of the type parameter or use it in the `instanceof` operator. The examples shown below do no pass compilation phase:

```java
public class HelloWorld {
    public <T> void test() {
        T t = new T(); // error
    }
}
```

限制二：（2）在 runtime 过程中，经过类型擦除后，type parameters 有一些事情是做不了的：

- （1） 根据 type parameters 不能创建对象 create new instances of the type
- （2） 获得 type parameters 的真正类型  get the concrete class of the type parameter。换句话说，就是不能使用 `instanceof` 来验证 type parameters 的真正类型

### No Array

And lastly, it is also not possible to create the array instances using generics' type parameters.
For example, the following code does not compile (this time with a clean error message “Cannot create a generic array of T”):

> 限制三：不能创建数组

```java
public class HelloWorld {
    public <T> void test() {
        T[] array = new T[1];
    }
}
```

### 2.5. No Throwable

Another effect of **type erasure** is that a generic class cannot extend the `Throwable` class in any way, directly or indirectly:

正确：

```java
public class HelloWorld<T> extends Object {
}
```

错误：

```java
// Generic class may not extend 'java.lang.Throwable'
public class GenericException<T> extends Exception {
}
```

The reason why this is not supported is due to **type erasure**:

```java
public class HelloWorld {
    public void test() {
        try {
            throw new GenericException<Integer>();
        }
        catch(GenericException<Integer> e1) {
            System.err.println("Integer");
        }
        catch(GenericException<String> e2) { // Exception 'sample.GenericException' has already been caught
            System.err.println("String");
        }
    }
}
```

Due to type erasure, the runtime will not know which catch block to execute, so this is prohibited by the compiler.

## 3. Accessing generic type parameters

As you already know from the section Limitation of generics,
it is not possible to **get the class of the generic type parameter**.

One simple trick to work-around that is to require additional argument to be passed,
`Class<T>`, in places where it is necessary to know the class of the type parameter `T`. For example:

```java
public class HelloWorld {
    public <T> void test(T instance, Class<T> clazz) {
        // Some implementation here
    }
}
```

It might blow the amount of arguments required by the methods but with careful design it is not as bad as it looks at the first glance.

Another interesting use case which often comes up while working with generics in Java is to **determine the concrete class of the type**
which generic instance has been parameterized with.
It is not as straightforward and requires **Java reflection API** to be involved.
The `ParameterizedType` instance is the central point to do the **reflection** over **generics**.

## 4. When to use generics

However, please be aware of the limitations of the current implementation of generics in Java,
**type erasure** and **the famous implicit boxing and unboxing for primitive types**.

**Generics are not a silver bullet solving all the problems you may encounter** and **nothing could replace careful design and thoughtful thinking**.
