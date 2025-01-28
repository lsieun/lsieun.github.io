---
title: "Quick Start"
sequence: "102"
---

## pom.xml

```xml
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.17</version>
</dependency>
```

## VM

```java
import org.openjdk.jol.vm.VM;

public class VMRun {
    public static void main(String[] args) {
        System.out.println(VM.current().details());
    }
}
```

```text
# VM mode: 64 bits
# Compressed references (oops): 3-bit shift
# Compressed class pointers: 3-bit shift
# Object alignment: 8 bytes
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            4,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    4,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    16,   16,   16,   16,   16,   16,   16,   16,   16
```

## Class

```java
public class SimpleInt {
    private int state;
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class ClazzRun {
    public static void main(String[] args) {
        String str = ClassLayout.parseClass(SimpleInt.class).toPrintable();
        System.out.println(str);
    }
}
```

```text
SimpleInt object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     N/A
  8   4        (object header: class)    N/A
 12   4    int SimpleInt.state           N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

## Object

```java
import org.openjdk.jol.info.ClassLayout;

public class ObjRun {
    public static void main(String[] args) {
        SimpleInt instance = new SimpleInt();
        String str = ClassLayout.parseInstance(instance).toPrintable();
        System.out.println(str);
    }
}
```

```text
SimpleInt object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf800c143
 12   4    int SimpleInt.state           0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```
