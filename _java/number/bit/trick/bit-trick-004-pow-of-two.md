---
title: "2 的 N 次方"
sequence: "104"
---

## AND: 指数判断

如何判断一个数是否为 2 的 N 次方。

如果它是 2 的 N 次方，那么它的二进制表示中只包含一个 `1`：

```text
2^0 = 1 = 0b0001
2^1 = 2 = 0b0010
2^2 = 4 = 0b0100
```

### 方式一

第一种实现方式：

```text
public static boolean isPowerOfTwo1(int n) {
    if (n <= 0) return false;
    return (n & (n - 1)) == 0;
}
```

### 方式二

第二种实现方式，在 Netty 的 `DefaultEventExecutorChooserFactory` 类中使用了下面的实现：

```text
public static boolean isPowerOfTwo2(int n) {
    if (n <= 0) return false;
    return (n & -n) == n;
}
```

### 示例

```java
public class HelloWorld {
    public static void main(String[] args) {
        int val = 0x80000000;
        System.out.println("val = " + val);
        System.out.println(isPowerOfTwo1(val));
        System.out.println(isPowerOfTwo2(val));
    }

    public static boolean isPowerOfTwo1(int n) {
        if (n <= 0) return false;
        return (n & (n - 1)) == 0;
    }

    public static boolean isPowerOfTwo2(int n) {
        if (n <= 0) return false;
        return (n & -n) == n;
    }
}
```

## 最小指数：位移

目标：给定一个数，找出大于或等于它的最小的 2 的 N 次方。

### 方式一

```java
public class HelloWorld {

    private static int getMinPowOfTwo(int c) {
        int n = c - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return n + 1;
    }

    public static void main(String[] args) {
        int n = 100;
        int minPowOfTwo = getMinPowOfTwo(n);
        System.out.println("minPowOfTwo = " + minPowOfTwo);
    }
}
```

这段代码是一个常见的用于计算大于等于给定数字 c 的最接近的 2 的幂次方的方法。
具体来说，它会将 n 初始化为 c - 1，然后通过连续的按位或操作（>>> 表示无符号右移）来确保 n 的所有位都被设置为从最高位到最低位的所有位的“1”。
这样一来，n 最终的值将是大于等于 c 的最接近的 2 的幂次方。

```text
// n |= n >>> 1
00100000000000000000000000000000    ---> n
00010000000000000000000000000000    ---> n >>> 1
00110000000000000000000000000000    ---> n | (n >>> 1)

// n |= n >>> 2
00110000000000000000000000000000
00001100000000000000000000000000
00111100000000000000000000000000

// n |= n >>> 4
00111100000000000000000000000000
00000011110000000000000000000000
00111111110000000000000000000000

// n |= n >>> 8
00111111110000000000000000000000
00000000001111111100000000000000
00111111111111111100000000000000

// n |= n >>> 16
00111111111111111100000000000000
00000000000000000011111111111111
00111111111111111111111111111111

// n + 1
01000000000000000000000000000000
```

### 方式二

在 Netty 中，`MathUtil.findNextPositivePowerOfTwo()` 方法的实现：

```java
public final class MathUtil {
    public static int findNextPositivePowerOfTwo(final int value) {
        assert value > Integer.MIN_VALUE && value < 0x40000000;
        return 1 << (32 - Integer.numberOfLeadingZeros(value - 1));
    }

    public static int safeFindNextPositivePowerOfTwo(final int value) {
        return value <= 0 ? 1 : value >= 0x40000000 ? 0x40000000 : findNextPositivePowerOfTwo(value);
    }
}
```

### 示例

```java
public class HelloWorld {
    public static void main(String[] args) {
        int val = 0x99;
        System.out.println("val = " + val);
        System.out.println(findNextPositivePowerOfTwo1(val));
        System.out.println(findNextPositivePowerOfTwo2(val));
    }

    private static int findNextPositivePowerOfTwo1(int c) {
        int n = c - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return n + 1;
    }

    public static int findNextPositivePowerOfTwo2(final int value) {
        assert value > Integer.MIN_VALUE && value < 0x40000000;
        return 1 << (32 - Integer.numberOfLeadingZeros(value - 1));
    }
}
```
