---
title: "享元模式"
sequence: "flyweight"
---

![](/assets/images/design-pattern/diagrams/flyweight-structure.png)

## Intent

**Flyweight** is a structural design pattern
that lets you fit more objects into the available amount of RAM
by sharing common parts of state between multiple objects
instead of keeping all the data in each object.

![](/assets/images/design-pattern/flyweight.png)

## Usage examples

The Flyweight pattern has a single purpose: **minimizing memory intake**.
If your program doesn't struggle with a shortage of RAM, then you might just ignore this pattern for a while.

Examples of Flyweight in core Java libraries:

- `java.lang.Integer#valueOf(int)` (also `Boolean`, `Byte`, `Character`, `Short`, `Long` and `BigDecimal`)

```java
package java.lang;

public final class Integer extends Number implements Comparable<Integer>, Constable, ConstantDesc {
    public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high) {
            return IntegerCache.cache[i + (-IntegerCache.low)];
        }

        return new Integer(i);
    }

    private static class IntegerCache {
        static final int low = -128;
        static final int high;
        static final Integer[] cache;
        static Integer[] archivedCache;

        static {
            // 第 1 步，初始化 high 的值
            // high value may be configured by property
            int h = 127;
            String integerCacheHighPropValue = VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
            if (integerCacheHighPropValue != null) {
                try {
                    h = Math.max(parseInt(integerCacheHighPropValue), 127);
                    // Maximum array size is Integer.MAX_VALUE
                    h = Math.min(h, Integer.MAX_VALUE - (-low) -1);
                } catch( NumberFormatException nfe) {
                    // If the property cannot be parsed into an int, ignore it.
                }
            }
            high = h;

            // 第 2 步，计算 size 的值
            // Load IntegerCache.archivedCache from archive, if possible
            CDS.initializeFromArchive(IntegerCache.class);
            int size = (high - low) + 1;

            // 第 3 步，进行 for 循环，赋值给 cache
            // Use the archived cache if it exists and is large enough
            if (archivedCache == null || size > archivedCache.length) {
                Integer[] c = new Integer[size];
                int j = low;
                for(int i = 0; i < c.length; i++) {
                    c[i] = new Integer(j++);
                }
                archivedCache = c;
            }
            cache = archivedCache;
            // range [-128, 127] must be interned (JLS7 5.1.7)
            assert IntegerCache.high >= 127;
        }

        private IntegerCache() {}
    }
}
```

## Identification

Flyweight can be recognized by a creation method that returns **cached objects** instead of **creating new**.

## Reference

- [Flyweight](https://refactoring.guru/design-patterns/flyweight)
