---
title: "TypeDescription"
sequence: "103"
---

## 概览

### TypeDescription 和 TypeDefinition 的关系

要注意：`TypeDescription` 和 `TypeDescription.Generic` 是“兄弟”关系，不是父子关系，它们有共同的父接口 `TypeDefinition`

```text
                  ┌─── TypeDescription
TypeDefinition ───┤
                  └─── TypeDescription.Generic
```

```java
public interface TypeDefinition extends NamedElement, ModifierReviewable.ForTypeDefinition, Iterable<TypeDefinition> {
    // ...
}
```

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    // ...
}
```

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    interface Generic extends TypeDefinition, AnnotationSource {
        // ...
    }
}
```

在 ByteBuddy 中，TypeDefinition 和 TypeDescription 是两个相关的概念，用于描述 Java 类的元信息，它们之间存在一定的关系。

TypeDefinition 是一个更高级的抽象，代表了一个 Java 类的定义，包括类名、字段、方法等信息。
TypeDefinition 提供了一组 API，用于对类进行操作和查询。它是一个接口，为字节码生成和修改提供了一致的方式。

TypeDescription 是 TypeDefinition 的实现之一，它是对 Java 类描述的具体实例。
TypeDescription 提供了更详细的类信息，包括类修饰符、父类、接口、字段、方法等。
它可以通过 TypeDefinition.asErasure() 方法获取。

简而言之，TypeDefinition 是一个更抽象的概念，表示 Java 类的定义，而 TypeDescription 是对某个具体 Java 类进行描述的实例。
TypeDescription 实现了 TypeDefinition 接口，并提供了更详细的类信息。

在使用 ByteBuddy 时，您可以根据需要选择使用 TypeDefinition 或 TypeDescription 来描述和操作 Java 类。
通常情况下，您会使用 TypeDescription 来获取和修改类的元信息，而 TypeDefinition 则会用于更高级的场景，比如类的动态生成和增强。


## API 设计

### 两个组成部分

#### TypeDescription

`TypeDescription` represents the Java class loaded in the JVM.

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    //
}
```

```text
                                     ┌─── version ─────────┼─── getClassFileVersion()
                                     │
                                     ├─── constant.pool ───┼─── isCompileTimeConstant()
                                     │
                                     │                     ┌─── modifier ───┼─── getActualModifiers()
                                     │                     │
                                     ├─── class ───────────┤                ┌─── getSimpleName()
                                     │                     │                │
                                     │                     └─── name ───────┼─── getLongSimpleName()
                   ┌─── classfile ───┤                                      │
                   │                 │                                      └─── getCanonicalName()
                   │                 │
                   │                 ├─── field ───────────┼─── getDeclaredFields()
                   │                 │
                   │                 ├─── method ──────────┼─── getDeclaredMethods()
                   │                 │
                   │                 │                     ┌─── getInheritedAnnotations()
                   │                 │                     │
                   │                 └─── annotation ──────┼─── isAnnotationReturnType()
                   │                                       │
                   │                                       └─── isAnnotationValue()
                   │
                   │                                   ┌─── getPackage()
                   │                                   │
                   │                 ┌─── package ─────┼─── isSamePackage()
                   │                 │                 │
                   │                 │                 └─── isPackageType()
                   │                 │
                   │                 │                 ┌─── isAssignableFrom()
                   │                 │                 │
                   │                 ├─── hierarchy ───┼─── isAssignableTo()
                   │                 │                 │
                   │                 │                 └─── isInHierarchyWith()
                   │                 │
                   │                 │                                   ┌─── isPrimitiveWrapper()
                   │                 │                                   │
                   │                 │                 ┌─── primitive ───┼─── asBoxed()
                   │                 │                 │                 │
                   │                 │                 │                 └─── asUnboxed()
                   │                 │                 │
                   │                 │                 ├─── array ───────┼─── getComponentType()
                   │                 │                 │
                   │                 │                 ├─── record ──────┼─── getRecordComponents()
TypeDescription ───┤                 │                 │
                   │                 │                 │                 ┌─── getDeclaringType()
                   │                 │                 │                 │
                   │                 │                 │                 ├─── getDeclaredTypes()
                   │                 │                 │                 │
                   │                 │                 │                 ├─── getEnclosingType()
                   │                 │                 │                 │
                   ├─── type ────────┤                 ├─── enclose ─────┼─── getEnclosingMethod()
                   │                 │                 │                 │
                   │                 │                 │                 ├─── isAnonymousType()
                   │                 │                 │                 │
                   │                 ├─── specific ────┤                 ├─── isLocalType()
                   │                 │                 │                 │
                   │                 │                 │                 └─── isMemberType()
                   │                 │                 │
                   │                 │                 │                 ┌─── isNestedClass()
                   │                 │                 │                 │
                   │                 │                 │                 ├─── getNestHost()
                   │                 │                 │                 │
                   │                 │                 ├─── nested ──────┼─── getNestMembers()
                   │                 │                 │                 │
                   │                 │                 │                 ├─── isNestHost()
                   │                 │                 │                 │
                   │                 │                 │                 └─── isNestMateOf()
                   │                 │                 │
                   │                 │                 │                 ┌─── getInnerClassCount()
                   │                 │                 ├─── inner ───────┤
                   │                 │                 │                 └─── isInnerClass()
                   │                 │                 │
                   │                 │                 │                 ┌─── getPermittedSubtypes()
                   │                 │                 └─── seal ────────┤
                   │                 │                                   └─── isSealed()
                   │                 │
                   │                 └─── default ─────┼─── getDefaultValue()
                   │
                   └─── obj ─────────┼─── isInstance()
```

`TypeDescription.ForLoadedType.of()` method is the common method used in the ByteBuddy programming.

- `TypeDescription`
  - getDeclaredFields
  - getDeclaredMethods
- `net.bytebuddy.description.NamedElement.WithRuntimeName`
  - `String getName()`
  - `String getInternalName()`
- `net.bytebuddy.description.annotation.AnnotationSource`
  - `AnnotationList getDeclaredAnnotations()`

| Java Class    | ByteBuddy TypeDescription                       |
|---------------|-------------------------------------------------|
| int.class     | TypeDescription.ForLoadedType.of(int.class)     |
| Integer.class | TypeDescription.ForLoadedType.of(Integer.class) |

The `TypeDescription` is the fundamental Java class used in ByteBuddy programming.
The `TypeDescription` provides a set of API
that allows developer to inspect the Java class.
It is similar to Java Reflection API, but provides more functionality.


- `isGenerified()`: Checks if this type variable source has a generic declaration.



### 具体实现

#### OfNonGenericType

```java
import net.bytebuddy.description.type.TypeDescription;
import org.objectweb.asm.Opcodes;

public class HelloWorldRun {
    public static void main(String[] args) {
        TypeDescription.Generic objType = TypeDescription.Generic.OfNonGenericType.ForLoadedType.of(Object.class);
        TypeDescription typeDesc = new TypeDescription.Latent(
                "sample.AbcXyz", Opcodes.ACC_PUBLIC,
                objType
        );
        System.out.println(typeDesc.getName());
    }
}
```

## 如何使用




