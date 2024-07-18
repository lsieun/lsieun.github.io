---
title: "接口 Interface"
sequence: "102"
---

## 示例

### 示例一：Marker Interface

预期目标：

```java
public interface HelloWorld {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例二：实现接口

预期目标：

```java
public interface HelloWorld extends Cloneable, Serializable {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface(
                        Cloneable.class,
                        Serializable.class
                )
                .name(className);

        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例三：添加字段

预期目标：

```java
public interface HelloWorld {
    String str = "HelloWorld";
}
```

编码实现：

````java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.FieldManifestation;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        builder = builder.defineField(
                        "str",
                        String.class,
                        Visibility.PUBLIC,
                        Ownership.STATIC,
                        FieldManifestation.FINAL
                )
                .value("HelloWorld");

        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例四：添加方法

预期目标：

```java
public interface HelloWorld {
    void test();
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withoutCode();

        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```













