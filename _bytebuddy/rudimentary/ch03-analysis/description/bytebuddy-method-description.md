---
title: "MethodDescription"
sequence: "106"
---

```text
                     ┌─── ForLoadedConstructor ───┼─── ForLoadedConstructor(Constructor<?> constructor)
                     │
MethodDescription ───┼─── ForLoadedMethod ────────┼─── ForLoadedMethod(Method method)
                     │
                     └─── Latent ─────────────────┼─── TypeInitializer ───┼─── TypeInitializer(TypeDescription typeDescription)
```

```java
public interface MethodDescription extends TypeVariableSource,
        ModifierReviewable.ForMethodDescription,
        DeclaredByType.WithMandatoryDeclaration,
        ByteCodeElement.Member,
        ByteCodeElement.TypeDependant<MethodDescription.InDefinedShape, MethodDescription.Token> {
    /**
     * The internal name of a Java constructor.
     */
    String CONSTRUCTOR_INTERNAL_NAME = "<init>";

    /**
     * The internal name of a Java static initializer.
     */
    String TYPE_INITIALIZER_INTERNAL_NAME = "<clinit>";

    /**
     * The type initializer of any representation of a type initializer.
     */
    int TYPE_INITIALIZER_MODIFIER = Opcodes.ACC_STATIC;
}
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

###

```java
public class OuterClass {
    static {
        System.out.println("OuterClass");
    }

    public OuterClass() {
    }

    public void nonStaticMethodOuter() {
    }

    public static void staticMethodOuter() {
    }

    public class InnerClass {
        static {
            System.out.println("InnerClass");
        }

        public InnerClass() {
        }

        public void nonStaticMethodInner() {
        }

        public static void staticMethodInner() {
        }
    }

    public static class StaticNestedClass {
        static {
            System.out.println("Nested");
        }

        public StaticNestedClass() {
        }

        public void nonStaticMethodNested() {
        }

        public static void staticMethodNested() {
        }
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        Class<?>[] array = {
                OuterClass.class,
                OuterClass.InnerClass.class,
                OuterClass.StaticNestedClass.class
        };

        for (Class<?> clazz : array) {
            TypeDescription typeDesc = TypeDescription.ForLoadedType.of(clazz);
            printReceiverType(typeDesc);
        }
    }

    public static void printReceiverType(TypeDescription typeDesc) {
        MethodDescription.Latent.TypeInitializer typeInitializer = new MethodDescription.Latent.TypeInitializer(typeDesc);
        MethodList<? extends MethodDescription> methods = typeDesc.getDeclaredMethods();
        int rows = methods.size() + 2;
        int cols = 3;

        String[][] matrix = new String[rows][cols];
        matrix[0][0] = "getDeclaringType()";
        matrix[0][1] = "getInternalName()";
        matrix[0][2] = "getReceiverType()";

        matrix[1][0] = typeInitializer.getDeclaringType().toString();
        matrix[1][1] = typeInitializer.getInternalName();
        matrix[1][2] = String.valueOf(typeInitializer.getReceiverType());

        for (int i = 0; i < methods.size(); i++) {
            MethodDescription md = methods.get(i);
            matrix[i + 2][0] = md.getDeclaringType().toString();
            matrix[i + 2][1] = md.getInternalName();
            matrix[i + 2][2] = String.valueOf(md.getReceiverType());
        }

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────────────────────────┬──────────────────────┬─────────────────────────┐
│   getDeclaringType()    │  getInternalName()   │    getReceiverType()    │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │       <clinit>       │          null           │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │        <init>        │ class sample.OuterClass │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │ nonStaticMethodOuter │ class sample.OuterClass │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │  staticMethodOuter   │          null           │
└─────────────────────────┴──────────────────────┴─────────────────────────┘

┌────────────────────────────────────┬──────────────────────┬────────────────────────────────────┐
│         getDeclaringType()         │  getInternalName()   │         getReceiverType()          │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │       <clinit>       │                null                │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │        <init>        │      class sample.OuterClass       │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │ nonStaticMethodInner │ class sample.OuterClass$InnerClass │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │  staticMethodInner   │                null                │
└────────────────────────────────────┴──────────────────────┴────────────────────────────────────┘

┌───────────────────────────────────────────┬───────────────────────┬───────────────────────────────────────────┐
│            getDeclaringType()             │   getInternalName()   │             getReceiverType()             │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │       <clinit>        │                   null                    │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │        <init>         │          class sample.OuterClass          │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │ nonStaticMethodNested │ class sample.OuterClass$StaticNestedClass │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │  staticMethodNested   │                   null                    │
└───────────────────────────────────────────┴───────────────────────┴───────────────────────────────────────────┘
```
