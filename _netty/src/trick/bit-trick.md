---
title: "Bit Trick"
sequence: "101"
---

[UP](/netty.html)

在 Netty 源码中，搜索：

- ` >>> `
- ` >> `
- ` << `
- ` & `
- ` | `

## 2 的 N 次方

给定一个整数 `i`，找出大于或等于 `i` 的 最小 2 的 N 次方。

### 方式一

出现位置：

- Netty 源码：`InternalThreadLocalMap.expandIndexedVariableTableAndSet()`

```java
import lsieun.drawing.theme.table.TableType;
import lsieun.drawing.utils.BitUtils;
import lsieun.drawing.utils.TableUtils;

public class HelloWorld {
    public static int getMinPowOfTwo(int val) {
        int n = val - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return n + 1;
    }


    public static void main(String[] args) {
        int val = 7;

        int result = getMinPowOfTwo(val);
        System.out.println("result = " + result);

        int n = 0b00100000_00000000_00000000_00000000;
        printBinary(n);
    }


    static void printBinary(int n) {
        for (int i = 0; i < 5; i++) {
            int rightShift = 1 << i;
            int shiftedValue = n >>> rightShift;
            int result = n | shiftedValue;

            String[][] matrix = {
                    {"n", BitUtils.fromInt(n)},
                    {"n >>> " + rightShift, BitUtils.fromInt(shiftedValue)},
                    {"n | (n >>> " + rightShift + ")", BitUtils.fromInt(result)}
            };
            TableUtils.printTable(matrix, TableType.ONE_LINE);

            n = result;
        }
    }
}
```

```text
result = 8
┌───────────────┬──────────────────────────────────┐
│       n       │ 00100000000000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│    n >>> 1    │ 00010000000000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│ n | (n >>> 1) │ 00110000000000000000000000000000 │
└───────────────┴──────────────────────────────────┘

┌───────────────┬──────────────────────────────────┐
│       n       │ 00110000000000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│    n >>> 2    │ 00001100000000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│ n | (n >>> 2) │ 00111100000000000000000000000000 │
└───────────────┴──────────────────────────────────┘

┌───────────────┬──────────────────────────────────┐
│       n       │ 00111100000000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│    n >>> 4    │ 00000011110000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│ n | (n >>> 4) │ 00111111110000000000000000000000 │
└───────────────┴──────────────────────────────────┘

┌───────────────┬──────────────────────────────────┐
│       n       │ 00111111110000000000000000000000 │
├───────────────┼──────────────────────────────────┤
│    n >>> 8    │ 00000000001111111100000000000000 │
├───────────────┼──────────────────────────────────┤
│ n | (n >>> 8) │ 00111111111111111100000000000000 │
└───────────────┴──────────────────────────────────┘

┌────────────────┬──────────────────────────────────┐
│       n        │ 00111111111111111100000000000000 │
├────────────────┼──────────────────────────────────┤
│    n >>> 16    │ 00000000000000000011111111111111 │
├────────────────┼──────────────────────────────────┤
│ n | (n >>> 16) │ 00111111111111111111111111111111 │
└────────────────┴──────────────────────────────────┘
```

### 方式二

出现位置：

- Netty 源码：`MathUtil.findNextPositivePowerOfTwo()`

```java
import lsieun.drawing.theme.table.TableType;
import lsieun.drawing.utils.BitUtils;
import lsieun.drawing.utils.TableUtils;

public class HelloWorld {
    public static int findNextPositivePowerOfTwo(final int val) {
        assert val > Integer.MIN_VALUE && val < 0x40000000;
        return 1 << (32 - Integer.numberOfLeadingZeros(val - 1));
    }


    public static void main(String[] args) {
        int val = 7;

        int result = findNextPositivePowerOfTwo(val);
        System.out.println("result = " + result);

        int n = 0b00000000_00010000_00010000_00001000;
        printBinary(n);
    }


    static void printBinary(int val) {
        int val2 = val - 1;
        int leftShift = 32 - Integer.numberOfLeadingZeros(val2);
        int result = 1 << leftShift;
        String[][] matrix = {
                {"Expression", "Binary", "Leading Zeros"},
                {"val", BitUtils.fromInt(val), String.valueOf(Integer.numberOfLeadingZeros(val))},
                {"val - 1", BitUtils.fromInt(val2), String.valueOf(Integer.numberOfLeadingZeros(val2))},
                {"1 << " + leftShift, BitUtils.fromInt(result), String.valueOf(Integer.numberOfLeadingZeros(result))}
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
result = 8
┌────────────┬──────────────────────────────────┬───────────────┐
│ Expression │              Binary              │ Leading Zeros │
├────────────┼──────────────────────────────────┼───────────────┤
│    val     │ 00000000000100000001000000001000 │      11       │
├────────────┼──────────────────────────────────┼───────────────┤
│  val - 1   │ 00000000000100000001000000000111 │      11       │
├────────────┼──────────────────────────────────┼───────────────┤
│  1 << 21   │ 00000000001000000000000000000000 │      10       │
└────────────┴──────────────────────────────────┴───────────────┘
```

## Bit Map

Bit Map 位图，位 映射 X -> Y

是否空间占用

## Chunk - Handle

## Other

### int替换 Integer

LongLongHashMap

### FastThreadLocal

