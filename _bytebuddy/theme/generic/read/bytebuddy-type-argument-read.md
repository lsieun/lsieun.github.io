---
title: "TypeArgument"
sequence: "TypeArgument"
---

## 示例

### Generic

#### getTypeArguments

```java
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.description.type.TypeList;

import java.util.Date;
import java.util.Map;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException {
        // Map<Integer, Date>
        TypeDescription mapType = TypeDescription.ForLoadedType.of(Map.class);
        TypeDescription intType = TypeDescription.ForLoadedType.of(Integer.class);
        TypeDescription dateType = TypeDescription.ForLoadedType.of(Date.class);
        TypeDescription.Generic mapOfIntAndDate = TypeDescription.Generic.Builder
                .parameterizedType(mapType, intType, dateType)
                .build();

        // Type Arguments
        TypeList.Generic typeArguments = mapOfIntAndDate.getTypeArguments();
        for (TypeDescription.Generic type : typeArguments) {
            System.out.println(type);
        }
    }
}
```

```text
class java.lang.Integer
class java.util.Date
```

#### findBindingOf

```java
import net.bytebuddy.description.type.TypeDescription;

import java.util.List;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException {
        // <E>
        TypeDescription.Generic typeVariable = TypeDescription.Generic.Builder.typeVariable("E").build();

        // List<String>
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder
                .parameterizedType(listType, strType)
                .build();

        // String
        TypeDescription.Generic payloadType = listOfString.findBindingOf(typeVariable);
        System.out.println(payloadType);
    }
}
```

```text
class java.lang.String
```

