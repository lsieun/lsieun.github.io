---
title: "String Split"
sequence: "101"
---

## String.split()

用逗号（`,`）分隔：

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String[] splitted = "peter,james,thomas".split(",");
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[peter, james, thomas]
```

用空格（` `）分隔：

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String[] splitted = "car jeep scooter".split(" ");
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[car, jeep, scooter]
```

用点（`.`）分隔：

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String[] splitted = "192.168.1.178".split("\\.");
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[192, 168, 1, 178]
```

Let's now split by multiple characters – a comma, space, and hyphen through regex:

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String[] splitted = "b a, e, l.d u, n g".split("\\s+|,\\s*|\\.\\s*");
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[b, a, e, l, d, u, n, g]
```

## Split and Trim

Sometimes a given `String` contains some leading, trailing, or extra spaces around the delimiter.

Let's see how we can handle splitting the input and trimming the results in one go.

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String input = " car , jeep, scooter ";
        String[] splitted = input.trim().split("\\s*,\\s*");
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[car, jeep, scooter]
```

Here, `trim()` method removes leading and trailing spaces in the input string,
and the **regex itself** handles the extra spaces around delimiter.

We can achieve the same result by using Java 8 Stream features:

```java
import java.util.Arrays;

public class TextSplit {
    public static void main(String[] args) {
        String input = " car , jeep, scooter ";
        String[] splitted = Arrays.stream(input.split(","))
                .map(String::trim)
                .toArray(String[]::new);
        System.out.println(Arrays.toString(splitted));
    }
}
```

```text
[car, jeep, scooter]
```

## Guava

Finally, there's a nice `Splitter` fluent API in Guava as well:

```java
import com.google.common.base.Splitter;

import java.util.List;

public class TextSplit {
    public static void main(String[] args) {
        List<String> resultList = Splitter.on(',')
                .trimResults()
                .omitEmptyStrings()
                .splitToList("car,jeep,, scooter");
        System.out.println(resultList);
    }
}
```

```text
[car, jeep, scooter]
```

## Apache Commons Lang3

Apache's common lang package provides a `StringUtils` class – which contains a null-safe `split()` method,
that splits using whitespace as the **default** delimiter.

Furthermore, it **ignores extra spaces**.

```java
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;

public class TextApacheSplit {
    public static void main(String[] args) {
        String[] splitted1 = StringUtils.split("car jeep scooter");
        System.out.println(Arrays.toString(splitted1));

        String[] splitted2 = StringUtils.split("car   jeep  scooter");
        System.out.println(Arrays.toString(splitted2));
    }
}
```

```text
[car, jeep, scooter]
[car, jeep, scooter]
```
