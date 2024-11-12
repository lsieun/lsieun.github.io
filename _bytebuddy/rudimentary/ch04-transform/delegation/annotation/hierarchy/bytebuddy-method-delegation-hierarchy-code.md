---
title: "代码准备"
sequence: "100"
---

![](/assets/images/bytebuddy/uml/delegation/bytebuddy-method-delegation-sample-class-hierarchy.svg)

```java
public interface ITest {
    String test(String name, int age);
}
```

```java
public class Ancestor implements ITest {
    public void sayFromAncestor() {
        System.out.println("Ancestor");
    }

    @Override
    public String test(String name, int age) {
        return String.format("Ancestor: %s - %d", name, age);
    }
}
```

```java
public class GrandFather extends Ancestor {
    public void sayFromGrandFather() {
        System.out.println("GrandFather");
    }

    @Override
    public String test(String name, int age) {
        return String.format("GrandFather: %s - %d", name, age);
    }
}
```

```java
public class Father extends GrandFather {
    public void sayFromFather() {
        System.out.println("Father");
    }

    @Override
    public String test(String name, int age) {
        return String.format("Father: %s - %d", name, age);
    }
}
```

```java
public interface IAnimal extends ITest {
    default void sayFromAnimal() {
        System.out.println("Animal");
    }

    @Override
    default String test(String name, int age) {
        return String.format("Animal: %s - %d", name, age);
    }
}
```

```java
public interface IMammal extends IAnimal {
    default void sayFromMammal() {
        System.out.println("Mammal");
    }

    @Override
    default String test(String name, int age) {
        return String.format("Mammal: %s - %d", name, age);
    }
}
```

```java
public interface ICat extends IMammal {
    default void sayFromCat() {
        System.out.println("Cat");
    }

    @Override
    default String test(String name, int age) {
        return String.format("Cat: %s - %d", name, age);
    }
}
```

```java
public interface IDog extends IMammal {
    default void sayFromDog() {
        System.out.println("Dog");
    }

    @Override
    default String test(String name, int age) {
        return String.format("Dog: %s - %d", name, age);
    }
}
```

```java
public class HelloWorld extends Father implements ICat, IDog {
    public void sayFromHelloWorld() {
        System.out.println("HelloWorld");
    }

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test("Tom", 10);
        System.out.println(message);
    }
}
```
