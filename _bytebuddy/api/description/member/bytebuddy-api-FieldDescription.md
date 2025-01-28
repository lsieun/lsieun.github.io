---
title: "FieldDescription"
sequence: "101"
---

## 概览

```text
                    ┌─── class ────────┼─── getDeclaringType()
                    │
                    │                  ┌─── modifier ───┼─── getActualModifiers()
                    │                  │
FieldDescription ───┼─── field_info ───┼─── type ───────┼─── getType()
                    │                  │
                    │                  └─── name ───────┼─── getName()
                    │
                    └─── signature ────┼─── asSignatureToken()
```

## API 设计

```java
public interface FieldDescription extends ModifierReviewable.ForFieldDescription,
        DeclaredByType.WithMandatoryDeclaration,
        ByteCodeElement.Member,
        ByteCodeElement.TypeDependant<FieldDescription.InDefinedShape, FieldDescription.Token> {

}
```

### 具体实现

## 如何使用

### 获取对象

#### ForLoadedField

```text
FieldDescription fieldDesc = new FieldDescription.ForLoadedField(field);
```

```java
public class HelloWorld {
    private volatile int intValue;
}
```

```java
import net.bytebuddy.description.field.FieldDescription;

import java.lang.reflect.Field;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);
        Field field = clazz.getDeclaredField("intValue");
        FieldDescription fieldDesc = new FieldDescription.ForLoadedField(field);

        DescriptionForField.print(fieldDesc);
    }
}
```

```text
┌──────────────────────┬───────────────────┐
│  getDeclaringType()  │ sample.HelloWorld │
├──────────────────────┼───────────────────┤
│ getActualModifiers() │ private volatile  │
├──────────────────────┼───────────────────┤
│      getType()       │        int        │
├──────────────────────┼───────────────────┤
│      getName()       │     intValue      │
├──────────────────────┼───────────────────┤
│  asSignatureToken()  │   int intValue    │
├──────────────────────┼───────────────────┤
│   getDescriptor()    │         I         │
└──────────────────────┴───────────────────┘
```

#### Latent

```text
FieldDescription.Token fieldToken = new FieldDescription.Token(
        "strValue",
        Opcodes.ACC_PRIVATE | Opcodes.ACC_FINAL,
        TypeDescription.ForLoadedType.of(String.class).asGenericType()
);
FieldDescription fieldDesc = new FieldDescription.Latent(
        typeDesc, fieldToken
);
```

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.type.TypeDescription;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        // TypeDescription
        String className = "sample.HelloWorld";
        TypeDescription typeDesc = new TypeDescription.Latent(
                className,
                Opcodes.ACC_PUBLIC,
                TypeDescription.ForLoadedType.of(Object.class).asGenericType()
        );

        // FieldDescription
        FieldDescription.Token fieldToken = new FieldDescription.Token(
                "strValue",
                Opcodes.ACC_PRIVATE | Opcodes.ACC_FINAL,
                TypeDescription.ForLoadedType.of(String.class).asGenericType()
        );
        FieldDescription fieldDesc = new FieldDescription.Latent(
                typeDesc, fieldToken
        );

        DescriptionForField.print(fieldDesc);
    }
}
```

```text
┌──────────────────────┬─────────────────────────────────┐
│  getDeclaringType()  │        sample.HelloWorld        │
├──────────────────────┼─────────────────────────────────┤
│ getActualModifiers() │          private final          │
├──────────────────────┼─────────────────────────────────┤
│      getType()       │        java.lang.String         │
├──────────────────────┼─────────────────────────────────┤
│      getName()       │            strValue             │
├──────────────────────┼─────────────────────────────────┤
│  asSignatureToken()  │ class java.lang.String strValue │
├──────────────────────┼─────────────────────────────────┤
│   getDescriptor()    │       Ljava/lang/String;        │
└──────────────────────┴─────────────────────────────────┘
```

### 调用方法

#### SignatureToken
