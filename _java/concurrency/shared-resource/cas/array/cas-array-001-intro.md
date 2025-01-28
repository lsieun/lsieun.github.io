---
title: "原子数组"
sequence: "101"
---

[UP](/java-concurrency.html)


- AtomicIntegerArray
- AtomicLongArray
- AtomicReferenceArray

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicIntegerArray;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Supplier;

public class CasArrayRun {
    public static void main(String[] args) {
        // 不安全的数组
        test(
                () -> new int[10],
                (array) -> array.length,
                (array, index) -> array[index]++,
                Arrays::toString
        );

        // 安全的数组
        test(
                () -> new AtomicIntegerArray(10),
                AtomicIntegerArray::length,
                AtomicIntegerArray::getAndIncrement,
                AtomicIntegerArray::toString
        );
    }

    /**
     * 参数 1，提供数组、可以是线程不安全数组或线程安全数组
     * 参数 2，获取数组长度的方法
     * 参数 3，自增方法，回传  array, index
     * 参数 4，打印数组的方法
     */
    private static <T> void test(
            Supplier<T> arrayNewSupplier,
            Function<T, Integer> arrayLengthFunc,
            BiConsumer<T, Integer> arrayUpdateConsumer,
            Function<T, String> arrayToStrFunc) {
        // 创建线程
        List<Thread> threads = new ArrayList<>();
        T array = arrayNewSupplier.get();
        int length = arrayLengthFunc.apply(array);
        for (int i = 0; i < length; i++) {
            // 每个线程对数组作 10000 次操作
            threads.add(new Thread(() -> {
                for (int j = 0; j < 10000; j++) {
                    arrayUpdateConsumer.accept(array, j % length);
                }
            }));
        }

        // 启动所有线程
        threads.forEach(Thread::start);

        // 等所有线程结束
        threads.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // 打印数组
        String str = arrayToStrFunc.apply(array);
        LogUtils.log(str);
    }
}
```

```text
[main] INFO [5871, 5859, 5835, 5829, 5944, 6054, 6052, 6033, 5997, 5989]
[main] INFO [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]
```
