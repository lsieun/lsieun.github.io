---
title: "原子累加器：LongAdder"
sequence: "102"
---

[UP](/java-concurrency.html)

The JDK offers us `AtomicLong` for concurrent counters/sequences and
`LongAdder` for striped counters where contention is an issue.

- LongAdder
- DoubleAdder

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class NumAdderRun {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            test(LongAdder::new, LongAdder::increment);
        }

        System.out.println("=========");

        for (int i = 0; i < 5; i++) {
            test(AtomicLong::new, AtomicLong::getAndIncrement);
        }
    }

    private static <T> void test(Supplier<T> adderSupplier, Consumer<T> action) {
        T adder = adderSupplier.get();

        long start = System.nanoTime();

        List<Thread> ts = new ArrayList<>();
        // 4 个线程，每人累加  50  万
        for (int i = 0; i < 4; i++) {
            ts.add(new Thread(() -> {
                for (int j = 0; j < 500000; j++) {
                    action.accept(adder);
                }
            }));
        }
        ts.forEach(Thread::start);
        ts.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        long end = System.nanoTime();
        System.out.println(adder + " cost:" + (end - start) / 1000_000);
    }
}
```

```text
2000000 cost:50
2000000 cost:29
2000000 cost:10
2000000 cost:7
2000000 cost:7
=========
2000000 cost:99
2000000 cost:104
2000000 cost:105
2000000 cost:105
2000000 cost:70
```
