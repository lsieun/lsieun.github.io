---
title: "计数"
sequence: "101"
---

## AND: Count set bits

Write a Java program to count the number of bits set to `1` (set bits) of an integer.

```java
class CountSetBit {
    private static int helper(int n) {
        int count = 0;
        while (n > 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }
 
    public static void main(String[] args) {
        int number = 125;
        System.out.println("SetBit Count is : " + helper(number));
    }
}
```

`n&(n-1)` 这个操作是算法中常见的，作用是消除数字 `n` 的二进制表示中的最后一个 `1`。

![](/assets/images/java/number/bitwise-n-and-n-minus-1.png)
