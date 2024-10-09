---
title: "Generic Methods and Constructors"
sequence: "107"
---

## Generic Methods

You can define type parameters in a method declaration.
They are specified in angle brackets before the return type of the method.

> 语法

```java
public class Test<T> {
    public <V> void m1(Wrapper<V> a, Wrapper<V> b, T c) {
        // Do something
    }
}
```

The type that contains the generic method declaration does not have to be a generic type,
so you can have generic methods in a non-generic type.
It is also possible for a type and its methods to define different type parameters.

> 类和方法之间的关系

Type parameters defined for a generic type are not available in static methods of that type.
Therefore, if a static method needs to be generic, it must define its own type parameters.
If a method needs to be generic, define just that method as generic rather than defining the entire type as generic.

> 静态方法、尽量缩小泛型的有效范围

How do you specify the generic type for a method when you want to call the method?
Usually, you do not need to specify the actual type parameter when you call the method.
The compiler figures it out for you using the value you pass to the method.
However, if you ever need to pass the actual type parameter for the method's formal type parameter,
you must specify it in angle brackets (`<>`) between the dot and the method name in the method call, as shown:

```java
public class HelloWorld {
    public void test() {
        Test<String> t = new Test<String>();
        Wrapper<Integer> iw1 = new Wrapper<Integer>(new Integer(201));
        Wrapper<Integer> iw2 = new Wrapper<Integer>(new Integer(202));

        // Specify that Integer is the actual type for the type
        // parameter for m1()
        t.<Integer>m1(iw1, iw2, "hello");

        // Let the compiler figure out the actual type parameters
        // using types for iw1 and iw2
        t.m1(iw1, iw2, "hello"); // OK
    }
}
```

### Generic Static Method

You cannot refer to the type parameters of the containing class inside the static method.
A static method can refer only to its own declared type parameters.

```text
public static <T> void copy(Wrapper<T> source, Wrapper<? super T> dest) {
    T value = source.get();
    dest.set(value);
}
```

**The compiler will figure out the actual type parameter for a method whether the method is non-static or static.**
However, if you want to specify the actual type parameter for a static method call, you can do so as follows:

```text
WrapperUtil.<Integer>copy(iw1, iw2);
```

## Generic Constructors

The following snippet of code defines a type parameter `U` for the constructor of class `Test`.
It places a constraint that the constructor's type parameter `U` must be the same or
a subtype of the actual type of its class type parameter `T`:

```java
public class Test<T> {
    public <U extends T> Test(U k) {
        // Do something
    }
}
```

The compiler will figure out the actual type parameter passed to a constructor
by examining the arguments you pass to the constructor.
If you want to specify the actual type parameter value for the constructor,
you can specify it in **angle brackets**(`<>`) between the `new` operator and **the name of the constructor**,
as shown in the following snippet of code:

```java
public class HelloWorld {
    public void test() {
        // Specify the actual type parameter for the constructor as Double
        Test<Number> t1 = new <Double>Test<Number>(new Double(12.89));
        
        // Let the compiler figure out that we are using Integer
        // as the actual type parameter for the constructor
        Test<Number> t2 = new Test<Number>(new Integer(123));
    }
}
```

