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

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeRecord()
                .name(className)
                .defineRecordComponent("name", String.class)
                .defineRecordComponent("age", int.class);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
