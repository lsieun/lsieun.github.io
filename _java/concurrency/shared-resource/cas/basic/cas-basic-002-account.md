---
title: "Account"
sequence: "102"
---

[UP](/java-concurrency.html)


## Basic

### Account

```java
public interface Account {
    // 获取余额
    Integer getBalance();

    // 取款
    void withdraw(Integer amount);
}
```

### AccountRun

```java
import java.util.ArrayList;
import java.util.List;

public class AccountRun {
    public static void main(String[] args) {
        // ...
    }

    // 方法内启动 1000 个线程，每个线程做减 10 元操作。
    // 如果初始余额为 10000，那么正确的结果应当是 0。
    private static void test(Account account) {
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            threads.add(new Thread(() -> {
                account.withdraw(10);
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

## 不安全

### AccountUnsafe

```java
public class AccountUnsafe implements Account {
    private Integer balance;

    public AccountUnsafe(Integer balance) {
        this.balance = balance;
    }

    @Override
    public Integer getBalance() {
        return this.balance;
    }

    @Override
    public void withdraw(Integer amount) {
        this.balance -= amount;
    }
}
```

```text
Account account = new AccountUnsafe(10000);
test(account);
```

输出（结果不对）：

```text
[main] INFO Balance: 2710, elapsed 124 ms
```

## Synchronized

```java
public class AccountSynchronized implements Account {
    private Integer balance;

    public AccountSynchronized(Integer balance) {
        this.balance = balance;
    }

    @Override
    public Integer getBalance() {
        synchronized (this) {
            return this.balance;
        }
    }

    @Override
    public void withdraw(Integer amount) {
        synchronized (this) {
            this.balance -= amount;
        }
    }
}
```

```text
Account account = new AccountSynchronized(10000);
test(account);
```

```text
[main] INFO Balance: 0, elapsed 107 ms
```

## CAS

### AccountCas

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AccountCas implements Account {

    private AtomicInteger balance;

    public AccountCas(int balance) {
        this.balance = new AtomicInteger(balance);
    }

    @Override
    public Integer getBalance() {
        return balance.get();
    }

    @Override
    public void withdraw(Integer amount) {
        while (true) {
            // 获取余额最新值
            int prev = balance.get();
            // 要修改的余额
            int next = prev - amount;
            // 真正修改
            if (balance.compareAndSet(prev, next)) {
                break;
            }
        }
        // while 语句可替换为如下：
        // balance.getAndAdd(-1 * amount);
    }
}
```

```text
Account account = new AccountCas(10000);
test(account);
```

```text
[main] INFO Balance: 0, elapsed 129 ms
```

## AtomicData

### UnsafeAccessor

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class UnsafeAccessor {
    static Unsafe unsafe;

    static {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            unsafe = (Unsafe) field.get(null);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new Error(e);
        }
    }

    static Unsafe getUnsafe() {
        return unsafe;
    }
}
```

### AtomicData

```java
import sun.misc.Unsafe;

public class AtomicData {
    private volatile int data;

    public AtomicData(int data) {
        this.data = data;
    }

    public int getData() {
        return data;
    }

    public void decrease(int amount) {
        while (true) {
            int oldValue = data;
            int newValue = data - amount;
            if (unsafe.compareAndSwapInt(this, DATA_OFFSET, oldValue, newValue)) {
                break;
            }
        }
    }

    static final Unsafe unsafe;
    static final long DATA_OFFSET;

    static {
        unsafe = UnsafeAccessor.getUnsafe();

        try {
            DATA_OFFSET = unsafe.objectFieldOffset(AtomicData.class.getDeclaredField("data"));
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### AccountWithAtomicData

```java
public class AccountWithAtomicData implements Account {
    AtomicData atomicData;

    public AccountWithAtomicData(int balance) {
        this.atomicData = new AtomicData(balance);
    }

    @Override
    public Integer getBalance() {
        return atomicData.getData();
    }

    @Override
    public void withdraw(Integer amount) {
        atomicData.decrease(amount);
    }
}
```

```text
Account account = new AccountWithAtomicData(10000);
test(account);
```

```text
[main] INFO Balance: 0, elapsed 111 ms
```
