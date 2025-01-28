---
title: "synchronized"
sequence: "105"
---

## 创建简单无锁对象

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

- `OFF` 即 `OFFSET`，表示内存偏移量，单位是 byte
- `SIZE` 表示占用内存大小，单位是 byte
- `TYPE DESCRIPTION` 类型描述，其中 object header 为对象头
- `VALUE` 代表存储值，对应内存中当前存储的值；

对象总大小为 16 个字节，对象头占用 12 个字节，前 8 个字节代表 markword，对象运行时数据状态，
前 64 位的 value 倒序排列拼的 markword 是 16 进制为 00 00 00 00 00 00 00 01，
最后一个字节 01 的二进制是00000001，最后三位001，代表无锁状态，后4个字节代表对象指向类元数据的指针；
空对象没有属性所以实例数据不占内存，对象头+实例数据=12，不是8个倍数，所以补4个字节为16字节

```text
# 十六进制表示
0x0000000000000001 (non-biasable; age: 0)

# 转换成二进制表示
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

## Hash

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Object instance = new Object();
        int hashCode = instance.hashCode();
        System.out.println("HashCode: " + Integer.toHexString(hashCode));

        ClassLayout classLayout = ClassLayout.parseInstance(instance);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
HashCode: 74a14482
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x00000074a1448201 (hash: 0x74a14482; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
# 十六进制
0x00000074a1448201

# 二进制
00000000 00000000 00000000 01110100 10100001 01000100 10000010 00000001
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        Object instance = new Object();
//        int hashCode = instance.hashCode();
//        System.out.println("HashCode: " + Integer.toHexString(hashCode));

        synchronized (instance) {
            ClassLayout classLayout = ClassLayout.parseInstance(instance);
            System.out.println(classLayout.toPrintable());
        }
    }
}
```

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000001fef1f0 (thin lock: 0x0000000001fef1f0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

## 偏向锁

一个对象创建时：

- 如果开启了偏向锁（默认开启），那么对象创建后，markword 值为 `0x05` 即最后 3 位为 `101`，这时它的 thread、epoch、age 都为 0
- 偏向锁是默认是延迟的，不会在程序启动时立即生效，如果想避免延迟，可以加 VM 参数 `-XX:BiasedLockingStartupDelay=0` 来禁用延迟
- 如果没有开启偏向锁，那么对象创建后，markword 值为 `0x01` 即最后 3 位为 `001`，这时它的 hashcode、age 都为 0，第一次用到 hashcode 时才会赋值

```text
-XX:BiasedLockingStartupDelay=0
```

```java
import org.openjdk.jol.info.ClassLayout;

public class SynchronizedMarkWord {
    public static void main(String[] args) throws InterruptedException {
        // 第 1 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());

        Thread.sleep(3000);

        // 第 2 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());

        // 第 3 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());
    }
}
```

第一次测试，输出结果：

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)    // A. 无锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)       // B. 偏向锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)       // B. 偏向锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
0x0000000000000001
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001

0x0000000000000005
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

第二次测试，添加如下 VM 参数：

```text
-XX:BiasedLockingStartupDelay=0
```

输出结果：

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

## 创建轻量级锁对象

```java
public class Person {
    String name;
    Integer age;

    Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Person instance = new Person("tomcat",10);
        Runnable runnable = () -> {

            synchronized (instance) {
                ClassLayout layout = ClassLayout.parseInstance(instance);
                System.out.println(layout.toPrintable());
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        };

        for (int i = 0; i < 1; i++) {
            new Thread(runnable).start();
        }
    }
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ                TYPE DESCRIPTION               VALUE
  0   8                     (object header: mark)     0x000000001f59eed8 (thin lock: 0x000000001f59eed8)
  8   4                     (object header: class)    0xf800c143
 12   4    java.lang.String Person.name               (object)
 16   4   java.lang.Integer Person.age                10
 20   4                     (object alignment gap)    
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
# 十六进制
0x000000001f59eed8

# 二进制
00000000 00000000 00000000 00000000 00011111 01011001 11101110 11011000
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

## 创建重量级锁对象

```java
public class Person {
    String name;
    Integer age;

    Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Person instance = new Person("tomcat",10);
        Runnable runnable = () -> {

            synchronized (instance) {
                ClassLayout layout = ClassLayout.parseInstance(instance);
                System.out.println(layout.toPrintable());
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        };

        for (int i = 0; i < 3; i++) {
            new Thread(runnable).start();
        }
    }
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ                TYPE DESCRIPTION               VALUE
  0   8                     (object header: mark)     0x000000000d37cf2a (fat lock: 0x000000000d37cf2a)
  8   4                     (object header: class)    0xf800c143
 12   4    java.lang.String Person.name               (object)
 16   4   java.lang.Integer Person.age                10
 20   4                     (object alignment gap)    
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
# 十六进制
0x000000000d37cf2a

# 二进制
00000000 00000000 00000000 00000000 00001101 00110111 11001111 00101010
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```
