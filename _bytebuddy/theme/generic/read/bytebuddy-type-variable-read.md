---
title: "TypeVariable"
sequence: "TypeVariable"
---

```java
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.description.type.TypeList;

import java.util.Map;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException {
        TypeDescription.Generic mapType = TypeDescription.Generic.Builder
                .of(Map.class)
                .build();
        TypeDescription typeDesc = mapType.asErasure();
        TypeList.Generic typeVariables = typeDesc.getTypeVariables();
        for (TypeDescription.Generic type : typeVariables) {
            System.out.println(type);
        }
    }
}
```

输出内容：

```text
K
V
```
