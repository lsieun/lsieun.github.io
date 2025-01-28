---
title: "Java Generic Concepts"
sequence: "102"
---

## Concept

- `List<E>` 是 Generic Type，其中 `E` 是 Type Parameter。
- `List<String>` 是 Parameterized Type，其中 `String` 是 Type Argument。

### Generic Type vs. Parameterized Type

A **generic type** is a type with **formal type parameters** (e.g. `List<E>`);
whereas **a parameterized type** is an instantiation of a **generic type** with actual **type arguments** (e.g., `List<String>`).

The [JLS](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.4) says:

- A **type variable** is an unqualified identifier used as a **type** in class, interface, method, and constructor bodies.
- A **type variable** is introduced by the declaration of a **type parameter** of a generic class, interface, method, or constructor.

```java
public class HelloWorld<T extends Number> { /* The TypeParameter that "introduces" T comes first */
    private T item; /* now T is a TypeVariable in this context */

    public void test() {
        /* the Integer inside the <> diamond is TypeArgument */
        HelloWorld<Integer> instance = new HelloWorld<>();
    }
}
```

做一个比喻。在《火影忍者》中鸣人有一个忍术叫“影分身之术”， 使用查克拉制造出有实体的分身，具有独立于施术者本体的意识和一定的抗击打能力，解除后分身的记忆和经验会回到本体。
Type Parameter 相当于“本体”，而 Type Variable 则相当于“分身”。

![影分身之术](/assets/images/manga/naruto/shadow-clone-technique.gif)

- Generic Type
  - Type Parameter
  - Type Variable
- Parameterized Type
  - Type Argument

对于 Type Parameter 和 Type Argument，还可以进行再详细的划分：

- Type Parameter (Generic Type)
  - Unbounded Type Parameters: `<T>`
  - Bounded Type Parameters
    - Upper Bounded Type Parameters: `<T extends TypeName>`
    - Lower Bounded Type Parameters: `<T super Class>`(not supported)
- Type Argument (Parameterized Type)
  - Concrete Type Argument
  - Wildcard
    - Unbounded Wildcard: `<?>`
    - Bounded Wildcard
      - Upper Bounded Wildcard: `<? extends T>`
      - Lower Bounded Wildcard: `<? super T>`

- generic
  - compile time: java code
  - runtime: bytecode

### Generic Class and Generic Interface

- Generic Type
  - Generic Class
  - Generic Interface

一个 Generic Class 示例：

```java
public class HelloWorld<T> {
}
```

一个 Generic Interface 示例：

```java
public interface HelloWorld<T> {
}
```

### Generic Methods

```java
public class HelloWorld {
    public static <E> void test(E val) {
        System.out.println(val);
    }
}
```



## Type Erasure

Generics are used for tighter type checks at compile time and to provide a generic programming.

- The java compiler is responsible for understanding Generics at compile time.
- The compiler is also responsible for throwing away this "understanding" of generic classes, in a process we call **type erasure**.
- All happens at compile time.

IMHO:

- 第一，在 JavaFile 中，它确实是支持泛型编程的。
- 第二，在编译的过程，Java Compiler 可以获取到 JavaFile 中包含的泛型相关的所有信息。在 Type Erasure 的过程中，它并不是将所有的泛型信息全部擦除，而是将一部分泛型信息存储到 Signature 属性中。

## Reference

- [Oracle-JLS: Chapter 4. Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html)
  - [4.6 Type Erasure](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.6)
  - [4.7 Reifiable Types](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.7)
- [Singapore NanYang Technological University: Java Generics](https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaGeneric.html)
- [Baeldung: Type Erasure in Java Explained](https://www.baeldung.com/java-type-erasure)


