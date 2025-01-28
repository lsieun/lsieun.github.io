---
title: "Annotation Element: Different Types"
sequence: "107"
---

Keep in mind that the supplied value for elements of an annotation must be **a compile-time constant expression**,
and you **cannot** use `null` as the value for any type of elements in an annotation.

## Primitive Types

The data type of an element in an annotation type could be any of the primitive data types:
`byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, and `char`.

```text
public @interface PrimitiveAnnTest {
    byte a();
    short b();
    int c();
    long d();
    float e();
    double f();
    boolean g();
    char h();
}
```

You can use an instance of the `PrimitiveAnnTest` type as

```text
@PrimitiveAnnTest(a=1, b=2, c=3, d=4, e=12.34F, f=1.89, g=true, h='Y')
```

## String Types

```text
public @interface Name {
    String first();
    String last();
}
```

```text
@Name(first="John", last="Jacobs")
public class NameTest {
    @Name(first="Wally", last="Inman")
    public void aMethod() {
        // More code goes here...
    }
}
```

## Class Types

The benefits of using the `Class` type as an element in an annotation type are not obvious.
Typically, it is used
where a tool/framework reads the annotations with elements of a class type and
performs some specialized processing on the element's value or generates code.

```text
public class DefaultException extends java.lang.Throwable {
    public DefaultException() {
    }
    public DefaultException(String msg) {
        super(msg);
    }
}
```

```text
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TestCase {
    Class<? extends Throwable> willThrow() default DefaultException.class;
}
```

The return type of the `willThrow` element is defined as the wildcard of the `Throwable` class,
so that the user will specify only the `Throwable` class or its subclasses as the element's value.

```text
import java.io.IOException;
public class PolicyTestCases {
    // Must throw IOException
    @TestCase(willThrow=IOException.class)
    public static void testCase1(){
        // Code goes here
    }
    // We are not expecting any exception
    @TestCase()
    public static void testCase2(){
        // Code goes here
    }
}
```

The `testCase1()` method specifies, using the `@TestCase` annotation, that it will throw an `IOException`.
The test runner tool will make sure that when it invokes this method,
the method does throw an `IOException`.
Otherwise, it will fail the test case.

The `testCase2()` method does not specify that it will throw an exception.
If it throws an exception when the test is run, the tool should fail this test case.

## Enum Type

An annotation can have elements of an enum type.

Suppose you want to declare an annotation type called `Review`
that can describe the code review status of a program element.
Let's assume that it has a `status` element and it can have one of the four values:
`PENDING`, `FAILED`, `PASSED`, and `PASSEDWITHCHANGES`.
You can declare an enum as an annotation type member.

```text
public @interface Review {
    ReviewStatus status() default ReviewStatus.PENDING;
    String comments() default "";

    // ReviewStatus enum is a member of the Review annotation type
    public enum ReviewStatus {PENDING, FAILED, PASSED, PASSEDWITHCHANGES};
}
```

The `Review` annotation type declares a `ReviewStatus` enum type,
and the four review statuses are the elements of the enum.
It has two elements, `status` and `comments`.
The type of the `status` element is the enum type `ReviewStatus`.
The default value for the `status` element is `ReviewStatus.PENDING`.
You have an empty string as the default value for the `comments` element.

```text
// Have default for status and comments. Maybe the code // is new.
@Review()

// Leave status as Pending, but add some comments
@Review(comments= "Have scheduled code review on December 1, 2017")

// Fail the review with comments
@Review(status=ReviewStatus.FAILED, comments="Need to handle errors")

// Pass the review without comments
@Review(status=ReviewStatus.PASSED)
```

## Annotation Type

An annotation type can be used anywhere a type can be used in a Java program.
For example, you can use an annotation type as the return type for a method.
You can also use an annotation type as the type of an element inside another annotation type's declaration.

Suppose you want to have a new annotation type called `Description`,
which will include the name of the `author`, `version`, and `comments` for a program element.
You can reuse your `Name` and `Version` annotation types as its `name` and `version` elements type.

```text
public @interface Description {
    Name name();
    Version version();
    String comments() default "";
}
```

```text
public @interface Name {
    String first();
    String last();
}
```

```text
public @interface Version {
    int major();
    int minor();
}
```

To provide a value for an element of an annotation type,
you need to use the syntax that creates an annotation type instance.

```text
@Description(name=@Name(first="John", last="Jacobs"),
    version=@Version(major=1, minor=2),
    comments="Just a test class")
public class Test {
    // Code goes here
}
```

## Array Type Annotation Element

An annotation can have elements of an array type.
The array type could be one of the following types:

- A primitive type
- `java.lang.String` type
- `java.lang.Class` type
- An enum type
- An annotation type

You need to specify the value for an array element inside braces.
Elements of the array are separated by a comma.

### String Array

Suppose you want to annotate your program elements with a short description of a list of things that you need to work
on.

```text
public @interface ToDo {
    String[] items();
}
```

```text
@ToDo(items={"Add readFile method", "Add error handling"})
public class Test {
    // Code goes here
}
```

If you have only one element in the array, you can omit the braces.

The following two annotation instances of the `ToDo` annotation type are equivalent:

```text
@ToDo(items={"Add error handling"})
@ToDo(items="Add error handling")
```

### empty array

If you **do not have valid values** to pass to an element of an array type,
you can use an empty array.
For example, `@ToDo(items={})` is a valid annotation
where the `items` element has been assigned an empty array.

## No Null Value in an Annotation

You **cannot** use a `null` reference as a value for an element in an annotation.
Note that it is allowed to use **an empty string** for the `String` type element and
an **empty array** for an array type element.

Using the following annotations will result in compile-time errors:

```text
@ToDo(items=null)
@Name(first=null, last="Jacobs")
```

