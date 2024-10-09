---
title: "Bounded Wildcard"
sequence: "103"
---

A wildcard type is denoted by a question mark `<?>`.

There is a complicated list of rules as to what a wildcard generic type reference can do with the object.
However, there is a simple rule of thumb to remember.
**The purpose of using generics is to have compile-time type-safety.**
As long as the compiler is satisfied
that the operation will not produce any surprising results at runtime,
it allows the operation on the wildcard generic type reference.

```java
public class Wrapper<T> {
    private T ref;
    public Wrapper(T ref) {
        this.ref = ref;
    }
    public T get() {
        return ref;
    }
    public void set(T ref) {
        this.ref = ref;
    }
}
```

## Unbounded Wildcards

```java
public class HelloWorld {
    public void test() {
        // Wrapper of String type
        Wrapper<String> stringWrapper = new Wrapper<String>("Hi");

        // You can assign a Wrapper<String> to Wrapper<?> type
        Wrapper<?> wildCardWrapper = stringWrapper;
    }
}
```

### new

不能用于 new

```java
public class HelloWorld {
    public void test() {
        // 编译出错：Wildcard type '?' cannot be instantiated directly
        Wrapper<?> unknownWrapper = new Wrapper<?>("Hello");
    }
}
```

下面这样写是对的：

```java
public class HelloWorld {
    public void test() {
        Wrapper<?> unknownWrapper = new Wrapper<String>("Hello");
    }
}
```

### get

```java
public class HelloWorld {
    public void test() {
        Wrapper<?> unknownWrapper = new Wrapper<String>("Hello");

        // 编译错误
        String str = unknownWrapper.get();
    }
}
```

正确方式：

```java
public class HelloWorld {
    public void test() {
        Wrapper<?> unknownWrapper = new Wrapper<String>("Hello");
        Object obj = unknownWrapper.get();
    }
}
```

### set

```java
public class HelloWorld {
    public void test() {
        Wrapper<?> unknownWrapper = new Wrapper<String>("Hello");

        unknownWrapper.set("Hello");        // A compile-time error
        unknownWrapper.set(new Integer());  // A compile-time error
        unknownWrapper.set(new Object());   // A compile-time error
        unknownWrapper.set(null);           // OK
    }
}
```

A `null` is assignment compatible to any reference type in Java.

The compiler thought that no matter what type `T` would be in the `set(T ref)` method for the object
to which `unknownWrapper` reference variable is pointing to,
a `null` can always be safe to use.

```java
public class WrapperUtil {
    public static void printDetails(Wrapper<?> wrapper) {
        // Can assign get() return value to an Object
        Object value = wrapper.get();

        String className = null;
        if (value != null) {
            className = value.getClass().getName();
        }

        System.out.println("Class: " + className);
        System.out.println("Value: " + value);
    }
}
```

Using only a question mark as a parameter type (`<?>`) is known as **an unbounded wildcard**.
It places no bounds as to what type it can refer.

## Upper-Bounded Wildcards

You express the upper bound of a wildcard as

```text
<? extends T>
```

`T` is a type. `<? extends T>` means anything that is of type `T` or its subclass is acceptable.

```java
public class WrapperUtil {
    public static double sum(Wrapper<? extends Number> n1,
                             Wrapper<? extends Number> n2) {
        Number num1 = n1.get();
        Number num2 = n2.get();
        double sum = num1.doubleValue() + num2.doubleValue();
        return sum;
    }
    
    public static void printDetails(Wrapper<?> wrapper) {
        // Can assign get() return value to an Object
        Object value = wrapper.get();

        String className = null;
        if (value != null) {
            className = value.getClass().getName();
        }

        System.out.println("Class: " + className);
        System.out.println("Value: " + value);
    }
}
```

```java
public class HelloWorld {
    public void test() {
        Wrapper<Integer> intWrapper = new Wrapper<Integer>(new Integer(10));

        Wrapper<? extends Number> numberWrapper = intWrapper; // <- OK

        numberWrapper.set(new Integer(1220)); // <- A compile-time error
        numberWrapper.set(new Double(12.20)); // <- A compile-time error
    }
}
```

## Lower-Bounded Wildcards

The syntax for using a lower-bounded wildcard is `<? super T>`,
which means “anything that is a supertype of T.”

```java
public class WrapperUtil {
    public static <T> void copy(Wrapper<T> source, Wrapper<T> dest) {
        T value = source.get();
        dest.set(value);
    }
}
```

```java
public class HelloWorld {
    public void test() {
        Wrapper<Object> objectWrapper = new Wrapper<Object>(new Object());
        Wrapper<String> stringWrapper = new Wrapper<String>("Hello");

        // A compile-time error
        WrapperUtil.copy(stringWrapper, objectWrapper);
    }
}
```

```java
public class WrapperUtil {
    public static <T> void copy(Wrapper<T> source, Wrapper<? super T> dest){
        T value = source.get();
        dest.set(value);
    }
}
```

