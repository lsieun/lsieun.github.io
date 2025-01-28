---
title: "Array"
sequence: "101"
---

## Unsafe

```java
public final class Unsafe {
    /**
     * Report the offset of the first element in the storage allocation of a given array class.
     * If {@link #arrayIndexScale} returns a non-zero value for the same class,
     * you may use that scale factor, together with this base offset,
     * to form new offsets to access elements of arrays of the given class.
     */
    public native int arrayBaseOffset(Class<?> arrayClass);

    /** The value of {@code arrayBaseOffset(boolean[].class)} */
    public static final int ARRAY_BOOLEAN_BASE_OFFSET = theUnsafe.arrayBaseOffset(boolean[].class);

    /** The value of {@code arrayBaseOffset(byte[].class)} */
    public static final int ARRAY_BYTE_BASE_OFFSET = theUnsafe.arrayBaseOffset(byte[].class);

    /** The value of {@code arrayBaseOffset(short[].class)} */
    public static final int ARRAY_SHORT_BASE_OFFSET = theUnsafe.arrayBaseOffset(short[].class);

    /** The value of {@code arrayBaseOffset(char[].class)} */
    public static final int ARRAY_CHAR_BASE_OFFSET = theUnsafe.arrayBaseOffset(char[].class);

    /** The value of {@code arrayBaseOffset(int[].class)} */
    public static final int ARRAY_INT_BASE_OFFSET = theUnsafe.arrayBaseOffset(int[].class);

    /** The value of {@code arrayBaseOffset(long[].class)} */
    public static final int ARRAY_LONG_BASE_OFFSET = theUnsafe.arrayBaseOffset(long[].class);

    /** The value of {@code arrayBaseOffset(float[].class)} */
    public static final int ARRAY_FLOAT_BASE_OFFSET = theUnsafe.arrayBaseOffset(float[].class);

    /** The value of {@code arrayBaseOffset(double[].class)} */
    public static final int ARRAY_DOUBLE_BASE_OFFSET = theUnsafe.arrayBaseOffset(double[].class);

    /** The value of {@code arrayBaseOffset(Object[].class)} */
    public static final int ARRAY_OBJECT_BASE_OFFSET = theUnsafe.arrayBaseOffset(Object[].class);

    /**
     * Report the scale factor for addressing elements in the storage allocation of a given array class.
     * However, arrays of "narrow" types
     * will generally not work properly with accessors like {@link #getByte(Object, int)},
     * so the scale factor for such classes is reported as zero.
     */
    public native int arrayIndexScale(Class<?> arrayClass);

    /** The value of {@code arrayIndexScale(boolean[].class)} */
    public static final int ARRAY_BOOLEAN_INDEX_SCALE = theUnsafe.arrayIndexScale(boolean[].class);

    /** The value of {@code arrayIndexScale(byte[].class)} */
    public static final int ARRAY_BYTE_INDEX_SCALE = theUnsafe.arrayIndexScale(byte[].class);

    /** The value of {@code arrayIndexScale(short[].class)} */
    public static final int ARRAY_SHORT_INDEX_SCALE = theUnsafe.arrayIndexScale(short[].class);

    /** The value of {@code arrayIndexScale(char[].class)} */
    public static final int ARRAY_CHAR_INDEX_SCALE = theUnsafe.arrayIndexScale(char[].class);

    /** The value of {@code arrayIndexScale(int[].class)} */
    public static final int ARRAY_INT_INDEX_SCALE = theUnsafe.arrayIndexScale(int[].class);

    /** The value of {@code arrayIndexScale(long[].class)} */
    public static final int ARRAY_LONG_INDEX_SCALE = theUnsafe.arrayIndexScale(long[].class);

    /** The value of {@code arrayIndexScale(float[].class)} */
    public static final int ARRAY_FLOAT_INDEX_SCALE = theUnsafe.arrayIndexScale(float[].class);

    /** The value of {@code arrayIndexScale(double[].class)} */
    public static final int ARRAY_DOUBLE_INDEX_SCALE = theUnsafe.arrayIndexScale(double[].class);

    /** The value of {@code arrayIndexScale(Object[].class)} */
    public static final int ARRAY_OBJECT_INDEX_SCALE = theUnsafe.arrayIndexScale(Object[].class);
}
```

## Example

### Example01

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class ArrayRun {
    public static void main(String[] args) throws Exception {
        Field f = Unsafe.class.getDeclaredField("theUnsafe");
        f.setAccessible(true);
        Unsafe unsafe = (Unsafe) f.get(null);

        // 获取一个 int 类型数组对象的 对象头的字节长度
        int base = unsafe.arrayBaseOffset(int[].class);
        System.out.println("base = " + base); // base = 16

        // 计算指定数据类型的数组中每个元素所占用的内存空间
        // 在 int[] 类型的数据里，每个元素是 int 类型，占用 4 个字节
        int scale = unsafe.arrayIndexScale(int[].class);
        System.out.println("scale = " + scale); // scale = 4

        // 计算传入的数字在二进制表示下，从左开始有多少个连续的 0
        // 4 的二进制是 100，占用 3 bit，一个 int 类型有 32 bit，那么 32 - 3 = 29
        int numberOfLeadingZeros = Integer.numberOfLeadingZeros(scale);
        System.out.println("numberOfLeadingZeros = " + numberOfLeadingZeros); // numberOfLeadingZeros = 29
    }
}
```

```text
base = 16
scale = 4
numberOfLeadingZeros = 29
```

```java
import org.openjdk.jol.info.ClassLayout;

public class ObjRun {
    public static void main(String[] args) {
        int[] array = new int[8];
        String str = ClassLayout.parseInstance(array).toPrintable();
        System.out.println(str);
    }
}
```

```text
[I object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)    // markword 占用 8 字节
  8   4        (object header: class)    0xf800016d                                   // klass pointer 占用 4 字节
 12   4        (array length)            8                                            // 数组长度占用 4 字节
 16  32    int [I.<elements>             N/A                                          // 当前偏移量 = 8 + 4 + 4 = 16
Instance size: 48 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

### Example02

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class ArrayBaseAndIndexRun {
    public static void main(String[] args) throws Exception {
        Field[] fields = Unsafe.class.getDeclaredFields();
        printValue(fields, "ARRAY", "BASE_OFFSET");
        System.out.println("================================");

        printValue(fields, "ARRAY", "INDEX_SCALE");
        System.out.println("================================");
    }

    private static void printValue(Field[] fields, String prefix, String suffix) throws Exception {
        for (Field f : fields) {
            String name = f.getName();
            if (name.startsWith(prefix) && name.endsWith(suffix)) {
                Object value = f.get(null);
                System.out.println(name + ": " + value);
            }
        }
    }
}
```

```text
ARRAY_BOOLEAN_BASE_OFFSET: 16
ARRAY_BYTE_BASE_OFFSET: 16
ARRAY_SHORT_BASE_OFFSET: 16
ARRAY_CHAR_BASE_OFFSET: 16
ARRAY_INT_BASE_OFFSET: 16
ARRAY_LONG_BASE_OFFSET: 16
ARRAY_FLOAT_BASE_OFFSET: 16
ARRAY_DOUBLE_BASE_OFFSET: 16
ARRAY_OBJECT_BASE_OFFSET: 16
================================
ARRAY_BOOLEAN_INDEX_SCALE: 1
ARRAY_BYTE_INDEX_SCALE: 1
ARRAY_SHORT_INDEX_SCALE: 2
ARRAY_CHAR_INDEX_SCALE: 2
ARRAY_INT_INDEX_SCALE: 4
ARRAY_LONG_INDEX_SCALE: 8
ARRAY_FLOAT_INDEX_SCALE: 4
ARRAY_DOUBLE_INDEX_SCALE: 8
ARRAY_OBJECT_INDEX_SCALE: 4
================================
```
