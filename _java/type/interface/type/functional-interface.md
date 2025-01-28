---
title: "Functional Interfaces"
sequence: "105"
---


With **the release of Java 8**, interfaces have obtained new very interesting capabilities: **static methods**, **default methods** and **automatic conversion from lambdas (functional interfaces)**.

## functional interfaces

The **functional interfaces** are a different story and they are proven to be very helpful add-on to the language. Basically, the
**functional interface** is **the interface with just a single abstract method** declared in it.

The `Runnable` interface from Java standard library is a good example of this concept:

```java
@FunctionalInterface
public interface Runnable {
    void run();
}
```

The Java compiler treats functional interfaces differently and is able to convert **the lambda function** into the functional interface implementation where it makes sense. Let us take a look on following function definition:

```text
public void runMe(final Runnable r) {
    r.run();
}
```

To invoke this function in Java 7 and below, the implementation of the `Runnable` interface should be provided (for example
using Anonymous classes), but in Java 8 it is enough to pass `run()` method implementation using lambda syntax:

```text
runMe( () -> System.out.println( "Run!" ) );
```

Additionally, the `@FunctionalInterface` annotation hints **the compiler** to **verify that the interface contains only one abstract method** so any changes introduced to the interface in the future will not break this assumption.

```java
package lsieun.advanced.design;

public class FunctionalInterfaceExample {
    public void runMe(final Runnable r) {
        r.run();
    }

    public static void main(String[] args) {
        FunctionalInterfaceExample instance = new FunctionalInterfaceExample();
        instance.runMe(new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous Class");
            }
        });

        instance.runMe(() -> System.out.println("Lambda expression"));
    }
}
```
