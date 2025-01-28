---
title: "Generics And Reflection"
sequence: "138"
---

## 获取 Class

正确：

```text
Class<?> clazz = List.class;
```

错误：

```text
Class<?> clazz = List<String>.class;

Class<?> clazz = List<?>.class;

Class<?> clazz = List<? extends Number>.class;
```

## 1. Which information related to generics can I access reflectively?

**The exact static type information**, but only **inexact dynamic type information**.

Using the reflection API of package `java.lang.reflect`,
you can access the **exact declared type** of **fields**, **method parameters** and **method return values**.
However, you have **no access** to the **exact dynamic type of an object** that a reference variable refers to.

Here is the short version of **how the static and dynamic type information is retrieved reflectively**.

假如有一个 `HelloWorld` 类：

```java
package sample;

import java.util.ArrayList;

public class HelloWorld {
    public static Object field = new ArrayList<String>();
}
```

### 1.1. exact static type information

The information regarding the declared type of a field ( **static type information**) can be found like this:

```java
import java.lang.reflect.Field;
import java.lang.reflect.Type;

public class B_Reflect_Field {
    public static void main(String[] args) throws NoSuchFieldException {
        Field f = HelloWorld.class.getDeclaredField("field");
        Type genericType = f.getGenericType();
        System.out.println(genericType);
    }
}
```

Class `java.lang.reflect.Field` has a method named `getGenericType()`; it returns an object of type `java.lang.reflect.Type`, which represents the declared type of the field.

### 1.2. inexact dynamic type information

The information regarding the type of the object that a reference refers to (**dynamic type information**) can be found like this:

Example (find actual type of a field):

```java
class Test {
  public static void main(String[] args) {
    Class<?> c = SomeClass.field.getClass();
  }
}
```

In the example above, the field `SomeClass.field` is declared as a field of type `Object`; for this reason `Field.getGenericType()` yields the type information `Object`. This is the **static type information** of the field as declared in the class definition.

At runtime the field variable `SomeClass.field` refers to an object of any subtype of `Object`. **The actual type of the referenced object** is retrieved using the object's `getClass()` method, which is defined in class `Object`. If the field refers to an object of type `ArrayList<String>` then `getClass()` yields the raw type information `ArrayList`, but not the exact type information `ArrayList<String>`.

## How do I retrieve an object's actual (dynamic) type?

**By calling its `getClass()` method**.

When you want to retrieve an object's **actual type** (as opposed to its **declared type**) you use a reference to the object in question and invoke its `getClass()` method.

Example (of retrieving an object's actual type):

```java
class Test {
  public static void main(String[] args) {
    Object tmp = java.util.EnumSet.allOf(java.util.concurrent.TimeUnit.class);
    Class<?> clazz = tmp. getClass() ;
    System.out.println("actual type of Object tmp is: "+clazz); 
  }
}
```

```txt
actual type of Object tmp is: class java.util.RegularEnumSet
```

The actual type of the object that the local `tmp` variable refers to is unknown at compile time. It is some class type that extends the abstract `EnumSet` class; we do not know which type exactly. It turns out that in our example the actual type is `java.util.RegularEnumSet`, which is an implementation specific class type defined by the JDK implementor. The class is a private implementation detail of the JDK and is not even mentioned in the API description of the `java.util` package. Nonetheless the virtual machine can retrieve the **actual type** of the object via reflection by means of the `getClass()` method.

In contrast, the **declared type** of the object in question is type `Object`, because the reference variable `tmp` is of type `Object`.

In this example the **declared type** is not available through reflection, because `tmp` is a local variable. **The declared type** is available reflectively solely for **fields of types**, and for **return types or parameter types or exception types of methods**. **The actual type of an object**, however, can be retrieved for all objects regardless of their declaration: for **local variables**, **fields of classes**, **return types of methods**, **arguments passed to method**, etc.<sub>我觉得，这段才是“精髓”，它表明了 declared type 和 actual type 在哪里能够获取到。特别是 local variable，它是不能够获取到 declared type 的。在我的印象中，local variable 只是分配到相应的 slot 中，并没有明确的类型。</sub>

The `getClass()` method of class `Object` returns an object of type `java.lang.Class`, which means that the actual type of each object is represented by a `Class` object. You can extract various information about the type represented by the `Class` object, such as "is it a primitive type?", "is it an array type?", "is it an interface, or a class, or an enum type?", "which fields does the type have?", "which methods does the type have?", etc. You can additionally find out whether the `Class` object represents a generic type by asking it: "does it have type parameters?".

## Hierarchy

- ClassFile And Reflection
    - static type information
        - Class
            - modifier
            - SuperClass
            - Interfaces
            - Annotation
        - Field
            - Field Type
            - Annotation
        - Method
            - Method Parameter Type
            - Method Return Type
            - Annotation
        - Constructor
            - Parameter Type
            - Annotation
    - dynamic type information
        - `obj.getClass()`

