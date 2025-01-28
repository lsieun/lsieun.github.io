---
title: "Bit Map"
sequence: "bit-map"
---

[UP](/netty.html)

```java
public class BitMap {
    private static final int BITS_PER_LONG = 64;
    private final long[] array;
    private final int nBits;

    public BitMap(int nBits) {
        this.nBits = nBits;

        int quotient = nBits / 64;
        int remainder = nBits % 64;
        int length = quotient + (remainder > 0 ? 1 : 0);
        this.array = new long[length];
    }

    public void set(int i) {
        if (i < 0 || i >= nBits) return;
        int byteIndex = i / BITS_PER_LONG;
        int bitIndex = i % BITS_PER_LONG;
        array[byteIndex] |= (1L << bitIndex);
    }

    public boolean get(int i) {
        if (i > nBits) return false;
        int byteIndex = i / BITS_PER_LONG;
        int bitIndex = i % BITS_PER_LONG;
        return (array[byteIndex] & (1L << bitIndex)) != 0;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < nBits; i++) {
            sb.append(get(i)? "1" : "0");

        }
        return sb.toString();
    }

    public void printArray() {
        int length = array.length;
        String[] textArray = new String[length];
        for (int i = 0; i < length; i++) {
            long value = array[i];
            String binaryStr = String.format("%64s", Long.toBinaryString(value)).replace(" ", "0");
            textArray[i] = binaryStr;
        }

        int totalBits = length * BITS_PER_LONG;
        int invalidBits = totalBits - nBits;
        if (invalidBits > 0) {
            StringBuilder newStr = new StringBuilder();
            for (int i = 0; i < invalidBits; i++) {
                newStr.append("X");
            }
            newStr.append(textArray[length - 1].substring(invalidBits));
            textArray[length - 1] = newStr.toString();
        }
        for (String str : textArray) {
            System.out.println(str);
        }
    }

    public static void main(String[] args) {
        int nBits = 100;
        BitMap bitmap = new BitMap(nBits);
        bitmap.set(1);
        bitmap.set(2);
        bitmap.set(3);
        bitmap.set(4);
        bitmap.set(5);
        bitmap.set(64);
        bitmap.set(97);
        bitmap.set(98);
        bitmap.set(99);
        System.out.println(bitmap);

        bitmap.printArray();
    }
}
```

```text
0111110000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000111
0000000000000000000000000000000000000000000000000000000000111110
XXXXXXXXXXXXXXXXXXXXXXXXXXXX111000000000000000000000000000000001
```
