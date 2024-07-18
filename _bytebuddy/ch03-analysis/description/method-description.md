---
title: "MethodDescription"
sequence: "150"
---

```text
                     ┌─── ForLoadedConstructor ───┼─── ForLoadedConstructor(Constructor<?> constructor)
                     │
MethodDescription ───┼─── ForLoadedMethod ────────┼─── ForLoadedMethod(Method method)
                     │
                     └─── Latent ─────────────────┼─── TypeInitializer ───┼─── TypeInitializer(TypeDescription typeDescription)
```

## Example

### Latent.TypeInitializer

```java
public class HelloWorld {
    static {
        System.out.println("Hello Type Initializer");
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import sample.HelloWorld;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        MethodDescription.Latent.TypeInitializer typeInitializer = new MethodDescription.Latent.TypeInitializer(typeDesc);
        DescriptionForMethod.print(typeInitializer);
    }
}
```

### Constructor

```java
public class HelloWorld {
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Constructor;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Constructor<?> constructor = HelloWorld.class.getDeclaredConstructor();

        MethodDescription methodDesc = new MethodDescription.ForLoadedConstructor(constructor);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### Default Method

```java
public interface HelloWorld {
    default void test(String name, int age) throws Exception {
        String message = String.format("Default Method: %s %d", name, age);
        System.out.println(message);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = HelloWorld.class.getDeclaredMethod("test", String.class, int.class);
        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### Generic Method

```java
public class HelloWorld {
    public <A, B> void test(A a, B b) {
        System.out.println("Hello Generic Method");
    }
}
```

```java
public class HelloWorld<A, B> {
    public void test(A a, B b) {
        System.out.println("Hello Plain Method in Generic Class");
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = HelloWorld.class.getDeclaredMethod("test", Object.class, Object.class);
        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### LambdaMetafactory

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.invoke.LambdaMetafactory;
import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        Method method = MethodUtils.findMethod(LambdaMetafactory.class, "metafactory");
        if (method == null) return;

        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

```text
Method Bootstrap
    isInvokeBootstrap()      : true
    isConstantBootstrap()    : false
```

