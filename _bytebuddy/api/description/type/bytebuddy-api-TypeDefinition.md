---
title: "TypeDefinition"
sequence: "102"
---

## API 设计

### TypeDefinition

```text
                  ┌─── TypeDescription
TypeDefinition ───┤
                  └─── TypeDescription.Generic
```

```text
                                              ┌─── super ───────┼─── getSuperClass()
                                              │
                                              ├─── interface ───┼─── getInterfaces()
                                              │
                                              │                                  ┌─── getTypeName()
                                              │                                  │
                                              │                 ┌─── common ─────┼─── represents()
                                              │                 │                │
                                              │                 │                └─── getSort()
                                              ├─── class ───────┤
                                              │                 │                ┌─── primitive ───┼─── isPrimitive()
                  ┌─── classfile.structure ───┤                 │                │
                  │                           │                 │                │                 ┌─── isArray()
                  │                           │                 └─── specific ───┼─── array ───────┤
                  │                           │                                  │                 └─── getComponentType()
                  │                           │                                  │
                  │                           │                                  │                 ┌─── isRecord()
                  │                           │                                  └─── record ──────┤
                  │                           │                                                    └─── getRecordComponents()
TypeDefinition ───┤                           │
                  │                           ├─── field ───────┼─── getDeclaredFields()
                  │                           │
                  │                           └─── method ──────┼─── getDeclaredMethods()
                  │
                  ├─── jvm.stack frame ───────┼─── getStackSize()
                  │
                  │                                            ┌─── asGenericType()
                  └─── type.conversion ───────┼─── subclass ───┤
                                                               └─── asErasure()
```

## TypeDefinition.Sort

```java
public interface TypeDefinition extends NamedElement, ModifierReviewable.ForTypeDefinition, Iterable<TypeDefinition> {
    enum Sort {
        NON_GENERIC,        // non-generic type
        GENERIC_ARRAY,      // generic array type
        PARAMETERIZED,      // parameterized type
        WILDCARD,           // wildcard type
        VARIABLE,           // type variable that is attached to a TypeVariableSource
        VARIABLE_SYMBOLIC;  // type variable that is merely symbolic and is not attached to a TypeVariableSource
    }
}
```

## 示例

### TypeDefinition.Sort

#### NON_GENERIC

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDefinition.Sort sort = strType.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        String className = "sample.HelloWorld";
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);
        DynamicType.Unloaded<?> unloaded = builder.make();
        TypeDescription type = unloaded.getTypeDescription();
        unloaded.close();

        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = NON_GENERIC
```

#### GENERIC_ARRAY: `A[]`

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription.Generic A_type = TypeDescription.Generic.Builder.typeVariable("A").build();
        TypeDescription.Generic type = TypeDescription.Generic.Builder.of(A_type).asArray().build();
        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = GENERIC_ARRAY
```

#### PARAMETERIZED: `List<String>`

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;
import java.util.List;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        // List<String>
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder
                .parameterizedType(listType, strType)
                .build();
        TypeDefinition.Sort sort = listOfString.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = PARAMETERIZED
```

#### WILDCARD: `*`

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription.Generic type = TypeDescription.Generic.Builder.unboundWildcard();
        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = WILDCARD
```

#### VARIABLE

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException {
        TypeDescription comparableType = TypeDescription.ForLoadedType.of(Comparable.class);
        TypeDescription.Generic type = comparableType.findExpectedVariable("T");
        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = VARIABLE
```

#### VARIABLE_SYMBOLIC: `A`

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription.Generic type = TypeDescription.Generic.Builder
                .typeVariable("A")
                .build();
        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```

