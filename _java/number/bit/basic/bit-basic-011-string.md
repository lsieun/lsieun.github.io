---
title: "int 和 long 值转换成 bit 字符串"
sequence: "111"
---

## int to bit string

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        int val = 128;
        String binaryStr = String.format("%32s", Integer.toBinaryString(val)).replace(" ", "0");
        System.out.println(binaryStr);
    }
}
```

输出结果：

```text
00000000000000000000000010000000
```

## long to bit string

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        long val = 123456789L;
        String binaryStr = String.format("%64s", Long.toBinaryString(val)).replace(" ", "0");
        System.out.println(binaryStr);
    }
}
```

输出结果：

```text
0000000000000000000000000000000000000111010110111100110100010101
```
