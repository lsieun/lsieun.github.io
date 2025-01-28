---
title: "Get First Set Bit"
sequence: "102"
---

## Left Shift: Get First Set Bit

Given an integer, find the position of the first set-bit (1) from the right.

Input: `n = 18`

18 in binary = `0b10010`

Output: `2`

```java
class FirstSetBitPosition {
    private static int helper(int n) {
        if (n == 0) {
            return 0;
        }
 
        int k = 1;
 
        while (true) {
            if ((n & (1 << (k - 1))) == 0) {
                k++;
            } else {
                return k;
            }
        }
    }
 
    public static void main(String[] args) {
        System.out.println("First setbit position for number: 18 is -> " + helper(18));
        System.out.println("First setbit position for number: 5 is -> " + helper(5));
        System.out.println("First setbit position for number: 32 is -> " + helper(32));
    }
}
```
