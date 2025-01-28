---
title: "Annotation Intro"
sequence: "101"
---

## 定义和使用





## Annotation Instance

```text
AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();
```

```java
@Version(major = 1, minor = 2)
@Author(firstname = "Tom", lastname = "Cat")
@Author(firstname = "Jerry", lastname = "Mouse")
public class HelloWorld {
}
```

![](/assets/images/bytebuddy/annotation-source-list-description-value.png)

```text
AnnotationSource --> AnnotationList --> AnnotationDescription --> AnnotationValue
```

## 添加和移除

Java Class

- 添加 Annotation：`net.bytebuddy.dynamic.DynamicType.Builder`
- 移除 Annotation：`net.bytebuddy.jar.asm.ClassVisitor`

Java method and constructor

- 添加 Annotation：`net.bytebuddy.asm.MemberAttributeExtension.ForMethod`
- 移除 Annotation：`net.bytebuddy.asm.AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper`

Java instance variable

- 添加 Annotation：`net.bytebuddy.asm.MemberAttributeExtension.ForField`
- 移除 Annotation：`net.bytebuddy.asm.AsmVisitorWrapper.ForDeclaredFields.FieldVisitorWrapper`

