---
title: "array"
sequence: "104"
---

## 示例一

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        int[] array = new int[0];
        ClassLayout classLayout = ClassLayout.parseInstance(array);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
[I object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf800016d
 12   4        (array length)            0
 16   0    int [I.<elements>             N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

## `int[3]`

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        int[] array = new int[3];
        array[0] = 1;
        array[1] = 2;
        array[2] = 3;

        ClassLayout classLayout = ClassLayout.parseInstance(array);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
[I object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf800016d
 12   4        (array length)            3
 16  12    int [I.<elements>             N/A
 28   4        (object alignment gap)    
Instance size: 32 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

## `boolean[3]`

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        boolean[] array = new boolean[3];

        ClassLayout classLayout = ClassLayout.parseInstance(array);
        System.out.println(classLayout.toPrintable());
    }
}
```

```text
[Z object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4           (object header: class)    0xf8000005
 12   4           (array length)            3
 16   3   boolean [Z.<elements>             N/A
 19   5           (object alignment gap)    
Instance size: 24 bytes
Space losses: 0 bytes internal + 5 bytes external = 5 bytes total
```
