---
title: "LongAdder 源码"
sequence: "102"
---

## 概览

生活例子：在银行，5个钱箱，5个人，分别数钱，再求和。

### 基本结构

![](/assets/images/java/src/coll/LongAdder-main-logic-001.png)

### 实现思路

#### 分：单独计数

![](/assets/images/java/src/coll/LongAdder-main-logic-002.png)

#### 和：汇总求和

![](/assets/images/java/src/coll/LongAdder-main-logic-003.png)

## Striped64

### 重要字段

```java
abstract class Striped64 extends Number {
    // 基础值，如果没有竞争，则用 CAS 累加这个域
    transient volatile long base;

    // 在 cells 创建或扩容时，置为 1，表示加锁
    transient volatile int cellsBusy;

    // 累加单元数组，懒惰初始化
    transient volatile Cell[] cells;
}
```

### 重要内部类

```java
abstract class Striped64 extends Number {
    // 防止缓存行（cache line）伪共享（false sharing）
    @sun.misc.Contended
    static final class Cell {
        volatile long value;

        Cell(long x) {
            value = x;
        }

        // 最重要的方法，用 CAS 方式进行累加，prev 表示旧值，next 表示新值
        final boolean cas(long cmp, long val) {
            return UNSAFE.compareAndSwapLong(this, valueOffset, cmp, val);
        }
        
        // 省略其它代码
    }
}
```

## LongAdder

```java
public class LongAdder extends Striped64 implements Serializable {
}
```

### add

```java
public class LongAdder extends Striped64 implements Serializable {
    public void increment() {
        add(1L);
    }

    public void add(long x) {
        // b 是 base 的局部“镜像”
        long b;

        // as 是 cells 的局部“镜像”
        Cell[] as;
        // m 是 cells 的长度减去 1
        int m;

        // a 代表 cells 中的某一个元素
        Cell a;
        // v 代表某个元素的值
        long v;
        // 第一个判断：cells 是否为 null
        // 第二个判断：在 base 字段上添加 x，是否成功
        if ((as = cells) != null || !casBase(b = base, b + x)) {
            boolean uncontended = true;
            // 判断：cells 是否为 null
            if (as == null ||
                    // 判断：cells.length 是否为 0
                    (m = as.length - 1) < 0 ||
                    // 判断：当前线程 cell 是否创建
                    (a = as[getProbe() & m]) == null ||
                    // 判断：当前线程 cell 进行 CAS 操作，是否成功
                    !(uncontended = a.cas(v = a.value, v + x)))
                longAccumulate(x, null, uncontended);
        }
    }
}
```

![](/assets/images/java/src/coll/LongAdder-thread-frame-local-variable.png)

重写 `add` 方法的代码（不改变原有逻辑）：

```java
public class LongAdder extends Striped64 implements Serializable {
    public void addX(long x) {
        Cell[] as = cells;
        long b = base;

        // cells == null
        if (as == null) {
            boolean flag = casBase(b, b + x);
            if (flag) {
                // 第 1 种情况
                return;
            }
            else {
                // 第 2 种情况
                longAccumulate(x, null, true);
                return;
            }
        }
        // cells != null && cells.length == 0
        else if (as.length == 0) {
            // 第 3 种情况
            longAccumulate(x, null, true);
            return;
        }
        // cells != null && cells.length > 0
        else {
            int m = as.length - 1;
            int index = getProbe() & m;
            Cell a = as[index];
            if (a == null) {
                // 第 4 种情况
                longAccumulate(x, null, true);
                return;
            }
            else {
                long v = a.value;
                boolean uncontended = a.cas(v, v + x);
                if (uncontended) {
                    // 第 6 种情况
                    return;
                }
                else {
                    // 第 5 种情况
                    longAccumulate(x, null, false);
                    return;
                }
            }
        }
    }
}
```

![](/assets/images/java/src/coll/LongAdder-add-logic.png)


### longAccumulate

![](/assets/images/java/src/coll/LongAdder-longAccumulate-logic.png)

#### 第 1 种情况：base 累加

```java
abstract class Striped64 extends Number {
    final void longAccumulate(long x, LongBinaryOperator fn, boolean wasUncontended) {
        // h 代表线程的 probe 值，类似于 hash 值
        int h;
        if ((h = getProbe()) == 0) {
            ThreadLocalRandom.current(); // force initialization
            h = getProbe();
            wasUncontended = true;
        }

        boolean collide = false;                // True if last slot nonempty
        for (; ; ) {
            // cells 的局部“镜像”
            Cell[] as;
            // cells 的长度
            int n;

            // cells 中的某一个元素
            Cell a;
            // 某一个元素的值
            long v;

            // 第 3、4 种情况
            // cells != null && cells.length > 0
            if ((as = cells) != null && (n = as.length) > 0) {
                // ...
            }
            // 第 2 种情况
            // cells == null || cells.length == 0，尝试加 CAS 锁
            else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
                // ...
            }
            //---------------------------------------------------------------------------------
            // 第 1 种情况
            // cells == null || cells.length == 0，加 CAS 锁失败
            else if (
                    casBase(
                            v = base,
                            ((fn == null) ? v + x : fn.applyAsLong(v, x))
                    )
            ) {
                break;                          // Fall back on using base
            }
            //---------------------------------------------------------------------------------
        }
    }
}
```

#### 第 2 种情况：新数组-新Cell

```java
abstract class Striped64 extends Number {
    final void longAccumulate(long x, LongBinaryOperator fn, boolean wasUncontended) {
        // h 代表线程的 probe 值，类似于 hash 值
        int h;
        if ((h = getProbe()) == 0) {
            ThreadLocalRandom.current(); // force initialization
            h = getProbe();
            wasUncontended = true;
        }

        boolean collide = false;                // True if last slot nonempty
        for (; ; ) {
            // cells 的局部“镜像”
            Cell[] as;
            // cells 的长度
            int n;

            // cells 中的某一个元素
            Cell a;
            // 某一个元素的值
            long v;

            // 第 3、4 种情况
            // cells != null && cells.length > 0
            if ((as = cells) != null && (n = as.length) > 0) {
                // ...
            }
            //---------------------------------------------------------------------------------
            // 第 2 种情况
            // cells == null || cells.length == 0，尝试加 CAS 锁
            else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
                boolean init = false;
                try {                           // Initialize table
                    if (cells == as) {
                        Cell[] rs = new Cell[2];
                        rs[h & 1] = new Cell(x);
                        cells = rs;
                        init = true;
                    }
                }
                finally {
                    cellsBusy = 0;
                }
                if (init) {
                    break;
                }
            }
            //---------------------------------------------------------------------------------
            // 第 1 种情况
            // cells == null || cells.length == 0，加 CAS 锁失败
            else if (casBase(v = base, ((fn == null) ? v + x : fn.applyAsLong(v, x)))
            ) {
                break;                          // Fall back on using base
            }
        }
    }
}
```


#### 第 3 种情况：旧数组-新Cell

```java
abstract class Striped64 extends Number {
    final void longAccumulate(long x, LongBinaryOperator fn, boolean wasUncontended) {
        // h 代表线程的 probe 值，类似于 hash 值
        int h;
        if ((h = getProbe()) == 0) {
            ThreadLocalRandom.current(); // force initialization
            h = getProbe();
            wasUncontended = true;
        }

        boolean collide = false;                // True if last slot nonempty
        for (; ; ) {
            // cells 的局部“镜像”
            Cell[] as;
            // cells 的长度
            int n;

            // cells 中的某一个元素
            Cell a;
            // 某一个元素的值
            long v;

            // 第 3、4 种情况
            // cells != null && cells.length > 0
            if ((as = cells) != null && (n = as.length) > 0) {
                //---------------------------------------------------------------------------------
                // 第 3 种情况
                // cells != null && cells.length > 0 && a == null
                if ((a = as[(n - 1) & h]) == null) {
                    if (cellsBusy == 0) {       // Try to attach new Cell
                        // 第 1 步，创建 cell
                        Cell r = new Cell(x);   // Optimistically create

                        // 第 2 步，尝试将 cell 加入数组
                        if (cellsBusy == 0 && casCellsBusy()) {
                            // 记录“将 cell 加入数组”是否成功
                            boolean created = false;
                            try {               // Recheck under lock
                                Cell[] rs;
                                int m, j;
                                // 三个条件：cells != null && cells.length > 0 && cells[i] == null
                                if ((rs = cells) != null &&
                                        (m = rs.length) > 0 &&
                                        rs[j = (m - 1) & h] == null) {
                                    rs[j] = r;
                                    created = true;
                                }
                            }
                            finally {
                                // 释放 CAS 锁
                                cellsBusy = 0;
                            }

                            if (created) {
                                // “将 cell 加入数组”成功，退出循环
                                break;
                            }
                            continue;           // Slot is now non-empty
                        }
                    }
                    collide = false;
                }
                //---------------------------------------------------------------------------------

                // ...

                // 对当前线程进行 rehash，这样有机会换一个新的 cell 进行累加操作
                h = advanceProbe(h);
            }
            // 第 2 种情况
            // cells == null || cells.length == 0，尝试加 CAS 锁
            else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
                // ...
            }
            // 第 1 种情况
            // cells == null || cells.length == 0，加 CAS 锁失败
            else if (casBase(v = base, ((fn == null) ? v + x : fn.applyAsLong(v, x)))) {
                break;                          // Fall back on using base
            }
        }
    }
}
```

#### 第 4 种情况：旧数组-旧Cell

```java
abstract class Striped64 extends Number {
    final void longAccumulate(long x, LongBinaryOperator fn, boolean wasUncontended) {
        // h 代表线程的 probe 值，类似于 hash 值
        int h;
        if ((h = getProbe()) == 0) {
            ThreadLocalRandom.current(); // force initialization
            h = getProbe();
            wasUncontended = true;
        }

        boolean collide = false;                // True if last slot nonempty
        for (; ; ) {
            // cells 的局部“镜像”
            Cell[] as;
            // cells 的长度
            int n;

            // cells 中的某一个元素
            Cell a;
            // 某一个元素的值
            long v;

            // 第 3、4 种情况
            // cells != null && cells.length > 0
            if ((as = cells) != null && (n = as.length) > 0) {
                // 第 3 种情况
                // cells != null && cells.length > 0 && a == null
                if ((a = as[(n - 1) & h]) == null) {
                    // ...
                }
                // cells != null && cells.length > 0 && a != null && wasUncontended == false （有竞争）
                else if (!wasUncontended) {      // CAS already known to fail
                    // 进入当前方法的时候，如果“有竞争”，那就线程进行 rehash，就有可能换个 cell 进行计数累加
                    wasUncontended = true;       // Continue after rehash
                }
                //---------------------------------------------------------------------------------
                // 第 4 种情况
                // cells != null && cells.length > 0 && a != null && wasUncontended == true （无竞争）
                else if (a.cas(v = a.value, ((fn == null) ? v + x :
                        fn.applyAsLong(v, x)))) {
                    break;
                }
                //---------------------------------------------------------------------------------
                
                // ... 省略代码

                // 对当前线程进行 rehash，这样有机会换一个新的 cell 进行累加操作
                h = advanceProbe(h);
            }
            // 第 2 种情况
            // cells == null || cells.length == 0，尝试加 CAS 锁
            else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
                // ...
            }
            // 第 1 种情况
            // cells == null || cells.length == 0，加 CAS 锁失败
            else if (casBase(v = base, ((fn == null) ? v + x : fn.applyAsLong(v, x)))
            ) {
                break;                          // Fall back on using base
            }
        }
    }
}
```

#### 扩容

```java
abstract class Striped64 extends Number {
    final void longAccumulate(long x, LongBinaryOperator fn, boolean wasUncontended) {
        // h 代表线程的 probe 值，类似于 hash 值
        int h;
        if ((h = getProbe()) == 0) {
            ThreadLocalRandom.current(); // force initialization
            h = getProbe();
            wasUncontended = true;
        }

        boolean collide = false;                // True if last slot nonempty
        for (; ; ) {
            // cells 的局部“镜像”
            Cell[] as;
            // cells 的长度
            int n;

            // cells 中的某一个元素
            Cell a;
            // 某一个元素的值
            long v;

            // 第 3、4 种情况
            // cells != null && cells.length > 0
            if ((as = cells) != null && (n = as.length) > 0) {
                // 第 3 种情况
                // cells != null && cells.length > 0 && a == null
                if ((a = as[(n - 1) & h]) == null) {
                    // ...
                }
                // cells != null && cells.length > 0 && a != null && wasUncontended == false （有竞争）
                else if (!wasUncontended) {      // CAS already known to fail
                    // 进入当前方法的时候，如果“有竞争”，那就线程进行 rehash，就有可能换个 cell 进行计数累加
                    wasUncontended = true;       // Continue after rehash
                }
                // 第 4 种情况
                // cells != null && cells.length > 0 && a != null && wasUncontended == true （无竞争）
                else if (a.cas(v = a.value, ((fn == null) ? v + x : fn.applyAsLong(v, x)))) {
                    break;
                }
                //---------------------------------------------------------------------------------
                // cells != null && cells.length > 0 && a != null && CAS 更新失败，说明有竞争
                else if (n >= NCPU || cells != as) {
                    // 这里是为了“阻止扩容”
                    // 如果 n >= NCPU 成立，说明 cells 的长度已经大于等于 CPU 核心数，再增加 cells 的长度，不能再提高并发度了
                    // 如果 cells != as 成立，说明当前线程拿到的 cells 数据是“过时”的，不能成为“进行扩容”的依据
                    collide = false;            // At max size or stale
                }
                // cells != null && cells.length > 0 && a != null && CAS 更新失败，说明有竞争
                else if (!collide) {
                    // 这里是为了“允许扩容”
                    // 这里代码可能是这样想的：第一次冲突（collide），不算冲突（false）；第二次冲突（collide），才算冲突（true）
                    // collide 为 true 之后，再进行一次 CAS 加值；如果失败了，就进行扩容。
                    collide = true;
                }
                // 可以扩容：cells 的长度小于 CPU 核心数（n < NCPU），且有更新 cell 过程中有冲突（collide == true）
                // cells != null && cells.length > 0 && a != null && n < NCPU && cells == as && collide == true
                else if (cellsBusy == 0 && casCellsBusy()) {
                    try {
                        if (cells == as) {      // Expand table unless stale
                            // 创建新数组
                            Cell[] rs = new Cell[n << 1];

                            // 迁移数据
                            for (int i = 0; i < n; ++i) {
                                rs[i] = as[i];
                            }

                            // 更新 cells
                            cells = rs;
                        }
                    }
                    finally {
                        cellsBusy = 0;
                    }
                    collide = false;
                    continue;                   // Retry with expanded table
                }
                //---------------------------------------------------------------------------------

                // 对当前线程进行 rehash，这样有机会换一个新的 cell 进行累加操作
                h = advanceProbe(h);
            }
            // 第 2 种情况
            // cells == null || cells.length == 0，尝试加 CAS 锁
            else if (cellsBusy == 0 && cells == as && casCellsBusy()) {
                // ...
            }
            // 第 1 种情况
            // cells == null || cells.length == 0，加 CAS 锁失败
            else if (casBase(v = base, ((fn == null) ? v + x : fn.applyAsLong(v, x)))
            ) {
                break;                          // Fall back on using base
            }
        }
    }
}
```

### sum

```java
public class LongAdder extends Striped64 implements Serializable {
    public long sum() {
        Cell[] as = cells;
        Cell a;
        long sum = base;
        if (as != null) {
            for (int i = 0; i < as.length; ++i) {
                if ((a = as[i]) != null)
                    sum += a.value;
            }
        }
        return sum;
    }

    public void reset() {
        Cell[] as = cells;
        Cell a;
        base = 0L;
        if (as != null) {
            for (int i = 0; i < as.length; ++i) {
                if ((a = as[i]) != null)
                    a.value = 0L;
            }
        }
    }
}
```

## 其它

### 线程 rehash

```java
abstract class Striped64 extends Number {
    static final int advanceProbe(int probe) {
        probe ^= probe << 13;   // xorshift
        probe ^= probe >>> 17;
        probe ^= probe << 5;
        UNSAFE.putInt(Thread.currentThread(), PROBE, probe);
        return probe;
    }
}
```

```java
import java.util.Formatter;

public class ThreadRehashRun {
    public static void main(String[] args) {
        int probe = 1;
        for (int i = 0; i < 1; i++) {
            probe = advanceProbeX(probe);
            System.out.println("probe = " + probe + System.lineSeparator());
        }
    }

    static int advanceProbe(int probe) {
        probe ^= probe << 13;   // xorshift
        probe ^= probe >>> 17;
        probe ^= probe << 5;
        return probe;
    }

    public static int advanceProbeX(int probe) {
        int val1 = doShift(probe, -1, 13);
        int val2 = doShift(val1, 1, 17);
        int val3 = doShift(val2, -1, 5);
        return val3;
    }

    public static int doShift(int probe, int direction, int shift) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("%s    // probe = %d%n", BitUtils.toString(probe, Integer.SIZE), probe);

        int shiftedProbe;
        if (direction < 0) {
            shiftedProbe = probe << shift;
        }
        else {
            shiftedProbe = probe >>> shift;
        }
        String str = String.format("probe %s %d", direction < 0 ? "<<" : ">>>", shift);
        fm.format("%s    // %s = %d%n",
                BitUtils.toString(shiftedProbe, Integer.SIZE),
                str,
                shiftedProbe
        );

        int newProbe = probe ^ shiftedProbe;
        fm.format("%s    // probe ^ %s = %d%n",
                BitUtils.toString(newProbe, Integer.SIZE),
                str,
                newProbe
        );

        System.out.println(sb);
        return newProbe;
    }

}
```

```text
00000000000000000000000000000001    // probe = 1
00000000000000000010000000000000    // probe << 13 = 8192
00000000000000000010000000000001    // probe ^ probe << 13 = 8193

00000000000000000010000000000001    // probe = 8193
00000000000000000000000000000000    // probe >>> 17 = 0
00000000000000000010000000000001    // probe ^ probe >>> 17 = 8193

00000000000000000010000000000001    // probe = 8193
00000000000001000000000000100000    // probe << 5 = 262176
00000000000001000010000000100001    // probe ^ probe << 5 = 270369

probe = 270369
```
