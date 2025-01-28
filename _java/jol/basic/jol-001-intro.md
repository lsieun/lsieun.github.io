---
title: "Intro"
sequence: "101"
---

The HotSpot JVM uses a data structure called **Ordinary Object Pointers (OOPS)** to represent pointers to objects.

在默认情况下，JDK8 是开启指针压缩的，64 位系统的Java Reference 占用 4 byte。

We can disable the compressed references via `-XX:-UseCompressedOops`.

If we change the alignment value to `32` via `-XX:ObjectAlignmentInBytes=32`.
Although the default object alignment is 8 bytes,
this value is configurable using the `-XX:ObjectAlignmentInBytes` tuning flag.
The specified value should be **a power of two** and must be within the range of `8` and `256`.

```java
import org.openjdk.jol.vm.VM;

public class VMRun {
    public static void main(String[] args) {
        System.out.println(VM.current().details());
    }
}
```

不使用 `-XX:-UseCompressedOops` 时，输出结果：

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

解读 1：

```text
# Field sizes by type: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
```

- 第一个 `4` 表示 **Java references** 占用 4 byte
- 第二个和第三个 `1` 分别表示 `boolean` 和 `byte` 分别占用 1 byte
- 第四个和第五个 `2` 分别表示 `char` 和 `short` 分别占用 2 byte
- 第六个和第七个 `4` 分别表示 `int` 和 `float` 分别占用 4 byte
- 第八个和第九个 `8` 分别表示 `long` 和 `double` 分别占用 8 byte

解读 2：

```text
# Array element sizes: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
```

These types consume the same amount of memory even when we use them as **array elements**.

使用 `-XX:-UseCompressedOops` 时，输出结果：

```text
# VM mode: 64 bits
# Compressed references (oops): disabled
# Compressed class pointers: disabled
# Object alignment: 8 bytes
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            8,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    8,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    24,   24,   24,   24,   24,   24,   24,   24,   24
```

使用 `-XX:ObjectAlignmentInBytes=32` 时，输出结果：

```text
# VM mode: 64 bits
# Compressed references (oops): 5-bit shift    # A.
# Compressed class pointers: 5-bit shift       # A.
# Object alignment: 32 bytes                   # A. 注意，这里发生了变化
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            4,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    4,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    16,   16,   16,   16,   16,   16,   16,   16,   16
```

同时使用 `-XX:-UseCompressedOops` 和 `-XX:ObjectAlignmentInBytes=32` 时，输出结果：

```text
# VM mode: 64 bits
# Compressed references (oops): disabled    # A.
# Compressed class pointers: disabled       # A.
# Object alignment: 32 bytes                # A. 注意，这里发生了变化
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            8,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    8,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    24,   24,   24,   24,   24,   24,   24,   24,   24
```
