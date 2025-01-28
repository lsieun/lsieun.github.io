---
title: "Integer.valueOf()"
sequence: "101"
---

在JDK中 `Boolean`，`Byte`，`Short`，`Integer`，`Long`，`Character` 等包装类提供了 `valueOf` 方法，
例如 `Long` 的 `valueOf` 会缓存 `-128~127` 之间的 `Long` 对象，在这个范围之间会重用对象，大于这个范围，才会新建 `Long` 对象：

```text
public static Long valueOf(long l) {
    final int offset = 128;
    if (l >= -128 && l <= 127) { // will cache
        return LongCache.cache[(int)l + offset];
    }
    return new Long(l);
}
```

注意：

- `Byte`, `Short`, `Long` 缓存的范围都是 `-128~127`
- `Character` 缓存的范围是 `0~127`
- `Integer` 的默认范围是 `-128~127`
    - 最小值不能变
    - 但最大值可以通过调整虚拟机参数 `-Djava.lang.Integer.IntegerCache.high` 来改变
- `Boolean` 缓存了 `TRUE` 和 `FALSE`

```text
-Djava.lang.Integer.IntegerCache.high=<size>
```

```java
// -Djava.lang.Integer.IntegerCache.high=256
public class IntegerCache {
    public static void main(String[] args) {
        int low = Integer.MAX_VALUE;
        int high = Integer.MIN_VALUE;
        for (int i = -500; i < 1000; i++) {
            boolean flag = isSame(i);
            if (flag) {
                if (i < low) {
                    low = i;
                }
                if (i > high) {
                    high = i;
                }
            }
        }

        String msg = String.format("[%d, %d]", low, high);
        System.out.println(msg);
    }

    private static boolean isSame(int num) {
        Integer i1 = Integer.valueOf(num);
        Integer i2 = Integer.valueOf(num);
        return i1 == i2;
    }
}
```

## Long

```java
public final class Long extends Number implements Comparable<Long>, Constable, ConstantDesc {
    @IntrinsicCandidate
    public static Long valueOf(long l) {
        final int offset = 128;
        if (l >= -128 && l <= 127) { // will cache
            return LongCache.cache[(int)l + offset];
        }
        return new Long(l);
    }
  
    private static class LongCache {
        private LongCache() {}

        static final Long[] cache;
        static Long[] archivedCache;

        static {
            int size = -(-128) + 127 + 1;

            // Load and use the archived cache if it exists
            CDS.initializeFromArchive(LongCache.class);
            if (archivedCache == null || archivedCache.length != size) {
                Long[] c = new Long[size];
                long value = -128;
                for(int i = 0; i < size; i++) {
                    c[i] = new Long(value++);
                }
                archivedCache = c;
            }
            cache = archivedCache;
        }
    }
}
```
