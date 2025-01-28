---
title: "object"
sequence: "103"
---

## 无属性

### Person

```java
public class Person {
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Person instance = new Person();
        ClassLayout classLayout = ClassLayout.parseInstance(instance);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf800c143
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

### Object

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Object instance = new Object();
        ClassLayout classLayout = ClassLayout.parseInstance(instance);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```



## Field: boolean

```java
public class Person {
    private boolean myValue;
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Person instance = new Person();
        ClassLayout classLayout = ClassLayout.parseInstance(instance);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4           (object header: class)    0xf800c143
 12   1   boolean Person.myValue            false
 13   3           (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

## Field: name + age

```java
public class Person {
    private String name;
    private int age;
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ               TYPE DESCRIPTION               VALUE
  0   8                    (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4                    (object header: class)    0xf800c143
 12   4                int Person.age                0
 16   4   java.lang.String Person.name               null
 20   4                    (object alignment gap)    
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

`Person` 对象总大小为 24 byte，对象头占用 12 byte
- 前 8 byte 代表 markword，对象运行时数据状态，前8个字节低3位001代表无锁状，
- 后4个字节代表对象指向类元数据的指针；
- User实例数据是8个字节，有属性name和age，其中name是String类型,不过这里有个问题，显示string的字节长度是4，value显示object，我们都知道内部实现是byte[]，其中4字节指代对象内存指针，age是int类型，默认4个字节，value直接显示值；对象头+实例数据=20不是8字节倍数，所以填充4个字节为24个字节

