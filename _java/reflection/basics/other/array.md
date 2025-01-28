---
title: "Array"
sequence: "109"
---

Working with arrays via Java Reflection is done using the `java.lang.reflect.Array` class.
Do not confuse this class with the `java.util.Arrays` class in the Java Collections suite,
which contains utility methods for sorting arrays, converting them to collections etc.

```java
import java.lang.reflect.Array;

public class Box<T> {
    public T[] getArray(Class<?> type, int size) {
        // Unchecked cast: 'java.lang.Object' to 'T[]' 
        T[] array = (T[]) Array.newInstance(type, size);
        return array;
    }
}
```

## 数组对象

### 创建数组

```java
import java.lang.reflect.Array;

public class Program {
    public static void main(String[] args) throws Exception {
        int[] intArray = (int[]) Array.newInstance(int.class, 3);
    }
}
```

### 数组元素的值

```java
import java.lang.reflect.Array;

public class Program {
    public static void main(String[] args) {
        int[] intArray = (int[]) Array.newInstance(int.class, 3);

        Array.set(intArray, 0, 123);
        Array.set(intArray, 1, 456);
        Array.set(intArray, 2, 789);

        System.out.println("intArray[0] = " + Array.get(intArray, 0));
        System.out.println("intArray[1] = " + Array.get(intArray, 1));
        System.out.println("intArray[2] = " + Array.get(intArray, 2));
    }
}
```

```text
intArray[0] = 123
intArray[1] = 456
intArray[2] = 789
```

## 数组的 Class

### 获取 Class

#### 第一种方式

Using non-reflection code you can do like this:

```text
Class<?> clazz = String[].class;
```

```java
public class Program {
    public static void main(String[] args) {
        Class<?> clazz = String[].class;
        System.out.println(clazz);
    }
}
```

#### 第二种方式

Doing this using `Class.forName()` is not quite straightforward. For instance, you can access the primitive `int` array class object like this:

```text
Class<?> clazz1 = Class.forName("[I");
```

```java
public class Program {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> clazz1 = Class.forName("[I");
        Class<?> clazz2 = int[].class;
        System.out.println(clazz1);
        System.out.println(clazz1 == clazz2);
    }
}
```

#### 第三种方式

Once you have obtained the `Class` object of a type there is a simple way to obtain the `Class` of an array of that type.
The solution, or workaround as you might call it, is to create an empty array of the desired type and
obtain the class object from that empty array.
It's a bit of a cheat, but it works. Here is how that looks:

```java
import java.lang.reflect.Array;

public class Program {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> theClass = String.class;
        Class<?> stringArrayClass = Array.newInstance(theClass, 0).getClass();
        System.out.println(stringArrayClass);

        boolean isArray = stringArrayClass.isArray();
        System.out.println(isArray);
    }
}
```

### 数组元素的类型

Once you have obtained the `Class` object for an array you can access its component type via the `Class.getComponentType()` method.
The component type is the type of the items in the array.

For instance, the component type of an `int[]` array is the `int.class` Class object.
The component type of a `String[]` array is the `java.lang.String` Class object.

```java
public class Program {
    public static void main(String[] args) {
        String[] strings = new String[3];
        Class<?> stringArrayClass = strings.getClass();
        Class<?> componentType = stringArrayClass.getComponentType();
        System.out.println(componentType);
    }
}
```
