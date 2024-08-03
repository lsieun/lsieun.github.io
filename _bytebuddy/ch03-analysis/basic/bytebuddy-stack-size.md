---
title: "StackSize"
sequence: "105"
---

```java
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.bytecode.StackSize;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        Class<?>[] array = {int.class, long.class};
        for (Class<?> clazz : array) {
            TypeDescription typeDescription = TypeDescription.ForLoadedType.of(clazz);
            StackSize stackSize = typeDescription.getStackSize();
            String msg = String.format("%s : %s", clazz.getName(), stackSize.getSize());
            System.out.println(msg);
        }
    }
}
```
