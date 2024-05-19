---
title: "AtomicReference（原子引用）"
sequence: "101"
---

[UP](/java-concurrency.html)


为什么需要原子引用类型？
因为保护的数据，并不都是基本类型的（`int`、`long`）。

- AtomicReference
- AtomicMarkableReference
- AtomicStampedReference

## AtomicReference

### 代码示例

#### DecimalAccount

```java
import java.math.BigDecimal;

public interface DecimalAccount {
    // 获取余额
    BigDecimal getBalance();

    // 取款
    void withdraw(BigDecimal amount);
}
```

#### DecimalAccountRun

```java
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DecimalAccountRun {
    public static void main(String[] args) {
        DecimalAccount account = new DecimalAccountCas(new BigDecimal("10000"));
        test(account);
    }

    public static void test(DecimalAccount account) {
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            threads.add(new Thread(() -> {
                account.withdraw(BigDecimal.TEN);
            }));
        }

        long start = System.nanoTime();
        threads.forEach(Thread::start);
        threads.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        long stop = System.nanoTime();
        long elapsedTime = (stop - start) / 1_000_000L;
        LogUtils.log("Balance: {}, elapsed {} ms", account.getBalance(), elapsedTime);
    }
}
```

#### DecimalAccountUnsafe

```java
import java.math.BigDecimal;

public class DecimalAccountUnsafe implements DecimalAccount {
    private BigDecimal balance;

    public DecimalAccountUnsafe(BigDecimal balance) {
        this.balance = balance;
    }

    @Override
    public BigDecimal getBalance() {
        return balance;
    }

    @Override
    public void withdraw(BigDecimal amount) {
        balance = balance.subtract(amount);
    }
}
```

```text
[main] INFO Balance: 1150, elapsed 125 ms
```

#### Lock

```java
import java.math.BigDecimal;

public class DecimalAccountSafeLock implements DecimalAccount {
    private final Object lock = new Object();
    private BigDecimal balance;

    public DecimalAccountSafeLock(BigDecimal balance) {
        this.balance = balance;
    }

    @Override
    public BigDecimal getBalance() {
        return balance;
    }

    @Override
    public void withdraw(BigDecimal amount) {
        synchronized (lock) {
            balance = balance.subtract(amount);
        }
    }
}
```

#### DecimalAccountCas

```java
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

public class DecimalAccountCas implements DecimalAccount {
    private final AtomicReference<BigDecimal> balance;

    public DecimalAccountCas(BigDecimal balance) {
        this.balance = new AtomicReference<>(balance);
    }

    @Override
    public BigDecimal getBalance() {
        return balance.get();
    }

    @Override
    public void withdraw(BigDecimal amount) {
        while (true) {
            BigDecimal prev = balance.get();
            BigDecimal next = prev.subtract(amount);
            if (balance.compareAndSet(prev, next)) {
                break;
            }
        }
        // 可替换上面的 while 循环
        // balance.updateAndGet(x -> x.subtract(amount));
    }
}
```

## ABA 问题及解决

### ABA 问题

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public class CasABA {
    static AtomicReference<String> ref = new AtomicReference<>("A");

    public static void main(String[] args) throws InterruptedException {
        LogUtils.log("main start...");
        //  获取值  A
        //  这个共享变量被它线程修改过？
        String prev = ref.get();
        other();
        TimeUnit.SECONDS.sleep(2);
        //  尝试改为  C
        LogUtils.log("change A->C {}", ref.compareAndSet(prev, "C"));
    }

    private static void other() throws InterruptedException {
        new Thread(() -> {
            LogUtils.log("change A->B {}", ref.compareAndSet(ref.get(), "B"));
        }, "t1").start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(() -> {
            LogUtils.log("change B->A {}", ref.compareAndSet(ref.get(), "A"));
        }, "t2").start();
    }

}
```

```text
[main] INFO main start...
[t1] INFO change A->B true
[t2] INFO change B->A true
[main] INFO change A->C true
```

### AtomicStampedReference

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicStampedReference;

public class CasABAStamped {
    static AtomicStampedReference<String> ref = new AtomicStampedReference<>("A", 0);

    public static void main(String[] args) throws InterruptedException {
        LogUtils.log("main start...");
        // 获取值 A
        String prev = ref.getReference();
        // 获取版本号
        int stamp = ref.getStamp();
        LogUtils.log("版本 {}", stamp);
        //  如果中间有其它线程干扰，发生了 ABA 现象
        other();
        TimeUnit.SECONDS.sleep(2);
        //  尝试改为  C
        LogUtils.log("change A->C {}", ref.compareAndSet(prev, "C", stamp, stamp + 1));
    }

    private static void other() throws InterruptedException {
        new Thread(() -> {
            LogUtils.log("change A->B {}", ref.compareAndSet(ref.getReference(), "B",
                    ref.getStamp(), ref.getStamp() + 1));
            LogUtils.log("更新版本为 {}", ref.getStamp());
        }, "t1").start();
        TimeUnit.SECONDS.sleep(1);
        new Thread(() -> {
            LogUtils.log("change B->A {}", ref.compareAndSet(ref.getReference(), "A",
                    ref.getStamp(), ref.getStamp() + 1));
            LogUtils.log("更新版本为 {}", ref.getStamp());
        }, "t2").start();
    }
}
```

```text
[main] INFO main start...
[main] INFO 版本 0
[t1] INFO change A->B true
[t1] INFO 更新版本为 1
[t2] INFO change B->A true
[t2] INFO 更新版本为 2
[main] INFO change A->C false
```

### AtomicMarkableReference

`AtomicStampedReference` 可以给原子引用加上版本号，追踪原子引用整个的变化过程，如：

```text
A -> B -> A -> C
```

通过 `AtomicStampedReference`，我们可以知道，**引用变量中途被更改了几次**。

但是有时候，并不关心引用变量更改了几次，只是单纯的关心**是否更改过**，所以就有了 `AtomicMarkableReference`

```java
import java.util.concurrent.atomic.AtomicMarkableReference;

public class CasABAMark {

    public static void main(String[] args) throws InterruptedException {
        GarbageBag bag = new GarbageBag("装满了垃圾");
        //  参数 2 mark  可以看作一个标记，表示垃圾袋满了
        AtomicMarkableReference<GarbageBag> ref = new AtomicMarkableReference<>(bag, true);

        LogUtils.log("主线程 start...");
        GarbageBag prev = ref.getReference();
        LogUtils.log(prev.toString());

        new Thread(() -> {
            LogUtils.log("打扫卫生的线程 start...");
            bag.setDesc("空垃圾袋");
            while (!ref.compareAndSet(bag, bag, true, false)) {
            }
            LogUtils.log(bag.toString());
        }).start();

        Thread.sleep(1000);
        LogUtils.log("主线程想换一只新垃圾袋？");
        boolean success = ref.compareAndSet(prev, new GarbageBag("空垃圾袋"), true, false);
        LogUtils.log("换了么？" + success);

        LogUtils.log(ref.getReference().toString());
    }

    static class GarbageBag {
        String desc;

        public GarbageBag(String desc) {
            this.desc = desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }

        @Override
        public String toString() {
            return desc;
        }
    }
}
```
