---
title: "Sort"
sequence: "102"
---

## 示例

### NON_GENERIC

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDefinition.Sort sort = strType.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = NON_GENERIC
```

### PARAMETERIZED

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;
import java.util.List;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        // List<String>
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder
                .parameterizedType(listType, strType)
                .build();
        TypeDefinition.Sort sort = listOfString.getSort();
        System.out.println("sort = " + sort);
    }
}
```

```text
sort = PARAMETERIZED
```

### VARIABLE_SYMBOLIC

```java
import net.bytebuddy.description.type.TypeDefinition;
import net.bytebuddy.description.type.TypeDescription;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        TypeDescription.Generic type = TypeDescription.Generic.Builder
                .typeVariable("A")
                .build();
        TypeDefinition.Sort sort = type.getSort();
        System.out.println("sort = " + sort);
    }
}
```
