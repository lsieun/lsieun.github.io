---
title: "ByteOrder"
sequence: "102"
---

[UP](/java-nio.html)


This class is a type-safe enumeration of byte orders used by the `ByteBuffer` class.

```text
public final class ByteOrder
```

The two constant fields define the two legal byte order values.
`BIG_ENDIAN` byte order means most-significant byte first. `LITTLE_ENDIAN` means least-significant byte first. 

```text
    /**
     * Constant denoting big-endian byte order.  In this order, the bytes of a
     * multibyte value are ordered from most significant to least significant.
     */
    public static final ByteOrder BIG_ENDIAN = new ByteOrder("BIG_ENDIAN");

    /**
     * Constant denoting little-endian byte order.  In this order, the bytes of
     * a multibyte value are ordered from least significant to most
     * significant.
     */
    public static final ByteOrder LITTLE_ENDIAN = new ByteOrder("LITTLE_ENDIAN");
```

The static `nativeOrder()` method returns
whichever of these two constants represents **the native byte order** of
the **underlying operating system and hardware**.

```text
import java.nio.ByteOrder;

public class ByteOrderTest {
    public static void main(String[] args) {
        ByteOrder value = ByteOrder.nativeOrder();
        System.out.println(value);
    }
}
```

Finally, the `toString()` method returns the string “BIG_ENDIAN” or “LITTLE_ENDIAN”.
