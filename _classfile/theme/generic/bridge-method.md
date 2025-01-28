---
title: "bounded wildcards example"
sequence: "115"
---

## What is a bridge method?

A synthetic method that the compiler generates in the course of type erasure.
It is sometimes needed when a type `extends` or `implements` a parameterized class or interface.

The compiler insert bridge methods in subtypes of parameterized supertypes to ensure that subtyping works as expected.

### 1.1. How to generate bridge method

Example (before type erasure):

```java
public class HelloWorld implements Comparable<HelloWorld> {
    private final int value;

    public HelloWorld(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    @Override
    public int compareTo(HelloWorld that) {
        return this.value - that.value;
    }
}
```

In the example, class `NumericValue` implements interface `Comparable<NumericValue>` and must therefore override the
superinterface's `compareTo` method.
The method takes a `NumericValue` as an argument.
In the process of type erasure,
the compiler translates the parameterized `Comparable<A>` interface to its type erased counterpart `Comparable`.
The type erasure changes the signature of the interface's `compareTo` method.
After type erasure the method takes an `Object` as an argument.

Example (after type erasure):

```java
interface Comparable {
    public int compareTo(Object that); // 注意：这里的参数变成了 Object 类型
}

final class NumericValue implements Comparable {
    private byte value;

    public NumericValue(byte value) {
        this.value = value;
    }

    public byte getValue() {
        return value;
    }

    public int compareTo(NumericValue that) {
        return this.value - that.value;
    }

    public int compareTo(Object that) {
        return this.compareTo((NumericValue) that);
    } // 注意：这是 Compile 自动添加的 bridge method
}
```

After this translation, method `NumericValue.compareTo(NumericValue)` is no longer an implementation of the interface's `compareTo` method.
The type erased `Comparable` interface requires a `compareTo` method with argument type `Object`, not `NumericValue`.
This is a side effect of type erasure:
the two methods (in the interface and the implementing class) have identical signatures
before type erasure and different signatures after type erasure.

In order to achieve that class `NumericValue` remains a class that correctly implements the `Comparable` interface,
the compiler adds a bridge method to the class.
The bridge method has the same signature as the interface's method after type erasure,
because that's the method that must be implemented.
The bridge method delegates to the orignal methods in the implementing class.

### How to invoke bridge method

The existence of the bridge method does not mean that
objects of arbitrary types can be passed as arguments to the `compareTo` method in `NumericValue`.
The bridge method is an implementation detail and the compiler makes sure that
it normally cannot be invoked.

Example (illegal attempt to invoke bridge method):

```text
NumericValue value=new NumericValue((byte)0);
value.compareTo(value);  // fine
value.compareTo("abc");  // error
```

The compiler does not invoke the bridge method
when an object of a type other than `NumericValue` is passed to the `compareTo` method.
Instead it rejects the call with an error message,
saying that the `compareTo` method expects a `NumericValue` as an argument and other types of arguments are not permitted.

You can, however, invoke the synthetic bridge message using reflection.
But, if you provide an argument of a type other than `NumericValue`,
the method will fail with a `ClassCastException` thanks of the cast in the implementation of the bridge method.

Example (failed attempt to invoke bridge method via reflection):

```text
int reflectiveCompareTo(NumericValue value,Object other)
throws NoSuchMethodException,IllegalAccessException,InvocationTargetException
{
    Method meth=NumericValue.class.getMethod("compareTo",new Class[]{Object.class});
    return(Integer)meth.invoke(value,new Object[]{other});
}

NumericValue value=new NumericValue((byte)0);
reflectiveCompareTo(value,value);  // fine
reflectiveCompareTo(value,"abc");   // ClassCastException
```

The cast to type `NumericValue` in the bridge method fails with a `ClassCastException` when an argument of a type other
than `NumericValue` is passed to the bridge method.
This was it is guaranteed that a bridge method, even when it is called, will fail for unexpected argument types.

## Under which circumstances is a bridge method generated?

When a type `extends` or `implements` a parameterized class or interface
and **type erasure** changes the signature of any inherited method.

**Bridge methods** are necessary
when a class `implements` **a parameterized interface** or `extends` **a parameterized superclass** and
**type ersure** changes the argument type of any of the inherited non-static methods.

### Type erasure changes the signature of the superclass's methods

Below is an example of a class that extends a parameterized superclass.

Example (before type erasure):

```java
class Superclass<T extends Bound> {
    public void m1(T arg) { ...}

    public T m2() { ...}
}

class Subclass extends Superclass<SubTypeOfBound> {
    public void m1(SubTypeOfBound arg) { ...}

    public SubTypeOfBound m 2()

    { ...}
}
```

Example (after type erasure):

```java
class Superclass {
    void m1(Bound arg) { ...}

    Bound m2() { ...}
}

class Subclass extends Superclass {
    public void m1(SubTypeOfBound arg) { ...}

    public void m1(Bound arg) {
        m1((SubTypeOfBound) arg);
    }

    public SubTypeOfBound m2() { ...}

    public Bound m2() {
        return m2();
    }
}
```

Type erasure changes the signature of the superclass's methods.
The subclass's methods are no longer overriding versions of the superclass's method after type erasure. In order to make overriding work the compiler adds bridge methods.

The compiler must add bridge methods even if the subclass does not override the inherited methods.

Example (before type erasure):

```java
class Superclass<T extends Bound> {
    public void m1(T arg) { ...}

    public T m2() { ...}
}

class AnotherSubclass extends Superclass<SubTypeOfBound> {
}
```

Example (after type erasure):

```java
class Superclass {
    void m1(Bound arg) { ...}

    Bound m2() { ...}
}

// 问题：我查看 byte code 的时候，并没有发现下面两个方法
class AnotherSubclass extends Superclass {
    public void m1(Bound arg) {
        super.m1((SubTypeOfBound) arg);
    }

    public Bound m2() {
        return super.m2();
    }
}
```

The subclass is derived from a particular instantiation of the superclass and therefore inherits the methods with a
particular signature. After type erasure the signature of the superclass's methods are different from the signatures
that the subclass is supposed to have inherited. The compiler adds bridge methods, so that the subclass has the expected
inherited methods.

### No bridge method

No bridge method is needed
when type erasure does not change the signature of any of the methods of the parameterized supertype.
Also, no bridge method is needed
if the signatures of methods in the sub- and supertype change in the same way.
This can occur when the subtype is generic itself.

Example (before type erasure):

```java
interface Callable<V> {
    public V call();
}

class Task<T> implements Callable<T> {
    public T call() { ...}
}
```

Example (after type erasure):

```java
interface Callable {
    public Object call();
}

class Task implements Callable {
    public Object call() { ...}
}
```

The return type of the `call` method changes during type erasure in the interface and the implementing class. After type
erasure the two methods have the same signature so that the subclass's method implements the interface's method without
a brdige method.

However, it does not suffice that the subclass is generic. The key is that the method signatures must not match after
type erasure. Otherwise, we again need a bridge method.

Example (before type erasure):

```java
interface Copyable<V> extends Cloneable {
    public V copy();
}

class Triple<T extends Copyable<T>> implements Copyable<Triple<T>> {
    public Triple<T> copy() { ...}
}
```

Example (after type erasure):

```java
interface Copyable extends Cloneable {
    public Object copy();
}

class Triple implements Copyable {
    public Triple copy() { ...}

    public Object copy() {
        return copy();
    }
}
```

The method signatures change to `Object copy()` in the interface and `Triple copy()` in the subclass.
As a result, the compiler adds a bridge method.

## 3. Reference

- [Under The Hood Of The Compiler](http://www.angelikalanger.com/GenericsFAQ/FAQSections/TechnicalDetails.html)

