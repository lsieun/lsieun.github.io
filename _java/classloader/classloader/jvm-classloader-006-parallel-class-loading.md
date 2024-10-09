---
title: "Parallel Class loading"
sequence: "106"
---


- JDK7 made an important enhancement to Multi-threading custom class loader.
- Previously, certain class loader were prone to **deadlock**.
- JDK7 modifies the lock mechanism.
- Previously as well, it was not an issue which adhere the acyclic delegation model.

- `protected static boolean registerAsParallelCapable()`

```java
public abstract class ClassLoader {
    @CallerSensitive
    protected static boolean registerAsParallelCapable() {
        Class<? extends ClassLoader> callerClass =
                Reflection.getCallerClass().asSubclass(ClassLoader.class);
        return ParallelLoaders.register(callerClass);
    }
}
```

- [ ] 在 SkyWalking 中当中提到了 classloader dead lock，不明白是指什么情况。 `ClassLoader.registerAsParallelCapable()`

## Deadlock Scenario

Class Hierarchy:

- class A extends B
- class C extends D

ClassLoader Delegation Hierarchy:

- Custom Classloader `CL1`:
  - directly loads class `A`
  - delegates to custom ClassLoader `CL2` for class `B`
- Custom Classloader `CL2`:
  - directly loads class `C`
  - delegates to custom ClassLoader `CL1` for class `D`

- Thread 1:
  - Use `CL1` to load class `A` (locks `CL1`)
    - defineClass `A` triggers
      - loadClass `B` (try to lock `CL2`)
- Thread 2:
  - Use `CL2` to load class `C` (locks CL2)
    - defineClass `C` triggers
      - loadClass `D` (try to lock `CL1`)

## JDK7 - Resolution

Class Hierarchy:

- class A extends B
- class C extends D

ClassLoader Delegation Hierarchy:

- Custom Classloader CL1:
  - directly loads class A  
  - delegates to custom ClassLoader CL2 for class B
- Custom Classloader CL2:
  - directly loads class C
  - delegates to custom ClassLoader CL1 for class D

- Thread 1:
  - `<if parallel capable>`
  - Use CL1 to load class A (locks CL1 + A)
    - defineClass A triggers
      - loadClass B (try to lock CL2 + B)
- Thread 2:
  - `<if parallel capable>`
  - Use CL2 to load class C (locks CL2 + C)
    - defineClass C triggers
      - loadClass D (try to lock CL1 + D)

## Reference

- [Class Loader API Modifications for Deadlock Fix](https://openjdk.java.net/groups/core-libs/ClassLoaderProposal.html)
- [Multithreaded Custom Class Loaders in Java SE 7](https://docs.oracle.com/javase/7/docs/technotes/guides/lang/cl-mt.html)
- [Deadlocks in Java class initialisation](https://www.farside.org.uk/201510/deadlocks_in_java_class_initialisation)
