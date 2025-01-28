---
title: "Interface: Add and Remove"
sequence: "101"
---

## 添加接口

修改前：

```java
public class HelloWorld {
}
```

修改后：

```java
import java.io.Serializable;

public class HelloWorld implements Serializable, Cloneable {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .implement(Serializable.class, Cloneable.class);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

