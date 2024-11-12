---
title: "Record"
sequence: "105"
---

预期目标：

```java
public record HelloWorld(String name, int age) {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeRecord()
                .name(className)
                .defineRecordComponent("name", String.class)
                .defineRecordComponent("age", int.class);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
