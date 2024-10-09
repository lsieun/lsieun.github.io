---
title: "Annotation Reflection"
sequence: "101"
---

## AnnotatedElement

Program elements that let you access their annotations implement the `java.lang.reflect.AnnotatedElement` interface.



### 具体实现

The following classes implement the `AnnotatedElement` interface:

- java.lang.reflect.Module
- java.lang.Package
- java.lang.Class
- java.lang.reflect.Executable
- java.lang.reflect.Constructor
- java.lang.reflect.Field
- java.lang.reflect.Method
- java.lang.reflect.Parameter
- java.lang.reflect.AccessibleObject

### 定义了哪些方法

There are several methods in the `AnnotatedElement` interface
that let you access annotations of a program element.

```text
                                    ┌─── isAnnotationPresent(Class<? extends Annotation> annotationClass)
                                    │
                                    ├─── getAnnotation(Class<T> annotationClass)
                    ┌─── use ───────┤
                    │               ├─── getAnnotations()
                    │               │
AnnotatedElement ───┤               └─── getAnnotationsByType(Class<T> annotationClass)
                    │
                    │               ┌─── getDeclaredAnnotation(Class<T> annotationClass)
                    │               │
                    └─── declare ───┼─── getDeclaredAnnotationsByType(Class<T> annotationClass)
                                    │
                                    └─── getDeclaredAnnotations()
```

### 注意事项

Caution: It is very important to note that
an annotation type must be annotated with the `Retention` meta-annotation
with the retention policy of `RUNTIME` to access it at runtime.
If a program element has multiple annotations,
you would be able to access only annotations, which have `RUNTIME` as their retention policy.

## 示例

```java
import lsieun.annotation.Version;

@Version(major = 1, minor = 0)
@Deprecated(since = "10", forRemoval = true)
public class HelloWorld {
}
```

print all annotations:

```java
import java.lang.annotation.Annotation;

public class Program {
    public static void main(String[] args) {
        // Get the class object reference
        Class<HelloWorld> cls = HelloWorld.class;
        
        // Get all annotations on the class declaration
        Annotation[] annotations = cls.getAnnotations();
        System.out.println("Annotation count: " + annotations.length);
        
        // Print all annotations
        for (Annotation ann : annotations) {
            System.out.println(ann.toString());
        }
    }
}
```

```java
import lsieun.annotation.Version;

public class Program {
    public static void main(String[] args) {
        // Get the class object reference
        Class<HelloWorld> cls = HelloWorld.class;

        // Get the instance of the Version annotation
        Version v = cls.getAnnotation(Version.class);
        if (v == null) {
            System.out.println("Version annotation is not present.");
        }
        else {
            int major = v.major();
            int minor = v.minor();
            System.out.println("Version: major=" + major + ", minor=" + minor);
        }
    }
}
```

我想验证，生成 `v` 是 `Proxy` 生成的实例：

```text
Class<?> proxyClass = v.getClass();
boolean isProxyClass = Proxy.isProxyClass(proxyClass);
System.out.println(isProxyClass);
InvocationHandler handler = Proxy.getInvocationHandler(v);
System.out.println(handler);
```

The instances of an annotation type are created by the Java runtime.
You never create an instance of an annotation type using the `new` operator.

```java
import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Method;

public class Program {
    public static void main(String[] args) {
        // Read annotations on the class declaration
        Class<HelloWorld> cls = HelloWorld.class;
        System.out.println("Annotations for class: " + cls.getName());
        printAnnotations(cls);

        // Read annotations on the package declaration
        Package p = cls.getPackage();
        System.out.println("Annotations for package: " + p.getName());
        printAnnotations(p);

        // Read annotations on the methods declarations
        System.out.println("Method annotations:");
        Method[] methodList = cls.getDeclaredMethods();
        for (Method m : methodList) {
            System.out.println("Annotations for method: " + m.getName());
            printAnnotations(m);
        }
    }

    public static void printAnnotations(AnnotatedElement programElement) {
        Annotation[] annList = programElement.getAnnotations();
        for (Annotation ann : annList) {
            System.out.println(ann);
            if (ann instanceof Version) {
                Version v = (Version) ann;
                int major = v.major();
                int minor = v.minor();
                System.out.println("Found Version annotation: major=" + major + ", minor=" + minor);
            }
        }
        System.out.println();
    }
}
```

## repeatable annotation

Accessing instances of a **repeatable annotation** is a little different.
Recall that a repeatable annotation has a companion containing an annotation type.

For example, you declared a `ChangeLogs` annotation type that is a containing annotation type
for the `ChangeLog` repeatable annotation type.
You can access **repeated annotations** using either **the annotation type** or **the containing annotation type**.

Use the `getAnnotationsByType()` method,
passing it the class reference of **the repeatable annotation type**
to get the instances of the repeatable annotation in an array.

Use the `getAnnotation()` method,
passing it the class reference of **the containing annotation type**
to get the instances of the repeatable annotation as an instance of its containing annotation type.

```java
import lsieun.annotation.ChangeLog;
import lsieun.annotation.Version;

@Version(major = 1, minor = 0)
@ChangeLog(date = "08/28/2017", comments = "Declared the class")
@ChangeLog(date = "09/21/2017", comments = "Added the process() method")
public class HelloWorld {
}
```

```java
import lsieun.annotation.ChangeLog;
import lsieun.annotation.ChangeLogs;

public class Program {
    public static void main(String[] args) {
        // Read annotations on the class declaration
        Class<?> clazz = HelloWorld.class;

        // Access annotations using the ChangeLog type
        System.out.println("Using the ChangeLog type...");
        ChangeLog[] annList = clazz.getAnnotationsByType(ChangeLog.class);
        for (ChangeLog log : annList) {
            System.out.println("Date=" + log.date() + ", Comments=" + log.comments());
        }

        // Access annotations using the ChangeLogs
        // containing annotation type
        System.out.println("\nUsing the ChangeLogs type...");
        Class<ChangeLogs> containingAnnClass = ChangeLogs.class;
        ChangeLogs logs = clazz.getAnnotation(containingAnnClass);
        for (ChangeLog log : logs.value()) {
            System.out.println("Date=" + log.date() + ", Comments=" + log.comments());
        }
    }
}
```

## 提取 Annotation 信息

当开发者使用 Annotation 修饰了类、方法、Field 等成员之后，这些 Annotation 不会自己生效，必须由开发者提供相应的工具来提供并处理 Annotation 信息。

Java 使用 `Annotation` 接口来代表程序元素前面的注释，该接口是所有 Annotation 类型的父接口。

```java
package java.lang.annotation;

/**
 * @since   1.5
 */
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();
}
```

Java 5 在 `java.lang.reflect` 包下新增了 `AnnotatedElement` 接口，该接口代表程序中可以接受注释的程序元素。

```java
package java.lang.reflect;

/**
 * @since 1.5
 */
public interface AnnotatedElement {
    /**
     * Returns true if an annotation for the specified type
     * is <em>present</em> on this element, else false. 
     * @since 1.5
     */
    default boolean isAnnotationPresent(Class<? extends Annotation> annotationClass) {
        return getAnnotation(annotationClass) != null;
    }

   /**
     * Returns this element's annotation for the specified type if
     * such an annotation is <em>present</em>, else null.
     * @since 1.5
     */
    <T extends Annotation> T getAnnotation(Class<T> annotationClass);

    /**
     * Returns annotations that are <em>present</em> on this element.
     * @since 1.5
     */
    Annotation[] getAnnotations();

    /**
     * Returns annotations that are <em>associated</em> with this element.
     * @since 1.8
     */
    default <T extends Annotation> T[] getAnnotationsByType(Class<T> annotationClass) {
        //
     }

    /**
     * Returns this element's annotation for the specified type if
     * such an annotation is <em>directly present</em>, else null.
     * @since 1.8
     */
    default <T extends Annotation> T getDeclaredAnnotation(Class<T> annotationClass) {
        //
    }

    /**
     * Returns this element's annotation(s) for the specified type if
     * such annotations are either <em>directly present</em> or
     * <em>indirectly present</em>. This method ignores inherited
     * annotations.
     * @since 1.8
     */
    default <T extends Annotation> T[] getDeclaredAnnotationsByType(Class<T> annotationClass) {
        //
    }

    /**
     * Returns annotations that are <em>directly present</em> on this element.
     * This method ignores inherited annotations.
     * @since 1.5
     */
    Annotation[] getDeclaredAnnotations();
}
```

`AnnotatedElement` 接口主要有如下几个实现类：

- `Class`：类定义
- `Constructor`：构造器定义
- `Field`：类的成员变量定义。
- `Method`：类的方法定义。
- `Package`：类的包定义。

`AnnotatedElement` 接口是所有程序元素（如 Class、Method、Constructor 等）的父接口，所以程序通过反射获取了某个类的 `AnnotatedElement` 对象（如 Class、Method、Constructor 等）之后，程序就可以调用该对象的如下 3 个方法来访问 Annotation 信息：

- `getAnnotation(Class<T> annotationClass)`：返回该程序元素上存在的指定类型的注释，如果该类型的注释不存在，则返回 null。
- `getAnnotations()`：返回该程序元素上存在的所有注释。
- `isAnnotationPresent(Class<? extends Annotation> annotationClass)`：判断该程序元素上是否存在指定类型的注释，如果存在则返回 `true`，否则返回 `false`。


