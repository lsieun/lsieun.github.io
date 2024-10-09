---
title: "Annotation Restrictions"
sequence: "105"
---

An annotation type is a special type of interface with some restrictions.

## Restriction #1

**An annotation type cannot inherit from another annotation type.**
That is, you cannot use the `extends` clause in an annotation type declaration.

```text
// Won't compile
public @interface WrongVersion extends BasicVersion {
    int extended();
}
```

Every annotation type implicitly inherits from the `java.lang.annotation.Annotation` interface.

```java
package java.lang.annotation;
public interface Annotation {
    boolean equals(Object obj);
    int hashCode();
    String toString();
    Class<? extends Annotation> annotationType();
}
```

This implies that all the four methods declared in the `Annotation` interface
are available in all annotation types.

```java
public @interface Version {
    int major();
    int minor();
}
```

You declare **elements** for an annotation type using **abstract method declarations**.
the methods declared in the `Annotation` interface **do not declare elements** in an annotation type.
Your `Version` annotation type has only two elements, `major` and `minor`, which are declared in the `Version` type itself.
You cannot use the annotation type `Version` as `@Version(major=1, minor=2, toString="Hello")`.
The `Version` annotation type does not declare `toString` as an **element**.
It inherits the `toString()` method from the `Annotation` interface.

```java
package java.lang.annotation;
public interface Annotation {
    boolean equals(Object obj);
    int hashCode();
    String toString();
    Class<? extends Annotation> annotationType();
}
```

The first three methods in the `Annotation` interface are the methods from the `Object` class.
The `annotationType()` method returns the class reference of the annotation type to which the annotation instance belongs.
**The Java creates a proxy class dynamically at runtime, which implements the annotation type.**
When you obtain an instance of an annotation type,
that instance class is the dynamically generated proxy class,
whose reference you can get using the `getClass()` method on the annotation instance.
If you get an instance of the `Version` annotation type at runtime,
its `getClass()` method will return the class reference of the dynamically generated proxy class,
whereas its `annotationType()` method will return the class reference of the `Version` annotation type.

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

```java
public class HelloWorld {
}
```

```java
import java.lang.annotation.Annotation;
import java.util.Arrays;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = HelloWorld.class;
        Annotation[] annotations = clazz.getAnnotations();
        System.out.println("Length: " + annotations.length);
        for (Annotation annotation : annotations) {
            Class<?> implClass = annotation.getClass();
            Class<?> superclass = implClass.getSuperclass();
            Class<?>[] interfaces = implClass.getInterfaces();
            System.out.println("Current Class: " + implClass);
            System.out.println("Super   Class: " + superclass);
            System.out.println("Interfaces   : " + Arrays.toString(interfaces));

            System.out.println("annotationType(): " + annotation.annotationType());
            System.out.println("========= ========= =========");
        }
    }
}
```

```text
Length: 1
Current Class: class com.sun.proxy.$Proxy1
Super   Class: class java.lang.reflect.Proxy
Interfaces   : [interface sample.MyTag]
annotationType(): interface sample.MyTag
```

## Restriction #2

**Method declarations in an annotation type cannot specify any parameters.**

```text
// Won't compile
public @interface WrongVersion {
    // Cannot have parameters
    String concatenate(int major, int minor);
}
```

For an annotation, the Java runtime creates a proxy class that implements the annotation type (which is an interface).
Each annotation instance is an object of that proxy class.
The method you declare in your annotation type becomes the getter method for the value of that element you specify in the annotation.

The Java runtime will take care of setting the specified value for the annotation elements.
Since the goal of declaring a method in an annotation type is to work with a data element,
you do not need to (and are not allowed to) specify any parameters in a method declaration.

## Restriction #3

**Method declarations in an annotation type cannot have a `throws` clause.**

```text
// Won't compile
public @interface WrongVersion {
    int major() throws Exception; // Cannot have a throws clause
    int minor(); // OK
}
```

## Restriction #4

The return type of a method declared in an annotation type must be one of the following types:

- Any primitive type: `byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, and `char`
- `java.lang.String`
- `java.lang.Class`
- An enum type
- An annotation type
- An array of the previously mentioned types, for example, `String[]`, `int[]`, etc. **The return type cannot be a nested array**.
  For example, you cannot have a return type of `String[][]` or `int[][]`.

The return type of `Class` needs a little explanation.
Instead of the `Class` type, you can use **a generic return type** that will return a user-defined class type.

```text
public @interface GoodOne {
    Class element1();                 // <- Any Class type
    Class<Test> element2();           // <- Only Test class type
    Class<? extends Test> element3(); // <- Test or its subclass type
}
```

## Restriction #5

An annotation type cannot declare a method,
which would be equivalent to overriding a method in the `Object` class or the `Annotation` interface.

## Restriction #6

An annotation type cannot be generic.

## Limitations

There are a couple of limitations which in certain use cases make working with annotations not very convenient.
Firstly, annotations do not support any kind of inheritance: one annotation cannot extend another annotation.
Secondly, it is not possible to create an instance of annotation programmatically using the `new` operator.
And thirdly, annotations can declare only attributes of **primitive types**, `String` or `Class<?>` types and **arrays of those**.
No methods or constructors are allowed to be declared in the annotations.

这里说了 annotation 的三个限制：

- （1） 不能继承
- （2） 不能使用 new 创建实例 （但是，可以变通一下）
- （3） 只能定义 attributes，而不能定义 methods 和构造 constructors。


```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

```java
import java.lang.annotation.Annotation;

public class HelloWorld {
    public static void main(String[] args) {
        MyTag tag = new MyTag() {

            @Override
            public Class<? extends Annotation> annotationType() {
                return MyTag.class;
            }
        };

        System.out.println(tag);
    }
}
```

```text
sample.HelloWorld$1@4f3f5b24
```
