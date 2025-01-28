---
title: "Annotation: 读取 Instance"
sequence: "103"
---

## 类注解

```java
@Version(major = 1, minor = 2)
@Author(firstname = "Tom", lastname = "Cat")
@Author(firstname = "Jerry", lastname = "Mouse")
public class HelloWorld {
}
```

```java
import net.bytebuddy.description.type.TypeDescription;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        DescriptionForAnnotation.printAnnotationSource(typeDesc);
    }
}
```

## 字段注解

```java
public class HelloWorld {
    @Version(major = 1, minor = 2)
    private String name;

    @Version(major = 1, minor = 3)
    private int age;
}
```

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        FieldDescription fieldDesc = typeDesc.getDeclaredFields()
                .filter(ElementMatchers.named("name"))
                .getOnly();
        DescriptionForAnnotation.printAnnotationSource(fieldDesc);
    }
}
```

## 方法注解

```java
public class HelloWorld {
    @Version(major = 1, minor = 2)
    public void test() {
        System.out.println("Hello World");
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        MethodDescription methodDesc = typeDesc.getDeclaredMethods()
                .filter(ElementMatchers.named("test"))
                .getOnly();
        DescriptionForAnnotation.printAnnotationSource(methodDesc);
    }
}
```

## 方法参数注解

```java
public class HelloWorld {
    public void test(@Version(major = 1, minor = 2) @NonNull String name, @NonZero int age) {
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.ParameterDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        MethodDescription methodDesc = typeDesc.getDeclaredMethods()
                .filter(ElementMatchers.named("test"))
                .getOnly();
        ParameterDescription paramDesc = methodDesc.getParameters()
                .get(0);
        DescriptionForAnnotation.printAnnotationSource(paramDesc);
    }
}
```

## 工具类

```java
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.annotation.AnnotationList;
import net.bytebuddy.description.annotation.AnnotationSource;
import net.bytebuddy.description.annotation.AnnotationValue;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;

public class DescriptionForAnnotation {
    public static void printAnnotationSource(AnnotationSource annotationSource) {
        AnnotationList annotationList = annotationSource.getDeclaredAnnotations();
        printAnnotationList(annotationList);
    }

    public static void printAnnotationList(AnnotationList annotationList) {
        for (AnnotationDescription annotationDesc : annotationList) {
            printAnnotationDescription(annotationDesc);
        }
    }

    public static void printAnnotationDescription(AnnotationDescription annotationDesc) {
        TypeDescription annotationType = annotationDesc.getAnnotationType();
        System.out.println(annotationType);

        String format = "    %s = %s (%s)";
        MethodList<? extends MethodDescription> methodList = annotationType.getDeclaredMethods();
        for (MethodDescription method : methodList) {
            String name = method.getName();
            AnnotationValue<?, ?> annotationElementValue = annotationDesc.getValue(name);
            AnnotationValue.Sort sort = annotationElementValue.getSort();

            String message = String.format(format, name, annotationElementValue.toString(), sort);
            System.out.println(message);
        }
    }
}
```

```text
AnnotationSource --> AnnotationList --> AnnotationDescription --> AnnotationValue
```
