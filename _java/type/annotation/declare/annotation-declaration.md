---
title: "Annotation Declaration"
sequence: "104"
---

## annotation declaration

### 语法

定义 Annotation：

```text
[modifiers] @ interface <annotation-type-name> {
    // Annotation type body goes here
}
```

The `@` sign and the `interface` keyword may be separated by whitespace, or they can be placed together.
By convention, they are placed together as `@interface`.

使用 Annotation

```text
@annotationType(name1=value1, name2=value2, name3=value3...)
```

### 示例

Let us take a look at the simplest annotation declaration possible:

```java
public @interface SimpleAnnotation {
}
```

### default

The `@interface` keyword introduces new annotation type.
That is why annotations could be treated as specialized interfaces.
Annotations may declare the **attributes** with or without default values, for example:

```java
public @interface SimpleAnnotationWithAttributes {
    String name();
    int order() default 0;
}
```

If an annotation declares an attribute without a default value,
it should be provided in all places the annotation is being applied.
For example:

```text
@SimpleAnnotationWithAttributes(name = "new annotation")
```

### value

By convention, if the annotation has an attribute with the name `value` and it is the only one
which is required to be specified, the name of the attribute could be omitted, for example:

```java
public @interface SimpleAnnotationWithValue {
    String value();
}
```

It could be used like this:

```text
@SimpleAnnotationWithValue("new annotation")
```

### 定义 Annotation

定义新的 Annotation 类型时，使用 `@interface` 关键字：

```java
public @interface Testable {
    //
}
```

使用 Annotation 时的语法，非常类似于 `public`、`final` 这样的修饰符。
通常我们会把 Annotation 放在所有修饰符之前，而且由于使用 Annotation 时可能还需要为成员变量指定值，
因而 Annotation 的长度可能较长，所以通常把 Annotation 另放一行：

```java
@Testable
public class MyClass {
    //
}
```

在默认情况下，Annotation 可用于修饰任何程序元素，包括类、接口、方法等。

Annotation 还可以带**成员变量**，这些成员变量在定义中以“**无形参的方法**”形式来声明，
其**方法名**和**返回值**定义了该**成员变量**的**名字**和**类型**。

```java
public @interface MyTag {
    String name();
    int age();
}
```

另外，也可以在定义 Annotation 的成员变量时为其指定初始值（默认值），指定成员变量的初始值可以使用 `default` 关键字。
如果为 Annotation 的成员变量指定了默认值，使用该 Annotation 时则可以不为这些成员变量指定值，而是使用默认值。

```java
public @interface MyTag {
    String name() default "tomcat";
    int age() default 12;
}
```

根据 Annotation 是否可以包含成员变量，可以把 Annotation 分为如下两类：

- 标记 Annotation：一个没有定义成员变量的 Annotation 的类型被称为标记。这种 Annotation 仅利用自身的存在与否来为我们提供信息，例如 `@Override`。
- 元数据 Annotation：包含成员变量的 Annotation。因为它们可以接受更多的元数据，所以也被称为元数据 Annotation。
