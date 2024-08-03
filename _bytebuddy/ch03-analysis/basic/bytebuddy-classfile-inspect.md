---
title: "查看类的信息"
sequence: "101"
---

## 类型判断

### 名称信息

在 `TypeDescription` 类层次结构中，有许多与名称（`name`）相关的方法：

```text
                ┌─── getActualName()
                │
                │                       ┌─── getName()
                ├─── WithRuntimeName ───┤
NamedElement ───┤                       └─── getInternalName()
                │
                │                       ┌─── getTypeName()
                │                       │
                └─── TypeDefinition ────┤                       ┌─── getCanonicalName()
                                        │                       │
                                        └─── TypeDescription ───┼─── getSimpleName()
                                                                │
                                                                └─── getLongSimpleName()
```

```java
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;
import java.util.concurrent.Callable;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        Class<?> clazz = Callable.class;
        TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);

        String[][] matrix = {
                {"Method", "Value"},
                {"getActualName()", typeDescription.getActualName()},
                {"getName()", typeDescription.getName()},
                {"getInternalName()", typeDescription.getInternalName()},
                {"getTypeName()", typeDescription.getTypeName()},
                {"getCanonicalName()", typeDescription.getCanonicalName()},
                {"getSimpleName()", typeDescription.getSimpleName()},
                {"getLongSimpleName()", typeDescription.getLongSimpleName()},
        };
        TableUtils.printTable(matrix, TableType.MARKDOWN);
    }
}
```

```text
| Method              | Value                         |
|---------------------|-------------------------------|
| getName()           | java.util.concurrent.Callable |
| getTypeName()       | java.util.concurrent.Callable |
| getActualName()     | java.util.concurrent.Callable |
| getCanonicalName()  | java.util.concurrent.Callable |
| getInternalName()   | java/util/concurrent/Callable |
| getSimpleName()     | Callable                      |
| getLongSimpleName() | Callable                      |
```

### 修饰符信息

{:refdef: style="text-align: center;"}
![](/assets/images/bytebuddy/description/modifier-reviewable-for-type-definition.png)
{:refdef}

```java
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        Class<?> clazz = Integer.class;
        TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);

        String[][] matrix = {
                {"Method", "Value"},
                {"getModifiers()", String.valueOf(typeDescription.getModifiers())},
                {"isSynthetic()", String.valueOf(typeDescription.isSynthetic())},
                {"getSyntheticState()", String.valueOf(typeDescription.getSyntheticState())},
                {"isPublic()", String.valueOf(typeDescription.isPublic())},
                {"isProtected()", String.valueOf(typeDescription.isProtected())},
                {"isPackagePrivate()", String.valueOf(typeDescription.isPackagePrivate())},
                {"isPrivate()", String.valueOf(typeDescription.isPrivate())},
                {"getVisibility()", String.valueOf(typeDescription.getVisibility())},
                {"isStatic()", String.valueOf(typeDescription.isStatic())},
                {"getOwnership()", String.valueOf(typeDescription.getOwnership())},
                {"isDeprecated()", String.valueOf(typeDescription.isDeprecated())},
                {"isEnum()", String.valueOf(typeDescription.isEnum())},
                {"getEnumerationState()", String.valueOf(typeDescription.getEnumerationState())},
                {"isAbstract()", String.valueOf(typeDescription.isAbstract())},
                {"isInterface()", String.valueOf(typeDescription.isInterface())},
                {"isAnnotation()", String.valueOf(typeDescription.isAnnotation())},
                {"getTypeManifestation()", String.valueOf(typeDescription.getTypeManifestation())},
        };
        TableUtils.printTable(matrix, TableType.MARKDOWN);
    }
}
```

```text
| Method                 | Value  |
|------------------------|--------|
| getModifiers()         | 17     |
| isSynthetic()          | false  |
| getSyntheticState()    | PLAIN  |
| isPublic()             | true   |
| isProtected()          | false  |
| isPackagePrivate()     | false  |
| isPrivate()            | false  |
| getVisibility()        | PUBLIC |
| isStatic()             | false  |
| getOwnership()         | MEMBER |
| isDeprecated()         | false  |
| isEnum()               | false  |
| getEnumerationState()  | PLAIN  |
| isAbstract()           | false  |
| isInterface()          | false  |
| isAnnotation()         | false  |
| getTypeManifestation() | FINAL  |
```

## 父类和接口

```java
import java.io.Serializable;

public class HelloWorld implements Comparable<HelloWorld>, Serializable {

    private final int val;

    public HelloWorld() {
        this(0);
    }

    public HelloWorld(int val) {
        this.val = val;
    }

    @Override
    public int compareTo(HelloWorld another) {
        return this.val - another.val;
    }
}
```

```java
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.description.type.TypeList;
import sample.HelloWorld;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        Class<?> clazz = HelloWorld.class;
        TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);

        TypeList.Generic interfaces = typeDescription.getInterfaces();
        int size = interfaces.size();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            TypeDescription.Generic type = interfaces.get(i);
            String typeName = type.getTypeName();
            sb.append(typeName).append(" ");
        }

        String[][] matrix = {
                {"Method", "Value"},
                {"getSuperClass()", typeDescription.getSuperClass().getTypeName()},
                {"getInterfaces()", sb.toString()},
        };
        TableUtils.printTable(matrix, TableType.MARKDOWN);
    }
}
```

```text
| Method          | Value                                                         |
|-----------------|---------------------------------------------------------------|
| getSuperClass() | java.lang.Object                                              |
| getInterfaces() | java.lang.Comparable<sample.HelloWorld> java.io.Serializable  |
```

## 字段

```java
public class HelloWorld {

    private String name;
    private int age;
}
```

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.field.FieldList;
import net.bytebuddy.description.type.TypeDescription;
import sample.HelloWorld;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        // 第 1 步，将 Class 转换为 TypeDescription
        Class<?> clazz = HelloWorld.class;
        TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);

        // 第 2 步，从 TypeDescription 中获取 FieldList
        FieldList<FieldDescription.InDefinedShape> fields = typeDescription.getDeclaredFields();
        int size = fields.size();

        // 第 3 步，查看 FieldDescription 的详细信息
        for (int i = 0; i < size; i++) {
            FieldDescription fd = fields.get(i);
            String fieldName = fd.getName();
            TypeDescription.Generic fieldType = fd.getType();
            String info = String.format("%s: %s", fieldName, fieldType.getTypeName());
            System.out.println(info);
        }
    }
}
```

## 方法

```java
public class HelloWorld {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %s", name, age);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.method.ParameterDescription;
import net.bytebuddy.description.method.ParameterList;
import net.bytebuddy.description.type.TypeDescription;
import sample.HelloWorld;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        // 第 1 步，将 Class 转换为 TypeDescription
        Class<?> clazz = HelloWorld.class;
        TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);

        // 第 2 步，从 TypeDescription 中获取 MethodList
        MethodList<MethodDescription.InDefinedShape> methods = typeDescription.getDeclaredMethods();
        int size = methods.size();

        // 第 3 步，查看 MethodDescription 的详细信息
        for (int i = 0; i < size; i++) {
            MethodDescription md = methods.get(i);
            String methodName = md.getName();
            TypeDescription.Generic returnType = md.getReturnType();
            ParameterList<?> parameters = md.getParameters();


            String info = String.format("%s: %s", methodName, returnType.getTypeName());
            System.out.println(info);
            for (ParameterDescription pd : parameters) {
                String paramName = pd.getName();
                TypeDescription.Generic paramType = pd.getType();
                String paramInfo = String.format("    %s: %s", paramName, paramType);
                System.out.println(paramInfo);
            }
        }
    }
}
```

```text
sample.HelloWorld: void
test: java.lang.String
    arg0: class java.lang.String
    arg1: int
```
