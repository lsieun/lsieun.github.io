---
title: "package-info.class"
sequence: "107"
---

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String packageName = "sample";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makePackage(packageName);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
