---
title: "Generic"
sequence: "102"
---

I have often read in articles and forums that all Java Generics information is erased at compile time
so that you cannot access any of that information at runtime.
**This is not entirely true though.**
It is possible to access generics information at runtime in a handful of cases.
[Link](https://jenkov.com/tutorials/java-reflection/generics.html)

> 我是认同这些话的

## 两种形式

Using Java Generics typically falls into one of two different situations:

- Declaring a class/interface as being parameterizable. （定义泛型）
- Using a parameterizable class. （使用泛型）

- Generic Declaration
- Generic Use
  - 字段：`List<String>`
  - 方法：方法的参数（`Parameter`）、方法的返回值

## 类

```java
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.util.Arrays;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        TypeVariable<? extends Class<?>>[] typeParameters = clazz.getTypeParameters();
        for (TypeVariable<? extends Class<?>> t : typeParameters) {
            String name = t.getName();
            System.out.println("Name: " + name);

            Type[] bounds = t.getBounds();
            System.out.println("Bounds: " + Arrays.toString(bounds));

            Class<?> genericDeclaration = t.getGenericDeclaration();
            System.out.println("Generic Declaration: " + genericDeclaration);

            System.out.println("=== === ===");
        }
    }
}
```

### 示例一

```java
public class HelloWorld<A, B> {
}
```

```text
Name: A
Bounds: [class java.lang.Object]
Generic Declaration: class sample.HelloWorld
=== === ===
Name: B
Bounds: [class java.lang.Object]
Generic Declaration: class sample.HelloWorld
=== === ===
```

### 示例二

主要演示 `TypeVariable.getBounds()` 的差异：

```java
import java.io.Serializable;

public class HelloWorld<A extends Number, B extends Serializable> {
}
```

```text
Name: A
Bounds: [class java.lang.Number]
Generic Declaration: class sample.HelloWorld
=== === ===
Name: B
Bounds: [interface java.io.Serializable]
Generic Declaration: class sample.HelloWorld
=== === ===
```

### 示例三

主要演示 `TypeVariable.getBounds()` 的差异：

```java
import java.io.Serializable;

public class HelloWorld<A extends Number & Cloneable, B extends Runnable & Serializable> {
}
```

```text
Name: A
Bounds: [class java.lang.Number, interface java.lang.Cloneable]
Generic Declaration: class sample.HelloWorld
=== === ===
Name: B
Bounds: [interface java.lang.Runnable, interface java.io.Serializable]
Generic Declaration: class sample.HelloWorld
=== === ===
```

### 示例四

主要演示 `TypeVariable.getGenericDeclaration()` 的差异：

```java
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.util.Arrays;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method method = clazz.getDeclaredMethod("test", Object.class, Object.class);
        TypeVariable<Method>[] typeParameters = method.getTypeParameters();
        for (TypeVariable<Method> t : typeParameters) {
            String name = t.getName();
            System.out.println("Name: " + name);

            Type[] bounds = t.getBounds();
            System.out.println("Bounds: " + Arrays.toString(bounds));

            Method genericDeclaration = t.getGenericDeclaration();
            System.out.println("Generic Declaration: " + genericDeclaration);

            System.out.println("=== === ===");
        }
    }
}
```

```java
public class HelloWorld {
    public <A, B> void test(A a, B b) {
    }
}
```

```text
Name: A
Bounds: [class java.lang.Object]
Generic Declaration: public void sample.HelloWorld.test(java.lang.Object,java.lang.Object)
=== === ===
Name: B
Bounds: [class java.lang.Object]
Generic Declaration: public void sample.HelloWorld.test(java.lang.Object,java.lang.Object)
=== === ===
```

## 字段

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    private List<String> strList = new ArrayList<>();
}
```

```java
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Field field = clazz.getDeclaredField("strList");

        Type genericType = field.getGenericType();
        if (genericType instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) genericType;
            Type rawType = parameterizedType.getRawType();
            System.out.println("Raw Type: " + rawType);

            Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
            for (Type argType : actualTypeArguments) {
                System.out.println("Arg Type: " + argType);
            }
            System.out.println("=== === ===");
        }
        else {
            System.out.println("Type: " + genericType);
        }
    }
}
```

```text
Raw Type: interface java.util.List
Arg Type: class java.lang.String
```

## 方法

### 方法参数类型

#### 示例一

```java
import java.util.List;

public class HelloWorld {
    public void test(List<String> list) {
    }
}
```

```java
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method method = clazz.getDeclaredMethod("test", List.class);
        Type[] genericParameterTypes = method.getGenericParameterTypes();

        for(Type t : genericParameterTypes) {
            if (t instanceof ParameterizedType) {
                ParameterizedType parameterizedType = (ParameterizedType) t;
                Type rawType = parameterizedType.getRawType();
                System.out.println("Raw Type: " + rawType);

                Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
                for (Type argType : actualTypeArguments) {
                    System.out.println("Arg Type: " + argType);
                }
                System.out.println("=== === ===");
            }
        }
    }
}
```

```text
Raw Type: interface java.util.List
Arg Type: class java.lang.String
```

#### 示例二

```java
import java.util.Date;
import java.util.List;
import java.util.Map;

public class HelloWorld {
    public void test(List<String> list, Map<Integer, Date> map) {
    }
}
```

```java
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method method = clazz.getDeclaredMethod("test", List.class, Map.class);
        Type[] genericParameterTypes = method.getGenericParameterTypes();

        for(Type t : genericParameterTypes) {
            if (t instanceof ParameterizedType) {
                ParameterizedType parameterizedType = (ParameterizedType) t;
                Type rawType = parameterizedType.getRawType();
                System.out.println("Raw Type: " + rawType);

                Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
                for (Type argType : actualTypeArguments) {
                    System.out.println("Arg Type: " + argType);
                }
                System.out.println("=== === ===");
            }
        }
    }
}
```

```text
Raw Type: interface java.util.List
Arg Type: class java.lang.String
=== === ===
Raw Type: interface java.util.Map
Arg Type: class java.lang.Integer
Arg Type: class java.util.Date
=== === ===
```

### 方法返回类型

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    private List<String> strList = new ArrayList<>();

    public List<String> test() {
        return strList;
    }
}
```

```java
import java.lang.reflect.Method;
import java.lang.reflect.Type;

public class Program {
    public static void main(String[] args) throws Exception {
        Method method = HelloWorld.class.getDeclaredMethod("test", null);

        Class<?> returnType = method.getReturnType();
        System.out.println(returnType);

        Type genericReturnType = method.getGenericReturnType();
        System.out.println(genericReturnType);
    }
}
```

```text
interface java.util.List
java.util.List<java.lang.String>
```

```java
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class Program {
    public static void main(String[] args) throws Exception {
        Method method = HelloWorld.class.getDeclaredMethod("test", null);
        Type genericReturnType = method.getGenericReturnType();

        if (genericReturnType instanceof ParameterizedType) {
            ParameterizedType type = (ParameterizedType) genericReturnType;

            Type ownerType = type.getOwnerType();
            System.out.println("Owner Type: " + ownerType);

            Type rawType = type.getRawType();
            System.out.println("Raw Type: " + rawType);

            Type[] actualTypeArguments = type.getActualTypeArguments();
            for (Type typeArgument : actualTypeArguments) {
                System.out.println("type Argument: " + typeArgument);
            }
        }
    }
}
```

```text
Owner Type: null
Raw Type: interface java.util.List
type Argument: class java.lang.String
```
