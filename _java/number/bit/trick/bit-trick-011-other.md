---
title: "Bitwise Tricks"
sequence: "111"
---

Some of these problems include:

- Checking for odd and even numbers in a sequence
- Counting set bits in an integer
- Multiplying two numbers using bitwise operators (Russian Peasant)
- Generating n-bit Gray Codes
- Detecting if two integers have opposite signs
- Adding 1 to a given number

## Common Bitwise Tricks



### XOR: Single Number

Find the element in an array that is not repeated.

Input: `nums = { 4, 1, 2, 9, 1, 4, 2 }`

Output: `9`

```java
class SingleNumber {
    private static int singleNumber(int[] nums) {
        int xor = 0;
        for (int num : nums) {
            xor ^= num;
        }
        return xor;
    }
 
    public static void main(String[] args) {
        int[] nums = {4, 1, 2, 9, 1, 4, 2};
        System.out.println("Element appearing one time is " + singleNumber(nums));
    }
}
```

This solution relies on the following logic:

- If we take XOR of zero and some bit, it will return that bit: `a ^ 0 = a`
- If we take XOR of two same bits, it will return 0: `a ^ a = 0`
- For n numbers, the below math can be applied: `a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b`




## Number

### XOR: 符号判断

Determine if the sign of two numbers are different:

```text
int x = -1, y = 2;
bool f = ((x ^ y) < 0); // true

int x = 3, y = 2;
bool f = ((x ^ y) < 0); // false
```

### AND: 偶数判断

This one tests your knowledge of how **AND** works and how even/odd numbers differ in binary.

```text
(x & 1 ) == 0
```



### XOR: 是否相等



```java
public class HelloWorld {
    static void areSame(int a, int b) {
        if ((a ^ b) != 0) {
            System.out.print("Not Same");
        }
        else {
            System.out.print("Same");
        }
    }

    public static void main(String[] args) {
        areSame(10, 20);
    }
}
```

### 平均数

Fast average of two numbers

```java
public class HelloWorld {
    static int floorAvg(int x, int y) {
        return (x + y) >> 1;
    }

    public static void main(String[] args) {
        int x = 10, y = 20;
        System.out.print(floorAvg(x, y));
    }
}
```

```java
public class HelloWorld {
    static int getAverage(int x, int y) {
        // Calculate the average
        // Floor value of (x + y) / 2
        int avg = (x & y) + ((x ^ y) >> 1);

        return avg;
    }

    public static void main(String[] args) {
        int x = 10, y = 20;
        System.out.print(getAverage(x, y));
    }
}
```

### OR: Number of Flips

Write a program that takes 3 integers and uses the lowest number of flips to make the sum of the first two numbers equal to the third.
The program will return the number of flips required.

> A flip is changing one single bit to the opposite value ie. `1 --> 0` or `0 --> 1`.

Input: `a = 2`, `b = 6`, `c = 5`

Output: `3`

```java
class MinFlips {
    private static int helper(int a, int b, int c) {
        int ans = 0;
        for (int i = 0; i < 32; i++) {
            int bitC = ((c >> i) & 1);
            int bitA = ((a >> i) & 1);
            int bitB = ((b >> i) & 1);
 
            if ((bitA | bitB) != bitC) {
                ans += (bitC == 0) ? (bitA == 1 && bitB == 1) ? 2 : 1 : 1;
            }
        }
        return ans;
    }
 
    public static void main(String[] args) {
        int a = 2;
        int b = 6;
        int c = 5;
        System.out.println("Min Flips required to make two numbers equal to third is : " + helper(a, b, c));
    }
}
```

### Show Off

The following three operations just Show off. No practical use. We just know it.

Swap two Numbers:

```text
int a = 1, b = 2;
a ^= b;
b ^= a;
a ^= b;
// 现在 a = 2, b = 1
```

Plus one:

```text
int n = 1;
n = -~n;
// 现在 n = 2
```

Minus one:

```text
int n = 2;
n = ~-n;
// 现在 n = 1
```

## References

- [Some Useful Bit Manipulations](https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/commonbitmanipulation)
- [常用的位操作](https://labuladong.gitee.io/algo/4/28/108/)
- [Bit Twiddling Hacks](https://graphics.stanford.edu/~seander/bithacks.html)
