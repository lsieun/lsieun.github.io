---
title: "Record"
sequence: "104"
---



```java
import java.lang.reflect.Method;
import java.lang.reflect.RecordComponent;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        boolean record = clazz.isRecord();
        System.out.println("isRecord: " + record);
        System.out.println("=== === ===");

        if (record) {
            RecordComponent[] recordComponents = clazz.getRecordComponents();
            for (RecordComponent component : recordComponents) {
                String name = component.getName();
                System.out.println("Name: " + name);

                Class<?> type = component.getType();
                System.out.println("Type: " + type);

                Class<?> declaringRecord = component.getDeclaringRecord();
                System.out.println("Declaring Record: " + declaringRecord);

                Method accessor = component.getAccessor();
                System.out.println("Accessor: " + accessor);

                System.out.println("=== === ===");
            }
        }
    }
}
```

## 示例一

```java
public record HelloWorld(String username, int age) {
}
```

```text
isRecord: true
=== === ===
Name: username
Type: class java.lang.String
Declaring Record: class sample.HelloWorld
Accessor: public java.lang.String sample.HelloWorld.username()
=== === ===
Name: age
Type: int
Declaring Record: class sample.HelloWorld
Accessor: public int sample.HelloWorld.age()
=== === ===
```

## 示例二

```java
import java.util.Date;

public record HelloWorld(String username, int age, Date birthday) {
}
```

```text
isRecord: true
=== === ===
Name: username
Type: class java.lang.String
Declaring Record: class sample.HelloWorld
Accessor: public java.lang.String sample.HelloWorld.username()
=== === ===
Name: age
Type: int
Declaring Record: class sample.HelloWorld
Accessor: public int sample.HelloWorld.age()
=== === ===
Name: birthday
Type: class java.util.Date
Declaring Record: class sample.HelloWorld
Accessor: public java.util.Date sample.HelloWorld.birthday()
=== === ===
```
